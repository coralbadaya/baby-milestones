import Icon from '../Icon';
import GuideFaqSection from '../GuideFaqSection';
import { guideThemeClassName, resolveGuideTheme } from '../../data/guideThemes';
import { tagLabel, tagsForGuide } from '../../data/guideTags';
import { ROUTES } from '../../routes';

/**
 * Live consumer chrome for staff — same theme classes as `/guides/:slug`.
 * @param {{ guide: import('../../data/guidesBase.js').Guide & { faqs?: { q: string, a: string }[] } }} props
 */
function AdminGuideThemePreview({ guide }) {
  const theme = resolveGuideTheme(guide);
  const tags = tagsForGuide(guide);
  const previewFaqs = guide.faqs?.slice(0, 2) || [
  { q: 'Sample question for contrast check?', a: 'Accordion chevron and answer text use theme accent colors.' },
  ];
  const bodyBlock = guide.body?.[0];

  return (
    <div className="admin-guide-theme-preview">
      <dl className="admin-guide-theme-preview__meta">
        <div>
          <dt>Theme</dt>
          <dd>
            <span
              className="admin-guide-theme-preview__swatch"
              style={{ background: theme.surface, borderColor: theme.accent }}
            />
            {theme.label}
            {' '}
            <code className="admin-guide-theme-preview__code">{guideThemeClassName(theme)}</code>
          </dd>
        </div>
        <div>
          <dt>Primary tag</dt>
          <dd>{tags.map((id) => tagLabel(id)).join(', ') || '—'}</dd>
        </div>
        <div>
          <dt>Live URL</dt>
          <dd>
            <a href={ROUTES.guide(guide.slug)} target="_blank" rel="noreferrer">
              {ROUTES.guide(guide.slug)}
            </a>
          </dd>
        </div>
      </dl>

      <div className="admin-guide-theme-preview__stage" aria-label="Guide article preview">
        <article className={`content-page guide-article guide-article--preview ${guideThemeClassName(theme)}`}>
          <header className="content-page-hero guide-article__hero-band">
            <Icon name={guide.icon} size={32} className="content-page-icon" />
            <div className="guide-card-tags">
              {tags.slice(0, 2).map((id) => (
                <span key={id} className="guide-tag">
                  {tagLabel(id)}
                </span>
              ))}
            </div>
            <h1>{guide.title}</h1>
            <p className="guide-byline">
              Preview ·
              {' '}
              {guide.readMinutes}
              {' '}
              min read
            </p>
            <p className="content-page-intro">{guide.intro}</p>
          </header>

          <div className="content-page-body">
            {bodyBlock ? (
              <section className="content-block">
                {bodyBlock.heading ? <h2>{bodyBlock.heading}</h2> : null}
                {bodyBlock.paragraphs?.[0] ? <p>{bodyBlock.paragraphs[0]}</p> : null}
              </section>
            ) : (
              <section className="content-block">
                <h2>Body preview</h2>
                <p>Section headings and copy inherit the theme surface band and accent rule.</p>
              </section>
            )}
          </div>

          <GuideFaqSection faqs={previewFaqs} heading="FAQ preview" />
        </article>
      </div>
    </div>
  );
}

export default AdminGuideThemePreview;