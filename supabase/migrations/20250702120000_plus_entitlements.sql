-- Yarn Trails Plus: entitlements, baby book tables, remove signup auto-trial
-- @see docs/ai-baby-book-plan.md

-- pgcrypto optional; token defaults use gen_random_uuid() for portability
create extension if not exists pgcrypto with schema extensions;

-- ---------------------------------------------------------------------------
-- memberships: migrate premium → plus, add billing columns
-- ---------------------------------------------------------------------------

alter table public.memberships
  drop constraint if exists memberships_plan_check;

update public.memberships set plan = 'plus' where plan = 'premium';

alter table public.memberships
  add constraint memberships_plan_check check (plan in ('free', 'plus'));

alter table public.memberships
  add column if not exists billing_interval text check (billing_interval in ('monthly', 'annual', 'gift', 'bundle')),
  add column if not exists stripe_customer_id text,
  add column if not exists stripe_subscription_id text;

-- premium_until already exists from original migration

-- ---------------------------------------------------------------------------
-- usage_entitlements (per-user quotas)
-- ---------------------------------------------------------------------------

create table if not exists public.usage_entitlements (
  user_id uuid primary key references auth.users (id) on delete cascade,
  photos_used_this_month int not null default 0,
  photos_month_key text not null default to_char(now(), 'YYYY-MM'),
  stories_generated_total int not null default 0,
  voice_notes_stored_count int not null default 0,
  first_story_generated_at timestamptz,
  annual_trial_offered_at timestamptz,
  annual_trial_started_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.usage_entitlements enable row level security;

create policy "usage_entitlements_select_own"
  on public.usage_entitlements for select
  using (auth.uid() = user_id);

create policy "usage_entitlements_update_own"
  on public.usage_entitlements for update
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- viewer_seats (Plus)
-- ---------------------------------------------------------------------------

create table if not exists public.viewer_seats (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  viewer_email text not null,
  invite_token text not null default replace(gen_random_uuid()::text, '-', ''),
  status text not null default 'pending' check (status in ('pending', 'active', 'revoked')),
  created_at timestamptz not null default now(),
  unique (owner_user_id, viewer_email)
);

alter table public.viewer_seats enable row level security;

create policy "viewer_seats_owner_all"
  on public.viewer_seats for all
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

-- ---------------------------------------------------------------------------
-- album_photos
-- ---------------------------------------------------------------------------

create table if not exists public.album_photos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text,
  caption text,
  photo_month int,
  data_url text,
  is_hd boolean not null default false,
  captured_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index if not exists album_photos_user_month_idx on public.album_photos (user_id, photo_month);

alter table public.album_photos enable row level security;

create policy "album_photos_own"
  on public.album_photos for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- baby_stories
-- ---------------------------------------------------------------------------

create table if not exists public.baby_stories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  pages jsonb not null default '[]'::jsonb,
  persona text not null default 'gentle',
  art_style text not null default 'watercolor',
  audio_url text,
  preview_token text not null default replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now()
);

alter table public.baby_stories enable row level security;

create policy "baby_stories_own"
  on public.baby_stories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "baby_stories_preview_read"
  on public.baby_stories for select
  using (true);

-- ---------------------------------------------------------------------------
-- voice_notes
-- ---------------------------------------------------------------------------

create table if not exists public.voice_notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text,
  data_url text,
  duration_seconds numeric(5,2) not null default 0,
  attach_type text check (attach_type in ('milestone', 'album', 'story')),
  attach_id text,
  created_at timestamptz not null default now()
);

alter table public.voice_notes enable row level security;

create policy "voice_notes_own"
  on public.voice_notes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- print_coupons (bundle fulfillment)
-- ---------------------------------------------------------------------------

