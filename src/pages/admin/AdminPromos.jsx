import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminEmpty from '../../components/admin/AdminEmpty';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminToolbar from '../../components/admin/AdminToolbar';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../utils/supabaseClient';
import { ROUTES } from '../../routes';
import { interact } from '../../utils/haptics';

const GRANT_OPTIONS = [
  { value: 'trial_days', label: 'Trial days' },
  { value: 'extend_premium', label: 'Extend premium' },
  { value: 'comp', label: 'Founding / comp' },
];

const PROMO_COLUMNS = [
  { key: 'code', header: 'Code' },
  { key: 'label', header: 'Label' },
  { key: 'type', header: 'Type' },
  { key: 'uses', header: 'Uses' },
  { key: 'active', header: 'Active' },
];

const emptyForm = {
  code: '',
  label: '',
  grant_type: 'trial_days',
  duration_days: '30',
  max_uses: '100',
  active: true,
};

function AdminPromos() {
  const { isAdmin } = useAuth();
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('promo_codes')
      .select('*')
      .order('created_at', { ascending: false });
    if (!fetchError) setRows(data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  if (!isAdmin) {
    return <Navigate to={ROUTES.admin} replace />;
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    setError(null);
    interact('tap', 'light');

    const { error: insertError } = await supabase.from('promo_codes').insert({
      code: form.code.trim().toUpperCase(),
      label: form.label.trim() || null,
      grant_type: form.grant_type,
      duration_days: form.grant_type === 'comp' ? null : Number(form.duration_days) || 30,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      active: form.active,
    });

    if (insertError) {
      setError(insertError.message);
      return;
    }

    setForm(emptyForm);
    load();
  };

  const toggleActive = async (id, active) => {
    interact('tap', 'light');
    await supabase.from('promo_codes').update({ active }).eq('id', id);
    load();
  };

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'code':
        return <strong className="admin-mono">{row.code}</strong>;
      case 'label':
        return row.label || '—';
      case 'type':
        return `${row.grant_type}${row.duration_days ? ` (${row.duration_days}d)` : ''}`;
      case 'uses':
        return `${row.uses_count}${row.max_uses != null ? ` / ${row.max_uses}` : ''}`;
      case 'active':
        return (
          <button
            type="button"
            className={`btn-ghost${row.active ? '' : ' admin-muted'}`}
            onClick={() => toggleActive(row.id, !row.active)}
          >
            {row.active ? (
              <AdminBadge variant="active">Active</AdminBadge>
            ) : (
              <AdminBadge variant="neutral">Inactive</AdminBadge>
            )}
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Promo codes"
        description="Create and manage promotional codes for trials and founding access."
      />

      <AdminPanel className="admin-form">
        <h2>Create code</h2>
        <form onSubmit={handleCreate}>
          <div className="admin-form-grid">
            <div className="auth-field">
              <label htmlFor="promo-code">Code</label>
              <input
                id="promo-code"
                required
                className="admin-mono"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                placeholder="FOUNDING30"
              />
            </div>
            <div className="auth-field">
              <label htmlFor="promo-label">Label</label>
              <input
                id="promo-label"
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="Founding member offer"
              />
            </div>
          </div>
          <div className="admin-form-grid">
            <div className="auth-field">
              <label htmlFor="promo-grant">Grant type</label>
              <Select
                id="promo-grant"
                value={form.grant_type}
                onChange={(v) => setForm({ ...form, grant_type: v })}
                options={GRANT_OPTIONS}
              />
            </div>
            {form.grant_type !== 'comp' && (
              <div className="auth-field">
                <label htmlFor="promo-days">Duration (days)</label>
                <input
                  id="promo-days"
                  type="number"
                  min={1}
                  value={form.duration_days}
                  onChange={(e) => setForm({ ...form, duration_days: e.target.value })}
                />
              </div>
            )}
            <div className="auth-field">
              <label htmlFor="promo-max">Max uses</label>
              <input
                id="promo-max"
                type="number"
                min={1}
                value={form.max_uses}
                onChange={(e) => setForm({ ...form, max_uses: e.target.value })}
              />
            </div>
          </div>
          {error && <p className="auth-error">{error}</p>}
          <button type="submit" className="btn-primary">Create promo code</button>
        </form>
      </AdminPanel>

      <AdminToolbar onRefresh={load} />

      {loading ? (
        <AdminLoading variant="table" message="Loading codes…" />
      ) : rows.length === 0 ? (
        <AdminEmpty message="No promo codes yet — create one above." />
      ) : (
        <AdminPanel padding={false}>
          <AdminDataTable
            columns={PROMO_COLUMNS}
            rows={rows}
            rowKey={(row) => row.id}
            renderCell={renderCell}
          />
        </AdminPanel>
      )}
    </div>
  );
}

export default AdminPromos;
