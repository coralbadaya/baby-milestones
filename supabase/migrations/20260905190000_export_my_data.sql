-- Account data export RPC (metadata only — no storage blobs)

create or replace function public.export_my_data()
returns jsonb
language plpgsql
security invoker
set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_result jsonb;
begin
  if v_user is null then
    raise exception 'Sign in required';
  end if;

  select jsonb_build_object(
    'disclaimer', 'Yarn Trails is educational, not medical advice. This export is a copy of your account data.',
    'exported_at', now(),
    'profile', (
      select to_jsonb(p) from public.profiles p where p.id = v_user
    ),
    'membership', (
      select to_jsonb(m) from public.memberships m where m.user_id = v_user
    ),
    'baby_profiles', coalesce((
      select jsonb_agg(to_jsonb(b) order by b.is_primary desc, b.created_at)
      from public.baby_profiles b where b.user_id = v_user
    ), '[]'::jsonb),
    'milestone_checks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'baby_profile_id', c.baby_profile_id,
        'milestone_id', c.milestone_id,
        'checked', c.checked,
        'checked_at', c.checked_at
      ))
      from public.milestone_checks c where c.user_id = v_user
    ), '[]'::jsonb),
    'shopping_checks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'baby_profile_id', c.baby_profile_id,
        'item_id', c.item_id,
        'checked', c.checked
      ))
      from public.shopping_checks c where c.user_id = v_user
    ), '[]'::jsonb),
    'vaccine_settings', coalesce((
      select jsonb_agg(to_jsonb(s)) from public.vaccine_settings s where s.user_id = v_user
    ), '[]'::jsonb),
    'vaccine_records', coalesce((
      select jsonb_agg(jsonb_build_object(
        'baby_profile_id', r.baby_profile_id,
        'schedule_type', r.schedule_type,
        'vaccine_id', r.vaccine_id,
        'status', r.status,
        'given_on', r.given_on,
        'notes', r.notes
      ))
      from public.vaccine_records r where r.user_id = v_user
    ), '[]'::jsonb),
    'custom_vaccines', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', v.id,
        'baby_profile_id', v.baby_profile_id,
        'payload', v.payload
      ))
      from public.custom_vaccines v where v.user_id = v_user
    ), '[]'::jsonb),
    'first_moments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'baby_profile_id', f.baby_profile_id,
        'first_id', f.first_id,
        'media_type', f.media_type,
        'storage_path', f.storage_path,
        'note', f.note,
        'captured_at', f.captured_at
      ))
      from public.first_moments f where f.user_id = v_user
    ), '[]'::jsonb)
  ) into v_result;

  return v_result;
end;
$$;

grant execute on function public.export_my_data() to authenticated;
