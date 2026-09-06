-- Vaccination settings, records, and custom schedule items

create table if not exists public.vaccine_settings (
  baby_profile_id uuid primary key references public.baby_profiles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  schedule_type text not null default 'india'
    check (schedule_type in ('india', 'cdc', 'custom')),
  reminder_days int not null default 7,
  updated_at timestamptz not null default now()
);

alter table public.vaccine_settings enable row level security;

create policy "vaccine_settings_own"
  on public.vaccine_settings for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.vaccine_settings to authenticated;

create table if not exists public.vaccine_records (
  baby_profile_id uuid not null references public.baby_profiles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  schedule_type text not null
    check (schedule_type in ('india', 'cdc', 'custom')),
  vaccine_id text not null,
  status text not null default 'pending'
    check (status in ('pending', 'done', 'skipped')),
  given_on date,
  notes text,
  updated_at timestamptz not null default now(),
  primary key (baby_profile_id, schedule_type, vaccine_id)
);

create index if not exists vaccine_records_user_idx on public.vaccine_records (user_id);

alter table public.vaccine_records enable row level security;

create policy "vaccine_records_own"
  on public.vaccine_records for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.vaccine_records to authenticated;

create table if not exists public.custom_vaccines (
  id uuid primary key default gen_random_uuid(),
  baby_profile_id uuid not null references public.baby_profiles (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists custom_vaccines_baby_idx on public.custom_vaccines (baby_profile_id);

alter table public.custom_vaccines enable row level security;

create policy "custom_vaccines_own"
  on public.custom_vaccines for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.custom_vaccines to authenticated;
