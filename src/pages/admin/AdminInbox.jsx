import { useCallback, useEffect, useState } from 'react';
import Select from '../../components/Select';
import { supabase } from '../../utils/supabaseClient';
import { interact } from '../../utils/haptics';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

function AdminInbox() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    let q = supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter !== 'all') q = q.eq('status', filter);

    const { data, error } = await q;
    if (!error) setRows(data || []);
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateRow = async (id, patch) => {
    interact('tap', 'light');
    const { error } = await supabase.from('contact_submissions').update(patch).eq('id', id);
    if (!error) load();
  };

  return (
    <div className="admin-page">
      <h1 className="font-display">Inbox</h1>
      <div className="admin-toolbar">
        <Select
          id="inbox-filter"
          value={filter}
          onChange={setFilter}
          options={[
            { value: 'all', label: 'All statuses' },
            ...STATUS_OPTIONS,
          ]}
        />
        <button type="button" className="btn-ghost" onClick={load}>Refresh</button>
      </div>

      {loading ? (
        <p className="admin-loading">Loading messages…</p>
      ) : rows.length === 0 ? (
        <p className="admin-empty">No messages.</p>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>From</th>
                <th>Subject</th>
                <th>Status</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id}>
                  <td>{new Date(row.created_at).toLocaleString()}</td>
                  <td>
                    <strong>{row.name || '—'}</strong>
                    <br />
                    <a href={`mailto:${row.email}`}>{row.email}</a>
                  </td>
                  <td>{row.subject}</td>
                  <td>
                    <Select
                      id={`status-${row.id}`}
                      value={row.status}
                      onChange={(v) => updateRow(row.id, { status: v })}
                      options={STATUS_OPTIONS}
                    />
                  </td>
                  <td className="admin-cell-message">
                    <p>{row.message}</p>
                    <textarea
                      className="admin-notes"
                      placeholder="Admin notes"
                      defaultValue={row.admin_notes || ''}
                      onBlur={(e) => {
                        if (e.target.value !== (row.admin_notes || '')) {
                          updateRow(row.id, { admin_notes: e.target.value });
                        }
                      }}
                    />
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

export default AdminInbox;
