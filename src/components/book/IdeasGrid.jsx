import { Link } from 'react-router-dom';
import { useEntitlements } from '../../hooks/useEntitlements';
import { PREMIUM_FEATURES } from '../../constants/premium';
import { ROUTES } from '../../routes';

const IDEA_SWATCHES = [
  'baby-book-idea-swatch--0',
  'baby-book-idea-swatch--1',
  'baby-book-idea-swatch--2',
  'baby-book-idea-swatch--3',
  'baby-book-idea-swatch--4',
  'baby-book-idea-swatch--5',
];

function BookIdeaCard({ idea, index, onGenerate, generating }) {
  const { isPlus } = useEntitlements();
  const countLabel = idea.id === 'letterAt18'
    ? 'Write yours'
    : idea.photoCount > 0
      ? `${idea.photoCount} photo${idea.photoCount === 1 ? '' : 's'} found`
      : 'Add photos to unlock';

  const handleClick = () => {
    if (!isPlus && idea.id !== 'letterAt18') return;
    onGenerate?.(idea);
  };

  const card = (
    <button
      type="button"
      className="baby-book-idea-card-v2 baby-book-glass"
      onClick={handleClick}
      disabled={generating === idea.id}
    >
      <span className={`baby-book-idea-card-v2__swatch ${IDEA_SWATCHES[index % IDEA_SWATCHES.length]}`}>
        {idea.emoji || '💡'}
      </span>
      <span className="baby-book-idea-card-v2__body">
        <span className="baby-book-idea-card-v2__head">
          <span className="baby-book-idea-card-v2__title">{idea.title}</span>
          <span className="baby-book-idea-card-v2__tag">{idea.tagLine || countLabel}</span>
        </span>
        <span className="baby-book-idea-card-v2__desc">{idea.description}</span>
        <span className="baby-book-idea-card-v2__cta">
          {idea.autoDetected ? 'Auto-detected · ' : ''}
          {countLabel}
          {' · Make this book →'}
        </span>
      </span>
    </button>
  );

  if (!isPlus && idea.id !== 'letterAt18') {
    return (
      <div className="baby-book-gate">
        <div className="baby-book-gate__blur">{card}</div>
        <div className="baby-book-gate__overlay">
          <p>One-tap AI layouts on Plus</p>
          <Link to={ROUTES.premium} className="baby-book-btn">Upgrade</Link>
        </div>
      </div>
    );
  }

  return card;
}

function IdeasGrid({ ideas, totalPhotoCount = 0, onGenerate, generating }) {
  return (
    <div className="baby-book-ideas">
      <p className="baby-book-ideas__eyebrow">Idea Studio</p>
      <h2 className="baby-book-section-title">Books hiding in your camera roll</h2>
      <p className="baby-book-section-sub">
        Nestbean studied your {totalPhotoCount || 'album'} photos. Each idea below is one tap from a finished keepsake — layout, cleanup, and captions handled.
      </p>
      <div className="baby-book-ideas__list">
        {ideas.map((idea, index) => (
          <BookIdeaCard
            key={idea.id}
            idea={idea}
            index={index}
            onGenerate={onGenerate}
            generating={generating}
          />
        ))}
      </div>
    </div>
  );
}

export default IdeasGrid;
