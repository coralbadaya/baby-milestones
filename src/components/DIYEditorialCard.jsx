import { useState } from 'react';
import DiyCardImage from './DiyCardImage';
import DetailModal from './DetailModal';
import DiyActivityModalBody from './DiyActivityModalBody';
import { diyCategoryConfig, difficultyDots } from './diyCategoryConfig';
import { interact } from '../utils/haptics';
import Icon from './Icon';

function DiyEditorialImage({ activity, variant = 'split', loading = 'lazy' }) {
  return (
    <div className={`diy-editorial-card__media diy-editorial-card__media--${variant}`}>
      <DiyCardImage activity={activity} loading={loading} />
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

  const modalContent = isOpen && (
    <DetailModal
      title={activity.name}
      subtitle={`${cat.label} · ${activity.duration} · ${activity.difficulty}`}
      onClose={onClose}
    >
      <DiyActivityModalBody
        activity={activity}
        image={<DiyEditorialImage activity={activity} variant="split" loading="eager" />}
      />
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
