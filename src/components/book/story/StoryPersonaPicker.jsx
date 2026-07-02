import PremiumGate from '../../PremiumGate';
import { PREMIUM_FEATURES } from '../../../constants/premium';
import { STORY_ART_STYLES, STORY_PERSONAS } from '../../../utils/storyGeneration';

function StoryPersonaPicker({
  persona,
  artStyle,
  onPersonaChange,
  onArtStyleChange,
  isPlus,
}) {
  const content = (
    <section className="baby-book-studio__section baby-book-glass" aria-labelledby="story-persona-heading">
      <h3 id="story-persona-heading" className="baby-book-studio__section-title">Story voice & art</h3>
      <p className="baby-book-section-sub baby-book-studio__section-sub">
        Pick a narrator tone and illustration style for this chapter.
      </p>

      <p className="baby-book-studio__field-label">Narrator</p>
      <div className="baby-book-pill-row">
        {STORY_PERSONAS.map((p) => (
          <button
            key={p.id}
            type="button"
            className={`baby-book-pill${persona === p.id ? ' baby-book-pill--active' : ''}`}
            onClick={() => onPersonaChange(p.id)}
            title={p.desc}
          >
            {p.label}
          </button>
        ))}
      </div>

      <p className="baby-book-studio__field-label">Art style</p>
      <div className="baby-book-pill-row">
        {STORY_ART_STYLES.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`baby-book-pill${artStyle === s.id ? ' baby-book-pill--active' : ''}`}
            onClick={() => onArtStyleChange(s.id)}
            title={s.desc}
          >
            {s.label}
          </button>
        ))}
      </div>
    </section>
  );

  if (isPlus) return content;

  return (
    <PremiumGate feature={PREMIUM_FEATURES.aiStory} compact>
      {content}
    </PremiumGate>
  );
}

export default StoryPersonaPicker;
