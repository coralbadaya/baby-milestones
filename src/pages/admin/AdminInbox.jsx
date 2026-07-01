import { useCallback, useEffect, useState } from 'react';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminEmpty from '../../components/admin/AdminEmpty';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminToolbar from '../../components/admin/AdminToolbar';
import Select from '../../components/Select';
import { contactSubjectLabel } from '../../constants/contactSubjects';
import { ROUTES } from '../../routes';
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
  { key: 'message', header: 'Message', className: 'admin-cell-message' },
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
    dispatchAdminInboxUpdated();
    load();
  };

  const renderMessageCell = (row) => (
    <>
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
    </>
  );

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
            <a href={`mailto:${row.email}`} className="admin-cell-email">{row.email}</a>
          </>
        );
      case 'subject':
        return <span className="admin-subject">{contactSubjectLabel(row.subject)}</span>;
      case 'status':
        return (
          <Select
            id={`status-${row.id}`}
            value={row.status}
            onChange={(v) => updateRow(row.id, { status: v })}
            options={STATUS_OPTIONS}
          />
        );
      case 'message':
        return renderMessageCell(row);
      default:
        return null;
    }
  };

  const mobileCard = (row) => (
    <>
      <div className="admin-card-row">
        <span className="admin-card-label">Date</span>
        <span className="admin-card-value">
          <time dateTime={row.created_at}>
            {new Date(row.created_at).toLocaleString()}
          </time>
        </span>
      </div>
      <div className="admin-card-row">
        <span className="admin-card-label">From</span>
        <span className="admin-card-value">
          <strong>{row.name?.trim() || '—'}</strong>
          <br />
          <a href={`mailto:${row.email}`}>{row.email}</a>
        </span>
      </div>
      <div className="admin-card-row">
        <span className="admin-card-label">Subject</span>
        <span className="admin-card-value">{contactSubjectLabel(row.subject)}</span>
      </div>
      <div className="admin-card-row">
        <span className="admin-card-label">Status</span>
        <span className="admin-card-value">
          <Select
            id={`status-mobile-${row.id}`}
            value={row.status}
            onChange={(v) => updateRow(row.id, { status: v })}
            options={STATUS_OPTIONS}
          />
        </span>
      </div>
      <div className="admin-card-row">
        <span className="admin-card-label">Message</span>
        <span className="admin-card-value">{renderMessageCell(row)}</span>
      </div>
    </>
  );

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Inbox"
        description="Contact form submissions from users and visitors. New messages appear at the top."
        breadcrumb={[{ label: 'Admin', to: ROUTES.admin }, { label: 'Inbox' }]}
      />

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
        <AdminPanel padding={false}>
          <AdminDataTable
            columns={INBOX_COLUMNS}
            rows={rows}
            rowKey={(row) => row.id}
            renderCell={renderCell}
            highlightRow={(row) => row.status === 'new'}
            mobileCard={mobileCard}
          />
        </AdminPanel>
      )}
    </div>
  );
}

export default AdminInbox;
