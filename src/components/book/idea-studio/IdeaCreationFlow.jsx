import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { getBookIdeaDefinition } from '../../../data/bookIdeasConfig';
import { detectFestivalFromDate } from '../../../data/festivalCalendar';
import { getTimeCapsuleUnlockYear } from '../../../utils/bookReminders';
import { useBabyProfiles } from '../../../hooks/useBabyProfiles';
import { ROUTES } from '../../../routes';
import PhotoSelection from './PhotoSelection';
import { trackIdeaStudio } from './trackIdeaStudio';

function ThenAndNowFlow({ photos, selectedIds, onChange }) {
  const step = selectedIds.length === 0 ? 'parent' : selectedIds.length === 1 ? 'baby' : 'done';
  const label = step === 'parent' ? 'Choose your photo (parent)' : step === 'baby' ? 'Choose baby\'s photo' : 'Both photos chosen';

  return (
    <div className="idea-flow-stack">
      <p className="baby-book-section-sub">{label}</p>
      <PhotoSelection
        photos={photos}
        selectedIds={selectedIds}
        onChange={(ids) => onChange(ids.slice(0, 2))}
        min={2}
        max={2}
        title="Two photos for Then & Now"
        hint="Pick one portrait of you and one of your baby — order is parent first, then baby."
      />
    </div>
  );
}

