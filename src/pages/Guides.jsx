import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import Icon from '../components/Icon';
import guides from '../data/guides';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';

function Guides() {
  usePageMeta({
    title: 'Guides & Articles',
    description:
      'Evidence-informed guides on baby development, postpartum recovery, vaccinations, and the practical side of early parenthood.',
  });

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

      <PageSection surface="ivory" width="wide" className="page-body--with-mobile-nav">
        <SectionHeader
          id="guides-list-heading"
          eyebrow="Library"
          title="Curated reading"
          subtitle="Reviewed against trusted medical guidance — calm, never alarmist."
        />
        <div className="guides-grid">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
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
          ))}
        </div>
      </PageSection>
    </div>
  );
}

export default Guides;
