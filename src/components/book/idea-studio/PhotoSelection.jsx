import { useCallback, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes';

/**
 * @typedef {{ id: string, dataUrl?: string, caption?: string, source?: string }} SelectablePhoto
 */

function PhotoSelection({
  photos = [],
  selectedIds = [],
  onChange,
  min = 1,
  max = 50,
  title = 'Choose photos',
  hint,
  onUpload,
  uploading = false,
  uploadError,
}) {
  const fileRef = useRef(null);
  const [dragId, setDragId] = useState(null);

  const selectedSet = useMemo(() => new Set(selectedIds), [selectedIds]);
  const orderedSelected = useMemo(
    () => selectedIds
      .map((id) => photos.find((p) => p.id === id))
      .filter(Boolean),
    [selectedIds, photos],
  );

  const toggle = useCallback((id) => {
    if (selectedSet.has(id)) {
      onChange(selectedIds.filter((x) => x !== id));
      return;
    }
    if (selectedIds.length >= max) return;
    onChange([...selectedIds, id]);
  }, [selectedIds, selectedSet, onChange, max]);

  const remove = useCallback((id) => {
    onChange(selectedIds.filter((x) => x !== id));
  }, [selectedIds, onChange]);

  const move = useCallback((id, dir) => {
    const idx = selectedIds.indexOf(id);
    if (idx < 0) return;
    const next = idx + dir;
    if (next < 0 || next >= selectedIds.length) return;
    const copy = [...selectedIds];
    const [item] = copy.splice(idx, 1);
    copy.splice(next, 0, item);
    onChange(copy);
  }, [selectedIds, onChange]);

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file || !onUpload) return;
    await onUpload(file);
  };

  const onDragStart = (id) => setDragId(id);
  const onDragOver = (e, targetId) => {
    e.preventDefault();
    if (!dragId || dragId === targetId) return;
    const from = selectedIds.indexOf(dragId);
    const to = selectedIds.indexOf(targetId);
    if (from < 0 || to < 0) return;
    const copy = [...selectedIds];
    copy.splice(from, 1);
    copy.splice(to, 0, dragId);
    onChange(copy);
  };

  const countOk = selectedIds.length >= min;

  return (
    <div className="idea-photo-select">
      <div className="idea-photo-select__head">
        <h3 className="idea-photo-select__title">{title}</h3>
        <p className="baby-book-section-sub idea-photo-select__count" aria-live="polite">
          {selectedIds.length} selected
          {min > 0 ? ` · ${min}${max ? `–${max}` : '+'} needed` : ''}
        </p>
      </div>

      {hint && <p className="baby-book-section-sub idea-photo-select__hint">{hint}</p>}

      {orderedSelected.length > 0 && (
        <p className="idea-photo-select__reorder-label">Selected — drag to reorder</p>
      )}

      {orderedSelected.length > 0 && (
        <ol className="idea-photo-select__tray">
          {orderedSelected.map((photo, index) => (
            <li
              key={photo.id}
              className="idea-photo-select__tray-item"
              draggable
              onDragStart={() => onDragStart(photo.id)}
              onDragOver={(e) => onDragOver(e, photo.id)}
              onDragEnd={() => setDragId(null)}
            >
              <span className="idea-photo-select__tray-num">{index + 1}</span>
              {photo.dataUrl ? (
                <img src={photo.dataUrl} alt="" className="idea-photo-select__thumb" />
              ) : (
                <span className="idea-photo-select__thumb idea-photo-select__thumb--empty" />
              )}
              <div className="idea-photo-select__tray-actions">
                <button type="button" className="idea-photo-select__icon-btn" onClick={() => move(photo.id, -1)} aria-label="Move earlier">↑</button>
                <button type="button" className="idea-photo-select__icon-btn" onClick={() => move(photo.id, 1)} aria-label="Move later">↓</button>
                <button type="button" className="idea-photo-select__icon-btn" onClick={() => remove(photo.id)} aria-label="Remove">×</button>
              </div>
            </li>
          ))}
        </ol>
      )}

      <div className="idea-photo-select__toolbar">
        {onUpload && (
          <>
            <button
              type="button"
              className="baby-book-btn baby-book-btn--ghost"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading…' : 'Upload photo'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
          </>
        )}
        <Link to={ROUTES.babyAlbum} className="baby-book-studio__link">
          Add on My Baby
        </Link>
      </div>

      {uploadError && (
        <p className="idea-photo-select__error" role="alert">{uploadError}</p>
      )}

      {photos.length === 0 ? (
        <div className="idea-empty baby-book-glass">
          <p className="baby-book-section-title idea-empty__title">No photos yet</p>
          <p className="baby-book-section-sub">
            Upload a few memories to your monthly album — we never scan your camera roll without you.
          </p>
        </div>
      ) : (
        <div className="idea-photo-select__grid" role="listbox" aria-label="Album photos" aria-multiselectable="true">
          {photos.map((photo) => {
            const selected = selectedSet.has(photo.id);
            return (
              <button
                key={photo.id}
                type="button"
                role="option"
                aria-selected={selected}
                className={`idea-photo-select__cell${selected ? ' idea-photo-select__cell--on' : ''}`}
                onClick={() => toggle(photo.id)}
              >
                {photo.dataUrl ? (
                  <img src={photo.dataUrl} alt={photo.caption || 'Album photo'} loading="lazy" />
                ) : (
                  <span className="idea-photo-select__placeholder" />
                )}
                {selected && <span className="idea-photo-select__check" aria-hidden="true">✓</span>}
                {photo.caption && <span className="idea-photo-select__caption">{photo.caption}</span>}
              </button>
            );
          })}
        </div>
      )}

      {!countOk && selectedIds.length > 0 && (
        <p className="idea-photo-select__warn" role="status">
          Select at least {min} photo{min === 1 ? '' : 's'} to continue.
        </p>
      )}
    </div>
  );
}

export default PhotoSelection;