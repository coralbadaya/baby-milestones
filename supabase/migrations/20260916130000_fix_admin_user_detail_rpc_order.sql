-- PostgREST exposes RPC args alphabetically (p_days, p_user_id). Drop the old signature.

drop function if exists public.admin_user_detail(uuid, int);

create or replace function public.admin_user_detail(p_days int, p_user_id uuid)
returns jsonb
language plpgsql
stable
security definer
set search_path = public
as $$
declare
  v_days int := greatest(1, least(coalesce(p_days, 90), 90));
  v_from timestamptz := now() - (v_days || ' days')::interval;
  result jsonb;
  v_show_ip boolean := public.is_admin();
begin
  if not public.is_staff() then
    raise exception 'not allowed';
  end if;

  if not exists (select 1 from public.profiles where id = p_user_id) then
    return null;
  end if;

  select jsonb_build_object(
    'profile', (
      select jsonb_build_object(
        'id', p.id,
        'display_name', p.display_name,
        'role', p.role,
        'created_at', p.created_at,
        'updated_at', p.updated_at
      )
      from public.profiles p where p.id = p_user_id
    ),
    'auth', (
      select jsonb_build_object(
        'email', u.email::text,
        'created_at', u.created_at,
        'last_sign_in_at', u.last_sign_in_at,
        'email_confirmed_at', u.email_confirmed_at
      )
      from auth.users u where u.id = p_user_id
    ),
    'membership', (
      select to_jsonb(m.*)
      from public.memberships m where m.user_id = p_user_id
    ),
    'baby', (
      select jsonb_build_object(
        'id', bp.id,
        'name', bp.name,
        'birth_date', bp.birth_date,
        'is_primary', bp.is_primary,
        'updated_at', bp.updated_at
      )
      from public.baby_profiles bp
      where bp.user_id = p_user_id and bp.is_primary = true
      limit 1
    ),
    'counts', (
      select jsonb_build_object(
        'contact_messages', (
          select count(*)::int from public.contact_submissions c where c.user_id = p_user_id
        ),
        'community_posts', (
          select count(*)::int from public.community_memories cm where cm.author_id = p_user_id
        )
      )
    ),
    'metrics', coalesce(
      (
        select jsonb_build_object(
          'days', v_days,
          'first_seen', min(e.occurred_at),
          'last_seen', max(e.occurred_at),
          'sessions', count(distinct e.session_id),
          'pageviews', count(*) filter (where e.event_name = 'page_view'),
          'logins', count(*) filter (where e.event_name = 'login_completed'),
          'logouts', count(*) filter (where e.event_name = 'logout_completed'),
          'signups', count(*) filter (where e.event_name = 'signup_completed'),
          'milestone_checks', count(*) filter (where e.event_name = 'milestone_checked'),
          'first_saved', count(*) filter (where e.event_name = 'first_saved'),
          'gate_hits', count(*) filter (where e.event_name = 'gate_hit'),
          'by_event', (
            select coalesce(jsonb_object_agg(event_name, cnt), '{}'::jsonb)
            from (
              select e2.event_name, count(*)::int as cnt
              from public.analytics_events e2
              where e2.user_id = p_user_id and e2.occurred_at >= v_from
              group by e2.event_name
            ) ev
          ),
          'top_routes', (
            select coalesce(jsonb_agg(jsonb_build_object(
              'route_key', route_key,
              'pageviews', pv
            ) order by pv desc), '[]'::jsonb)
            from (
              select e2.route_key, count(*)::int as pv
              from public.analytics_events e2
              where e2.user_id = p_user_id
                and e2.occurred_at >= v_from
                and e2.event_name = 'page_view'
                and e2.route_key is not null and e2.route_key <> ''
              group by e2.route_key
              order by pv desc
              limit 12
            ) r
          )
        )
        from public.analytics_events e
        where e.user_id = p_user_id and e.occurred_at >= v_from
      ),
      jsonb_build_object(
        'days', v_days,
        'first_seen', null,
        'last_seen', null,
        'sessions', 0,
        'pageviews', 0,
        'logins', 0,
        'logouts', 0,
        'signups', 0,
        'milestone_checks', 0,
        'first_saved', 0,
        'gate_hits', 0,
        'by_event', '{}'::jsonb,
        'top_routes', '[]'::jsonb
      )
    ),
    'sessions', (
      select coalesce(jsonb_agg(row_to_json(s)::jsonb order by s.started_at desc), '[]'::jsonb)
      from (
        select
          g.session_id,
          g.started_at,
          g.ended_at,
          g.event_count,
          g.pageviews,
          g.device,
          g.country,
          g.login_at,
          g.logout_at,
          g.session_start_at,
          ent.entry_path,
          ent.referrer_host,
          ent.utm_source,
          case
            when g.logout_at is not null then 'logout_event'
            when g.ended_at < now() - interval '35 minutes' then 'idle_timeout'
            else 'open_or_recent'
          end as end_reason
        from (
          select
            e.session_id,
            min(e.occurred_at) as started_at,
            max(e.occurred_at) as ended_at,
            count(*)::int as event_count,
            count(*) filter (where e.event_name = 'page_view')::int as pageviews,
            mode() within group (order by e.device) as device,
            mode() within group (order by e.country) filter (where e.country is not null and e.country <> '') as country,
            min(e.occurred_at) filter (where e.event_name = 'login_completed') as login_at,
            max(e.occurred_at) filter (where e.event_name = 'logout_completed') as logout_at,
            min(e.occurred_at) filter (where e.event_name = 'session_start') as session_start_at
          from public.analytics_events e
          where e.user_id = p_user_id and e.occurred_at >= v_from
          group by e.session_id
        ) g
        left join lateral (
          select
            e.path as entry_path,
            e.referrer_host,
            e.utm_source
          from public.analytics_events e
          where e.session_id = g.session_id and e.user_id = p_user_id
          order by e.occurred_at asc
          limit 1
        ) ent on true
        order by g.started_at desc
        limit 80
      ) s
    ),
    'events', (
      select coalesce(jsonb_agg(jsonb_build_object(
        'occurred_at', e.occurred_at,
        'event_name', e.event_name,
        'path', e.path,
        'route_key', e.route_key,
        'session_id', e.session_id,
        'device', e.device,
        'country', e.country,
        'referrer_host', e.referrer_host,
        'props', e.props,
        'ip_hash', e.ip_hash,
        'ip', case when v_show_ip then e.ip::text else null end
      ) order by e.occurred_at desc), '[]'::jsonb)
      from (
        select *
        from public.analytics_events e
        where e.user_id = p_user_id and e.occurred_at >= v_from
        order by e.occurred_at desc
        limit 250
      ) e
    )
  ) into result;

  return coalesce(result, '{}'::jsonb);
end;
$$;

revoke all on function public.admin_user_detail(int, uuid) from public, anon;
grant execute on function public.admin_user_detail(int, uuid) to authenticated;