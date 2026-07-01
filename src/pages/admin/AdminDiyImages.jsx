import { useCallback, useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';
import { diyActivityImages, diyActivityIds } from '../../data/diyImageManifest';
import { getDiyImage } from '../../data/diyImages';
import { ROUTES } from '../../routes';
import { supabase } from '../../utils/supabaseClient';
import {
  fetchDiyImageFromUrl,
  prepareDiyImageFile,
  publicDiyImageUrl,
  resetDiyActivityImage,
  uploadDiyImageBlob,
  upsertDiyImageRow,
  validateDiyImageUrl,
} from '../../utils/diyImageAdmin';
import { interact } from '../../utils/haptics';

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

function AdminDiyImages() {
  const { isAdmin, user } = useAuth();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState(null);
  const [urlInput, setUrlInput] = useState('');
  const [altInput, setAltInput] = useState('');
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error: fetchError } = await supabase
      .from('diy_activity_images')
      .select('*')
      .order('updated_at', { ascending: false });
    if (fetchError) setError(fetchError.message);
    else {
      setError(null);
      setRows(data || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const rowByActivityId = useMemo(
    () => Object.fromEntries(rows.map((row) => [row.activity_id, row])),
    [rows],
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
  const pageIds = filteredIds.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  useEffect(() => {
    setPage(0);
  }, [search, monthFilter, categoryFilter]);

  if (!isAdmin) {
    return <Navigate to={ROUTES.admin} replace />;
  }

  const handleUpload = async (activityId, file) => {
    if (!file) return;
    setBusyId(activityId);
    setError(null);
    interact('tap', 'light');

    try {
      const meta = diyActivityImages[activityId];
      const { blob, ext, contentType } = await prepareDiyImageFile(file);
      const storagePath = await uploadDiyImageBlob(supabase, activityId, blob, contentType, ext);
      await upsertDiyImageRow(supabase, activityId, storagePath, {
        altText: altInput.trim() || meta.alt,
        source: 'upload',
        userId: user?.id,
      });
      setAltInput('');
      await load();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleUrlImport = async (activityId) => {
    setBusyId(activityId);
    setError(null);
    interact('tap', 'light');

    try {
      const check = validateDiyImageUrl(urlInput);
      if (!check.ok) throw new Error(check.error);

      const meta = diyActivityImages[activityId];
      const { blob, contentType, ext } = await fetchDiyImageFromUrl(urlInput);
      const storagePath = await uploadDiyImageBlob(supabase, activityId, blob, contentType, ext);
      await upsertDiyImageRow(supabase, activityId, storagePath, {
        altText: altInput.trim() || meta.alt,
        source: 'url_import',
        userId: user?.id,
      });
      setUrlInput('');
      setAltInput('');
      await load();
    } catch (err) {
      setError(err.message || 'Import failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleReset = async (activityId) => {
    setBusyId(activityId);
    setError(null);
    interact('tap', 'light');

    try {
      const row = rowByActivityId[activityId];
      await resetDiyActivityImage(supabase, activityId, row?.storage_path);
      await load();
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setBusyId(null);
    }
  };

  const handleAltSave = async (activityId) => {
    const row = rowByActivityId[activityId];
    if (!row) return;
    setBusyId(activityId);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('diy_activity_images')
        .update({
          alt_text: altInput.trim() || diyActivityImages[activityId].alt,
          updated_by: user?.id,
          updated_at: new Date().toISOString(),
        })
        .eq('activity_id', activityId);
      if (updateError) throw updateError;
      setAltInput('');
      await load();
    } catch (err) {
      setError(err.message || 'Could not save alt text');
    } finally {
      setBusyId(null);
    }
  };

  const customCount = rows.length;
  const totalCount = diyActivityIds.length;

  return (
    <div className="admin-page">
      <h1 className="font-display">DIY activity images</h1>
      <p className="admin-intro">
        {customCount} of {totalCount} activities have custom images. Others use bundled illustration fallbacks.
      </p>

      {error && <p className="admin-error" role="alert">{error}</p>}

      <div className="admin-form-grid admin-diy-filters">
        <label className="admin-field">
          <span>Search</span>
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Name, id, or illustration key"
          />
        </label>
        <label className="admin-field">
          <span>Month</span>
          <Select
            value={monthFilter}
            onChange={setMonthFilter}
            options={MONTH_OPTIONS}
            ariaLabel="Filter by month"
          />
        </label>
        <label className="admin-field">
          <span>Category</span>
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={CATEGORY_OPTIONS}
            ariaLabel="Filter by category"
          />
        </label>
      </div>

      {loading ? (
        <p className="admin-loading">Loading DIY images…</p>
      ) : (
        <>
          <div className="admin-table-wrap">
            <table className="admin-table admin-diy-table">
              <thead>
                <tr>
                  <th>Preview</th>
                  <th>Activity</th>
                  <th>Illustration</th>
                  <th>Source</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageIds.map((activityId) => {
                  const meta = diyActivityImages[activityId];
                  const row = rowByActivityId[activityId];
                  const preview = row
                    ? publicDiyImageUrl(row.storage_path)
                    : getDiyImage({
                      activityId,
                      illustration: meta.illustration,
                      category: meta.category,
                    }).src;
                  const isExpanded = expandedId === activityId;
                  const isBusy = busyId === activityId;

                  return (
                    <tr key={activityId}>
                      <td>
                        <div className="admin-diy-thumb">
                          {preview ? (
                            <img src={preview} alt="" loading="lazy" decoding="async" />
                          ) : (
                            <span className="admin-diy-thumb-empty">—</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <strong>{meta.name}</strong>
                        <div className="admin-muted">{activityId} · Month {meta.month}</div>
                      </td>
                      <td><code>{meta.illustration}</code></td>
                      <td>{row?.source || 'bundled fallback'}</td>
                      <td>
                        <div className="admin-diy-actions">
                          <label className="btn-ghost admin-diy-upload">
                            {isBusy ? 'Working…' : 'Upload'}
                            <input
                              type="file"
                              accept="image/jpeg,image/webp,image/png"
                              hidden
                              disabled={isBusy}
                              onChange={(e) => {
                                handleUpload(activityId, e.target.files?.[0]);
                                e.target.value = '';
                              }}
                            />
                          </label>
                          <button
                            type="button"
                            className="btn-ghost"
                            disabled={isBusy}
                            onClick={() => {
                              setExpandedId(isExpanded ? null : activityId);
                              setAltInput(row?.alt_text || meta.alt);
                              setUrlInput('');
                            }}
                          >
                            {isExpanded ? 'Close' : 'More'}
                          </button>
                          {row && (
                            <button
                              type="button"
                              className="btn-ghost admin-muted"
                              disabled={isBusy}
                              onClick={() => handleReset(activityId)}
                            >
                              Reset
                            </button>
                          )}
                        </div>
                        {isExpanded && (
                          <div className="admin-diy-expand card-accent-top">
                            <label className="admin-field">
                              <span>Alt text</span>
                              <input
                                type="text"
                                value={altInput}
                                onChange={(e) => setAltInput(e.target.value)}
                              />
                            </label>
                            {row && (
                              <button
                                type="button"
                                className="btn-ghost"
                                disabled={isBusy}
                                onClick={() => handleAltSave(activityId)}
                              >
                                Save alt
                              </button>
                            )}
                            <label className="admin-field">
                              <span>Import from URL</span>
                              <input
                                type="url"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="https://…"
                              />
                            </label>
                            <button
                              type="button"
                              className="btn-primary"
                              disabled={isBusy || !urlInput.trim()}
                              onClick={() => handleUrlImport(activityId)}
                            >
                              Import URL
                            </button>
                            <details className="admin-diy-prompt">
                              <summary>AI prompt</summary>
                              <p>{meta.prompt}</p>
                            </details>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="admin-diy-pagination">
            <button
              type="button"
              className="btn-ghost"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </button>
            <span className="admin-muted">
              Page {page + 1} of {pageCount} ({filteredIds.length} activities)
            </span>
            <button
              type="button"
              className="btn-ghost"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminDiyImages;
