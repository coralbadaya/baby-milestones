import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminEmpty from '../../components/admin/AdminEmpty';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminToolbar from '../../components/admin/AdminToolbar';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';
import { diyActivityImages, diyActivityIds } from '../../data/diyImageManifest';
import { getDiyImage } from '../../data/diyImages';
import { ROUTES } from '../../routes';
import { supabase } from '../../utils/supabaseClient';
import {
  fetchAllDiyImageRows,
  publicDiyImageUrl,
} from '../../utils/diyImageAdmin';
import { fetchAllDiyContentRows } from '../../utils/diyActivityAdmin';

const PAGE_SIZE = 20;

const CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  { value: 'sensory', label: 'Sensory' },
  { value: 'motor', label: 'Motor' },
  { value: 'cognitive', label: 'Cognitive' },
  { value: 'emotional', label: 'Emotional' },
  { value: 'bonding', label: 'Bonding' },
];

const MONTH_OPTIONS = [
  { value: '', label: 'All months' },
  ...Array.from({ length: 36 }, (_, i) => ({
    value: String(i + 1),
    label: `Month ${i + 1}`,
  })),
];

const TABLE_COLUMNS = [
  { key: 'preview', header: 'Preview', className: 'admin-cell-narrow' },
  { key: 'activity', header: 'Activity' },
  { key: 'illustration', header: 'Illustration', className: 'admin-cell-narrow' },
  { key: 'source', header: 'Overrides', className: 'admin-cell-narrow' },
  { key: 'actions', header: '', className: 'admin-cell-actions' },
];

function buildReturnQuery({ search, monthFilter, categoryFilter, page }) {
  const params = new URLSearchParams();
  if (search.trim()) params.set('search', search.trim());
  if (monthFilter) params.set('month', monthFilter);
  if (categoryFilter) params.set('category', categoryFilter);
  if (page > 0) params.set('page', String(page));
  return params.toString();
}

function AdminDiyImages() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [imageRows, setImageRows] = useState([]);
  const [contentRows, setContentRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [monthFilter, setMonthFilter] = useState(searchParams.get('month') || '');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || '');
  const [page, setPage] = useState(Number(searchParams.get('page') || 0));

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [images, content] = await Promise.all([
        fetchAllDiyImageRows(supabase),
        fetchAllDiyContentRows(supabase),
      ]);
      setImageRows(images);
      setContentRows(content);
      setError(null);
    } catch (fetchError) {
      setError(fetchError.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const imageByActivityId = useMemo(
    () => Object.fromEntries(imageRows.map((row) => [row.activity_id, row])),
    [imageRows],
  );

  const contentByActivityId = useMemo(
    () => Object.fromEntries(contentRows.map((row) => [row.activity_id, row])),
    [contentRows],
  );

  const filteredIds = useMemo(() => {
    const q = search.trim().toLowerCase();
    return diyActivityIds.filter((id) => {
      const meta = diyActivityImages[id];
      if (monthFilter && String(meta.month) !== monthFilter) return false;
      if (categoryFilter && meta.category !== categoryFilter) return false;
      if (!q) return true;
      return (
        id.toLowerCase().includes(q)
        || meta.name.toLowerCase().includes(q)
        || meta.illustration.includes(q)
      );
    });
  }, [search, monthFilter, categoryFilter]);

  const pageCount = Math.max(1, Math.ceil(filteredIds.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const pageIds = filteredIds.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [search, monthFilter, categoryFilter]);

  const returnQuery = buildReturnQuery({
    search,
    monthFilter,
    categoryFilter,
    page: safePage,
  });

  const openActivity = (activityId) => {
    const qs = returnQuery ? `?return=${encodeURIComponent(returnQuery)}` : '';
    navigate(`${ROUTES.adminDiyImage(activityId)}${qs}`);
  };

  if (!isAdmin) {
    return <Navigate to={ROUTES.admin} replace />;
  }

  const customImageCount = imageRows.length;
  const customContentCount = contentRows.length;
  const totalCount = diyActivityIds.length;

  const renderCell = (activityId, col) => {
    const meta = diyActivityImages[activityId];
    const imageRow = imageByActivityId[activityId];
    const contentRow = contentByActivityId[activityId];
    const preview = imageRow
      ? publicDiyImageUrl(imageRow.storage_path)
      : getDiyImage({
        activityId,
        illustration: meta.illustration,
        category: meta.category,
      }).src;

    switch (col.key) {
      case 'preview':
        return (
          <div className="admin-diy-thumb">
            {preview ? (
              <img src={preview} alt="" loading="lazy" decoding="async" />
            ) : (
              <span className="admin-diy-thumb-empty">—</span>
            )}
          </div>
        );
      case 'activity':
        return (
          <>
            <strong className="admin-cell-title">{meta.name}</strong>
            <span className="admin-cell-sub">
              {activityId}
              {' · Month '}
              {meta.month}
            </span>
          </>
        );
      case 'illustration':
        return <code className="admin-mono">{meta.illustration}</code>;
      case 'source':
        return (
          <span className="admin-flag-group">
            {contentRow ? <AdminBadge variant="active">Content</AdminBadge> : null}
            {imageRow ? <AdminBadge variant="trial">Image</AdminBadge> : null}
            {!contentRow && !imageRow ? <span className="admin-muted">Bundled</span> : null}
          </span>
        );
      case 'actions':
        return (
          <Link
            to={`${ROUTES.adminDiyImage(activityId)}${returnQuery ? `?return=${encodeURIComponent(returnQuery)}` : ''}`}
            className="admin-btn admin-btn--primary admin-btn--sm"
            onClick={(e) => e.stopPropagation()}
          >
            Edit
          </Link>
        );
      default:
        return null;
    }
  };

  return (
    <div className="admin-page admin-diy-page">
      <AdminPageHeader
        title="DIY activities"
        description={`${customContentCount} with custom content · ${customImageCount} with custom images · ${totalCount} total. Open an activity to edit copy, steps, materials, and images.`}
        breadcrumb={[{ label: 'Admin', to: ROUTES.admin }, { label: 'DIY activities' }]}
      />

      {error ? (
        <div className="admin-banner admin-banner--error" role="alert">{error}</div>
      ) : null}

      <AdminToolbar
        left={(
          <>
            <input
              type="search"
              className="admin-search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, id, or illustration key"
              aria-label="Search activities"
            />
            <Select
              value={monthFilter}
              onChange={setMonthFilter}
              options={MONTH_OPTIONS}
              ariaLabel="Filter by month"
            />
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={CATEGORY_OPTIONS}
              ariaLabel="Filter by category"
            />
          </>
        )}
        onRefresh={load}
      />

      {loading ? (
        <AdminLoading variant="table" message="Loading DIY images…" />
      ) : pageIds.length === 0 ? (
        <AdminEmpty message="No activities match your filters." />
      ) : (
        <AdminPanel padding={false}>
          <AdminDataTable
            columns={TABLE_COLUMNS}
            rows={pageIds}
            rowKey={(id) => id}
            renderCell={renderCell}
            onRowClick={openActivity}
          />

          <div className="admin-diy-pagination">
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              disabled={safePage === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              Previous
            </button>
            <span className="admin-muted">
              Page {safePage + 1} of {pageCount} ({filteredIds.length} activities)
            </span>
            <button
              type="button"
              className="admin-btn admin-btn--ghost"
              disabled={safePage >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </AdminPanel>
      )}
    </div>
  );
}

export default AdminDiyImages;
