-- First-party analytics warehouse (staff Insights). Not included in export_my_data.

create table if not exists public.analytics_events (
  id bigint generated always as identity primary key,
  occurred_at timestamptz not null default now(),
  session_id uuid not null,
  user_id uuid references auth.users (id) on delete set null,
  event_name text not null,
  path text,
  route_key text,
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  country text,
  device text,
  ip inet,
  ip_hash text,
  props jsonb not null default '{}'::jsonb
);

create index if not exists analytics_events_occurred_idx
  on public.analytics_events (occurred_at desc);
create index if not exists analytics_events_name_occurred_idx
  on public.analytics_events (event_name, occurred_at desc);
create index if not exists analytics_events_session_idx
  on public.analytics_events (session_id);
create index if not exists analytics_events_route_idx
  on public.analytics_events (route_key, occurred_at desc);

create table if not exists public.analytics_daily (
  day date not null,
  event_name text not null,
  route_key text not null default '',
  country text not null default '',
  device text not null default '',
  sessions integer not null default 0,
  pageviews integer not null default 0,
  unique_hashes integer not null default 0,
  signups integer not null default 0,
  checkouts integer not null default 0,
  paid integer not null default 0,
  primary key (day, event_name, route_key, country, device)
);

alter table public.analytics_events enable row level security;
alter table public.analytics_daily enable row level security;

create policy "analytics_daily_staff_select"
  on public.analytics_daily for select
  to authenticated
  using (public.is_staff());

grant select on public.analytics_daily to authenticated;

-- No direct table access to raw events for anon/authenticated.
revoke all on public.analytics_events from anon, authenticated, public;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

