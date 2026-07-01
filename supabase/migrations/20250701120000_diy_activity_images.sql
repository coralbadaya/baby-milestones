-- Nestbean: per-activity DIY image overrides (Supabase Storage + metadata)

-- ---------------------------------------------------------------------------
-- diy_activity_images
-- ---------------------------------------------------------------------------

create table if not exists public.diy_activity_images (
  activity_id text primary key,
  storage_path text not null,
  alt_text text not null,
  source text not null default 'upload'
    check (source in ('upload', 'url_import', 'ai', 'stock', 'seed')),
  attribution text,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index if not exists diy_activity_images_updated_at_idx
  on public.diy_activity_images (updated_at desc);

alter table public.diy_activity_images enable row level security;

create policy "diy_activity_images_select_public"
  on public.diy_activity_images for select
  to anon, authenticated
  using (true);

create policy "diy_activity_images_admin_all"
  on public.diy_activity_images for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- Storage bucket: diy-images (public read)
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'diy-images',
  'diy-images',
  true,
  2097152,
  array['image/jpeg', 'image/jpg', 'image/webp', 'image/png']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "diy_images_public_read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'diy-images');

create policy "diy_images_admin_insert"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'diy-images' and public.is_admin());

create policy "diy_images_admin_update"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'diy-images' and public.is_admin())
  with check (bucket_id = 'diy-images' and public.is_admin());

create policy "diy_images_admin_delete"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'diy-images' and public.is_admin());

-- ---------------------------------------------------------------------------
-- Grants (Data API)
-- ---------------------------------------------------------------------------

grant select on public.diy_activity_images to anon, authenticated;
grant all on public.diy_activity_images to authenticated;
