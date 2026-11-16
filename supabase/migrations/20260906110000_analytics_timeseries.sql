-- Daily series for staff Insights charts (query raw events; staff-only RPC).

create or replace function public.analytics_timeseries(p_from date, p_to date)
returns table (
  day date,
  sessions bigint,
  pageviews bigint,
  signups bigint,
  paid bigint,
  birth_dates bigint,
  milestones bigint,
  gate_hits bigint
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
  with days as (
    select generate_series(p_from, p_to, interval '1 day')::date as day
  ),
  agg as (
    select
      (occurred_at at time zone 'utc')::date as day,
      count(distinct session_id) filter (
        where event_name in ('page_view', 'session_start')
      ) as sessions,
      count(*) filter (where event_name = 'page_view') as pageviews,
      count(*) filter (where event_name = 'signup_completed') as signups,
      count(*) filter (where event_name = 'subscribe_success') as paid,
      count(*) filter (where event_name = 'birth_date_set') as birth_dates,
      count(*) filter (where event_name = 'milestone_checked') as milestones,
      count(*) filter (where event_name = 'gate_hit') as gate_hits
    from public.analytics_events
    where occurred_at >= p_from::timestamptz
      and occurred_at < (p_to + 1)::timestamptz
      and public.analytics_is_public_user(user_id)
    group by 1
  )
  select
    d.day,
    coalesce(a.sessions, 0),
    coalesce(a.pageviews, 0),
    coalesce(a.signups, 0),
    coalesce(a.paid, 0),
    coalesce(a.birth_dates, 0),
    coalesce(a.milestones, 0),
    coalesce(a.gate_hits, 0)
  from days d
  left join agg a on a.day = d.day
  order by d.day;
end;
$$;

revoke all on function public.analytics_timeseries(date, date) from public;
grant execute on function public.analytics_timeseries(date, date) to authenticated;