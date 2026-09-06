import { interact } from '../../utils/haptics';
import ShareButton from './ShareButton';
import Icon from '../Icon';
import { communityItemUrl } from '../../utils/communityUrls';

const CATEGORY_ICONS = {
  health: 'stethoscope',
  sleep: 'crescent-moon',
  feeding: 'baby-bottle',
  play: 'balloon',
};

function TipCard({ tip, helpfulCount = 0, onHelpful, expanded = false, highlighted = false, onToggleExpand }) {
  const paragraphs = tip.content.split('\n\n');

  const handleHelpful = () => {
    interact('check', 'light');
    onHelpful?.(tip.id);
  };

  return (
    <article
      id={`community-tip-${tip.id}`}
      className={`content-card tip-card card-accent-top${highlighted ? ' tip-card--permalink' : ''}`}
      style={{ '--cat-color': 'var(--lavender-dark)' }}
    >
      <header className="tip-card-header">
        <span className="tip-category">
          <Icon name={CATEGORY_ICONS[tip.category] ?? 'light-bulb'} size={16} />
          {tip.category}
        </span>
        <span className="tip-age">{tip.ageRange}</span>
      </header>

      <h3 className="tip-card-title">{tip.title}</h3>
      <p className="tip-card-preview">{tip.preview}</p>

      {tip.tags?.length > 0 && (
        <div className="memory-tags tip-card-tags">
          {tip.tags.map((tag) => (
            <span key={tag} className="memory-tag">#{tag}</span>
          ))}
        </div>
      )}

      {expanded && (
        <div className="tip-card-body">
          {paragraphs.map((p, i) => (
            <p key={i} className="tip-paragraph">{p}</p>
          ))}
          <p className="tip-tagline">{tip.tagline}</p>
        </div>
      )}

      <footer className="tip-card-footer">
        <button
          type="button"
          className="tip-expand-btn"
          onClick={() => {
            interact('tap', 'light');
            onToggleExpand?.();
          }}
        >
          {expanded ? 'Show less' : 'Read tip'}
        </button>
        <button type="button" className="tip-helpful-btn" onClick={handleHelpful}>
          <Icon name="thumbs-up" size={16} /> Helpful{helpfulCount > 0 ? ` (${helpfulCount})` : ''}
        </button>
      </footer>

      {expanded && (
        <div className="tip-share-row">
          <ShareButton
            title={tip.title}
            text={`${tip.preview} — ${tip.tagline}`}
            url={communityItemUrl('tips', tip.id)}
            label="Share this tip"
          />
        </div>
      )}
    </article>
  );
}

export default TipCard;
