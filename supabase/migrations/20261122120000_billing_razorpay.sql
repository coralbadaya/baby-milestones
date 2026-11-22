-- Dual billing: Razorpay (India) + Stripe (ROW); profile billing override; admin overview

alter table public.profiles
  add column if not exists billing_country text;

comment on column public.profiles.billing_country is 'Staff override: IN or ROW for checkout region';

alter table public.memberships
  add column if not exists razorpay_customer_id text,
  add column if not exists razorpay_subscription_id text;

alter table public.memberships drop constraint if exists memberships_source_check;
alter table public.memberships
  add constraint memberships_source_check
  check (source in ('signup_trial', 'promo', 'admin', 'stripe', 'razorpay'));

create table if not exists public.razorpay_events (
  id text primary key,
  type text not null,
  processed_at timestamptz not null default now()
);

alter table public.razorpay_events enable row level security;

create table if not exists public.billing_webhook_health (
  provider text primary key check (provider in ('stripe', 'razorpay')),
  last_success_at timestamptz not null default now()
);

alter table public.billing_webhook_health enable row level security;

create or replace function public.admin_billing_overview()
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
begin
  if not public.is_staff() then
    raise exception 'not allowed';
  end if;

  select jsonb_build_object(
    'webhook_health', coalesce(
      (select jsonb_object_agg(provider, last_success_at) from public.billing_webhook_health),
      '{}'::jsonb
    ),
    'membership_by_source', coalesce(
      (
        select jsonb_object_agg(coalesce(source, 'unknown'), cnt)
        from (
          select source, count(*)::bigint as cnt
          from public.memberships
          where source in ('stripe', 'razorpay')
          group by 1
        ) s
      ),
      '{}'::jsonb
    ),
    'recent_plus', coalesce(
      (
        select jsonb_agg(row_to_json(r))
        from (
          select m.user_id, m.status, m.source, m.plan, m.updated_at, p.display_name
          from public.memberships m
          left join public.profiles p on p.id = m.user_id
          where m.plan = 'plus' and m.source in ('stripe', 'razorpay')
          order by m.updated_at desc nulls last
          limit 20
        ) r
      ),
      '[]'::jsonb
    )
  ) into result;

  return coalesce(result, '{}'::jsonb);
end;
$$;

revoke all on function public.admin_billing_overview() from public, anon;
grant execute on function public.admin_billing_overview() to authenticated;

create or replace function public.admin_set_billing_country(p_user_id uuid, p_billing_country text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if p_billing_country is not null and p_billing_country not in ('IN', 'ROW') then
    raise exception 'billing_country must be IN, ROW, or null';
  end if;
  update public.profiles
  set billing_country = p_billing_country
  where id = p_user_id;
end;
$$;

revoke all on function public.admin_set_billing_country(uuid, text) from public, anon;
grant execute on function public.admin_set_billing_country(uuid, text) to authenticated;