-- Nestbean: community recipes, tips, memories, comments

-- ---------------------------------------------------------------------------
-- community_recipes
-- ---------------------------------------------------------------------------

create table if not exists public.community_recipes (
  id text primary key,
  title text not null,
  description text,
  video_url text,
  ai_video_url text,
  thumbnail text,
  prep_time text not null default '',
  age_range text not null default '',
  age_min_months integer,
  ingredients text[] not null default '{}'::text[],
  steps text[] not null default '{}'::text[],
  nutrition_tip text,
  tags text[] not null default '{}'::text[],
  meal_type text check (meal_type is null or meal_type in ('breakfast', 'lunch', 'snack')),
  published boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_recipes_published_idx
  on public.community_recipes (published, sort_order);

alter table public.community_recipes enable row level security;

create policy "community_recipes_public_select"
  on public.community_recipes for select
  to anon, authenticated
  using (published = true);

create policy "community_recipes_staff_select"
  on public.community_recipes for select
  to authenticated
  using (public.is_staff());

create policy "community_recipes_admin_all"
  on public.community_recipes for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- community_tips
-- ---------------------------------------------------------------------------

create table if not exists public.community_tips (
  id text primary key,
  title text not null,
  tagline text,
  preview text not null default '',
  content text not null default '',
  age_range text not null default '',
  age_min_months integer,
  age_max_months integer,
  category text not null
    check (category in ('health', 'sleep', 'feeding', 'play')),
  tags text[] not null default '{}'::text[],
  published boolean not null default true,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_tips_published_idx
  on public.community_tips (published, category, sort_order);

alter table public.community_tips enable row level security;

create policy "community_tips_public_select"
  on public.community_tips for select
  to anon, authenticated
  using (published = true);

create policy "community_tips_staff_select"
  on public.community_tips for select
  to authenticated
  using (public.is_staff());

create policy "community_tips_admin_all"
  on public.community_tips for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- community_memories
-- ---------------------------------------------------------------------------

create table if not exists public.community_memories (
  id uuid primary key default gen_random_uuid(),
  legacy_id text unique,
  type text not null
    check (type in ('milestone', 'tip', 'recipe', 'moment', 'struggle')),
  title text not null,
  content text not null,
  baby_age text,
  tags text[] not null default '{}'::text[],
  status text not null default 'pending'
    check (status in ('pending', 'published', 'hidden')),
  featured boolean not null default false,
  reactions jsonb not null default '{"heart":0,"celebrate":0,"support":0}'::jsonb,
  author_id uuid references auth.users (id) on delete set null,
  author_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists community_memories_status_created_idx
  on public.community_memories (status, created_at desc);

create index if not exists community_memories_author_idx
  on public.community_memories (author_id);

alter table public.community_memories enable row level security;

create policy "community_memories_public_select"
  on public.community_memories for select
  to anon, authenticated
  using (status = 'published');

create policy "community_memories_staff_select"
  on public.community_memories for select
  to authenticated
  using (public.is_staff());

create policy "community_memories_author_insert"
  on public.community_memories for insert
  to authenticated
  with check (author_id = auth.uid() and status = 'pending');

create policy "community_memories_author_select_own"
  on public.community_memories for select
  to authenticated
  using (author_id = auth.uid());

create policy "community_memories_admin_all"
  on public.community_memories for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- community_memory_comments
-- ---------------------------------------------------------------------------

create table if not exists public.community_memory_comments (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.community_memories (id) on delete cascade,
  text text not null,
  author_name text not null default 'Anonymous',
  created_at timestamptz not null default now()
);

create index if not exists community_memory_comments_memory_idx
  on public.community_memory_comments (memory_id, created_at);

alter table public.community_memory_comments enable row level security;

create policy "community_memory_comments_public_select"
  on public.community_memory_comments for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.community_memories m
      where m.id = memory_id and m.status = 'published'
    )
  );

create policy "community_memory_comments_staff_select"
  on public.community_memory_comments for select
  to authenticated
  using (public.is_staff());

create policy "community_memory_comments_authenticated_insert"
  on public.community_memory_comments for insert
  to authenticated
  with check (
    exists (
      select 1 from public.community_memories m
      where m.id = memory_id and m.status = 'published'
    )
  );

create policy "community_memory_comments_admin_all"
  on public.community_memory_comments for all
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------------------------------------------------------------------------
-- RPC: increment reaction on published memory (anon + authenticated)
-- ---------------------------------------------------------------------------

create or replace function public.react_to_community_memory(p_memory_id uuid, p_reaction text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_reaction not in ('heart', 'celebrate', 'support') then
    raise exception 'invalid reaction type';
  end if;

  update public.community_memories
  set
    reactions = jsonb_set(
      reactions,
      array[p_reaction],
      to_jsonb(coalesce((reactions ->> p_reaction)::integer, 0) + 1),
      true
    ),
    updated_at = now()
  where id = p_memory_id and status = 'published';
end;
$$;

grant execute on function public.react_to_community_memory(uuid, text) to anon, authenticated;
