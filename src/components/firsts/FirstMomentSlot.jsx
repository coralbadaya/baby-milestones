import { useRef } from 'react';
import Icon from '../Icon';
import { interact } from '../../utils/haptics';

function FirstMomentSlot({
  firstId,
  label,
  moment,
  size = 'md',
  onSelectFile,
  onOpenDetail,
}) {
  const inputRef = useRef(null);
  const hasPhoto = Boolean(moment?.photoDataUrl);
  const hasVideo = Boolean(moment?.videoDataUrl);
  const filled = hasPhoto || hasVideo;

  const openPicker = () => {
    interact('tap', 'light');
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) onSelectFile(firstId, file);
  };

  const handleClick = () => {
    if (filled && onOpenDetail) {
      interact('tap', 'light');
      onOpenDetail(firstId);
    } else {
      openPicker();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className={`first-moment-slot first-moment-slot--${size}`}>
      <button
        type="button"
        className={`first-moment-slot__frame${filled ? ' first-moment-slot__frame--filled' : ''}`}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        aria-label={filled ? `View ${label}` : `Add photo for ${label}`}
      >
        {hasPhoto && (
          <img src={moment.photoDataUrl} alt="" className="first-moment-slot__media" />
        )}
        {hasVideo && !hasPhoto && (
          <video
            src={moment.videoDataUrl}
            className="first-moment-slot__media"
            muted
            playsInline
            preload="metadata"
          />
        )}
        {!filled && (
          <span className="first-moment-slot__empty">
            <Icon name="camera" size={size === 'lg' ? 28 : 22} />
          </span>
        )}
        {hasVideo && (
          <span className="first-moment-slot__video-badge" aria-hidden="true">
            <Icon name="play" size={14} />
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        className="first-moment-slot__input"
        tabIndex={-1}
        aria-hidden
        onChange={handleChange}
      />
    </div>
  );
}

export default FirstMomentSlot;
