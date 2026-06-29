import { useCallback, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
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

  return (
    <div className="admin-page">
      <h1 className="font-display">Promo codes</h1>

      <form className="admin-form card-accent-top" onSubmit={handleCreate}>
        <h2>Create code</h2>
        <div className="admin-form-grid">
          <div className="auth-field">
            <label htmlFor="promo-code">Code</label>
            <input
              id="promo-code"
              required
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

      {loading ? (
        <p className="admin-loading">Loading codes…</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>Label</th>
                <th>Type</th>
                <th>Uses</th>
                <th>Active</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td><strong>{row.code}</strong></td>
                  <td>{row.label || '—'}</td>
                  <td>{row.grant_type}{row.duration_days ? ` (${row.duration_days}d)` : ''}</td>
                  <td>{row.uses_count}{row.max_uses != null ? ` / ${row.max_uses}` : ''}</td>
                  <td>
                    <button
                      type="button"
                      className={`btn-ghost${row.active ? '' : ' admin-muted'}`}
                      onClick={() => toggleActive(row.id, !row.active)}
                    >
                      {row.active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default AdminPromos;
