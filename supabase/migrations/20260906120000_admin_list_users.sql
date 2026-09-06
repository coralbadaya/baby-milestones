-- Staff Users table: email + last login live on auth.users, not public.profiles.

create or replace function public.admin_list_users()
returns table (
  id uuid,
  display_name text,
  role text,
  created_at timestamptz,
  email text,
  last_sign_in_at timestamptz
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
    u.last_sign_in_at
  from public.profiles p
  left join auth.users u on u.id = p.id
  order by p.created_at desc
  limit 200;
end;
$$;

revoke all on function public.admin_list_users() from public, anon;
grant execute on function public.admin_list_users() to authenticated;
