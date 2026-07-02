-- Baby Book v2: multilingual stories, voice profiles, ideas, time capsules
-- @see docs/ai-baby-book-plan.md

-- Extend baby_stories
alter table public.baby_stories
  add column if not exists language text default 'en',
  add column if not exists language_variants jsonb default '{}'::jsonb,
  add column if not exists folk_template_id text,
  add column if not exists voice_profile_id uuid,
  add column if not exists render_style text default 'parallax'
    check (render_style in ('parallax', 'popup', 'snowglobe'));

-- baby_profiles (sibling support)
create table if not exists public.baby_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null default 'Baby',
  birth_date date,
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists baby_profiles_user_idx on public.baby_profiles (user_id);

alter table public.baby_profiles enable row level security;

create policy "baby_profiles_own"
  on public.baby_profiles for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- voice_profiles
create table if not exists public.voice_profiles (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  role text not null default 'parent' check (role in ('parent', 'grandparent')),
  display_name text,
  language text default 'en',
  sample_storage_path text,
  clone_provider_id text,
  consent_signed_at timestamptz,
  invite_token text not null default replace(gen_random_uuid()::text, '-', ''),
  status text not null default 'pending' check (status in ('pending', 'active', 'revoked')),
  created_at timestamptz not null default now()
);

create index if not exists voice_profiles_owner_idx on public.voice_profiles (owner_user_id);
create unique index if not exists voice_profiles_invite_token_idx on public.voice_profiles (invite_token);

alter table public.voice_profiles enable row level security;

create policy "voice_profiles_owner_all"
  on public.voice_profiles for all
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

create policy "voice_profiles_invite_read"
  on public.voice_profiles for select
  using (true);

create policy "voice_profiles_invite_update"
  on public.voice_profiles for update
  using (invite_token is not null)
  with check (true);

-- voice_blessings
create table if not exists public.voice_blessings (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.voice_profiles (id) on delete cascade,
  baby_profile_id uuid references public.baby_profiles (id) on delete set null,
  owner_user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text,
  transcript text,
  language text default 'en',
  created_at timestamptz not null default now()
);

alter table public.voice_blessings enable row level security;

create policy "voice_blessings_owner"
  on public.voice_blessings for all
  using (auth.uid() = owner_user_id)
  with check (auth.uid() = owner_user_id);

-- time_capsules
create table if not exists public.time_capsules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  baby_profile_id uuid references public.baby_profiles (id) on delete cascade,
  content_text text not null,
  audio_path text,
  unlock_at timestamptz not null,
  sealed_for_print boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.time_capsules enable row level security;

create policy "time_capsules_own"
  on public.time_capsules for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- book_ideas
create table if not exists public.book_ideas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  concept_id text not null,
  status text not null default 'detected' check (status in ('detected', 'preview', 'generating', 'ready', 'failed')),
  matched_photo_ids jsonb not null default '[]'::jsonb,
  preview_url text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (user_id, concept_id)
);

alter table public.book_ideas enable row level security;

create policy "book_ideas_own"
  on public.book_ideas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- book_page_layers (depth segmentation cache)
create table if not exists public.book_page_layers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  photo_id text not null,
  render_style text not null default 'parallax',
  layer_paths jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  unique (user_id, photo_id, render_style)
);

alter table public.book_page_layers enable row level security;

create policy "book_page_layers_own"
  on public.book_page_layers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- FK for baby_stories voice_profile (after voice_profiles exists)
alter table public.baby_stories
  drop constraint if exists baby_stories_voice_profile_id_fkey;

alter table public.baby_stories
  add constraint baby_stories_voice_profile_id_fkey
  foreign key (voice_profile_id) references public.voice_profiles (id) on delete set null;
