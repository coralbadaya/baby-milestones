import { useEffect, useState } from 'react';
import Icon from '../Icon';
import { interact } from '../../utils/haptics';
import { getFirstById } from '../../data/firsts';

function FirstMomentCapture({
  firstId,
  moment,
  onSaveNote,
  onRemove,
  onClose,
  error,
}) {
  const first = getFirstById(firstId);
  const [note, setNote] = useState(moment?.note || '');

  useEffect(() => {
    setNote(moment?.note || '');
  }, [firstId, moment?.note]);

  if (!first) return null;

  const hasMedia = moment?.photoDataUrl || moment?.videoDataUrl;

  const handleSaveNote = () => {
    interact('tap', 'light');
    onSaveNote(firstId, note);
  };

  const handleRemove = () => {
    interact('tap', 'light');
    onRemove(firstId);
    onClose();
  };

  return (
    <div className="first-moment-capture" role="dialog" aria-modal="true" aria-labelledby="first-capture-title">
      <div className="first-moment-capture__backdrop" onClick={onClose} aria-hidden="true" />
      <div className="first-moment-capture__panel card-accent-top">
        <button type="button" className="first-moment-capture__close" onClick={onClose} aria-label="Close">
          <Icon name="close" size={20} />
        </button>

        <h2 id="first-capture-title" className="first-moment-capture__title font-display">
          {first.label}
        </h2>

        {hasMedia && (
          <div className="first-moment-capture__preview">
            {moment.photoDataUrl && (
              <img src={moment.photoDataUrl} alt={first.label} className="first-moment-capture__media" />
            )}
            {moment.videoDataUrl && !moment.photoDataUrl && (
              <video src={moment.videoDataUrl} controls className="first-moment-capture__media" />
            )}
          </div>
        )}

        <label className="first-moment-capture__note-label" htmlFor="first-moment-note">
          Note (optional)
        </label>
        <textarea
          id="first-moment-note"
          className="first-moment-capture__note"
          rows={3}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="A line you'll want to remember…"
        />

        {error && <p className="first-moment-capture__error" role="alert">{error}</p>}

        <div className="first-moment-capture__actions">
          <button type="button" className="btn-primary" onClick={handleSaveNote}>
            Save note
          </button>
          {hasMedia && (
            <button type="button" className="btn-ghost first-moment-capture__remove" onClick={handleRemove}>
              Remove photo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default FirstMomentCapture;
