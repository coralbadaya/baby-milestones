import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminEmpty from '../../components/admin/AdminEmpty';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminStatCard from '../../components/admin/AdminStatCard';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';
import { analyticsRange, bounceRate, formatRate } from '../../utils/analyticsAdmin';
import { interact } from '../../utils/haptics';
import { supabase } from '../../utils/supabaseClient';

const TABS = [
  { id: 'traffic', label: 'Traffic' },
  { id: 'acquisition', label: 'Acquisition' },
  { id: 'conversion', label: 'Conversion' },
  { id: 'habit', label: 'Habit' },
  { id: 'content', label: 'Content' },
];

const RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
];

const FUNNEL_LABELS = {
  session_start: 'Session start',
  signup_view: 'Signup view',
  signup_completed: 'Signup completed',
  premium_view: 'Premium view',
  begin_checkout: 'Begin checkout',
  subscribe_success: 'Paid',
};

const EMPTY_MESSAGE = 'No events yet — consent + ingest not live.';

function num(value) {
  return Number(value) || 0;
}

function BarList({ rows, valueKey, labelKey }) {
  const max = Math.max(...rows.map((row) => num(row[valueKey])), 1);
  return (
    <ul className="admin-bar-list">
      {rows.map((row) => {
        const value = num(row[valueKey]);
        const label = row[labelKey] || 'unknown';
        return (
          <li key={label} className="admin-bar-row">
            <span className="admin-bar-label">{label}</span>
            <span className="admin-bar-track">
              <span className="admin-bar-fill" style={{ width: `${(value / max) * 100}%` }} />
            </span>
            <span className="admin-bar-value">{value.toLocaleString()}</span>
          </li>
        );
      })}
    </ul>
  );
}

