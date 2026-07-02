import { useState } from 'react';
import DiyCardImage from './DiyCardImage';
import DetailModal from './DetailModal';
import DiyActivityModalBody from './DiyActivityModalBody';
import { diyCategoryConfig, difficultyDots } from './diyCategoryConfig';
import { interact } from '../utils/haptics';
import Icon from './Icon';

function DIYActivityCard({ activity, onOpen, onClose, isOpen, compact = false }) {
  const cat = diyCategoryConfig[activity.category] || diyCategoryConfig.sensory;
  const previewMaterials = activity.materials.slice(0, compact ? 1 : 2);
  const extraMaterials = activity.materials.length - previewMaterials.length;

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
        image={<DiyCardImage activity={activity} />}
      />
    </DetailModal>
  );

  if (compact) {
    return (
      <>
        <article
          className="content-card diy-activity-card diy-activity-card--compact card-accent-top"
          style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
        >
          <div className="content-card-body">
            <span className="diy-cat-badge" style={{ background: cat.bg, color: cat.color }}>
              <Icon name={cat.icon} size={14} /> {cat.label}
            </span>
            <h4 className="content-card-title">{activity.name}</h4>
            <div className="content-card-meta">
              <span className="diy-duration"><Icon name="stopwatch" size={14} /> {activity.duration}</span>
            </div>
            <p className="content-card-preview">{activity.benefits[0]}</p>
            <div className="diy-preview-card__actions">
              <button type="button" className="content-card-cta" onClick={open}>
                Open guide
              </button>
            </div>
          </div>
        </article>
        {modalContent}
      </>
    );
  }

  return (
    <>
      <article
        className="content-card diy-activity-card card-accent-top card-hover-lift"
        style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
      >
        <div className="content-card-media diy-activity-media">
          <DiyCardImage activity={activity} />
        </div>
        <div className="content-card-body">
          <span className="diy-cat-badge" style={{ background: cat.bg, color: cat.color }}>
            <Icon name={cat.icon} size={16} /> {cat.label}
          </span>
          <h4 className="content-card-title">{activity.name}</h4>
          <div className="content-card-meta">
            <span className="diy-duration"><Icon name="stopwatch" size={14} /> {activity.duration}</span>
            <span className="diy-difficulty" aria-label={`Difficulty: ${activity.difficulty}`}>
              {Array.from({ length: 3 }).map((_, i) => (
                <span
                  key={i}
                  className={`diff-dot ${i < difficultyDots[activity.difficulty] ? 'filled' : ''}`}
                />
              ))}
            </span>
          </div>
          <div className="diy-materials content-card-chips">
            {previewMaterials.map((m, i) => (
              <span key={i} className="diy-material-chip">{m}</span>
            ))}
            {extraMaterials > 0 && (
              <span className="diy-material-chip diy-material-more">+{extraMaterials}</span>
            )}
          </div>
          <p className="content-card-preview">{activity.benefits[0]}</p>
          <button type="button" className="content-card-cta" onClick={open}>
            Open guide
          </button>
        </div>
      </article>
      {modalContent}
    </>
  );
}

export default DIYActivityCard;
