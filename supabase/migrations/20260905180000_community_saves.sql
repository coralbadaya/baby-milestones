-- Saved recipes and helpful tip counts per user

create table if not exists public.user_saved_recipes (
  user_id uuid not null references auth.users (id) on delete cascade,
  recipe_id text not null,
  created_at timestamptz not null default now(),
  primary key (user_id, recipe_id)
);

alter table public.user_saved_recipes enable row level security;

create policy "user_saved_recipes_own"
  on public.user_saved_recipes for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.user_saved_recipes to authenticated;

create table if not exists public.user_helpful_tips (
  user_id uuid not null references auth.users (id) on delete cascade,
  tip_id text not null,
  count int not null default 1,
  primary key (user_id, tip_id)
);

alter table public.user_helpful_tips enable row level security;

create policy "user_helpful_tips_own"
  on public.user_helpful_tips for all
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update, delete on public.user_helpful_tips to authenticated;