function AdminInsights() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const tab = TABS.some((item) => item.id === tabParam) ? tabParam : 'traffic';
  const rangeParam = searchParams.get('range');
  const days = ['7', '30', '90'].includes(rangeParam) ? rangeParam : '7';

  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [geo, setGeo] = useState([]);
  const [devices, setDevices] = useState([]);
  const [funnel, setFunnel] = useState([]);
  const [utm, setUtm] = useState([]);
  const [entryPages, setEntryPages] = useState([]);
  const [gates, setGates] = useState([]);
  const [habit, setHabit] = useState(null);
  const [content, setContent] = useState(null);
  const [memberships, setMemberships] = useState({ trials: 0, active: 0 });
  const [lookupQuery, setLookupQuery] = useState('');
  const [lookupRows, setLookupRows] = useState([]);
  const [lookupError, setLookupError] = useState(null);
  const [lookupBusy, setLookupBusy] = useState(false);

  const { from, to } = useMemo(() => analyticsRange(Number(days)), [days]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const [
        overviewRes,
        routesRes,
        geoRes,
        devicesRes,
        funnelRes,
        utmRes,
        entryRes,
        gatesRes,
        habitRes,
        contentRes,
        membershipsRes,
      ] = await Promise.all([
        supabase.rpc('analytics_overview', { p_from: from, p_to: to }),
        supabase.rpc('analytics_top_routes', { p_from: from, p_to: to }),
        supabase.rpc('analytics_geo', { p_from: from, p_to: to }),
        supabase.rpc('analytics_devices', { p_from: from, p_to: to }),
        supabase.rpc('analytics_funnel', { p_from: from, p_to: to }),
        supabase.rpc('analytics_utm', { p_from: from, p_to: to }),
        supabase.rpc('analytics_entry_pages', { p_from: from, p_to: to }),
        supabase.rpc('analytics_gates', { p_from: from, p_to: to }),
        supabase.rpc('analytics_habit', { p_from: from, p_to: to }),
        supabase.rpc('analytics_content', { p_from: from, p_to: to }),
        supabase.from('memberships').select('status'),
      ]);
      if (cancelled) return;

      setOverview(overviewRes.data || null);
      setRoutes(routesRes.data || []);
      setGeo(geoRes.data || []);
      setDevices(devicesRes.data || []);
      setFunnel(funnelRes.data || []);
      setUtm(utmRes.data || []);
      setEntryPages(entryRes.data || []);
      setGates(gatesRes.data || []);
      setHabit(habitRes.data || null);
      setContent(contentRes.data || null);
      const rows = membershipsRes.data || [];
      setMemberships({
        trials: rows.filter((row) => row.status === 'trial').length,
        active: rows.filter((row) => row.status === 'active' || row.status === 'comp').length,
      });
      setLoading(false);
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [from, to]);

  const setTab = (next) => {
    interact('tap', 'selection');
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', next);
    nextParams.set('range', days);
    setSearchParams(nextParams, { replace: true });
  };

  const setRange = (next) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set('tab', tab);
    nextParams.set('range', next);
    setSearchParams(nextParams, { replace: true });
  };

  const sessions = num(overview?.sessions);
  const pageviews = num(overview?.pageviews);
  const empty = !loading && sessions === 0 && pageviews === 0;
  const mobilePct = formatRate(overview?.mobile_views, pageviews);
  const weeks = Math.max(Number(days) / 7, 1);

  const handleLookup = async (event) => {
    event.preventDefault();
    if (!isAdmin) return;
    setLookupBusy(true);
    setLookupError(null);
    const { data, error } = await supabase.rpc('analytics_lookup_ip', {
      p_query: lookupQuery.trim(),
    });
    if (error) {
      setLookupRows([]);
      setLookupError(error.message || 'Lookup failed');
    } else {
      setLookupRows(data || []);
      if (!data?.length) setLookupError('No matches in the last 30 days.');
    }
    setLookupBusy(false);
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Insights"
        description="Staff-only product analytics. Parents never see this. Staff users are excluded from public funnels."
        action={(
          <Select
            id="insights-range"
            label="Range"
            value={days}
            onChange={setRange}
            options={RANGE_OPTIONS}
          />
        )}
      />

      <div className="admin-tabs" role="tablist" aria-label="Insights sections">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`admin-tab${tab === item.id ? ' active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {loading ? (
        <AdminLoading variant="stat-grid" cols={4} message="Loading insights…" />
      ) : empty ? (
        <AdminPanel>
          <AdminEmpty message={EMPTY_MESSAGE} />
        </AdminPanel>
      ) : (
        <>
          {tab === 'traffic' ? (
            <>
              <div className="admin-stat-grid admin-stat-grid--flat">
                <AdminStatCard value={sessions.toLocaleString()} label="Sessions" />
                <AdminStatCard value={pageviews.toLocaleString()} label="Pageviews" />
                <AdminStatCard value={bounceRate(overview?.bounced, sessions)} label="Bounce rate" />
                <AdminStatCard value={mobilePct} label="Mobile pageviews" />
                <AdminStatCard value={num(overview?.uniques).toLocaleString()} label="Unique visitors" />
                <AdminStatCard value={overview?.top_country || '—'} label="Top country" />
              </div>

              <AdminPanel>
                <h2 className="admin-panel-title">Top routes</h2>
                {routes.length === 0 ? (
                  <AdminEmpty message={EMPTY_MESSAGE} />
                ) : (
                  <AdminDataTable
                    columns={[
                      { key: 'route_key', header: 'Route' },
                      { key: 'pageviews', header: 'Pageviews' },
                      { key: 'sessions', header: 'Sessions' },
                      { key: 'bounce', header: 'Bounce' },
                    ]}
                    rows={routes}
                    rowKey={(row) => row.route_key || 'unknown'}
                    renderCell={(row, column) => {
                      if (column.key === 'bounce') return bounceRate(row.bounced, row.sessions);
                      if (column.key === 'pageviews' || column.key === 'sessions') {
                        return num(row[column.key]).toLocaleString();
                      }
                      return row.route_key || '—';
                    }}
                  />
                )}
              </AdminPanel>

              <div className="admin-insights-split">
                <AdminPanel>
                  <h2 className="admin-panel-title">Countries</h2>
                  {geo.length === 0 ? <AdminEmpty message={EMPTY_MESSAGE} /> : (
                    <BarList rows={geo} valueKey="sessions" labelKey="country" />
                  )}
                </AdminPanel>
                <AdminPanel>
                  <h2 className="admin-panel-title">Devices</h2>
                  {devices.length === 0 ? <AdminEmpty message={EMPTY_MESSAGE} /> : (
                    <BarList rows={devices} valueKey="sessions" labelKey="device" />
                  )}
                </AdminPanel>
              </div>
            </>
          ) : null}

          {tab === 'acquisition' ? (
            <>
              <AdminPanel>
                <h2 className="admin-panel-title">Funnel</h2>
                {funnel.length === 0 ? <AdminEmpty message={EMPTY_MESSAGE} /> : (
                  <BarList
                    rows={funnel.map((row) => ({
                      ...row,
                      label: FUNNEL_LABELS[row.event_name] || row.event_name,
                    }))}
                    valueKey="sessions"
                    labelKey="label"
                  />
                )}
              </AdminPanel>
              <AdminPanel>
                <h2 className="admin-panel-title">UTM / referrer</h2>
                {utm.length === 0 ? (
                  <AdminEmpty message="No referrer or UTM sessions in this range." />
                ) : (
                  <AdminDataTable
                    columns={[
                      { key: 'referrer_host', header: 'Referrer' },
                      { key: 'utm_source', header: 'Source' },
                      { key: 'utm_medium', header: 'Medium' },
                      { key: 'utm_campaign', header: 'Campaign' },
                      { key: 'sessions', header: 'Sessions' },
                    ]}
                    rows={utm}
                    rowKey={(row) => `${row.referrer_host}|${row.utm_source}|${row.utm_medium}|${row.utm_campaign}`}
                    renderCell={(row, column) => (
                      column.key === 'sessions'
                        ? num(row.sessions).toLocaleString()
                        : (row[column.key] || '—')
                    )}
                  />
                )}
              </AdminPanel>
              <AdminPanel>
                <h2 className="admin-panel-title">Entry pages</h2>
                {entryPages.length === 0 ? <AdminEmpty message={EMPTY_MESSAGE} /> : (
                  <AdminDataTable
                    columns={[
                      { key: 'path', header: 'Path' },
                      { key: 'sessions', header: 'Sessions' },
                    ]}
                    rows={entryPages}
                    rowKey={(row) => row.path || 'unknown'}
                    renderCell={(row, column) => (
                      column.key === 'sessions'
                        ? num(row.sessions).toLocaleString()
                        : (row.path || '—')
                    )}
                  />
                )}
              </AdminPanel>
            </>
          ) : null}

          {tab === 'conversion' ? (
            <>
              <div className="admin-stat-grid admin-stat-grid--flat">
                <AdminStatCard
                  value={formatRate(overview?.signups, sessions)}
                  label="Signup conversion"
                />
                <AdminStatCard
                  value={formatRate(overview?.paid, overview?.signups)}
                  label="Paid conversion"
                />
                <AdminStatCard value={memberships.active.toLocaleString()} label="Active members" />
                <AdminStatCard value={memberships.trials.toLocaleString()} label="Trials" />
              </div>
              <AdminPanel>
                <h2 className="admin-panel-title">Checkout funnel</h2>
                <BarList
                  rows={funnel
                    .filter((row) => ['premium_view', 'begin_checkout', 'subscribe_success'].includes(row.event_name))
                    .map((row) => ({
                      ...row,
                      label: FUNNEL_LABELS[row.event_name] || row.event_name,
                    }))}
                  valueKey="sessions"
                  labelKey="label"
                />
              </AdminPanel>
              <AdminPanel>
                <h2 className="admin-panel-title">Gate hits by feature</h2>
                {gates.length === 0 ? (
                  <AdminEmpty message="No gate hits in this range." />
                ) : (
                  <BarList rows={gates} valueKey="hits" labelKey="feature" />
                )}
              </AdminPanel>
            </>
          ) : null}

          {tab === 'habit' ? (
            <div className="admin-stat-grid admin-stat-grid--flat">
              <AdminStatCard
                value={num(habit?.birth_date_set).toLocaleString()}
                label="Birth dates set"
              />
              <AdminStatCard
                value={formatRate(habit?.birth_date_set, overview?.signups)}
                label="DOB rate among signups"
              />
              <AdminStatCard
                value={(num(habit?.milestone_checked) / weeks).toFixed(1)}
                label="Milestone checks / week"
              />
              <AdminStatCard
                value={num(habit?.first_saved).toLocaleString()}
                label="Firsts saved"
              />
            </div>
          ) : null}

          {tab === 'content' ? (
            <div className="admin-insights-split">
              <AdminPanel>
                <h2 className="admin-panel-title">Guides</h2>
                {(content?.guides || []).length === 0 ? (
                  <AdminEmpty message="No guide views in this range." />
                ) : (
                  <BarList rows={content.guides} valueKey="views" labelKey="slug" />
                )}
              </AdminPanel>
              <AdminPanel>
                <h2 className="admin-panel-title">Community tabs</h2>
                {(content?.community_tabs || []).length === 0 ? (
                  <AdminEmpty message="No community tab events in this range." />
                ) : (
                  <BarList rows={content.community_tabs} valueKey="views" labelKey="tab" />
                )}
              </AdminPanel>
            </div>
          ) : null}
        </>
      )}

      {isAdmin ? (
        <AdminPanel className="admin-insights-lookup">
          <h2 className="admin-panel-title">IP lookup</h2>
          <p className="admin-page-header-desc">
            Admin only. Paste a session id, IP hash, or raw IP from the last 30 days.
          </p>
          <form className="admin-insights-lookup-form" onSubmit={handleLookup}>
            <input
              className="admin-input"
              value={lookupQuery}
              onChange={(e) => setLookupQuery(e.target.value)}
              placeholder="session UUID, ip_hash, or IP"
              aria-label="IP lookup query"
            />
            <button type="submit" className="admin-btn admin-btn--primary" disabled={lookupBusy}>
              {lookupBusy ? 'Looking up…' : 'Lookup'}
            </button>
          </form>
          {lookupError ? <p className="admin-inline-error">{lookupError}</p> : null}
          {lookupRows.length > 0 ? (
            <AdminDataTable
              columns={[
                { key: 'occurred_at', header: 'When' },
                { key: 'path', header: 'Path' },
                { key: 'country', header: 'Country' },
                { key: 'ip', header: 'IP' },
                { key: 'ip_hash', header: 'Hash' },
              ]}
              rows={lookupRows}
              rowKey={(row) => `${row.occurred_at}-${row.path}-${row.ip_hash}`}
              renderCell={(row, column) => {
                if (column.key === 'occurred_at') {
                  return row.occurred_at ? new Date(row.occurred_at).toLocaleString() : '—';
                }
                return row[column.key] || '—';
              }}
            />
          ) : null}
        </AdminPanel>
      ) : null}
    </div>
  );
}

export default AdminInsights;
