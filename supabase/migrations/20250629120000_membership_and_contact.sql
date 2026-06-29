-- Nestbean: profiles, memberships, promo codes, contact submissions, RBAC helpers

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security invoker
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'support')
  );
$$;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  role text not null default 'user' check (role in ('user', 'support', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using (id = auth.uid() or public.is_staff());

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "profiles_admin_update"
  on public.profiles for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- promo_codes (before memberships FK)
-- ---------------------------------------------------------------------------

create table if not exists public.promo_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text,
  grant_type text not null check (grant_type in ('trial_days', 'comp', 'extend_premium')),
  duration_days integer,
  max_uses integer,
  uses_count integer not null default 0,
  expires_at timestamptz,
  active boolean not null default true,
  created_by uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.promo_codes enable row level security;

create policy "promo_codes_admin_all"
  on public.promo_codes for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- memberships
-- ---------------------------------------------------------------------------

create table if not exists public.memberships (
  user_id uuid primary key references auth.users (id) on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  status text not null default 'free' check (status in ('free', 'trial', 'active', 'comp', 'expired')),
  source text check (source in ('signup_trial', 'promo', 'admin', 'stripe')),
  trial_ends_at timestamptz,
  premium_until timestamptz,
  promo_code_id uuid references public.promo_codes (id) on delete set null,
  updated_at timestamptz not null default now()
);

alter table public.memberships enable row level security;

create policy "memberships_select_own"
  on public.memberships for select
  to authenticated
  using (user_id = auth.uid() or public.is_staff());

create policy "memberships_admin_update"
  on public.memberships for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "memberships_admin_insert"
  on public.memberships for insert
  to authenticated
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- promo_redemptions
-- ---------------------------------------------------------------------------

create table if not exists public.promo_redemptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  promo_code_id uuid not null references public.promo_codes (id) on delete cascade,
  redeemed_at timestamptz not null default now(),
  unique (user_id, promo_code_id)
);

alter table public.promo_redemptions enable row level security;

create policy "promo_redemptions_select_own"
  on public.promo_redemptions for select
  to authenticated
  using (user_id = auth.uid() or public.is_staff());

-- ---------------------------------------------------------------------------
-- contact_submissions
-- ---------------------------------------------------------------------------

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  name text,
  subject text not null default 'general'
    check (subject in ('general', 'press', 'partnership', 'feedback')),
  message text not null,
  user_id uuid references auth.users (id) on delete set null,
  status text not null default 'new'
    check (status in ('new', 'read', 'replied', 'archived')),
  admin_notes text,
  created_at timestamptz not null default now()
);

alter table public.contact_submissions enable row level security;

create policy "contact_insert_anon"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

create policy "contact_select_own"
  on public.contact_submissions for select
  to authenticated
  using (user_id = auth.uid());

create policy "contact_staff_select"
  on public.contact_submissions for select
  to authenticated
  using (public.is_staff());

create policy "contact_staff_update"
  on public.contact_submissions for update
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

-- ---------------------------------------------------------------------------
-- New user bootstrap (profile + 7-day trial)
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );

  insert into public.memberships (user_id, plan, status, source, trial_ends_at)
  values (new.id, 'premium', 'trial', 'signup_trial', now() + interval '7 days');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Redeem promo code (authenticated users)
-- ---------------------------------------------------------------------------

create or replace function public.redeem_promo_code(p_code text)
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_promo public.promo_codes%rowtype;
  v_until timestamptz;
  v_status text;
  v_trial_ends timestamptz;
  v_premium_until timestamptz;
begin
  if v_user_id is null then
    raise exception 'Sign in to redeem a code';
  end if;

  select * into v_promo
  from public.promo_codes
  where upper(code) = upper(trim(p_code)) and active = true
  for update;

  if not found then
    raise exception 'Invalid or inactive code';
  end if;

  if v_promo.expires_at is not null and v_promo.expires_at < now() then
    raise exception 'This code has expired';
  end if;

  if v_promo.max_uses is not null and v_promo.uses_count >= v_promo.max_uses then
    raise exception 'This code has reached its redemption limit';
  end if;

  if exists (
    select 1 from public.promo_redemptions
    where user_id = v_user_id and promo_code_id = v_promo.id
  ) then
    raise exception 'You have already redeemed this code';
  end if;

  if v_promo.grant_type = 'comp' then
    v_status := 'comp';
    v_trial_ends := null;
    v_premium_until := null;
  elsif v_promo.grant_type = 'trial_days' then
    v_status := 'trial';
    v_trial_ends := now() + make_interval(days => coalesce(v_promo.duration_days, 7));
    v_premium_until := null;
  else
    v_status := 'active';
    v_trial_ends := null;
    v_premium_until := now() + make_interval(days => coalesce(v_promo.duration_days, 30));
  end if;

  v_until := coalesce(v_premium_until, v_trial_ends);

  insert into public.memberships (user_id, plan, status, source, trial_ends_at, premium_until, promo_code_id, updated_at)
  values (v_user_id, 'premium', v_status, 'promo', v_trial_ends, v_premium_until, v_promo.id, now())
  on conflict (user_id) do update set
    plan = 'premium',
    status = excluded.status,
    source = 'promo',
    trial_ends_at = excluded.trial_ends_at,
    premium_until = excluded.premium_until,
    promo_code_id = excluded.promo_code_id,
    updated_at = now();

  insert into public.promo_redemptions (user_id, promo_code_id)
  values (v_user_id, v_promo.id);

  update public.promo_codes
  set uses_count = uses_count + 1
  where id = v_promo.id;

  return jsonb_build_object(
    'success', true,
    'status', v_status,
    'premium_until', v_until
  );
end;
$$;

grant execute on function public.redeem_promo_code(text) to authenticated;

-- ---------------------------------------------------------------------------
-- Grants (Data API)
-- ---------------------------------------------------------------------------

grant usage on schema public to anon, authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, update on public.memberships to authenticated;
grant select on public.promo_redemptions to authenticated;
grant insert on public.contact_submissions to anon, authenticated;
grant select, update on public.contact_submissions to authenticated;
grant all on public.promo_codes to authenticated;

-- Seed a founding member promo (optional — safe to re-run)
insert into public.promo_codes (code, label, grant_type, duration_days, max_uses, active)
values ('FOUNDING30', 'Founding member — 30 days', 'trial_days', 30, 1000, true)
on conflict (code) do nothing;
