-- Public contact form via security definer RPC (anon has no SELECT on contact_submissions)

create or replace function public.submit_contact_form(
  p_email text,
  p_name text default null,
  p_subject text default 'general',
  p_message text default null,
  p_user_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_id uuid;
begin
  if p_email is null or trim(p_email) = '' then
    raise exception 'Email is required';
  end if;
  if p_message is null or trim(p_message) = '' then
    raise exception 'Message is required';
  end if;
  if p_subject is not null and p_subject not in ('general', 'press', 'partnership', 'feedback') then
    raise exception 'Invalid subject';
  end if;

  insert into public.contact_submissions (email, name, subject, message, user_id)
  values (
    trim(p_email),
    nullif(trim(coalesce(p_name, '')), ''),
    coalesce(nullif(trim(p_subject), ''), 'general'),
    trim(p_message),
    p_user_id
  )
  returning id into v_id;

  return v_id;
end;
$$;

grant execute on function public.submit_contact_form(text, text, text, text, uuid) to anon, authenticated;
