import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import Icon from '../components/Icon';
import guides from '../data/guides';
import {
  GUIDE_TAGS,
  isMonthMilestoneGuide,
  listGuidesForTag,
  parseGuideTag,
  tagLabel,
  tagsForGuide,
} from '../data/guideTags';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import { getStaticMeta } from '../seo/routes';
import PageBreadcrumb from '../components/PageBreadcrumb';
import { useBabyIdentity } from '../hooks/useBabyIdentity';
import { getCurrentMonthFromBirthDate } from '../utils/vaccines';

function GuideCard({ guide, currentMonth }) {
  const tags = tagsForGuide(guide);
  const thisMonth = isMonthMilestoneGuide(guide) && guide.milestoneMonth === currentMonth;

  return (
    <Link
      to={ROUTES.guide(guide.slug)}
      className="guide-card card-hover-lift"
      onClick={() => interact('tap', 'light')}
    >
      <div className="guide-card-icon">
        <Icon name={guide.icon} size={28} />
      </div>
      <div className="guide-card-tags">
        {thisMonth && <span className="guide-tag guide-tag--now">This month</span>}
        {tags.map((id) => (
          <span key={id} className="guide-tag" data-tag={id}>{tagLabel(id)}</span>
        ))}
      </div>
      <h2 className="guide-card-title">{guide.title}</h2>
      <p className="guide-card-desc">{guide.description}</p>
      <span className="guide-card-meta">{guide.readMinutes} min read</span>
    </Link>
  );
}

function Guides() {
  usePageMeta(getStaticMeta(ROUTES.guides) || {});
  const [params, setParams] = useSearchParams();
  const { birthDate } = useBabyIdentity();
  const currentMonth = getCurrentMonthFromBirthDate(birthDate);
  const activeTag = parseGuideTag(params.get('tag'));

  const items = useMemo(
    () => listGuidesForTag(guides, activeTag, { currentMonth }),
    [activeTag, currentMonth],
  );

  const activeLabel = tagLabel(activeTag);
  const subtitle = activeTag === 'all'
    ? 'Head-term guides first. Month-by-month articles live under Milestones.'
    : activeTag === 'milestones'
      ? (currentMonth
        ? `Your month ${currentMonth} guide first, then the rest of the first year.`
        : 'The monthly hub, then each month’s guide.')
      : `${items.length} guide${items.length === 1 ? '' : 's'} in ${activeLabel}.`;

  const setTag = (id) => {
    interact('tap', 'selection');
    if (id === 'all') setParams({}, { replace: true });
    else setParams({ tag: id }, { replace: true });
  };

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
        <div className="guides-tag-tabs" role="tablist" aria-label="Guide topics">
          {GUIDE_TAGS.map((tag) => (
            <button
              key={tag.id}
              type="button"
              role="tab"
              aria-selected={activeTag === tag.id}
              className={`guides-tag-btn${activeTag === tag.id ? ' is-active' : ''}`}
              data-tag={tag.id}
              onClick={() => setTag(tag.id)}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </PageSection>

      <PageSection surface="white" width="wide" className="page-body--with-mobile-nav">
        <h2 className="guides-category-title font-display">{activeLabel}</h2>
        <p className="guides-tag-sub">{subtitle}</p>
        {items.length > 0 ? (
          <div className="guides-grid" aria-labelledby="guides-list-heading">
            {items.map((guide) => (
              <GuideCard key={guide.slug} guide={guide} currentMonth={currentMonth} />
            ))}
          </div>
        ) : (
          <p className="month-section-empty">Nothing in this topic yet.</p>
        )}
      </PageSection>
    </div>
  );
}

export default Guides;
