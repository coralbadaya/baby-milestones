import { useState } from 'react';
import { getDiyImage } from '../data/diyImages';
import { useDiyImagesContext } from '../context/DiyImagesContext';
import DetailModal from './DetailModal';
import { diyCategoryConfig, difficultyDots } from './diyCategoryConfig';
import { interact } from '../utils/haptics';
import Icon from './Icon';
import ActivityIllustration from './ActivityIllustration';

function DiyEditorialImage({ activity, variant = 'split', loading = 'lazy' }) {
  const { overrides } = useDiyImagesContext();
  const config = getDiyImage(
    { activityId: activity.id, illustration: activity.illustration, category: activity.category },
    overrides,
  );
  const [failed, setFailed] = useState(false);
  const showPhoto = config.src && !failed;

  return (
    <div
      className={`diy-editorial-card__media diy-editorial-card__media--${variant}`}
      style={!showPhoto ? { background: config.fallbackGradient } : { backgroundColor: config.placeholderColor }}
    >
      {showPhoto && (
        <img
          src={config.src}
          alt={config.alt}
          loading={loading}
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

function DIYEditorialCard({
  activity,
  onOpen,
  onClose,
  isOpen,
  variant = 'split',
  imageLoading = 'lazy',
}) {
  const cat = diyCategoryConfig[activity.category] || diyCategoryConfig.sensory;

  const open = () => {
    onOpen(activity.id);
    interact('tap', 'selection');
  };

  const openVideo = (e) => {
    e.stopPropagation();
    e.preventDefault();
    interact('tap', 'selection');
    window.open(activity.videoSearch, '_blank', 'noopener,noreferrer');
  };

  const modalContent = isOpen && (
    <DetailModal
      title={activity.name}
      subtitle={`${cat.label} · ${activity.duration} · ${activity.difficulty}`}
      onClose={onClose}
    >
      <div className="diy-illustration-wrap">
        <ActivityIllustration type={activity.illustration} />
      </div>
      <div className="diy-section">
        <h5 className="diy-section-title"><Icon name="shopping-cart" size={16} /> What You Need</h5>
        <div className="diy-materials">
          {activity.materials.map((m, i) => (
            <span key={i} className="diy-material-chip">{m}</span>
          ))}
        </div>
      </div>
      <div className="diy-section">
        <h5 className="diy-section-title"><Icon name="clipboard" size={16} /> How To Play</h5>
        <ol className="diy-steps">
          {activity.steps.map((step, i) => (
            <li key={i}>
              <span className="step-num">{i + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>
      <div className="diy-two-col">
        <div className="diy-section">
          <h5 className="diy-section-title"><Icon name="check-mark" size={16} /> Benefits</h5>
          <ul className="diy-benefits">
            {activity.benefits.map((b, i) => (
              <li key={i}>{b}</li>
            ))}
          </ul>
        </div>
        <div className="diy-section diy-why">
          <h5 className="diy-section-title"><Icon name="microscope" size={16} /> Why It Works</h5>
          <p>{activity.whyItWorks}</p>
        </div>
      </div>
      <button type="button" className="diy-video-btn" onClick={openVideo}>
        <Icon name="youtube" size={18} className="yt-icon" />
        Watch How-To Videos on YouTube
      </button>
    </DetailModal>
  );

  const body = (
    <div className="diy-editorial-card__body">
      <span className="diy-cat-badge" style={{ background: cat.bg, color: cat.color }}>
        <Icon name={cat.icon} size={14} /> {cat.label}
      </span>
      <h3 className="diy-editorial-card__title font-display">{activity.name}</h3>
      <div className="diy-editorial-card__meta">
        <span className="diy-duration"><Icon name="stopwatch" size={14} /> {activity.duration}</span>
        {variant === 'stack' && (
          <span className="diy-difficulty" aria-label={`Difficulty: ${activity.difficulty}`}>
            {Array.from({ length: 3 }).map((_, i) => (
              <span
                key={i}
                className={`diff-dot ${i < difficultyDots[activity.difficulty] ? 'filled' : ''}`}
              />
            ))}
          </span>
        )}
      </div>
      <p className="diy-editorial-card__preview">{activity.benefits[0]}</p>
      <div className="diy-editorial-card__actions">
        <button type="button" className="content-card-cta" onClick={open}>
          Open guide
        </button>
        <button type="button" className="diy-preview-card__video" onClick={openVideo}>
          <Icon name="youtube" size={16} className="yt-icon-brand" />
          YouTube
        </button>
      </div>
    </div>
  );

  return (
    <>
      <article
        className={`diy-editorial-card diy-editorial-card--${variant} card-accent-top card-hover-lift`}
        style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
      >
        {variant === 'split' ? (
          <>
            <DiyEditorialImage activity={activity} variant="split" loading={imageLoading} />
            {body}
          </>
        ) : (
          <>
            <DiyEditorialImage activity={activity} variant="stack" loading={imageLoading} />
            {body}
          </>
        )}
      </article>
      {modalContent}
    </>
  );
}

export default DIYEditorialCard;
