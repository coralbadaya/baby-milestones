import { Link, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import Icon from '../components/Icon';
import PageBreadcrumb from '../components/PageBreadcrumb';
import StructuredData from '../components/StructuredData';
import { getGuideBySlug } from '../data/guides';
import { guideThemeClassName, resolveGuideTheme } from '../data/guideThemes';
import { tagLabel, tagsForGuide } from '../data/guideTags';
import { useGuideTagOverrides } from '../hooks/useGuideTagOverrides';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import GuideStoryCta from '../components/book/GuideStoryCta';
import GuideQuickLinks from '../components/GuideQuickLinks';
import GuideFaqSection from '../components/GuideFaqSection';
import { articleSchema, breadcrumbSchema, faqSchema } from '../utils/structuredData';
import { trackEvent } from '../utils/analytics';
import { guideRichText } from '../utils/guideRichText';
import NotFound from './NotFound';

function GuideArticle() {
  const { slug } = useParams();
  const guide = getGuideBySlug(slug);
  const pathname = guide ? ROUTES.guide(guide.slug) : undefined;

  usePageMeta({
    title: guide?.title,
    description: guide?.description,
    type: 'article',
    path: pathname,
  });

  const { overrides } = useGuideTagOverrides();
  const guideSlug = guide?.slug;
  useEffect(() => {
    if (!guideSlug) return undefined;
    trackEvent('guide_view', { guide_slug: guideSlug });
    return undefined;
  }, [guideSlug]);

  if (!guide) return <NotFound />;

  const related = (guide.relatedSlugs || [])
    .map((s) => getGuideBySlug(s))
    .filter(Boolean);
  const theme = resolveGuideTheme(guide, overrides);

  return (
    <article className={`content-page guide-article fade-in ${guideThemeClassName(theme)}`}>
      <PageBreadcrumb
        items={[
          { name: 'Home', to: ROUTES.home },
          { name: 'Guides', to: ROUTES.guides },
        ]}
      />

      <header className="content-page-hero guide-article__hero-band">
        <Icon name={guide.icon} size={40} className="content-page-icon" />
        <div className="guide-card-tags">
          {tagsForGuide(guide, overrides).map((id) => (
            <Link
              key={id}
              to={`${ROUTES.guides}?tag=${id}`}
              className="guide-tag"
              data-tag={id}
              onClick={() => interact('tap', 'light')}
            >
              {tagLabel(id)}
            </Link>
          ))}
        </div>
        <h1>{guide.title}</h1>
        <div className="guide-byline">
          <p className="guide-byline__credit">
            By {guide.author} · Reviewed by {guide.reviewedBy}
          </p>
          <div className="guide-byline__row">
            <time className="guide-byline__date" dateTime={guide.updated}>
              Updated {guide.updated}
            </time>
            <span className="guide-byline__read">{guide.readMinutes} min read</span>
          </div>
        </div>
        <p className="content-page-intro">{guideRichText(guide.intro)}</p>
        <GuideQuickLinks guide={guide} />
      </header>

      <div className="content-page-body">
        {guide.body.map((block, i) => (
          <section key={block.heading || i} className="content-block">
            {block.heading && <h2>{block.heading}</h2>}
            {block.paragraphs?.map((p, j) => (
              <p key={j}>{guideRichText(p)}</p>
            ))}
            {block.list && (
              <ul>
                {block.list.map((item, j) => (
                  <li key={j}>{guideRichText(item)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

      <GuideFaqSection faqs={guide.faqs} />

      <GuideStoryCta month={guide.milestoneMonth} />

      <div className="guide-disclaimer" role="note">
        <Icon name="medical" size={24} />
        <p>
          Educational information only — not a substitute for professional medical advice. Always
          consult your pediatrician or obstetric provider. See our{' '}
          <Link to={ROUTES.medicalDisclaimer}>medical disclaimer</Link>.
        </p>
      </div>

      {related.length > 0 && (
        <aside className="guide-related">
          <h2>Keep reading</h2>
          <div className="guides-grid">
            {related.map((r) => (
              <Link
                key={r.slug}
                to={ROUTES.guide(r.slug)}
                className="guide-card"
                onClick={() => interact('tap', 'light')}
              >
                <div className="guide-card-icon">
                  <Icon name={r.icon} size={24} />
                </div>
                <h3 className="guide-card-title">{r.title}</h3>
                <span className="guide-card-meta">{r.readMinutes} min read</span>
              </Link>
            ))}
          </div>
        </aside>
      )}

      <StructuredData id={`article-${guide.slug}`} data={articleSchema(guide, pathname)} />
      {guide.faqs?.length ? (
        <StructuredData id={`faq-${guide.slug}`} data={faqSchema(guide.faqs)} />
      ) : null}
      <StructuredData
        id={`breadcrumb-${guide.slug}`}
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'Guides', path: ROUTES.guides },
          { name: guide.title, path: pathname },
        ])}
      />
    </article>
  );
}

export default GuideArticle;
