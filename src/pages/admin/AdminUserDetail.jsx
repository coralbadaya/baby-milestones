import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminEmpty from '../../components/admin/AdminEmpty';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminStatCard from '../../components/admin/AdminStatCard';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes';
import { formatAdminDateTime } from '../../utils/adminFormat';
import {
  formatActivityEventName,
  formatSessionEndReason,
} from '../../utils/adminUserActivity';
import { supabase } from '../../utils/supabaseClient';
import { interact } from '../../utils/haptics';

const RANGE_OPTIONS = [
  { value: '7', label: 'Last 7 days' },
  { value: '30', label: 'Last 30 days' },
  { value: '90', label: 'Last 90 days' },
];

const BILLING_REGION_OPTIONS = [
  { value: '', label: 'Auto (IP)' },
  { value: 'IN', label: 'India · Razorpay' },
  { value: 'ROW', label: 'International · Stripe' },
];

const EVENT_FILTER_OPTIONS = [
  { value: 'all', label: 'All events' },
  { value: 'page_view', label: 'Page views' },
  { value: 'session_start', label: 'Session starts' },
  { value: 'login_completed', label: 'Logins' },
  { value: 'logout_completed', label: 'Logouts' },
  { value: 'signup_completed', label: 'Signups' },
  { value: 'milestone_checked', label: 'Milestones' },
  { value: 'gate_hit', label: 'Gate hits' },
];

function formatProps(props) {
  if (!props || typeof props !== 'object') return '—';
  const entries = Object.entries(props).filter(([, v]) => v != null && v !== '');
  if (!entries.length) return '—';
  return entries.map(([k, v]) => `${k}: ${v}`).join(' · ');
}

