import { useCallback, useEffect, useState } from 'react';
import Select from '../../components/Select';
import { contactSubjectLabel } from '../../constants/contactSubjects';
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
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    let q = supabase
      .from('contact_submissions')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);

    if (filter !== 'all') q = q.eq('status', filter);

    const { data, error: fetchError } = await q;
    if (fetchError) {
      setError(fetchError.message);
      setRows([]);
    } else {
      setRows(data || []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => { load(); }, [load]);

  const updateRow = async (id, patch) => {
    interact('tap', 'light');
    const { error: updateError } = await supabase
      .from('contact_submissions')
      .update(patch)
      .eq('id', id);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    load();
  };

  return (
    <div className="admin-page">
      <h1 className="font-display">Inbox</h1>
      <p className="admin-intro">
        Contact form submissions from users and visitors. New messages appear at the top.
      </p>

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

      {error && <p className="admin-error" role="alert">{error}</p>}

      {loading ? (
        <p className="admin-loading">Loading messages…</p>
      ) : rows.length === 0 ? (
        <p className="admin-empty">No messages{filter !== 'all' ? ` with status “${filter}”` : ''}.</p>
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
                <tr key={row.id} className={row.status === 'new' ? 'admin-row--highlight' : undefined}>
                  <td className="admin-cell-date">
                    <time dateTime={row.created_at}>
                      {new Date(row.created_at).toLocaleString()}
                    </time>
                  </td>
                  <td className="admin-cell-from">
                    <strong>{row.name?.trim() || '—'}</strong>
                    <a href={`mailto:${row.email}`} className="admin-cell-email">{row.email}</a>
                  </td>
                  <td>
                    <span className="admin-subject">{contactSubjectLabel(row.subject)}</span>
                  </td>
                  <td>
                    <Select
                      id={`status-${row.id}`}
                      value={row.status}
                      onChange={(v) => updateRow(row.id, { status: v })}
                      options={STATUS_OPTIONS}
                    />
                  </td>
                  <td className="admin-cell-message">
                    <p className="admin-message-body">{row.message}</p>
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
