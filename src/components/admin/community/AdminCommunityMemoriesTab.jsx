import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Select from '../../Select';
import AdminBadge from '../AdminBadge';
import AdminDataTable from '../AdminDataTable';
import AdminEmpty from '../AdminEmpty';
import AdminPanel from '../AdminPanel';
import AdminToolbar from '../AdminToolbar';
import { ROUTES } from '../../../routes';
import {
  formatDateTime,
  formatReactions,
  memoryTypeLabel,
  MemoryStatusBadge,
} from './communityAdminHelpers';

const MEMORY_COLUMNS = [
  { key: 'title', header: 'Post' },
  { key: 'author', header: 'Author', className: 'admin-cell-narrow' },
  { key: 'status', header: 'Status', className: 'admin-cell-narrow' },
  { key: 'engagement', header: 'Engagement', className: 'admin-cell-narrow' },
  { key: 'date', header: 'Date', className: 'admin-cell-narrow' },
  { key: 'actions', header: '', className: 'admin-cell-actions' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
];

/**
 * @param {{
 *   memories: object[],
 *   mode: 'memories' | 'moderation',
 *   isAdmin: boolean,
 *   onRefresh: () => void,
 *   onApproveAll: () => Promise<void>,
 *   onQuickApprove: (id: string) => Promise<void>,
 * }} props
 */
function AdminCommunityMemoriesTab({
  memories,
  mode,
  isAdmin,
  onRefresh,
  onApproveAll,
  onQuickApprove,
}) {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState(mode === 'moderation' ? 'pending' : 'all');
  const [approvingAll, setApprovingAll] = useState(false);
  const [approvingId, setApprovingId] = useState(null);

  useEffect(() => {
    setStatusFilter(mode === 'moderation' ? 'pending' : 'all');
  }, [mode]);

  const returnTab = mode === 'moderation' ? 'moderation' : 'memories';

  const openPost = (row) => {
    navigate(`${ROUTES.adminCommunityPost(row.id)}?tab=${returnTab}`);
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return memories.filter((row) => {
      if (mode === 'moderation' && row.status !== 'pending') return false;
      if (mode === 'memories' && statusFilter !== 'all' && row.status !== statusFilter) return false;
      if (!q) return true;
      return (
        row.title?.toLowerCase().includes(q)
        || row.author_name?.toLowerCase().includes(q)
        || row.content?.toLowerCase().includes(q)
      );
    });
  }, [memories, search, statusFilter, mode]);

  const pendingCount = memories.filter((m) => m.status === 'pending').length;

  const handleApproveAll = async () => {
    if (!window.confirm(`Approve all ${pendingCount} pending posts?`)) return;
    setApprovingAll(true);
    try {
      await onApproveAll();
    } finally {
      setApprovingAll(false);
    }
  };

  const handleQuickApprove = async (e, id) => {
    e.stopPropagation();
    setApprovingId(id);
    try {
      await onQuickApprove(id);
    } finally {
      setApprovingId(null);
    }
  };

  const renderCell = (row, col) => {
    const reactions = formatReactions(row.reactions);
    switch (col.key) {
      case 'title':
        return (
          <>
            <strong className="admin-cell-title">{row.title}</strong>
            <span className="admin-cell-sub">{memoryTypeLabel(row.type)}</span>
          </>
        );
      case 'author':
        return row.author_name || '—';
      case 'status':
        return <MemoryStatusBadge status={row.status} />;
      case 'engagement':
        return (
          <span className="admin-engagement">
            {reactions.total > 0 ? `${reactions.total} reactions` : '—'}
            {row.comment_count > 0 ? ` · ${row.comment_count} comments` : ''}
            {row.featured ? (
              <>
                {' · '}
                <AdminBadge variant="trial">Featured</AdminBadge>
              </>
            ) : null}
          </span>
        );
      case 'date':
        return (
          <time dateTime={row.created_at}>{formatDateTime(row.created_at)}</time>
        );
      case 'actions':
        return (
          <div className="admin-row-actions">
            {isAdmin && row.status === 'pending' ? (
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={(e) => handleQuickApprove(e, row.id)}
                disabled={approvingId === row.id}
              >
                {approvingId === row.id ? '…' : 'Approve'}
              </button>
            ) : null}
            <Link
              to={`${ROUTES.adminCommunityPost(row.id)}?tab=${returnTab}`}
              className="admin-btn admin-btn--primary admin-btn--sm"
              onClick={(e) => e.stopPropagation()}
            >
              Moderate
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AdminToolbar
        onRefresh={onRefresh}
        left={(
          <>
            <input
              type="search"
              className="admin-search"
              placeholder="Search posts…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search memories"
            />
            {mode === 'memories' ? (
              <Select value={statusFilter} onChange={setStatusFilter} options={STATUS_OPTIONS} aria-label="Filter by status" />
            ) : (
              <span className="admin-toolbar-meta">
                {pendingCount}
                {' '}
                awaiting review — open a post for full moderation
              </span>
            )}
          </>
        )}
        primaryAction={
          mode === 'moderation' && isAdmin && pendingCount > 0 ? (
            <button type="button" className="admin-btn admin-btn--primary" onClick={handleApproveAll} disabled={approvingAll}>
              {approvingAll ? 'Approving…' : 'Approve all'}
            </button>
          ) : null
        }
      />

      <AdminPanel padding={false}>
        {filtered.length === 0 ? (
          <AdminEmpty
            message={
              mode === 'moderation'
                ? 'Moderation queue is clear — no pending posts.'
                : 'No memories match your filters.'
            }
          />
        ) : (
          <AdminDataTable
            columns={MEMORY_COLUMNS}
            rows={filtered}
            rowKey={(row) => row.id}
            renderCell={renderCell}
            highlightRow={(row) => row.status === 'pending'}
            onRowClick={openPost}
          />
        )}
      </AdminPanel>
    </>
  );
}

export default AdminCommunityMemoriesTab;
