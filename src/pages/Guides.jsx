import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import Icon from '../components/Icon';
import guides from '../data/guides';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import { getStaticMeta } from '../seo/routes';
import PageBreadcrumb from '../components/PageBreadcrumb';

const GUIDE_CATEGORY_ORDER = [
  'Early Years',
  'Memories',
  'Baby Development',
  'Mom Care',
  'Health & Safety',
  'Compare',
];

function guidesByCategory() {
  return GUIDE_CATEGORY_ORDER.map((category) => ({
    category,
    items: guides.filter((g) => g.category === category),
  })).filter((group) => group.items.length > 0);
}

function GuideCard({ guide }) {
  return (
    <Link
      to={ROUTES.guide(guide.slug)}
      className="guide-card card-hover-lift"
      onClick={() => interact('tap', 'light')}
    >
      <div className="guide-card-icon">
        <Icon name={guide.icon} size={28} />
      </div>
      <span className="guide-card-category">{guide.category}</span>
      <h2 className="guide-card-title">{guide.title}</h2>
      <p className="guide-card-desc">{guide.description}</p>
      <span className="guide-card-meta">{guide.readMinutes} min read</span>
    </Link>
  );
}

function Guides() {
  usePageMeta(getStaticMeta(ROUTES.guides) || {});
  const groups = guidesByCategory();

  return (
    <div className="guides-page">
      <PageHero
        imageKey="essentials"
        layout="split"
        eyebrow="Editorial"
        title="Guides & Articles"
        subtitle="Evidence-informed, gently written guides for the first years."
        size="md"
      />

      <PageSection surface="ivory" width="wide">
        <PageBreadcrumb
          items={[
            { name: 'Home', to: ROUTES.home },
            { name: 'Guides' },
          ]}
        />
        <SectionHeader
          id="guides-list-heading"
          eyebrow="Library"
          title="Curated reading"
          subtitle="Reviewed against trusted medical guidance — calm, never alarmist."
        />
      </PageSection>

      <PageSection surface="white" width="wide" className="page-body--with-mobile-nav">
        {groups.map((group) => (
          <section key={group.category} className="guides-category" aria-labelledby={`guides-cat-${group.category}`}>
            <h2 id={`guides-cat-${group.category}`} className="guides-category-title font-display">
              {group.category}
            </h2>
            <div className="guides-grid" aria-labelledby={`guides-cat-${group.category}`}>
              {group.items.map((guide) => (
                <GuideCard key={guide.slug} guide={guide} />
              ))}
            </div>
          </section>
        ))}
      </PageSection>
    </div>
  );
}

export default Guides;