import { PAGE_TYPE_LABELS } from '../../../utils/storyGeneration';

function StoryPreviewPanel({ story, activeLanguage, languageVariants, hasVoiceProfile }) {
  if (!story) return null;

  const variant = languageVariants?.[activeLanguage]
    ?? (story.language_variants?.[activeLanguage])
    ?? { title: story.title, pages: story.pages };

  const pages = variant?.pages || story.pages || [];

  return (
    <section className="baby-book-studio__section baby-book-glass" aria-labelledby="story-preview-heading">
      <h3 id="story-preview-heading" className="baby-book-studio__section-title">Your chapter</h3>
      <p className="baby-book-story-preview__title">{variant.title || story.title}</p>

      <div className="baby-book-story-pages">
        {pages.map((page, i) => (
          <article key={i} className="baby-book-story-page">
            <span className="baby-book-story-page__label">
              {PAGE_TYPE_LABELS[page.type] || 'Page'}
            </span>
            <p className={`baby-book-story-text${page.type === 'opening' ? ' baby-book-story-text--opening' : ''}`}>
              {page.type === 'opening' ? <em>{page.text}</em> : page.text}
            </p>
            {page.culturalCaption && (
              <p className="baby-book-story-page__caption">
                Cultural idiom: <em>{page.culturalCaption}</em>
              </p>
            )}
          </article>
        ))}
      </div>

      <button
        type="button"
        className="baby-book-btn baby-book-btn--ghost"
        disabled={!hasVoiceProfile}
        title={hasVoiceProfile ? 'Play narration preview' : 'Record your voice first'}
      >
        {hasVoiceProfile ? 'Listen (preview)' : 'Listen — record your voice first'}
      </button>
    </section>
  );
}

export default StoryPreviewPanel;
