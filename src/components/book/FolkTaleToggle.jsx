import { FOLK_TALE_TEMPLATES } from '../../data/folkTaleTemplates';
import { getFolkBeatLabels } from '../../utils/storyGeneration';

const TEMPLATE_DESCRIPTIONS = {
  moonJourney: 'A gentle night journey toward the moon — wonder without fear.',
  braveLittleOne: 'Small courage, kind helpers, and a celebration at home.',
  riverCrossing: 'Stepping stones, a patient river, and friends on the other side.',
  starGift: 'Twilight whispers and a gift that glows until morning.',
  sleepingForest: 'When the forest rests, dreams carry the sweetest lullaby.',
};

function FolkTaleToggle({ enabled, onChange, selectedTemplateId, onTemplateChange }) {
  const selected = FOLK_TALE_TEMPLATES.find((t) => t.id === selectedTemplateId);
  const beatLabels = selected ? getFolkBeatLabels(selected.beatStructure) : [];

  return (
    <section className="baby-book-studio__section baby-book-glass" aria-labelledby="story-folk-heading">
      <h3 id="story-folk-heading" className="baby-book-studio__section-title">Folk-tale mode</h3>

      <label className="baby-book-toggle">
        <input
          type="checkbox"
          checked={enabled}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span>
          <strong>Enable folk-tale structure</strong>
          <span className="baby-book-studio__section-sub">
            Inspired by folk traditions worldwide — an original Nestbean story.
          </span>
        </span>
      </label>

      {enabled && (
        <>
          <div className="baby-book-pill-row">
            {FOLK_TALE_TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`baby-book-pill${selectedTemplateId === t.id ? ' baby-book-pill--active' : ''}`}
                onClick={() => onTemplateChange(t.id)}
              >
                {t.title}
              </button>
            ))}
          </div>

          {selected && (
            <div className="baby-book-folk-detail">
              <p className="baby-book-section-sub">
                {TEMPLATE_DESCRIPTIONS[selected.id] || 'An original chapter shaped by timeless story beats.'}
              </p>
              {beatLabels.length > 0 && (
                <ol className="baby-book-folk-beats">
                  {beatLabels.map((label, i) => (
                    <li key={label}>
                      <span className="baby-book-folk-beats__num">{i + 1}</span>
                      {label}
                    </li>
                  ))}
                </ol>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}

export default FolkTaleToggle;
