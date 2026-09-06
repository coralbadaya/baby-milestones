-- Public permalink slugs for community memories (/community/feed/:slug).

create or replace function public.community_memory_slugify(p_title text, p_id uuid)
returns text
language plpgsql
immutable
set search_path = public
as $$
declare
  base text;
  suffix text;
begin
  base := lower(trim(coalesce(p_title, '')));
  base := regexp_replace(base, '[^a-z0-9]+', '-', 'g');
  base := regexp_replace(base, '(^-+|-+$)', '', 'g');
  if base is null or base = '' then
    base := 'post';
  end if;
  suffix := substr(replace(p_id::text, '-', ''), 1, 8);
  return base || '-' || suffix;
end;
$$;

revoke all on function public.community_memory_slugify(text, uuid) from public;
grant execute on function public.community_memory_slugify(text, uuid) to anon, authenticated;

alter table public.community_memories
  add column if not exists slug text;

update public.community_memories
set slug = coalesce(
  nullif(btrim(legacy_id), ''),
  public.community_memory_slugify(title, id)
)
where slug is null or btrim(slug) = '';

alter table public.community_memories
  alter column slug set not null;

create unique index if not exists community_memories_slug_key
  on public.community_memories (slug);

create or replace function public.community_memories_set_slug()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if new.slug is null or btrim(new.slug) = '' then
    new.slug := coalesce(
      nullif(btrim(new.legacy_id), ''),
      public.community_memory_slugify(new.title, new.id)
    );
  end if;
  return new;
end;
$$;

drop trigger if exists community_memories_set_slug on public.community_memories;
create trigger community_memories_set_slug
  before insert on public.community_memories
  for each row execute function public.community_memories_set_slug();
