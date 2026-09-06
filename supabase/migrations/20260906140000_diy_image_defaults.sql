-- Yarn Trails: site-wide DIY card default image (singleton)

create table if not exists public.diy_image_defaults (
  id text primary key default 'global' check (id = 'global'),
  storage_path text not null,
  alt_text text not null default 'Hands-on play',
  source text not null default 'upload'
    check (source in ('upload', 'url_import', 'ai', 'stock')),
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

alter table public.diy_image_defaults enable row level security;

create policy "diy_image_defaults_select_public"
  on public.diy_image_defaults for select
  to anon, authenticated
  using (true);

create policy "diy_image_defaults_admin_all"
  on public.diy_image_defaults for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.diy_image_defaults to anon, authenticated;
grant all on public.diy_image_defaults to authenticated;
