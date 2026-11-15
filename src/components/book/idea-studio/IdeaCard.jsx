import { Link } from 'react-router-dom';
import { useEntitlements } from '../../../hooks/useEntitlements';
import { getBookIdeaDefinition } from '../../../data/bookIdeasConfig';
import { ROUTES } from '../../../routes';

function IdeaPreviewArt({ idea, definition }) {
  const previewClass = definition?.previewClass || 'idea-preview--default';
  const initial = (idea.title || 'Book')[0];

  return (
    <div className={`idea-card__visual ${previewClass}`} aria-hidden="true">
      <span className="idea-card__visual-page idea-card__visual-page--back" />
      <span className="idea-card__visual-page idea-card__visual-page--front">
        <span className="idea-card__visual-initial">{initial}</span>
      </span>
    </div>
  );
}

function IdeaCard({
  idea,
  onPrimaryAction,
  onCta,
  generating = false,
  compact = false,
}) {
  const { isPlus } = useEntitlements();
  const definition = getBookIdeaDefinition(idea.id) || {};
  const min = definition.suggestedPhotoCount?.min;
  const photoLabel = definition.creationType === 'text-based'
    ? 'No photos needed'
    : idea.photoCount > 0
      ? `${idea.photoCount} in your album`
      : min
        ? `From ${min} photos`
        : 'Add photos to start';

  const cta = definition.cta || 'Open';
  const plusRequired = idea.id !== 'letterAt18' && !isPlus;

  const open = () => {
    if (plusRequired) return;
    onPrimaryAction?.(idea);
    onCta?.(idea);
  };

  const body = (
    <div className={`idea-card baby-book-glass${compact ? ' idea-card--compact' : ''}`}>
      <IdeaPreviewArt idea={idea} definition={definition} />
      <div className="idea-card__body">
        <div className="idea-card__meta">
          <span className="idea-card__category">{definition.category || idea.tagLine}</span>
          {idea.autoDetected && (
            <span className="idea-card__badge">Suggested</span>
          )}
          {idea.savedStatus && (
            <span className="idea-card__badge idea-card__badge--saved">{idea.savedStatus}</span>
          )}
        </div>
        <h3 className="idea-card__title">{idea.title}</h3>
        <p className="idea-card__desc">{definition.emotionalDescription || idea.description}</p>

        {definition.aiCapabilities?.length > 0 && (
          <ul className="idea-card__ai">
            {definition.aiCapabilities.slice(0, 3).map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}

        <p className="idea-card__requirements">{photoLabel}</p>

        <span className="idea-card__cta baby-book-btn baby-book-btn--primary" role="presentation">
          {generating === idea.id ? 'Working…' : cta}
        </span>
      </div>
    </div>
  );

  if (plusRequired) {
    return (
      <div className="baby-book-gate idea-card-gate">
        <div className="baby-book-gate__blur">{body}</div>
        <div className="baby-book-gate__overlay">
          <p>AI layouts on Plus</p>
          <Link to={ROUTES.premium} className="baby-book-btn">Upgrade</Link>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      className="idea-card-hit"
      onClick={open}
      disabled={generating === idea.id}
      aria-label={`${idea.title} — ${cta}`}
    >
      {body}
    </button>
  );
}

export default IdeaCard;