-- Tighten public story/voice access; token RPCs; baby_profile_id on media tables

-- ---------------------------------------------------------------------------
-- baby_stories: drop public select; token RPC
-- ---------------------------------------------------------------------------

drop policy if exists "baby_stories_preview_read" on public.baby_stories;

create or replace function public.get_story_by_preview_token(p_token text)
returns table (title text, pages jsonb, preview_token text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_token is null or trim(p_token) = '' then
    return;
  end if;

  return query
  select s.title, s.pages, s.preview_token
  from public.baby_stories s
  where s.preview_token = trim(p_token)
     or s.id::text = trim(p_token)
  limit 1;
end;
$$;

grant execute on function public.get_story_by_preview_token(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- voice_profiles: drop open invite policies; token RPCs
-- ---------------------------------------------------------------------------

drop policy if exists "voice_profiles_invite_read" on public.voice_profiles;
drop policy if exists "voice_profiles_invite_update" on public.voice_profiles;

create or replace function public.get_voice_invite(p_token text)
returns table (
  id uuid,
  display_name text,
  language text,
  status text,
  role text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_token is null or trim(p_token) = '' then
    return;
  end if;

  return query
  select vp.id, vp.display_name, vp.language, vp.status, vp.role
  from public.voice_profiles vp
  where vp.invite_token = trim(p_token)
    and vp.status is distinct from 'revoked'
  limit 1;
end;
$$;

grant execute on function public.get_voice_invite(text) to anon, authenticated;

create or replace function public.accept_voice_invite(
  p_token text,
  p_sample_storage_path text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_token is null or trim(p_token) = '' then
    raise exception 'Invite token required';
  end if;
  if p_sample_storage_path is null or trim(p_sample_storage_path) = '' then
    raise exception 'Sample path required';
  end if;

  update public.voice_profiles
  set
    sample_storage_path = trim(p_sample_storage_path),
    consent_signed_at = now(),
    status = 'pending'
  where invite_token = trim(p_token)
    and status is distinct from 'revoked'
  returning id into v_id;

  if v_id is null then
    raise exception 'Invite not found';
  end if;

  return jsonb_build_object('ok', true, 'id', v_id);
end;
$$;

grant execute on function public.accept_voice_invite(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Attach media rows to a baby profile (nullable for existing rows)
-- ---------------------------------------------------------------------------

alter table public.album_photos
  add column if not exists baby_profile_id uuid references public.baby_profiles (id) on delete set null;

alter table public.baby_stories
  add column if not exists baby_profile_id uuid references public.baby_profiles (id) on delete set null;

alter table public.voice_notes
  add column if not exists baby_profile_id uuid references public.baby_profiles (id) on delete set null;

create index if not exists album_photos_baby_idx on public.album_photos (baby_profile_id);
create index if not exists baby_stories_baby_idx on public.baby_stories (baby_profile_id);
create index if not exists voice_notes_baby_idx on public.voice_notes (baby_profile_id);
