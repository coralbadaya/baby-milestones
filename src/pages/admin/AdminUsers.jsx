import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminEmpty from '../../components/admin/AdminEmpty';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminStatCard from '../../components/admin/AdminStatCard';
import AdminToolbar from '../../components/admin/AdminToolbar';
import { ROUTES } from '../../routes';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';
import { formatAdminDateTime } from '../../utils/adminFormat';
import { supabase } from '../../utils/supabaseClient';
import { interact } from '../../utils/haptics';

const ROLE_OPTIONS = [
  { value: 'user', label: 'User' },
  { value: 'support', label: 'Support' },
  { value: 'admin', label: 'Admin' },
];

const STATUS_OPTIONS = [
  { value: 'free', label: 'Free' },
  { value: 'trial', label: 'Trial' },
  { value: 'active', label: 'Active' },
  { value: 'comp', label: 'Founding (comp)' },
  { value: 'expired', label: 'Expired' },
];

const USER_COLUMNS = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'membership', header: 'Membership' },
  { key: 'joined', header: 'Joined', className: 'admin-cell-date' },
  { key: 'lastLogin', header: 'Last login', className: 'admin-cell-date' },
  { key: 'lastActive', header: 'Last on site', className: 'admin-cell-date' },
  { key: 'sessions30d', header: 'Sessions (30d)' },
];

