-- Baby identity as source of truth; milestone + shopping checks

alter table public.baby_profiles
  add column if not exists updated_at timestamptz not null default now();

-- One primary baby per user (collapse extras first)
with ranked as (
  select id, row_number() over (partition by user_id order by created_at) as rn
  from public.baby_profiles
  where is_primary
)
update public.baby_profiles p
set is_primary = false
from ranked r
where p.id = r.id and r.rn > 1;

update public.baby_profiles p
set is_primary = true
where not exists (
  select 1 from public.baby_profiles x
  where x.user_id = p.user_id and x.is_primary
)
and p.id in (
  select distinct on (user_id) id
  from public.baby_profiles
  order by user_id, created_at
);

create unique index if not exists baby_profiles_one_primary
  on public.baby_profiles (user_id) where is_primary;

-- ---------------------------------------------------------------------------
-- Signup: empty primary baby profile
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

  insert into public.memberships (user_id, plan, status, source)
  values (new.id, 'free', 'free', null);

  insert into public.usage_entitlements (user_id)
  values (new.id)
  on conflict (user_id) do nothing;

  insert into public.baby_profiles (user_id, name, is_primary)
  values (new.id, 'Baby', true);

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- milestone_checks
-- ---------------------------------------------------------------------------

create table if not exists public.milestone_checks (
  user_id uuid not null references auth.users (id) on delete cascade,
  baby_profile_id uuid not null references public.baby_profiles (id) on delete cascade,
  milestone_id text not null,
  checked boolean not null default true,
  checked_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (baby_profile_id, milestone_id)
);

create index if not exists milestone_checks_user_idx on public.milestone_checks (user_id);

alter table public.milestone_checks enable row level security;

create policy "milestone_checks_own"
  on public.milestone_checks for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.milestone_checks to authenticated;

-- ---------------------------------------------------------------------------
-- shopping_checks
-- ---------------------------------------------------------------------------

create table if not exists public.shopping_checks (
  user_id uuid not null references auth.users (id) on delete cascade,
  baby_profile_id uuid not null references public.baby_profiles (id) on delete cascade,
  item_id text not null,
  checked boolean not null default true,
  updated_at timestamptz not null default now(),
  primary key (baby_profile_id, item_id)
);

create index if not exists shopping_checks_user_idx on public.shopping_checks (user_id);

alter table public.shopping_checks enable row level security;

create policy "shopping_checks_own"
  on public.shopping_checks for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.shopping_checks to authenticated;

grant select, insert, update, delete on public.baby_profiles to authenticated;

-- ---------------------------------------------------------------------------
-- Bulk upserts for merge / debounce
-- ---------------------------------------------------------------------------

create or replace function public.upsert_milestone_checks(p_baby_id uuid, p_items jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_item jsonb;
begin
  if v_user is null then
    raise exception 'Sign in required';
  end if;
  if p_baby_id is null then
    raise exception 'Baby profile required';
  end if;
  if not exists (
    select 1 from public.baby_profiles
    where id = p_baby_id and user_id = v_user
  ) then
    raise exception 'Baby profile not found';
  end if;

  for v_item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
  loop
    insert into public.milestone_checks (
      user_id, baby_profile_id, milestone_id, checked, checked_at, updated_at
    )
    values (
      v_user,
      p_baby_id,
      v_item->>'id',
      coalesce((v_item->>'checked')::boolean, true),
      case when coalesce((v_item->>'checked')::boolean, true) then now() else null end,
      now()
    )
    on conflict (baby_profile_id, milestone_id) do update
      set
        checked = excluded.checked,
        checked_at = case when excluded.checked then coalesce(public.milestone_checks.checked_at, now()) else null end,
        updated_at = now();
  end loop;
end;
$$;

grant execute on function public.upsert_milestone_checks(uuid, jsonb) to authenticated;

create or replace function public.upsert_shopping_checks(p_baby_id uuid, p_items jsonb)
returns void
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_item jsonb;
begin
  if v_user is null then
    raise exception 'Sign in required';
  end if;
  if p_baby_id is null then
    raise exception 'Baby profile required';
  end if;
  if not exists (
    select 1 from public.baby_profiles
    where id = p_baby_id and user_id = v_user
  ) then
    raise exception 'Baby profile not found';
  end if;

  for v_item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
  loop
    insert into public.shopping_checks (
      user_id, baby_profile_id, item_id, checked, updated_at
    )
    values (
      v_user,
      p_baby_id,
      v_item->>'id',
      coalesce((v_item->>'checked')::boolean, true),
      now()
    )
    on conflict (baby_profile_id, item_id) do update
      set checked = excluded.checked, updated_at = now();
  end loop;
end;
$$;

grant execute on function public.upsert_shopping_checks(uuid, jsonb) to authenticated;