create or replace function public.analytics_is_public_user(p_user uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select p_user is null or not exists (
    select 1 from public.profiles pr
    where pr.id = p_user and pr.role in ('admin', 'support')
  );
$$;

create or replace function public.analytics_overview(p_from date, p_to date)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  result jsonb;
  prev_from date;
  prev_to date;
begin
  if not public.is_staff() then
    raise exception 'not allowed';
  end if;

  prev_to := p_from - 1;
  prev_from := prev_to - (p_to - p_from);

  with cur as (
    select
      count(*) filter (where event_name = 'page_view') as pageviews,
      count(distinct session_id) filter (where event_name in ('page_view', 'session_start')) as sessions,
      count(distinct ip_hash) filter (where ip_hash is not null) as uniques,
      count(*) filter (where event_name = 'page_view' and device = 'mobile') as mobile_views,
      count(*) filter (where event_name = 'signup_completed') as signups,
      count(*) filter (where event_name = 'subscribe_success') as paid,
      mode() within group (order by country) filter (where country is not null and country <> '') as top_country
    from public.analytics_events
    where occurred_at >= p_from::timestamptz
      and occurred_at < (p_to + 1)::timestamptz
      and public.analytics_is_public_user(user_id)
  ),
  bounce as (
    select count(*) as bounced
    from (
      select session_id
      from public.analytics_events
      where occurred_at >= p_from::timestamptz
        and occurred_at < (p_to + 1)::timestamptz
        and event_name = 'page_view'
        and public.analytics_is_public_user(user_id)
      group by session_id
      having count(*) = 1
    ) s
  ),
  prev as (
    select
      count(distinct session_id) filter (where event_name in ('page_view', 'session_start')) as sessions,
      count(*) filter (where event_name = 'signup_completed') as signups,
      count(*) filter (where event_name = 'subscribe_success') as paid
    from public.analytics_events
    where occurred_at >= prev_from::timestamptz
      and occurred_at < (prev_to + 1)::timestamptz
      and public.analytics_is_public_user(user_id)
  )
  select jsonb_build_object(
    'pageviews', coalesce(cur.pageviews, 0),
    'sessions', coalesce(cur.sessions, 0),
    'uniques', coalesce(cur.uniques, 0),
    'mobile_views', coalesce(cur.mobile_views, 0),
    'signups', coalesce(cur.signups, 0),
    'paid', coalesce(cur.paid, 0),
    'bounced', coalesce(bounce.bounced, 0),
    'top_country', cur.top_country,
    'prev_sessions', coalesce(prev.sessions, 0),
    'prev_signups', coalesce(prev.signups, 0),
    'prev_paid', coalesce(prev.paid, 0)
  )
  into result
  from cur, bounce, prev;

  return coalesce(result, '{}'::jsonb);
end;
$$;

create or replace function public.analytics_top_routes(p_from date, p_to date)
returns table (
  route_key text,
  pageviews bigint,
  sessions bigint,
  bounced bigint
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
    with route_stats as (
      select
        coalesce(e.route_key, '') as route_key,
        count(*) filter (where e.event_name = 'page_view') as pageviews,
        count(distinct e.session_id) as sessions
      from public.analytics_events e
      where e.occurred_at >= p_from::timestamptz
        and e.occurred_at < (p_to + 1)::timestamptz
        and public.analytics_is_public_user(e.user_id)
      group by 1
    ),
    bounced_sessions as (
      select coalesce(first_hit.route_key, '') as route_key, count(*) as bounced
      from (
        select distinct on (e.session_id) e.session_id, e.route_key
        from public.analytics_events e
        where e.occurred_at >= p_from::timestamptz
          and e.occurred_at < (p_to + 1)::timestamptz
          and e.event_name = 'page_view'
          and public.analytics_is_public_user(e.user_id)
        order by e.session_id, e.occurred_at
      ) first_hit
      join (
        select session_id
        from public.analytics_events
        where occurred_at >= p_from::timestamptz
          and occurred_at < (p_to + 1)::timestamptz
          and event_name = 'page_view'
          and public.analytics_is_public_user(user_id)
        group by session_id
        having count(*) = 1
      ) one_page using (session_id)
      group by 1
    )
    select
      r.route_key,
      r.pageviews,
      r.sessions,
      coalesce(b.bounced, 0) as bounced
    from route_stats r
    left join bounced_sessions b using (route_key)
    order by r.pageviews desc
    limit 20;
end;
$$;

create or replace function public.analytics_geo(p_from date, p_to date)
returns table (
  country text,
  sessions bigint,
  pageviews bigint
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
      coalesce(nullif(e.country, ''), 'unknown') as country,
      count(distinct e.session_id) as sessions,
      count(*) filter (where e.event_name = 'page_view') as pageviews
    from public.analytics_events e
    where e.occurred_at >= p_from::timestamptz
      and e.occurred_at < (p_to + 1)::timestamptz
      and public.analytics_is_public_user(e.user_id)
    group by 1
    order by sessions desc
    limit 20;
end;
$$;

create or replace function public.analytics_devices(p_from date, p_to date)
returns table (
  device text,
  sessions bigint,
  pageviews bigint
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
      coalesce(nullif(e.device, ''), 'unknown') as device,
      count(distinct e.session_id) as sessions,
      count(*) filter (where e.event_name = 'page_view') as pageviews
    from public.analytics_events e
    where e.occurred_at >= p_from::timestamptz
      and e.occurred_at < (p_to + 1)::timestamptz
      and public.analytics_is_public_user(e.user_id)
    group by 1
    order by sessions desc;
end;
$$;

create or replace function public.analytics_funnel(p_from date, p_to date)
returns table (
  event_name text,
  sessions bigint
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
    select step.event_name, count(distinct e.session_id) as sessions
    from (
      values
        (1, 'session_start'),
        (2, 'signup_view'),
        (3, 'signup_completed'),
        (4, 'premium_view'),
        (5, 'begin_checkout'),
        (6, 'subscribe_success')
    ) as step(ord, event_name)
    left join public.analytics_events e
      on e.event_name = step.event_name
      and e.occurred_at >= p_from::timestamptz
      and e.occurred_at < (p_to + 1)::timestamptz
      and public.analytics_is_public_user(e.user_id)
    group by step.ord, step.event_name
    order by step.ord;
end;
$$;

create or replace function public.analytics_utm(p_from date, p_to date)
returns table (
  referrer_host text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  sessions bigint
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
      coalesce(e.referrer_host, '') as referrer_host,
      coalesce(e.utm_source, '') as utm_source,
      coalesce(e.utm_medium, '') as utm_medium,
      coalesce(e.utm_campaign, '') as utm_campaign,
      count(distinct e.session_id) as sessions
    from public.analytics_events e
    where e.occurred_at >= p_from::timestamptz
      and e.occurred_at < (p_to + 1)::timestamptz
      and e.event_name in ('page_view', 'session_start')
      and public.analytics_is_public_user(e.user_id)
      and (
        coalesce(e.referrer_host, '') <> ''
        or coalesce(e.utm_source, '') <> ''
      )
    group by 1, 2, 3, 4
    order by sessions desc
    limit 25;
end;
$$;

create or replace function public.analytics_entry_pages(p_from date, p_to date)
returns table (
  path text,
  sessions bigint
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
    select first_hit.path, count(*) as sessions
    from (
      select distinct on (e.session_id) e.path
      from public.analytics_events e
      where e.occurred_at >= p_from::timestamptz
        and e.occurred_at < (p_to + 1)::timestamptz
        and e.event_name = 'page_view'
        and public.analytics_is_public_user(e.user_id)
      order by e.session_id, e.occurred_at
    ) first_hit
    group by first_hit.path
    order by sessions desc
    limit 15;
end;
$$;

create or replace function public.analytics_gates(p_from date, p_to date)
returns table (
  feature text,
  hits bigint
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
    select coalesce(e.props->>'feature', 'unknown') as feature, count(*) as hits
    from public.analytics_events e
    where e.occurred_at >= p_from::timestamptz
      and e.occurred_at < (p_to + 1)::timestamptz
      and e.event_name = 'gate_hit'
      and public.analytics_is_public_user(e.user_id)
    group by 1
    order by hits desc
    limit 20;
end;
$$;

create or replace function public.analytics_habit(p_from date, p_to date)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_staff() then
    raise exception 'not allowed';
  end if;
  return (
    select jsonb_build_object(
      'birth_date_set', count(*) filter (where event_name = 'birth_date_set'),
      'milestone_checked', count(*) filter (where event_name = 'milestone_checked'),
      'first_saved', count(*) filter (where event_name = 'first_saved')
    )
    from public.analytics_events
    where occurred_at >= p_from::timestamptz
      and occurred_at < (p_to + 1)::timestamptz
      and public.analytics_is_public_user(user_id)
  );
end;
$$;

create or replace function public.analytics_content(p_from date, p_to date)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  guides jsonb;
  tabs jsonb;
begin
  if not public.is_staff() then
    raise exception 'not allowed';
  end if;

  select coalesce(jsonb_agg(row_to_json(g)), '[]'::jsonb)
  into guides
  from (
    select coalesce(props->>'guide_slug', '') as slug, count(*) as views
    from public.analytics_events
    where occurred_at >= p_from::timestamptz
      and occurred_at < (p_to + 1)::timestamptz
      and event_name = 'guide_view'
      and public.analytics_is_public_user(user_id)
    group by 1
    order by views desc
    limit 15
  ) g;

  select coalesce(jsonb_agg(row_to_json(t)), '[]'::jsonb)
  into tabs
  from (
    select coalesce(props->>'tab', '') as tab, count(*) as views
    from public.analytics_events
    where occurred_at >= p_from::timestamptz
      and occurred_at < (p_to + 1)::timestamptz
      and event_name = 'community_tab'
      and public.analytics_is_public_user(user_id)
    group by 1
    order by views desc
  ) t;

  return jsonb_build_object('guides', guides, 'community_tabs', tabs);
end;
$$;

create or replace function public.analytics_lookup_ip(p_query text)
returns table (
  occurred_at timestamptz,
  path text,
  country text,
  ip inet,
  ip_hash text,
  session_id uuid
)
language plpgsql
stable
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    raise exception 'not allowed';
  end if;
  if p_query is null or length(trim(p_query)) < 8 then
    raise exception 'query too short';
  end if;

  return query
    select e.occurred_at, e.path, e.country, e.ip, e.ip_hash, e.session_id
    from public.analytics_events e
    where e.occurred_at >= now() - interval '30 days'
      and (
        e.session_id::text = trim(p_query)
        or e.ip_hash = trim(p_query)
        or e.ip::text = trim(p_query)
      )
    order by e.occurred_at desc
    limit 50;
end;
$$;

create or replace function public.analytics_rollup_and_scrub()
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  rolled integer := 0;
  scrubbed integer := 0;
  purged integer := 0;
begin
  insert into public.analytics_daily as d (
    day, event_name, route_key, country, device,
    sessions, pageviews, unique_hashes, signups, checkouts, paid
  )
  select
    e.occurred_at::date,
    e.event_name,
    coalesce(e.route_key, ''),
    coalesce(e.country, ''),
    coalesce(e.device, ''),
    count(distinct e.session_id),
    count(*) filter (where e.event_name = 'page_view'),
    count(distinct e.ip_hash) filter (where e.ip_hash is not null),
    count(*) filter (where e.event_name = 'signup_completed'),
    count(*) filter (where e.event_name = 'begin_checkout'),
    count(*) filter (where e.event_name = 'subscribe_success')
  from public.analytics_events e
  where e.occurred_at >= (current_date - 2)
    and e.occurred_at < current_date
  group by 1, 2, 3, 4, 5
  on conflict (day, event_name, route_key, country, device) do update set
    sessions = excluded.sessions,
    pageviews = excluded.pageviews,
    unique_hashes = excluded.unique_hashes,
    signups = excluded.signups,
    checkouts = excluded.checkouts,
    paid = excluded.paid;
  get diagnostics rolled = row_count;

  update public.analytics_events
  set ip = null
  where ip is not null
    and occurred_at < now() - interval '30 days';
  get diagnostics scrubbed = row_count;

  delete from public.analytics_events
  where occurred_at < now() - interval '90 days';
  get diagnostics purged = row_count;

  return jsonb_build_object(
    'rolled', rolled,
    'ip_scrubbed', scrubbed,
    'purged', purged
  );
end;
$$;

revoke all on function public.analytics_is_public_user(uuid) from public, anon, authenticated;
revoke all on function public.analytics_rollup_and_scrub() from public, anon, authenticated;

revoke all on function public.analytics_overview(date, date) from public;
revoke all on function public.analytics_top_routes(date, date) from public;
revoke all on function public.analytics_geo(date, date) from public;
revoke all on function public.analytics_devices(date, date) from public;
revoke all on function public.analytics_funnel(date, date) from public;
revoke all on function public.analytics_utm(date, date) from public;
revoke all on function public.analytics_entry_pages(date, date) from public;
revoke all on function public.analytics_gates(date, date) from public;
revoke all on function public.analytics_habit(date, date) from public;
revoke all on function public.analytics_content(date, date) from public;
revoke all on function public.analytics_lookup_ip(text) from public;

grant execute on function public.analytics_overview(date, date) to authenticated;
grant execute on function public.analytics_top_routes(date, date) to authenticated;
grant execute on function public.analytics_geo(date, date) to authenticated;
grant execute on function public.analytics_devices(date, date) to authenticated;
grant execute on function public.analytics_funnel(date, date) to authenticated;
grant execute on function public.analytics_utm(date, date) to authenticated;
grant execute on function public.analytics_entry_pages(date, date) to authenticated;
grant execute on function public.analytics_gates(date, date) to authenticated;
grant execute on function public.analytics_habit(date, date) to authenticated;
grant execute on function public.analytics_content(date, date) to authenticated;
grant execute on function public.analytics_lookup_ip(text) to authenticated;
-- rollup is service-role only (no grant to authenticated)
-- Retention: analytics_rollup_and_scrub nulls ip after 30 days, deletes rows after 90 days.