function AdminUserDetail() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [days, setDays] = useState('30');
  const [eventFilter, setEventFilter] = useState('all');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [billingCountry, setBillingCountry] = useState('');
  const [billingSaveError, setBillingSaveError] = useState(null);
  const [billingBusy, setBillingBusy] = useState(false);

  const load = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    const { data, error: rpcError } = await supabase.rpc('admin_user_detail', {
      p_days: Number(days) || 30,
      p_user_id: userId,
    });
    if (rpcError) {
      setDetail(null);
      setError(rpcError.message);
    } else if (!data) {
      setDetail(null);
      setError('User not found.');
    } else {
      setDetail(data);
    }
    setLoading(false);
  }, [userId, days]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!userId || !isAdmin) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from('profiles')
        .select('billing_country')
        .eq('id', userId)
        .maybeSingle();
      if (!cancelled) {
        setBillingCountry(data?.billing_country || '');
      }
    })();
    return () => { cancelled = true; };
  }, [userId, isAdmin]);

  const saveBillingCountry = async (value) => {
    if (!userId) return;
    setBillingBusy(true);
    setBillingSaveError(null);
    interact('tap', 'light');
    const next = value || null;
    const { error: rpcError } = await supabase.rpc('admin_set_billing_country', {
      p_user_id: userId,
      p_billing_country: next,
    });
    if (rpcError) {
      setBillingSaveError(rpcError.message);
    } else {
      setBillingCountry(value);
    }
    setBillingBusy(false);
  };

  const metrics = detail?.metrics || {};
  const sessions = detail?.sessions || [];
  const events = detail?.events || [];

  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return events;
    return events.filter((e) => e.event_name === eventFilter);
  }, [events, eventFilter]);

  const email = detail?.auth?.email || 'User';
  const membershipStatus = detail?.membership?.status || 'free';

  const sessionColumns = [
    { key: 'started', header: 'Started' },
    { key: 'ended', header: 'Last activity' },
    { key: 'login', header: 'Login' },
    { key: 'end', header: 'Session end' },
    { key: 'pages', header: 'Pages' },
    { key: 'entry', header: 'Entry' },
    { key: 'device', header: 'Device' },
  ];

  const eventColumns = [
    { key: 'when', header: 'When' },
    { key: 'event', header: 'Event' },
    { key: 'path', header: 'Path' },
    { key: 'detail', header: 'Detail' },
    ...(isAdmin ? [{ key: 'ip', header: 'IP' }] : []),
  ];

  if (loading) {
    return (
      <div className="admin-page">
        <AdminLoading variant="stat-grid" cols={4} message="Loading user activity…" />
      </div>
    );
  }

  if (error || !detail) {
    return (
      <div className="admin-page">
        <AdminPageHeader
          title="User activity"
          breadcrumb={[{ label: 'Users', to: ROUTES.adminUsers }]}
        />
        <AdminEmpty message={error || 'User not found.'} />
      </div>
    );
  }

  return (
    <div className="admin-page admin-user-detail">
      <AdminPageHeader
        title={detail.profile?.display_name || email}
        description={email}
        breadcrumb={[{ label: 'Users', to: ROUTES.adminUsers }, { label: 'Activity' }]}
        action={(
          <Select
            id="user-activity-range"
            label="Range"
            value={days}
            onChange={setDays}
            options={RANGE_OPTIONS}
          />
        )}
      />

      <div className="admin-stat-grid admin-stat-grid--flat">
        <AdminStatCard value={(metrics.sessions ?? 0).toLocaleString()} label="Sessions" />
        <AdminStatCard value={(metrics.pageviews ?? 0).toLocaleString()} label="Pageviews" />
        <AdminStatCard value={(metrics.logins ?? 0).toLocaleString()} label="Logins tracked" />
        <AdminStatCard value={(metrics.logouts ?? 0).toLocaleString()} label="Logouts tracked" />
        <AdminStatCard
          value={formatAdminDateTime(metrics.last_seen)}
          label="Last seen on site"
        />
        <AdminStatCard
          value={formatAdminDateTime(detail.auth?.last_sign_in_at)}
          label="Last Supabase sign-in"
        />
      </div>

      <div className="admin-insights-split admin-user-detail__split">
        <AdminPanel>
          <h2 className="admin-panel-title">Account</h2>
          <dl className="admin-dl">
            <div><dt>User id</dt><dd className="admin-mono">{detail.profile?.id}</dd></div>
            <div><dt>Role</dt><dd><AdminBadge variant="neutral">{detail.profile?.role}</AdminBadge></dd></div>
            <div><dt>Joined</dt><dd>{formatAdminDateTime(detail.profile?.created_at)}</dd></div>
            <div><dt>Email verified</dt><dd>{detail.auth?.email_confirmed_at ? formatAdminDateTime(detail.auth.email_confirmed_at) : 'Pending'}</dd></div>
            <div><dt>Membership</dt><dd><AdminBadge variant={membershipStatus === 'active' || membershipStatus === 'comp' ? 'active' : 'neutral'}>{membershipStatus}</AdminBadge></dd></div>
            {isAdmin && (
              <div className="admin-user-detail__billing">
                <dt>Billing region</dt>
                <dd>
                  <Select
                    id="user-billing-country"
                    label="Billing region override"
                    value={billingCountry}
                    onChange={(v) => saveBillingCountry(v)}
                    options={BILLING_REGION_OPTIONS}
                    disabled={billingBusy}
                  />
                  {billingSaveError && (
                    <p className="auth-error" role="alert">{billingSaveError}</p>
                  )}
                  <p className="admin-hint">Overrides IP for /premium checkout until the parent can self-serve on Account.</p>
                </dd>
              </div>
            )}
          </dl>
        </AdminPanel>
        <AdminPanel>
          <h2 className="admin-panel-title">Baby & engagement</h2>
          <dl className="admin-dl">
            <div><dt>Primary baby</dt><dd>{detail.baby?.name || '—'}</dd></div>
            <div><dt>Birth date</dt><dd>{detail.baby?.birth_date || '—'}</dd></div>
            <div>
              <dt>In-app habits ({metrics.days}d)</dt>
              <dd>
                {metrics.milestone_checks ?? 0} milestones · {metrics.first_saved ?? 0} firsts · {metrics.gate_hits ?? 0} gate hits
              </dd>
            </div>
            <div><dt>Support</dt><dd>{detail.counts?.contact_messages ?? 0} inbox messages</dd></div>
            <div><dt>Community</dt><dd>{detail.counts?.community_posts ?? 0} posts</dd></div>
          </dl>
          <p className="admin-hint">
            Pre-login browsing is anonymous until JWT is sent with analytics; only signed-in activity ties to this user id.
          </p>
        </AdminPanel>
      </div>

      {(metrics.top_routes || []).length > 0 ? (
        <AdminPanel>
          <h2 className="admin-panel-title">Top routes</h2>
          <ul className="admin-bar-list">
            {(metrics.top_routes || []).map((row) => (
              <li key={row.route_key} className="admin-bar-row">
                <span className="admin-bar-label">{row.route_key}</span>
                <span className="admin-bar-track">
                  <span
                    className="admin-bar-fill"
                    style={{
                      width: `${(row.pageviews / Math.max(...metrics.top_routes.map((r) => r.pageviews), 1)) * 100}%`,
                    }}
                  />
                </span>
                <span className="admin-bar-value">{row.pageviews}</span>
              </li>
            ))}
          </ul>
        </AdminPanel>
      ) : null}

      <AdminPanel padding={false}>
        <div className="admin-panel-title-row">
          <h2 className="admin-panel-title">Sessions</h2>
          <p className="admin-hint">How they arrived, when they logged in, and how the session ended (logout event or ~30m idle).</p>
        </div>
        {sessions.length === 0 ? (
          <AdminEmpty message="No consented analytics for this user in range." />
        ) : (
          <AdminDataTable
            columns={sessionColumns}
            rows={sessions}
            rowKey={(row) => row.session_id}
            renderCell={(row, col) => {
              switch (col.key) {
                case 'started':
                  return formatAdminDateTime(row.started_at);
                case 'ended':
                  return formatAdminDateTime(row.ended_at);
                case 'login':
                  return row.login_at ? formatAdminDateTime(row.login_at) : '—';
                case 'end':
                  return formatSessionEndReason(row.end_reason);
                case 'pages':
                  return `${row.pageviews} pv · ${row.event_count} ev`;
                case 'entry':
                  return (
                    <span className="admin-cell-stack">
                      <span>{row.entry_path || '—'}</span>
                      {row.referrer_host ? (
                        <span className="admin-cell-muted">via {row.referrer_host}</span>
                      ) : null}
                    </span>
                  );
                case 'device':
                  return `${row.device || '—'}${row.country ? ` · ${row.country}` : ''}`;
                default:
                  return null;
              }
            }}
            mobileCard={(row) => (
              <>
                <p><strong>{formatAdminDateTime(row.started_at)}</strong></p>
                <p className="admin-cell-muted">{row.entry_path} · {row.pageviews} pages</p>
                <p>{formatSessionEndReason(row.end_reason)}</p>
              </>
            )}
          />
        )}
      </AdminPanel>

      <AdminPanel padding={false}>
        <div className="admin-panel-title-row admin-panel-title-row--toolbar">
          <h2 className="admin-panel-title">Event log</h2>
          <Select
            id="user-event-filter"
            label="Filter"
            value={eventFilter}
            onChange={setEventFilter}
            options={EVENT_FILTER_OPTIONS}
          />
        </div>
        {filteredEvents.length === 0 ? (
          <AdminEmpty message="No events match this filter." />
        ) : (
          <AdminDataTable
            columns={eventColumns}
            rows={filteredEvents}
            rowKey={(row) => `${row.occurred_at}-${row.event_name}-${row.session_id}`}
            renderCell={(row, col) => {
              switch (col.key) {
                case 'when':
                  return (
                    <time dateTime={row.occurred_at}>
                      {formatAdminDateTime(row.occurred_at)}
                    </time>
                  );
                case 'event':
                  return formatActivityEventName(row.event_name);
                case 'path':
                  return row.path || row.route_key || '—';
                case 'detail':
                  return (
                    <span className="admin-cell-stack">
                      <span>{formatProps(row.props)}</span>
                      <span className="admin-cell-muted admin-mono">{row.session_id?.slice(0, 8)}…</span>
                    </span>
                  );
                case 'ip':
                  return row.ip || row.ip_hash || '—';
                default:
                  return null;
              }
            }}
            mobileCard={(row) => (
              <>
                <p><strong>{formatActivityEventName(row.event_name)}</strong></p>
                <p className="admin-cell-muted">{formatAdminDateTime(row.occurred_at)}</p>
                <p>{row.path || '—'}</p>
              </>
            )}
          />
        )}
      </AdminPanel>

      <button
        type="button"
        className="admin-btn admin-btn--ghost admin-user-detail__back"
        onClick={() => {
          interact('tap', 'light');
          navigate(ROUTES.adminUsers);
        }}
      >
        Back to all users
      </button>
    </div>
  );
}

export default AdminUserDetail;