function AdminUsers() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    const [{ data: profiles, error: listError }, { data: userMetrics }] = await Promise.all([
      supabase.rpc('admin_list_users'),
      supabase.rpc('admin_users_metrics'),
    ]);

    if (listError || !profiles) {
      setRows([]);
      setError(listError?.message || 'Could not load users.');
      setLoading(false);
      return;
    }

    const ids = profiles.map((p) => p.id);
    const { data: memberships } = ids.length
      ? await supabase.from('memberships').select('*').in('user_id', ids)
      : { data: [] };

    const memMap = Object.fromEntries((memberships || []).map((m) => [m.user_id, m]));

    setRows(profiles.map((p) => ({ ...p, membership: memMap[p.id] || null })));
    setMetrics(userMetrics || null);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (r.display_name || '').toLowerCase().includes(q)
      || (r.email || '').toLowerCase().includes(q)
      || r.id.includes(q);
  });

  const updateRole = async (userId, role) => {
    if (!isAdmin) return;
    interact('tap', 'light');
    await supabase.from('profiles').update({ role, updated_at: new Date().toISOString() }).eq('id', userId);
    load();
  };

  const updateMembership = async (userId, status) => {
    if (!isAdmin) return;
    interact('tap', 'light');
    const plan = status === 'free' || status === 'expired' ? 'free' : 'premium';
    await supabase.from('memberships').upsert({
      user_id: userId,
      plan,
      status,
      source: 'admin',
      updated_at: new Date().toISOString(),
    });
    load();
  };

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'name':
        return (
          <button
            type="button"
            className="admin-link-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(ROUTES.adminUser(row.id));
            }}
          >
            {row.display_name || '—'}
          </button>
        );
      case 'email':
        return row.email ? (
          <a
            href={`mailto:${row.email}`}
            className="admin-users-email"
            title={row.id}
            onClick={(e) => e.stopPropagation()}
          >
            {row.email}
          </a>
        ) : (
          '—'
        );
      case 'role':
        return isAdmin ? (
          <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <Select
              id={`role-${row.id}`}
              value={row.role}
              onChange={(v) => updateRole(row.id, v)}
              options={ROLE_OPTIONS}
            />
          </div>
        ) : (
          row.role
        );
      case 'membership':
        return isAdmin ? (
          <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
            <Select
              id={`mem-${row.id}`}
              value={row.membership?.status || 'free'}
              onChange={(v) => updateMembership(row.id, v)}
              options={STATUS_OPTIONS}
            />
          </div>
        ) : (
          row.membership?.status || 'free'
        );
      case 'joined':
        return (
          <time dateTime={row.created_at || undefined}>
            {formatAdminDateTime(row.created_at)}
          </time>
        );
      case 'lastLogin':
        return row.last_sign_in_at ? (
          <time dateTime={row.last_sign_in_at}>
            {formatAdminDateTime(row.last_sign_in_at)}
          </time>
        ) : (
          '—'
        );
      case 'lastActive':
        return row.last_active_at ? (
          <time dateTime={row.last_active_at}>
            {formatAdminDateTime(row.last_active_at)}
          </time>
        ) : (
          '—'
        );
      case 'sessions30d':
        return Number(row.sessions_30d || 0).toLocaleString();
      default:
        return null;
    }
  };

  const mobileCard = (row) => (
    <>
      <div className="admin-card-row">
        <span className="admin-card-label">Name</span>
        <span className="admin-card-value">{row.display_name || '—'}</span>
      </div>
      <div className="admin-card-row">
        <span className="admin-card-label">Email</span>
        <span className="admin-card-value">
          {row.email ? (
            <a href={`mailto:${row.email}`} className="admin-users-email">{row.email}</a>
          ) : '—'}
        </span>
      </div>
      <div className="admin-card-row">
        <span className="admin-card-label">Role</span>
        <span className="admin-card-value">{renderCell(row, { key: 'role' })}</span>
      </div>
      <div className="admin-card-row">
        <span className="admin-card-label">Membership</span>
        <span className="admin-card-value">{renderCell(row, { key: 'membership' })}</span>
      </div>
      <div className="admin-card-row">
        <span className="admin-card-label">Joined</span>
        <span className="admin-card-value">{formatAdminDateTime(row.created_at)}</span>
      </div>
      <div className="admin-card-row">
        <span className="admin-card-label">Last login</span>
        <span className="admin-card-value">{formatAdminDateTime(row.last_sign_in_at)}</span>
      </div>
      <div className="admin-card-row">
        <span className="admin-card-label">Last on site</span>
        <span className="admin-card-value">{formatAdminDateTime(row.last_active_at)}</span>
      </div>
      <button
        type="button"
        className="admin-btn admin-btn--ghost admin-users-view-btn"
        onClick={() => navigate(ROUTES.adminUser(row.id))}
      >
        View activity
      </button>
    </>
  );

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Users"
        description="Select a row for sessions, event log, and on-site activity. Metrics use consented analytics (90-day retention)."
      />

      {metrics ? (
        <div className="admin-stat-grid admin-stat-grid--flat">
          <AdminStatCard value={(metrics.total_users ?? 0).toLocaleString()} label="Total accounts" />
          <AdminStatCard value={(metrics.active_7d ?? 0).toLocaleString()} label="Active (7d)" />
          <AdminStatCard value={(metrics.active_30d ?? 0).toLocaleString()} label="Active (30d)" />
          <AdminStatCard value={(metrics.sessions_7d ?? 0).toLocaleString()} label="Signed-in sessions (7d)" />
          <AdminStatCard value={(metrics.with_plus ?? 0).toLocaleString()} label="Plus / trial / comp" />
        </div>
      ) : null}

      <AdminToolbar
        left={(
          <input
            type="search"
            className="admin-search"
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        onRefresh={load}
      />

      {loading ? (
        <AdminLoading variant="table" message="Loading users…" />
      ) : error ? (
        <AdminEmpty message={error} />
      ) : filtered.length === 0 ? (
        <AdminEmpty message={query.trim() ? 'No users match your search.' : 'No users found.'} />
      ) : (
        <AdminPanel padding={false}>
          <AdminDataTable
            columns={USER_COLUMNS}
            rows={filtered}
            rowKey={(row) => row.id}
            renderCell={renderCell}
            mobileCard={mobileCard}
            onRowClick={(row) => {
              interact('tap', 'light');
              navigate(ROUTES.adminUser(row.id));
            }}
          />
        </AdminPanel>
      )}
    </div>
  );
}

export default AdminUsers;
