-- Fix bounce join: first-hit subquery must expose session_id for USING.

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

revoke all on function public.analytics_top_routes(date, date) from public;
grant execute on function public.analytics_top_routes(date, date) to authenticated;