create table if not exists public.print_coupons (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  code text not null unique,
  discount_pct int not null default 20,
  free_shipping boolean not null default true,
  bundle_type text,
  redeemed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.print_coupons enable row level security;

create policy "print_coupons_own"
  on public.print_coupons for select
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Bootstrap: Basic user (no auto trial) + usage row
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

  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.ensure_usage_entitlements(p_user_id uuid)
returns public.usage_entitlements
language plpgsql
security definer
set search_path = public
as $$
declare
  v_row public.usage_entitlements;
  v_month text := to_char(now(), 'YYYY-MM');
begin
  insert into public.usage_entitlements (user_id, photos_month_key)
  values (p_user_id, v_month)
  on conflict (user_id) do nothing;

  select * into v_row from public.usage_entitlements where user_id = p_user_id for update;

  if v_row.photos_month_key is distinct from v_month then
    update public.usage_entitlements
    set photos_used_this_month = 0, photos_month_key = v_month, updated_at = now()
    where user_id = p_user_id
    returning * into v_row;
  end if;

  return v_row;
end;
$$;

create or replace function public.is_plus_active(p_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.memberships m
    where m.user_id = p_user_id
      and (
        m.status = 'comp'
        or (m.status = 'active' and (m.premium_until is null or m.premium_until > now()))
        or (m.status = 'trial' and m.trial_ends_at > now())
      )
  );
$$;

-- ---------------------------------------------------------------------------
-- RPC: check_and_increment_photo_usage
-- ---------------------------------------------------------------------------

create or replace function public.check_and_increment_photo_usage()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_usage public.usage_entitlements;
  v_plus boolean;
  v_limit int := 2;
begin
  if v_user_id is null then
    raise exception 'Sign in to upload album photos';
  end if;

  v_plus := public.is_plus_active(v_user_id);
  v_usage := public.ensure_usage_entitlements(v_user_id);

  if not v_plus and v_usage.photos_used_this_month >= v_limit then
    return jsonb_build_object(
      'allowed', false,
      'remaining', 0,
      'limit', v_limit,
      'is_plus', false
    );
  end if;

  if not v_plus then
    update public.usage_entitlements
    set photos_used_this_month = photos_used_this_month + 1, updated_at = now()
    where user_id = v_user_id;
    v_usage.photos_used_this_month := v_usage.photos_used_this_month + 1;
  end if;

  return jsonb_build_object(
    'allowed', true,
    'remaining', case when v_plus then -1 else greatest(0, v_limit - v_usage.photos_used_this_month) end,
    'limit', case when v_plus then -1 else v_limit end,
    'is_plus', v_plus
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- RPC: record_story_generation
-- ---------------------------------------------------------------------------

create or replace function public.record_story_generation()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_usage public.usage_entitlements;
  v_plus boolean;
  v_limit int := 1;
  v_first_story boolean;
  v_offer_trial boolean;
begin
  if v_user_id is null then
    raise exception 'Sign in to generate a story';
  end if;

  v_plus := public.is_plus_active(v_user_id);
  v_usage := public.ensure_usage_entitlements(v_user_id);

  if not v_plus and v_usage.stories_generated_total >= v_limit then
    return jsonb_build_object(
      'allowed', false,
      'remaining', 0,
      'is_plus', false,
      'offer_annual_trial', false
    );
  end if;

  v_first_story := v_usage.stories_generated_total = 0;

  update public.usage_entitlements
  set
    stories_generated_total = stories_generated_total + 1,
    first_story_generated_at = coalesce(first_story_generated_at, now()),
    updated_at = now()
  where user_id = v_user_id;

  v_offer_trial := v_first_story and not v_plus and v_usage.annual_trial_offered_at is null;

  if v_offer_trial then
    update public.usage_entitlements
    set annual_trial_offered_at = now(), updated_at = now()
    where user_id = v_user_id;
  end if;

  return jsonb_build_object(
    'allowed', true,
    'remaining', case when v_plus then -1 else greatest(0, v_limit - v_usage.stories_generated_total - 1) end,
    'is_plus', v_plus,
    'offer_annual_trial', v_offer_trial,
    'first_story', v_first_story
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- RPC: offer_annual_trial (marks trial start — Stripe webhook sets membership)
-- ---------------------------------------------------------------------------

create or replace function public.offer_annual_trial()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
begin
  if v_user_id is null then
    raise exception 'Sign in required';
  end if;

  perform public.ensure_usage_entitlements(v_user_id);

  update public.usage_entitlements
  set annual_trial_started_at = now(), updated_at = now()
  where user_id = v_user_id;

  return jsonb_build_object('ok', true);
end;
$$;

-- ---------------------------------------------------------------------------
-- RPC: check_voice_note_quota
-- ---------------------------------------------------------------------------

create or replace function public.check_voice_note_quota()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user_id uuid := auth.uid();
  v_usage public.usage_entitlements;
  v_plus boolean;
  v_limit int := 3;
  v_count int;
begin
  if v_user_id is null then
    raise exception 'Sign in to save voice notes';
  end if;

  v_plus := public.is_plus_active(v_user_id);
  select count(*)::int into v_count from public.voice_notes where user_id = v_user_id;
  v_usage := public.ensure_usage_entitlements(v_user_id);

  update public.usage_entitlements
  set voice_notes_stored_count = v_count, updated_at = now()
  where user_id = v_user_id;

  if not v_plus and v_count >= v_limit then
    return jsonb_build_object('allowed', false, 'remaining', 0, 'limit', v_limit, 'is_plus', false);
  end if;

  return jsonb_build_object(
    'allowed', true,
    'remaining', case when v_plus then -1 else greatest(0, v_limit - v_count) end,
    'limit', case when v_plus then -1 else v_limit end,
    'is_plus', v_plus
  );
end;
$$;

-- ---------------------------------------------------------------------------
-- Update redeem_promo_code to use plus plan
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
    v_premium_until := now() + make_interval(days => coalesce(v_promo.duration_days, 365));
  end if;

  insert into public.memberships (user_id, plan, status, source, trial_ends_at, premium_until, promo_code_id, updated_at)
  values (v_user_id, 'plus', v_status, 'promo', v_trial_ends, v_premium_until, v_promo.id, now())
  on conflict (user_id) do update set
    plan = 'plus',
    status = excluded.status,
    source = 'promo',
    trial_ends_at = excluded.trial_ends_at,
    premium_until = excluded.premium_until,
    promo_code_id = excluded.promo_code_id,
    updated_at = now();

  insert into public.promo_redemptions (user_id, promo_code_id)
  values (v_user_id, v_promo.id);

  update public.promo_codes set uses_count = uses_count + 1 where id = v_promo.id;

  return jsonb_build_object('ok', true, 'status', v_status);
end;
$$;

grant execute on function public.check_and_increment_photo_usage() to authenticated;
grant execute on function public.record_story_generation() to authenticated;
grant execute on function public.offer_annual_trial() to authenticated;
grant execute on function public.check_voice_note_quota() to authenticated;
