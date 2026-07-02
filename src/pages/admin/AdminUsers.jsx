import { useCallback, useEffect, useState } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminEmpty from '../../components/admin/AdminEmpty';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminToolbar from '../../components/admin/AdminToolbar';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes';
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
  { key: 'id', header: 'User ID' },
  { key: 'role', header: 'Role' },
  { key: 'membership', header: 'Membership' },
  { key: 'joined', header: 'Joined' },
];

function AdminUsers() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, display_name, role, created_at')
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !profiles) {
      setLoading(false);
      return;
    }

    const ids = profiles.map((p) => p.id);
    const { data: memberships } = await supabase
      .from('memberships')
      .select('*')
      .in('user_id', ids);

    const memMap = Object.fromEntries((memberships || []).map((m) => [m.user_id, m]));

    setRows(profiles.map((p) => ({ ...p, membership: memMap[p.id] || null })));
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = rows.filter((r) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (r.display_name || '').toLowerCase().includes(q) || r.id.includes(q);
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
        return row.display_name || '—';
      case 'id':
        return <span className="admin-mono">{row.id.slice(0, 8)}…</span>;
      case 'role':
        return isAdmin ? (
          <Select
            id={`role-${row.id}`}
            value={row.role}
            onChange={(v) => updateRole(row.id, v)}
            options={ROLE_OPTIONS}
          />
        ) : (
          row.role
        );
      case 'membership':
        return isAdmin ? (
          <Select
            id={`mem-${row.id}`}
            value={row.membership?.status || 'free'}
            onChange={(v) => updateMembership(row.id, v)}
            options={STATUS_OPTIONS}
          />
        ) : (
          row.membership?.status || 'free'
        );
      case 'joined':
        return new Date(row.created_at).toLocaleDateString();
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
        <span className="admin-card-label">User ID</span>
        <span className="admin-card-value admin-mono">{row.id.slice(0, 8)}…</span>
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
        <span className="admin-card-value">{new Date(row.created_at).toLocaleDateString()}</span>
      </div>
    </>
  );

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Users"
        description="Search profiles, roles, and membership status."
      />

      <AdminToolbar
        left={(
          <input
            type="search"
            className="admin-search"
            placeholder="Search by name or ID"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        )}
        onRefresh={load}
      />

      {loading ? (
        <AdminLoading variant="table" message="Loading users…" />
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
          />
        </AdminPanel>
      )}
    </div>
  );
}

export default AdminUsers;
