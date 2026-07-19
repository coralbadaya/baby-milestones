import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import Select from '../../components/Select';
import AdminBadge from '../../components/admin/AdminBadge';
import AdminDiyModalPreview from '../../components/admin/AdminDiyModalPreview';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import { useAuth } from '../../context/AuthContext';
import { diyActivityImages } from '../../data/diyImageManifest';
import { BRAND_WATERMARK_SRC } from '../../constants/brandAssets';
import { getDiyImage } from '../../data/diyImages';
import { ROUTES } from '../../routes';
import {
  activityFormFromSources,
  formToPreviewActivity,
  getStaticActivityById,
} from '../../utils/diyActivitiesMerge';
import {
  deleteDiyContentRow,
  fetchDiyContentRow,
  upsertDiyContentFromForm,
  validateDiyVideoUrl,
} from '../../utils/diyActivityAdmin';
import {
  fetchDiyImageFromUrl,
  fetchDiyImageRow,
  prepareDiyImageFile,
  publicDiyImageUrl,
  resetDiyActivityImage,
  updateDiyImageAlt,
  uploadDiyImageBlob,
  upsertDiyImageRow,
  validateDiyImageUrl,
} from '../../utils/diyImageAdmin';
import { supabase } from '../../utils/supabaseClient';
import { interact } from '../../utils/haptics';

