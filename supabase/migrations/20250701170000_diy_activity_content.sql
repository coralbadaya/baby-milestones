-- Yarn Trails: admin-managed DIY activity content overrides (full activity snapshot per row)

-- ---------------------------------------------------------------------------
-- diy_activity_content
-- ---------------------------------------------------------------------------

create table if not exists public.diy_activity_content (
  activity_id text primary key,
  name text not null,
  category text not null
    check (category in ('sensory', 'motor', 'cognitive', 'emotional', 'bonding')),
  duration text not null,
  difficulty text not null default 'Easy'
    check (difficulty in ('Easy', 'Medium', 'Hard')),
  materials text[] not null default '{}'::text[],
  steps text[] not null default '{}'::text[],
  benefits text[] not null default '{}'::text[],
  why_it_works text not null,
  video_search text not null,
  illustration text not null,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index if not exists diy_activity_content_updated_at_idx
  on public.diy_activity_content (updated_at desc);

alter table public.diy_activity_content enable row level security;

create policy "diy_activity_content_select_public"
  on public.diy_activity_content for select
  to anon, authenticated
  using (true);

create policy "diy_activity_content_admin_all"
  on public.diy_activity_content for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

grant select on public.diy_activity_content to anon, authenticated;
grant all on public.diy_activity_content to authenticated;