function FestivalConfirmFlow({ photos, selectedIds, onChange }) {
  const candidates = useMemo(
    () => photos.filter((p) => detectFestivalFromDate(p.capturedAt)),
    [photos],
  );

  useEffect(() => {
    if (selectedIds.length === 0 && candidates.length) {
      onChange(candidates.map((p) => p.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- preselect once when opening
  }, []);

  return (
    <div className="idea-flow-stack">
      <p className="baby-book-section-sub">
        We only suggest dates from your photo metadata. Confirm each celebration below — we never label faith without you.
      </p>
      {candidates.length === 0 ? (
        <div className="idea-empty baby-book-glass">
          <p className="baby-book-section-sub">
            No celebration dates found yet. Add photos with dates, or pick any memories that feel like a first festival.
          </p>
        </div>
      ) : null}
      <PhotoSelection
        photos={photos}
        selectedIds={selectedIds}
        onChange={onChange}
        min={1}
        title="Confirm celebration photos"
      />
    </div>
  );
}

function MilestoneFlow({ entries, onChange }) {
  const addRow = () => {
    onChange([
      ...entries,
      { id: crypto.randomUUID(), date: '', weightKg: '', heightCm: '', note: '' },
    ]);
  };

  const update = (id, patch) => {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  };

  const remove = (id) => onChange(entries.filter((e) => e.id !== id));

  return (
    <div className="idea-flow-stack">
      <p className="baby-book-section-sub">
        Enter real measurements only — we do not invent growth data. These points shape your rocket trail layout.
      </p>
      <div className="idea-milestone-form">
        {entries.map((row) => (
          <div key={row.id} className="idea-milestone-form__row baby-book-glass">
            <label>
              <span>Date</span>
              <input type="date" value={row.date} onChange={(e) => update(row.id, { date: e.target.value })} />
            </label>
            <label>
              <span>Weight (kg)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={row.weightKg}
                onChange={(e) => update(row.id, { weightKg: e.target.value })}
              />
            </label>
            <label>
              <span>Height (cm)</span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={row.heightCm}
                onChange={(e) => update(row.id, { heightCm: e.target.value })}
              />
            </label>
            <label className="idea-milestone-form__note">
              <span>Note (optional)</span>
              <input type="text" value={row.note} onChange={(e) => update(row.id, { note: e.target.value })} />
            </label>
            <button type="button" className="idea-photo-select__icon-btn" onClick={() => remove(row.id)} aria-label="Remove row">×</button>
          </div>
        ))}
      </div>
      <button type="button" className="baby-book-btn baby-book-btn--ghost" onClick={addRow}>
        Add measurement
      </button>
    </div>
  );
}

function LetterFlow({ birthDate, babyProfileId, onDone }) {
  const { capsules, createTimeCapsule } = useBabyProfiles();
  const [letter, setLetter] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const unlockYear = getTimeCapsuleUnlockYear(birthDate);
  const existing = capsules[0];

  const handleSave = async () => {
    if (!letter.trim() || !babyProfileId) return;
    setSaving(true);
    setError(null);
    try {
      const birth = birthDate ? new Date(birthDate) : new Date();
      const unlockAt = new Date(birth);
      unlockAt.setFullYear(birth.getFullYear() + 18);
      await createTimeCapsule({
        babyProfileId,
        contentText: letter.trim(),
        unlockAt: unlockAt.toISOString(),
        sealedForPrint: true,
      });
      setLetter('');
      onDone?.({ status: 'saved' });
    } catch (err) {
      setError(err.message || 'Could not save letter');
    } finally {
      setSaving(false);
    }
  };

  if (existing) {
    return (
      <div className="idea-empty baby-book-glass">
        <p className="baby-book-section-title">Letter saved</p>
        <p className="baby-book-section-sub">
          Your letter for {unlockYear} is sealed in Yarn Trails and can be included as a closed page in print.
          Editing after seal is not available yet — contact support if you need to replace it.
        </p>
      </div>
    );
  }

  return (
    <div className="idea-flow-stack">
      <p className="baby-book-section-sub">
        Write today&apos;s words for age {unlockYear}. No photos required. Voice recording lives on the Family tab.
      </p>
      <textarea
        value={letter}
        onChange={(e) => setLetter(e.target.value)}
        placeholder="Dear one, on the day you read this…"
        rows={6}
        className="baby-book-capsule-form__textarea"
      />
      {error && <p className="idea-photo-select__error" role="alert">{error}</p>}
      <button
        type="button"
        className="baby-book-btn baby-book-btn--primary"
        onClick={handleSave}
        disabled={saving || !letter.trim() || !babyProfileId}
      >
        {saving ? 'Saving draft…' : 'Save letter to book'}
      </button>
      {!babyProfileId && (
        <p className="idea-photo-select__warn">Sign in with a baby profile to save your letter.</p>
      )}
    </div>
  );
}

function FamilyConstellationFlow({ photos, selectedIds, onChange, blessingCount = 0 }) {
  return (
    <div className="idea-flow-stack">
      <p className="baby-book-section-sub">
        Choose family photos you have permission to print. Voice blessings from Family Circle ({blessingCount} saved) can accompany the spread.
      </p>
      <PhotoSelection
        photos={photos}
        selectedIds={selectedIds}
        onChange={onChange}
        min={3}
        max={8}
        title="Family faces"
      />
      <Link to={ROUTES.babyBookTab('family')} className="baby-book-studio__link">
        Open Family Circle
      </Link>
    </div>
  );
}

function IdeaCreationFlow({
  idea,
  photos,
  birthDate,
  babyProfileId,
  blessingCount = 0,
  onClose,
  onGenerate,
  uploadPhoto,
}) {
  const def = getBookIdeaDefinition(idea?.id) || {};
  const [step, setStep] = useState('edit');
  const [selectedIds, setSelectedIds] = useState(idea?.matchedPhotoIds || []);
  const [milestoneEntries, setMilestoneEntries] = useState([
    { id: crypto.randomUUID(), date: '', weightKg: '', heightCm: '', note: '' },
  ]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    trackIdeaStudio('select', { ideaId: idea?.id, creationType: def.creationType });
  }, [idea?.id, def.creationType]);

  const minPhotos = def.suggestedPhotoCount?.min ?? 1;
  const maxPhotos = def.suggestedPhotoCount?.max ?? 50;

  const handleUpload = useCallback(async (file) => {
    if (!uploadPhoto) return;
    setUploading(true);
    setUploadError(null);
    try {
      const row = await uploadPhoto(file);
      if (row?.id) setSelectedIds((prev) => (prev.includes(row.id) ? prev : [...prev, row.id]));
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [uploadPhoto]);

  const canSubmit = useMemo(() => {
    if (def.creationType === 'text-based') return false;
    if (def.creationType === 'milestone-based') {
      return milestoneEntries.some((e) => e.date && (e.weightKg || e.heightCm));
    }
    if (idea?.id === 'thenAndNow') return selectedIds.length === 2;
    return selectedIds.length >= Math.max(minPhotos, 1);
  }, [def.creationType, idea?.id, milestoneEntries, minPhotos, selectedIds.length]);

  const startCreate = async () => {
    trackIdeaStudio('create_start', { ideaId: idea.id, creationType: def.creationType });
    setStep('processing');
    setError(null);
    try {
      const payloadIds = def.creationType === 'milestone-based'
        ? selectedIds
        : selectedIds;
      const res = await onGenerate(idea.id, payloadIds, {
        milestones: def.creationType === 'milestone-based' ? milestoneEntries : undefined,
      });
      setResult(res);
      if (res?.status === 'queued' || res?.previewUrl) {
        trackIdeaStudio('preview', { ideaId: idea.id, creationType: def.creationType });
      }
      setStep('done');
    } catch (err) {
      setError(err.message || 'Creation failed');
      trackIdeaStudio('create_fail', { ideaId: idea.id, creationType: def.creationType });
      setStep('edit');
    }
  };

  useEffect(() => {
  // lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, []);

  return (
    <div className="baby-book-modal-backdrop idea-creation-backdrop" role="dialog" aria-modal="true" aria-labelledby="idea-flow-title">
      <div className="baby-book-modal baby-book-glass idea-creation-modal">
        <header className="idea-creation-modal__head">
          <button type="button" className="baby-book-shell__back" onClick={onClose}>← Back</button>
          <h2 id="idea-flow-title" className="baby-book-section-title">{idea?.title}</h2>
        </header>

        {step === 'processing' && (
          <div className="idea-creation-status" role="status">
            <p className="baby-book-section-title">Queuing layout…</p>
            <p className="baby-book-section-sub">
              AI layout runs on our servers — this screen updates when a preview is ready. We never show a finished book until processing completes.
            </p>
          </div>
        )}

        {step === 'done' && (
          <div className="idea-creation-status">
            <p className="baby-book-section-title">
              {result?.previewUrl ? 'Preview ready' : 'Layout queued'}
            </p>
            <p className="baby-book-section-sub">
              {result?.message || 'Your keepsake layout is in the queue. Check back soon or open the 3D book tab when a preview URL is available.'}
            </p>
            {result?.previewUrl && (
              <a href={result.previewUrl} className="baby-book-studio__link" target="_blank" rel="noreferrer">
                View preview
              </a>
            )}
            <button type="button" className="baby-book-btn baby-book-btn--primary" onClick={onClose}>
              Done
            </button>
          </div>
        )}

        {step === 'edit' && (
          <>
            {def.creationType === 'photo-based' && idea.id === 'thenAndNow' && (
              <ThenAndNowFlow photos={photos} selectedIds={selectedIds} onChange={setSelectedIds} />
            )}
            {def.creationType === 'photo-based' && idea.id === 'festivalFirsts' && (
              <FestivalConfirmFlow photos={photos} selectedIds={selectedIds} onChange={setSelectedIds} />
            )}
            {def.creationType === 'photo-based' && idea.id !== 'thenAndNow' && idea.id !== 'festivalFirsts' && (
              <PhotoSelection
                photos={photos}
                selectedIds={selectedIds}
                onChange={(ids) => {
                  trackIdeaStudio('photo_start', { ideaId: idea.id, creationType: def.creationType });
                  setSelectedIds(ids);
                }}
                min={minPhotos}
                max={maxPhotos}
                title={def.cta}
                hint={def.emotionalDescription}
                onUpload={uploadPhoto ? handleUpload : undefined}
                uploading={uploading}
                uploadError={uploadError}
              />
            )}

            {def.creationType === 'milestone-based' && (
              <>
                <MilestoneFlow entries={milestoneEntries} onChange={setMilestoneEntries} />
                <PhotoSelection
                  photos={photos}
                  selectedIds={selectedIds}
                  onChange={setSelectedIds}
                  min={0}
                  max={4}
                  title="Optional milestone photos"
                />
              </>
            )}

            {def.creationType === 'family-based' && (
              <FamilyConstellationFlow
                photos={photos}
                selectedIds={selectedIds}
                onChange={setSelectedIds}
                blessingCount={blessingCount}
              />
            )}

            {def.creationType === 'text-based' && (
              <LetterFlow
                birthDate={birthDate}
                babyProfileId={babyProfileId}
                onDone={() => {
                  trackIdeaStudio('saved', { ideaId: idea.id, creationType: def.creationType });
                  setStep('done');
                  setResult({ status: 'saved', message: 'Letter saved to your time capsule.' });
                }}
              />
            )}

            {error && <p className="idea-photo-select__error" role="alert">{error}</p>}

            {def.creationType !== 'text-based' && (
              <div className="idea-creation-modal__actions">
                <button
                  type="button"
                  className="baby-book-btn baby-book-btn--primary"
                  disabled={!canSubmit}
                  onClick={() => {
                    trackIdeaStudio('photo_done', { ideaId: idea.id, creationType: def.creationType });
                    startCreate();
                  }}
                >
                  Start book creation
                </button>
                <button type="button" className="baby-book-btn baby-book-btn--ghost" onClick={onClose}>
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default IdeaCreationFlow;