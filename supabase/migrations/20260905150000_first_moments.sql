-- Life firsts metadata + private storage bucket

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'first-moments',
  'first-moments',
  false,
  15728640,
  array['image/jpeg', 'image/jpg', 'image/webp', 'image/png', 'image/gif', 'video/mp4', 'video/webm', 'video/quicktime']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create table if not exists public.first_moments (
  user_id uuid not null references auth.users (id) on delete cascade,
  baby_profile_id uuid not null references public.baby_profiles (id) on delete cascade,
  first_id text not null,
  media_type text check (media_type in ('photo', 'video')),
  storage_path text,
  note text,
  captured_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (baby_profile_id, first_id)
);

create index if not exists first_moments_user_idx on public.first_moments (user_id);

alter table public.first_moments enable row level security;

create policy "first_moments_own"
  on public.first_moments for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.first_moments to authenticated;

create policy "first_moments_select_own"
  on storage.objects for select
  to authenticated
  using (
    bucket_id = 'first-moments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "first_moments_insert_own"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'first-moments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "first_moments_update_own"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'first-moments'
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id = 'first-moments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "first_moments_delete_own"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'first-moments'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