const CATEGORY_OPTIONS = [
  { value: 'sensory', label: 'Sensory' },
  { value: 'motor', label: 'Motor' },
  { value: 'cognitive', label: 'Cognitive' },
  { value: 'emotional', label: 'Emotional' },
  { value: 'bonding', label: 'Bonding' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'Easy', label: 'Easy' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Hard', label: 'Hard' },
];

function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function categoryLabel(category) {
  const labels = {
    sensory: 'Sensory',
    motor: 'Motor',
    cognitive: 'Cognitive',
    emotional: 'Emotional',
    bonding: 'Bonding',
  };
  return labels[category] || category;
}

function AdminDiyImageEdit() {
  const { activityId } = useParams();
  const [searchParams] = useSearchParams();
  const returnQuery = searchParams.get('return') || '';
  const backTo = returnQuery ? `${ROUTES.adminDiy}?${returnQuery}` : ROUTES.adminDiy;
  const { isAdmin, user } = useAuth();

  const staticActivity = useMemo(
    () => (activityId ? getStaticActivityById(activityId) : null),
    [activityId],
  );
  const manifestMeta = activityId ? diyActivityImages[activityId] : null;
  const bundledForm = useMemo(
    () => (staticActivity ? activityFormFromSources(staticActivity, null) : null),
    [staticActivity],
  );

  const [imageRow, setImageRow] = useState(null);
  const [contentRow, setContentRow] = useState(null);
  const [contentForm, setContentForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [altInput, setAltInput] = useState('');
  const [urlInput, setUrlInput] = useState('');

  const showNotice = useCallback((message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 4000);
  }, []);

  useEffect(() => {
    if (!activityId || !staticActivity) {
      setImageRow(null);
      setContentRow(null);
      setContentForm(null);
      setLoading(false);
      return undefined;
    }

    setContentForm(bundledForm);
    setImageRow(null);
    setContentRow(null);
    setLoading(true);
    setError(null);

    let cancelled = false;

    (async () => {
      try {
        const [imageData, contentData] = await Promise.all([
          fetchDiyImageRow(supabase, activityId),
          fetchDiyContentRow(supabase, activityId),
        ]);
        if (cancelled) return;
        setImageRow(imageData);
        setContentRow(contentData);
        setContentForm(activityFormFromSources(staticActivity, contentData));
        setAltInput(imageData?.alt_text || manifestMeta?.alt || staticActivity.name);
      } catch (err) {
        if (cancelled) return;
        setError(err.message);
        setContentForm(bundledForm);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activityId, staticActivity, bundledForm, manifestMeta]);

  const reload = useCallback(async () => {
    if (!activityId || !staticActivity) return;
    setLoading(true);
    setError(null);
    try {
      const [imageData, contentData] = await Promise.all([
        fetchDiyImageRow(supabase, activityId),
        fetchDiyContentRow(supabase, activityId),
      ]);
      setImageRow(imageData);
      setContentRow(contentData);
      setContentForm(activityFormFromSources(staticActivity, contentData));
      setAltInput(imageData?.alt_text || manifestMeta?.alt || staticActivity.name);
    } catch (err) {
      setError(err.message);
      setContentForm(bundledForm);
    } finally {
      setLoading(false);
    }
  }, [activityId, staticActivity, bundledForm, manifestMeta]);

  const setContentField = (key, value) => {
    setContentForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const customPreview = imageRow ? publicDiyImageUrl(imageRow.storage_path) : '';
  const illustrationKey = contentForm?.illustration || staticActivity?.illustration;
  const categoryKey = contentForm?.category || staticActivity?.category;
  const fallbackPreview = staticActivity
    ? getDiyImage({
      activityId,
      illustration: illustrationKey,
      category: categoryKey,
    }).src
    : '';
  const activePreview = customPreview || fallbackPreview || BRAND_WATERMARK_SRC;

  const sourceLabel = useMemo(() => {
    if (!imageRow) return 'Bundled fallback';
    if (imageRow.source === 'upload') return 'Custom upload';
    if (imageRow.source === 'url_import') return 'URL import';
    return imageRow.source || 'Custom';
  }, [imageRow]);

  const previewActivity = useMemo(
    () => (contentForm && activityId ? formToPreviewActivity(contentForm, activityId) : null),
    [contentForm, activityId],
  );

  const videoUrlCheck = useMemo(
    () => (contentForm ? validateDiyVideoUrl(contentForm.videoSearch) : { ok: false, error: '' }),
    [contentForm],
  );

  if (!isAdmin) {
    return (
      <div className="admin-page admin-diy-edit-page">
        <AdminPageHeader title="Access denied" breadcrumb={[{ label: 'Admin', to: ROUTES.admin }, { label: 'DIY activities', to: ROUTES.adminDiy }]} />
        <p className="admin-muted">Admin role required.</p>
      </div>
    );
  }

  if (!staticActivity) {
    return (
      <div className="admin-page admin-diy-edit-page">
        <AdminPageHeader
          title="Activity not found"
          breadcrumb={[
            { label: 'Admin', to: ROUTES.admin },
            { label: 'DIY activities', to: backTo },
            { label: activityId || 'Unknown' },
          ]}
        />
        <div className="admin-banner admin-banner--error" role="alert">
          Unknown activity ID “{activityId}”.
        </div>
        <Link to={backTo} className="admin-btn admin-btn--ghost">Back to list</Link>
      </div>
    );
  }

  if (loading || !contentForm) {
    return (
      <div className="admin-page admin-diy-edit-page">
        <AdminLoading message="Loading DIY activity…" />
      </div>
    );
  }

  const handleSaveContent = async () => {
    setBusy(true);
    setError(null);
    interact('tap', 'light');
    try {
      const saved = await upsertDiyContentFromForm(supabase, staticActivity, contentForm, user?.id);
      setContentRow(saved);
      setContentForm(activityFormFromSources(staticActivity, saved));
      showNotice('Activity content saved to database');
    } catch (err) {
      setError(err.message || 'Could not save content');
    } finally {
      setBusy(false);
    }
  };

  const handleResetContent = async () => {
    if (!contentRow) return;
    if (!window.confirm(`Reset activity copy for “${contentForm.name}” to bundled defaults?`)) return;
    setBusy(true);
    setError(null);
    interact('tap', 'light');
    try {
      await deleteDiyContentRow(supabase, activityId);
      setContentRow(null);
      setContentForm(activityFormFromSources(staticActivity, null));
      showNotice('Content reset to bundled defaults');
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setBusy(false);
    }
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    interact('tap', 'light');
    try {
      const { blob, ext, contentType } = await prepareDiyImageFile(file);
      const storagePath = await uploadDiyImageBlob(supabase, activityId, blob, contentType, ext);
      await upsertDiyImageRow(supabase, activityId, storagePath, {
        altText: altInput.trim() || manifestMeta?.alt || staticActivity.name,
        source: 'upload',
        userId: user?.id,
      });
      showNotice('Image uploaded');
      await reload();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const handleUrlImport = async () => {
    setBusy(true);
    setError(null);
    interact('tap', 'light');
    try {
      const check = validateDiyImageUrl(urlInput);
      if (!check.ok) throw new Error(check.error);
      const { blob, contentType, ext } = await fetchDiyImageFromUrl(urlInput);
      const storagePath = await uploadDiyImageBlob(supabase, activityId, blob, contentType, ext);
      await upsertDiyImageRow(supabase, activityId, storagePath, {
        altText: altInput.trim() || manifestMeta?.alt || staticActivity.name,
        source: 'url_import',
        userId: user?.id,
      });
      setUrlInput('');
      showNotice('Image imported from URL');
      await reload();
    } catch (err) {
      setError(err.message || 'Import failed');
    } finally {
      setBusy(false);
    }
  };

  const handleAltSave = async () => {
    if (!imageRow) {
      setError('Upload an image before saving alt text.');
      return;
    }
    setBusy(true);
    setError(null);
    interact('tap', 'light');
    try {
      await updateDiyImageAlt(
        supabase,
        activityId,
        altInput.trim() || manifestMeta?.alt || staticActivity.name,
        user?.id,
      );
      showNotice('Alt text saved');
      await reload();
    } catch (err) {
      setError(err.message || 'Could not save alt text');
    } finally {
      setBusy(false);
    }
  };

  const handleResetImage = async () => {
    if (!window.confirm(`Reset image for “${contentForm.name}” to bundled fallback?`)) return;
    setBusy(true);
    setError(null);
    interact('tap', 'light');
    try {
      await resetDiyActivityImage(supabase, activityId, imageRow?.storage_path);
      setAltInput(manifestMeta?.alt || staticActivity.name);
      setUrlInput('');
      showNotice('Image reset to bundled fallback');
      await reload();
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="admin-page admin-diy-edit-page">
      <AdminPageHeader
        title={contentForm.name}
        description={`Edit all fields for ${activityId} — content is stored in Supabase when saved; bundled data is the fallback.`}
        breadcrumb={[
          { label: 'Admin', to: ROUTES.admin },
          { label: 'DIY activities', to: backTo },
          { label: contentForm.name },
        ]}
        action={(
          <div className="admin-post-header-actions">
            <Link to={backTo} className="admin-btn admin-btn--ghost">Back to list</Link>
            <Link
              to={ROUTES.month(staticActivity.month)}
              className="admin-btn admin-btn--ghost"
              target="_blank"
              rel="noreferrer"
            >
              View month
            </Link>
            <button
              type="button"
              className="admin-btn admin-btn--primary"
              disabled={busy || !contentForm.name.trim() || !videoUrlCheck.ok}
              onClick={handleSaveContent}
            >
              {busy ? 'Saving…' : 'Save content'}
            </button>
          </div>
        )}
      />

      {error ? (
        <div className="admin-banner admin-banner--error" role="alert">{error}</div>
      ) : null}

      {notice ? (
        <div className="admin-banner admin-banner--success" role="status">{notice}</div>
      ) : null}

      <div className="admin-post-moderator admin-diy-edit-layout">
        <div className="admin-post-moderator-main">
          <AdminPanel>
            <div className="admin-diy-section-head">
              <h2 className="admin-post-section-title">Open guide modal</h2>
              {contentRow ? (
                <AdminBadge variant="active">Custom in DB</AdminBadge>
              ) : (
                <AdminBadge variant="neutral">Bundled default</AdminBadge>
              )}
            </div>
            <p className="admin-muted admin-diy-modal-intro">
              These fields populate the public “Open guide” modal (including in-modal video when a watch URL is set).
            </p>
            <form
              className="admin-form admin-form--post"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveContent();
              }}
            >
              <div className="admin-form-grid admin-form-grid--3">
                <label className="admin-field">
                  <span>Category</span>
                  <Select
                    value={contentForm.category}
                    onChange={(v) => setContentField('category', v)}
                    options={CATEGORY_OPTIONS}
                    aria-label="Category"
                  />
                </label>
                <label className="admin-field">
                  <span>Duration (modal subtitle)</span>
                  <input
                    type="text"
                    value={contentForm.duration}
                    onChange={(e) => setContentField('duration', e.target.value)}
                  />
                </label>
                <label className="admin-field">
                  <span>Difficulty (modal subtitle)</span>
                  <Select
                    value={contentForm.difficulty}
                    onChange={(v) => setContentField('difficulty', v)}
                    options={DIFFICULTY_OPTIONS}
                    aria-label="Difficulty"
                  />
                </label>
              </div>

              <label className="admin-field">
                <span>Modal title</span>
                <input
                  type="text"
                  value={contentForm.name}
                  onChange={(e) => setContentField('name', e.target.value)}
                  required
                />
              </label>

              <label className="admin-field">
                <span>What you need (one per line)</span>
                <textarea
                  value={contentForm.materials}
                  onChange={(e) => setContentField('materials', e.target.value)}
                  rows={4}
                />
              </label>

              <label className="admin-field">
                <span>How to play — steps (one per line)</span>
                <textarea
                  value={contentForm.steps}
                  onChange={(e) => setContentField('steps', e.target.value)}
                  rows={8}
                />
              </label>

              <label className="admin-field">
                <span>Benefits (one per line)</span>
                <textarea
                  value={contentForm.benefits}
                  onChange={(e) => setContentField('benefits', e.target.value)}
                  rows={4}
                />
              </label>

              <label className="admin-field">
                <span>Why it works (modal panel)</span>
                <textarea
                  value={contentForm.whyItWorks}
                  onChange={(e) => setContentField('whyItWorks', e.target.value)}
                  rows={4}
                />
              </label>

              <label className="admin-field">
                <span>YouTube link (in guide modal)</span>
                <input
                  type="url"
                  value={contentForm.videoSearch}
                  onChange={(e) => setContentField('videoSearch', e.target.value)}
                  placeholder="https://www.youtube.com/results?search_query=…"
                  aria-invalid={!videoUrlCheck.ok}
                />
                {!videoUrlCheck.ok && contentForm.videoSearch.trim() ? (
                  <span className="admin-field-error">{videoUrlCheck.error}</span>
                ) : (
                  <span className="admin-field-hint">Prefer a watch URL (`watch?v=` / `youtu.be/`) — embeds in the modal. Search URLs show a disclosure + outbound link.</span>
                )}
              </label>
              <div className="admin-diy-upload-row">
                <a
                  href={videoUrlCheck.ok ? videoUrlCheck.url : undefined}
                  className={`admin-btn admin-btn--ghost admin-btn--sm${videoUrlCheck.ok ? '' : ' admin-btn--disabled'}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-disabled={!videoUrlCheck.ok}
                  onClick={(e) => {
                    if (!videoUrlCheck.ok) e.preventDefault();
                  }}
                >
                  Test YouTube link
                </a>
              </div>

              <label className="admin-field">
                <span>Illustration key (image fallback)</span>
                <input
                  type="text"
                  value={contentForm.illustration}
                  onChange={(e) => setContentField('illustration', e.target.value)}
                />
              </label>
            </form>
          </AdminPanel>

          {previewActivity ? (
            <AdminPanel>
              <h2 className="admin-post-section-title">Modal preview</h2>
              <p className="admin-muted admin-diy-modal-intro">Live preview of what parents see when they tap Open guide.</p>
              <AdminDiyModalPreview
                activity={previewActivity}
                imageSrc={activePreview}
                imageAlt={altInput}
              />
            </AdminPanel>
          ) : null}

          <AdminPanel>
            <h2 className="admin-post-section-title">Image preview</h2>
            <div className="admin-diy-preview-grid">
              <figure className="admin-diy-preview-card">
                <figcaption>Active image</figcaption>
                {activePreview ? (
                  <img src={activePreview} alt={altInput} />
                ) : (
                  <div className="admin-diy-preview-empty">No preview</div>
                )}
              </figure>
              {customPreview && fallbackPreview && customPreview !== fallbackPreview ? (
                <figure className="admin-diy-preview-card admin-diy-preview-card--muted">
                  <figcaption>Bundled fallback</figcaption>
                  <img src={fallbackPreview} alt="" />
                </figure>
              ) : null}
            </div>
          </AdminPanel>

          <AdminPanel>
            <h2 className="admin-post-section-title">Image settings</h2>
            <div className="admin-form admin-form--post">
              <label className="admin-field">
                <span>Alt text</span>
                <input
                  type="text"
                  value={altInput}
                  onChange={(e) => setAltInput(e.target.value)}
                />
              </label>

              <div className="admin-diy-upload-row">
                <label className="admin-btn admin-btn--ghost admin-diy-upload">
                  {busy ? 'Working…' : 'Upload image'}
                  <input
                    type="file"
                    accept="image/jpeg,image/webp,image/png"
                    hidden
                    disabled={busy}
                    onChange={(e) => {
                      handleUpload(e.target.files?.[0]);
                      e.target.value = '';
                    }}
                  />
                </label>
                <span className="admin-muted">JPEG, WebP, or PNG · max 2 MB</span>
                {imageRow ? (
                  <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" disabled={busy} onClick={handleAltSave}>
                    Save alt only
                  </button>
                ) : null}
              </div>

              <label className="admin-field">
                <span>Import from URL</span>
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://…"
                  disabled={busy}
                />
              </label>
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                disabled={busy || !urlInput.trim()}
                onClick={handleUrlImport}
              >
                Import URL
              </button>
            </div>
          </AdminPanel>

          {manifestMeta?.prompt ? (
            <AdminPanel>
              <h2 className="admin-post-section-title">AI generation prompt</h2>
              <p className="admin-diy-prompt-text">{manifestMeta.prompt}</p>
              <button
                type="button"
                className="admin-btn admin-btn--ghost admin-btn--sm"
                onClick={() => {
                  navigator.clipboard.writeText(manifestMeta.prompt);
                  showNotice('Prompt copied');
                }}
              >
                Copy prompt
              </button>
            </AdminPanel>
          ) : null}
        </div>

        <aside className="admin-post-moderator-sidebar" aria-label="Activity metadata">
          <AdminPanel>
            <h2 className="admin-post-section-title">Overview</h2>
            <dl className="admin-detail-meta">
              <div>
                <dt>Activity ID</dt>
                <dd className="admin-mono">{activityId}</dd>
              </div>
              <div>
                <dt>Month</dt>
                <dd>{manifestMeta?.month ?? staticActivity.month}</dd>
              </div>
              <div>
                <dt>Category</dt>
                <dd>{categoryLabel(contentForm.category)}</dd>
              </div>
              <div>
                <dt>Content source</dt>
                <dd>{contentRow ? 'Database override' : 'Bundled default'}</dd>
              </div>
              {contentRow ? (
                <div>
                  <dt>Content updated</dt>
                  <dd><time dateTime={contentRow.updated_at}>{formatDateTime(contentRow.updated_at)}</time></dd>
                </div>
              ) : null}
            </dl>
          </AdminPanel>

          <AdminPanel>
            <h2 className="admin-post-section-title">Image storage</h2>
            <dl className="admin-detail-meta">
              <div>
                <dt>Image source</dt>
                <dd>{sourceLabel}</dd>
              </div>
              <div>
                <dt>Storage path</dt>
                <dd className="admin-mono">{imageRow?.storage_path || '—'}</dd>
              </div>
              {imageRow ? (
                <div>
                  <dt>Image updated</dt>
                  <dd><time dateTime={imageRow.updated_at}>{formatDateTime(imageRow.updated_at)}</time></dd>
                </div>
              ) : null}
            </dl>
          </AdminPanel>

          <AdminPanel>
            <h2 className="admin-post-section-title">Reset</h2>
            <div className="admin-post-moderation-actions">
              {contentRow ? (
                <button type="button" className="admin-btn admin-btn--ghost" disabled={busy} onClick={handleResetContent}>
                  Reset content to bundled
                </button>
              ) : null}
              {imageRow ? (
                <button type="button" className="admin-btn admin-btn--danger" disabled={busy} onClick={handleResetImage}>
                  Reset image to bundled
                </button>
              ) : null}
            </div>
          </AdminPanel>
        </aside>
      </div>
    </div>
  );
}

export default AdminDiyImageEdit;
