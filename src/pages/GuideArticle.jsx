import { Link, Navigate, useParams } from 'react-router-dom';
import Icon from '../components/Icon';
import StructuredData from '../components/StructuredData';
import { getGuideBySlug } from '../data/guides';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import GuideStoryCta from '../components/book/GuideStoryCta';
import { articleSchema, breadcrumbSchema } from '../utils/structuredData';

function GuideArticle() {
  const { slug } = useParams();
  const guide = getGuideBySlug(slug);

  usePageMeta({
    title: guide?.title,
    description: guide?.description,
    type: 'article',
  });

  if (!guide) return <Navigate to={ROUTES.guides} replace />;

  const related = (guide.relatedSlugs || [])
    .map((s) => getGuideBySlug(s))
    .filter(Boolean);
  const pathname = ROUTES.guide(guide.slug);

  return (
    <article className="content-page guide-article fade-in">
      <Link to={ROUTES.guides} className="guide-back" onClick={() => interact('tap', 'light')}>
        ← All guides
      </Link>

      <header className="content-page-hero">
        <Icon name={guide.icon} size={40} className="content-page-icon" />
        <span className="guide-card-category">{guide.category}</span>
        <h1>{guide.title}</h1>
        <p className="guide-byline">
          By {guide.author} · Reviewed by {guide.reviewedBy} · Updated {guide.updated} ·{' '}
          {guide.readMinutes} min read
        </p>
        <p className="content-page-intro">{guide.intro}</p>
      </header>

      <div className="content-page-body">
        {guide.body.map((block, i) => (
          <section key={block.heading || i} className="content-block">
            {block.heading && <h2>{block.heading}</h2>}
            {block.paragraphs?.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {block.list && (
              <ul>
                {block.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>

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
