import { useState } from 'react';
import AdminBadge from './AdminBadge';
import AdminPanel from './AdminPanel';
import { BRAND_WATERMARK_SRC } from '../../constants/brandAssets';
import { interact } from '../../utils/haptics';
import {
  DIY_DEFAULT_ALT,
  prepareDiyImageFile,
  publicDiyImageUrl,
  resetDiyImageDefault,
  uploadDiyDefaultBlob,
  upsertDiyImageDefault,
} from '../../utils/diyImageAdmin';
import { supabase } from '../../utils/supabaseClient';

/**
 * Site-wide DIY card default image. Shown on every activity until it has its own photo.
 * @param {{
 *   defaultRow: object | null,
 *   userId?: string,
 *   onChanged: () => void | Promise<void>,
 * }} props
 */
function AdminDiyDefaultImage({ defaultRow, userId, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const previewSrc = defaultRow
    ? publicDiyImageUrl(defaultRow.storage_path)
    : BRAND_WATERMARK_SRC;

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 4000);
  };

  const handleUpload = async (file) => {
    if (!file) return;
    setBusy(true);
    setError(null);
    interact('tap', 'light');
    try {
      const { blob, ext, contentType } = await prepareDiyImageFile(file);
      const storagePath = await uploadDiyDefaultBlob(supabase, blob, contentType, ext);
      await upsertDiyImageDefault(supabase, storagePath, {
        altText: DIY_DEFAULT_ALT,
        source: 'upload',
        userId,
      });
      showNotice('Default card image saved');
      await onChanged();
    } catch (err) {
      setError(err.message || 'Upload failed');
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!defaultRow) return;
    if (!window.confirm('Reset the default card image to the bundled Yarn Trails lockup?')) return;
    setBusy(true);
    setError(null);
    interact('tap', 'light');
    try {
      await resetDiyImageDefault(supabase, defaultRow.storage_path);
      showNotice('Default reset to bundled lockup');
      await onChanged();
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminPanel>
      <div className="admin-diy-section-head">
        <h2 className="admin-post-section-title">Default card image</h2>
        {defaultRow ? (
          <AdminBadge variant="active">Custom default</AdminBadge>
        ) : (
          <AdminBadge variant="neutral">Bundled lockup</AdminBadge>
        )}
      </div>
      <p className="admin-muted admin-diy-modal-intro">
        Shown on every Hands-on play card until that activity has its own photo.
      </p>

      {error ? (
        <div className="admin-banner admin-banner--error" role="alert">{error}</div>
      ) : null}
      {notice ? (
        <div className="admin-banner admin-banner--success" role="status">{notice}</div>
      ) : null}

      <div className="admin-diy-default">
        <figure className="admin-diy-preview-card">
          <figcaption>Current default</figcaption>
          <img src={previewSrc} alt={defaultRow?.alt_text || DIY_DEFAULT_ALT} />
        </figure>
        <div className="admin-diy-default-actions">
          <div className="admin-diy-upload-row">
            <label className="admin-btn admin-btn--primary admin-diy-upload">
              {busy ? 'Working…' : 'Upload default'}
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
            {defaultRow ? (
              <button
                type="button"
                className="admin-btn admin-btn--ghost"
                disabled={busy}
                onClick={handleReset}
              >
                Reset to bundled lockup
              </button>
            ) : null}
          </div>
          <p className="admin-muted">JPEG, WebP, or PNG · max 2 MB</p>
        </div>
      </div>
    </AdminPanel>
  );
}

export default AdminDiyDefaultImage;
