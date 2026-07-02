import { useState } from 'react';
import { STORY_LANGUAGES } from '../../constants/storyLanguages';
import { PAGE_TYPE_LABELS } from '../../utils/storyGeneration';

function LanguageSwitchDemo({
  languageVariants,
  activeLanguage,
  onLanguageChange,
  hasVoiceProfile = false,
}) {
  const [showAllLanguages, setShowAllLanguages] = useState(false);
  const variant = languageVariants?.[activeLanguage];
  const visibleLanguages = showAllLanguages ? STORY_LANGUAGES : STORY_LANGUAGES.slice(0, 6);
  const hiddenCount = STORY_LANGUAGES.length - 6;

  return (
    <section className="baby-book-studio__section baby-book-glass" aria-labelledby="story-lang-heading">
      <h3 id="story-lang-heading" className="baby-book-studio__section-title">Language preview</h3>
      <p className="baby-book-section-sub baby-book-studio__section-sub">
        Tap a language — the same story retells itself natively, not translated.
      </p>

      {variant?.title && (
        <p className="baby-book-story-preview__title">{variant.title}</p>
      )}

      <div className="baby-book-pill-row" role="tablist" aria-label="Story language">
        {visibleLanguages.map((lang) => (
          <button
            key={lang.code}
            type="button"
            role="tab"
            aria-selected={activeLanguage === lang.code}
            className={`baby-book-pill${activeLanguage === lang.code ? ' baby-book-pill--active' : ''}`}
            onClick={() => onLanguageChange(lang.code)}
          >
            {lang.nativeLabel}
          </button>
        ))}
      </div>

      {hiddenCount > 0 && (
        <button
          type="button"
          className="baby-book-studio__link baby-book-lang-expand"
          onClick={() => setShowAllLanguages((v) => !v)}
        >
          {showAllLanguages ? 'Show fewer languages' : `Show all ${STORY_LANGUAGES.length} languages`}
        </button>
      )}

      {variant?.pages?.map((page, i) => (
        <article key={i} className="baby-book-story-page baby-book-story-page--compact">
          {i > 0 && <hr className="baby-book-story-page__divider" aria-hidden="true" />}
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

      <button
        type="button"
        className="baby-book-btn baby-book-btn--ghost baby-book-lang-listen"
        disabled={!hasVoiceProfile}
        title={hasVoiceProfile ? 'Play narration preview' : 'Record your voice first'}
      >
        {hasVoiceProfile ? 'Listen (preview)' : 'Listen — record your voice first'}
      </button>
    </section>
  );
}

export default LanguageSwitchDemo;
