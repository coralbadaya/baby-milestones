-- Fix RLS recursion on is_staff/is_admin (stack depth exceeded on profile reads)
-- and reaffirm anonymous contact form inserts.

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin', 'support')
  );
$$;

-- Contact form: allow visitors (anon) and signed-in users to submit
drop policy if exists "contact_insert_anon" on public.contact_submissions;
create policy "contact_insert_anon"
  on public.contact_submissions for insert
  to anon, authenticated
  with check (true);

grant insert on table public.contact_submissions to anon;
grant insert on table public.contact_submissions to authenticated;
grant select, update on table public.contact_submissions to authenticated;
