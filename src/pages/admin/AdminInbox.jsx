import { useCallback, useEffect, useState } from 'react';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminEmpty from '../../components/admin/AdminEmpty';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminToolbar from '../../components/admin/AdminToolbar';
import Select from '../../components/Select';
import { contactSubjectLabel } from '../../constants/contactSubjects';
import { dispatchAdminInboxUpdated } from '../../utils/adminEvents';
import { supabase } from '../../utils/supabaseClient';
import { interact } from '../../utils/haptics';

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'read', label: 'Read' },
  { value: 'replied', label: 'Replied' },
  { value: 'archived', label: 'Archived' },
];

const INBOX_COLUMNS = [
  { key: 'date', header: 'Date', className: 'admin-cell-date' },
  { key: 'from', header: 'From', className: 'admin-cell-from' },
  { key: 'subject', header: 'Subject' },
  { key: 'status', header: 'Status' },
];

function AdminInbox() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

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

  useEffect(() => {
    if (selected && !rows.some((row) => row.id === selected.id)) {
      setSelected(null);
    }
  }, [rows, selected]);

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
    dispatchAdminInboxUpdated();
    setSelected((current) => (current?.id === id ? { ...current, ...patch } : current));
    load();
  };

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'date':
        return (
          <time dateTime={row.created_at}>
            {new Date(row.created_at).toLocaleString()}
          </time>
        );
      case 'from':
        return (
          <>
            <strong>{row.name?.trim() || '—'}</strong>
            <span className="admin-cell-email">{row.email}</span>
          </>
        );
      case 'subject':
        return <span className="admin-subject">{contactSubjectLabel(row.subject)}</span>;
      case 'status':
        return <AdminBadge variant={row.status}>{row.status}</AdminBadge>;
      default:
        return null;
    }
  };

  const mobileCard = (row) => (
    <button
      type="button"
      className="admin-inbox-mobile-row"
      onClick={() => setSelected(row)}
    >
      <div className="admin-inbox-mobile-row-head">
        <AdminBadge variant={row.status}>{row.status}</AdminBadge>
        <time dateTime={row.created_at} className="admin-cell-date">
          {new Date(row.created_at).toLocaleDateString()}
        </time>
      </div>
      <span className="admin-subject">{contactSubjectLabel(row.subject)}</span>
      <span className="admin-inbox-mobile-from">{row.name?.trim() || row.email}</span>
    </button>
  );

  return (
    <div className="admin-page">
      <AdminPageHeader title="Inbox" />

      <AdminToolbar
        left={(
          <Select
            id="inbox-filter"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All statuses' },
              ...STATUS_OPTIONS,
            ]}
          />
        )}
        onRefresh={load}
      />

      {error && <p className="admin-error" role="alert">{error}</p>}

      {loading ? (
        <AdminLoading variant="table" message="Loading messages…" />
      ) : rows.length === 0 ? (
        <AdminEmpty message={`No messages${filter !== 'all' ? ` with status “${filter}”` : ''}.`} />
      ) : (
        <div className={`admin-master-detail${selected ? ' admin-master-detail--open' : ''}`}>
          <div className="admin-master-detail-list">
            <AdminPanel padding={false}>
              <AdminDataTable
                columns={INBOX_COLUMNS}
                rows={rows}
                rowKey={(row) => row.id}
                renderCell={renderCell}
                highlightRow={(row) => row.status === 'new'}
                onRowClick={setSelected}
                selectedRowKey={selected?.id}
                mobileCard={mobileCard}
              />
            </AdminPanel>
          </div>

          {selected ? (
            <aside className="admin-detail-panel" aria-label="Message detail">
              <div className="admin-detail-panel-head">
                <h2 className="admin-detail-panel-title">{contactSubjectLabel(selected.subject)}</h2>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost admin-detail-panel-close"
                  onClick={() => setSelected(null)}
                >
                  Close
                </button>
              </div>

              <dl className="admin-detail-meta">
                <div>
                  <dt>From</dt>
                  <dd>
                    <strong>{selected.name?.trim() || '—'}</strong>
                    <a href={`mailto:${selected.email}`} className="admin-cell-email">{selected.email}</a>
                  </dd>
                </div>
                <div>
                  <dt>Received</dt>
                  <dd>
                    <time dateTime={selected.created_at}>
                      {new Date(selected.created_at).toLocaleString()}
                    </time>
                  </dd>
                </div>
                <div>
                  <dt>Status</dt>
                  <dd>
                    <Select
                      id={`status-detail-${selected.id}`}
                      value={selected.status}
                      onChange={(v) => updateRow(selected.id, { status: v })}
                      options={STATUS_OPTIONS}
                    />
                  </dd>
                </div>
              </dl>

              <div className="admin-detail-section">
                <h3 className="admin-detail-section-title">Message</h3>
                <p className="admin-message-body">{selected.message}</p>
              </div>

              <div className="admin-detail-section">
                <label className="admin-detail-section-title" htmlFor={`notes-${selected.id}`}>
                  Admin notes
                </label>
                <textarea
                  id={`notes-${selected.id}`}
                  className="admin-notes"
                  placeholder="Internal notes (not sent to user)"
                  defaultValue={selected.admin_notes || ''}
                  onBlur={(e) => {
                    if (e.target.value !== (selected.admin_notes || '')) {
                      updateRow(selected.id, { admin_notes: e.target.value });
                    }
                  }}
                />
              </div>
            </aside>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default AdminInbox;
