-- Staff-editable job tags for evergreen guides. Public can read; staff can write.

create table if not exists public.guide_tag_overrides (
  slug text primary key,
  tags text[] not null default '{}'::text[],
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null,
  constraint guide_tag_overrides_tags_valid check (
    tags <@ array[
      'milestones',
      'vaccines',
      'food',
      'play',
      'care',
      'mom',
      'memories',
      'compare'
    ]::text[]
  )
);

alter table public.guide_tag_overrides enable row level security;

create policy "guide_tag_overrides_select_public"
  on public.guide_tag_overrides for select
  to anon, authenticated
  using (true);

create policy "guide_tag_overrides_staff_write"
  on public.guide_tag_overrides for all
  to authenticated
  using (public.is_staff())
  with check (public.is_staff());

grant select on public.guide_tag_overrides to anon, authenticated;
grant insert, update, delete on public.guide_tag_overrides to authenticated;
