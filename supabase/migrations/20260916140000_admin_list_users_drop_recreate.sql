-- admin_list_users OUT shape changed; PostgreSQL requires drop before replace.

drop function if exists public.admin_list_users();

create or replace function public.admin_list_users()
returns table (
  id uuid,
  display_name text,
  role text,
  created_at timestamptz,
  email text,
  last_sign_in_at timestamptz,
  last_active_at timestamptz,
  sessions_30d bigint
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'not allowed';
  end if;

  return query
  select
    p.id,
    p.display_name,
    p.role,
    p.created_at,
    u.email::text,
    u.last_sign_in_at,
    act.last_active_at,
    coalesce(act.sessions_30d, 0)::bigint
  from public.profiles p
  left join auth.users u on u.id = p.id
  left join lateral (
    select
      max(e.occurred_at) as last_active_at,
      count(distinct e.session_id) filter (
        where e.occurred_at >= now() - interval '30 days'
      ) as sessions_30d
    from public.analytics_events e
    where e.user_id = p.id
  ) act on true
  order by coalesce(act.last_active_at, p.created_at) desc
  limit 500;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;