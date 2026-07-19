import { useRef, useState } from 'react';
import Icon from '../Icon';
import ImageWithFallback from '../ImageWithFallback';
import PremiumGate from '../PremiumGate';
import { PREMIUM_FEATURES } from '../../constants/premium';
import { BRAND_WATERMARK_SRC } from '../../constants/brandAssets';
import { interact } from '../../utils/haptics';
import useMonthlyAlbum from '../../hooks/useMonthlyAlbum';

function MonthlyAlbumSection({ currentMonth = 1 }) {
  const fileRef = useRef(null);
  const { photos, quota, isPlus, uploadPhoto, error } = useMonthlyAlbum(currentMonth);
  const [caption, setCaption] = useState('');
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState(null);

  const onPick = () => fileRef.current?.click();

  const onFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setBusy(true);
    setLocalError(null);
    interact('tap', 'light');
    try {
      await uploadPhoto(file, caption);
      setCaption('');
    } catch (err) {
      setLocalError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="monthly-album">
      <p className="monthly-album__quota">
        {isPlus
          ? 'Unlimited HD photos on Plus'
          : `${quota.remaining} of ${quota.limit} photos left this month`}
      </p>

      <PremiumGate feature={PREMIUM_FEATURES.hdPhotos} compact={!quota.canUpload && !isPlus}>
        <div className="monthly-album__upload">
          <label className="monthly-album__caption">
            <span>Caption (optional)</span>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Month {currentMonth} moment"
            />
          </label>
          <button type="button" className="btn-primary" disabled={busy} onClick={onPick}>
            <Icon name="camera" size={18} />
            Add photo
          </button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
        </div>
      </PremiumGate>

      {(error || localError) && <p className="auth-error" role="alert">{error || localError}</p>}

      <div className="monthly-album__grid">
        {photos.length === 0 ? (
          <p className="monthly-album__empty">Your monthly album is empty — add up to two photos free.</p>
        ) : (
          photos.map((photo) => (
            <figure key={photo.id} className="monthly-album__item card-accent-top">
              <ImageWithFallback
                src={photo.data_url}
                alt={photo.caption || 'Album photo'}
                watermarkSrc={!isPlus ? BRAND_WATERMARK_SRC : undefined}
                className="monthly-album__image"
              />
              {photo.caption && <figcaption>{photo.caption}</figcaption>}
            </figure>
          ))
        )}
      </div>
    </div>
  );
}

export default MonthlyAlbumSection;
