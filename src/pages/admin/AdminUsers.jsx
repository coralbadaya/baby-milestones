import { useCallback, useEffect, useState } from 'react';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';
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

  return (
    <div className="admin-page">
      <h1 className="font-display">Users</h1>
      <div className="admin-toolbar">
        <input
          type="search"
          className="admin-search"
          placeholder="Search by name or ID"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="btn-ghost" onClick={load}>Refresh</button>
      </div>

      {loading ? (
        <p className="admin-loading">Loading users…</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>User ID</th>
                <th>Role</th>
                <th>Membership</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((row) => (
                <tr key={row.id}>
                  <td>{row.display_name || '—'}</td>
                  <td className="admin-mono">{row.id.slice(0, 8)}…</td>
                  <td>
                    {isAdmin ? (
                      <Select
                        id={`role-${row.id}`}
                        value={row.role}
                        onChange={(v) => updateRole(row.id, v)}
                        options={ROLE_OPTIONS}
                      />
                    ) : (
                      row.role
                    )}
                  </td>
                  <td>
                    {isAdmin ? (
                      <Select
                        id={`mem-${row.id}`}
                        value={row.membership?.status || 'free'}
                        onChange={(v) => updateMembership(row.id, v)}
                        options={STATUS_OPTIONS}
                      />
                    ) : (
                      row.membership?.status || 'free'
                    )}
                  </td>
                  <td>{new Date(row.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminUsers;
