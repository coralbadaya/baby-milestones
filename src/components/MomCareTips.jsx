import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  MOM_CARE_TAB_IDS,
  MOM_CARE_TIMELINE_TAB,
  MOM_CARE_CATEGORIES,
  momCareCategoryConfig,
  momCareTips,
  MOM_CARE_DISCLAIMER,
} from '../data/momCareTips';
import MomMilestonesPanel from './MomMilestonesPanel';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import Icon from './Icon';

const DEFAULT_CATEGORY = MOM_CARE_TIMELINE_TAB;

function parseCareHash(hash) {
  const id = hash.replace(/^#/, '');
  return MOM_CARE_TAB_IDS.includes(id) ? id : DEFAULT_CATEGORY;
}

function MomCareTips({ birthDate, momMilestoneChecks, toggleMomMilestone }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeCategory = parseCareHash(location.hash);
  const isTimeline = activeCategory === MOM_CARE_TIMELINE_TAB;

  useEffect(() => {
    const fromHash = location.hash.replace(/^#/, '');
    if (!fromHash || !MOM_CARE_TAB_IDS.includes(fromHash)) {
      navigate({ pathname: ROUTES.momCare, hash: DEFAULT_CATEGORY }, { replace: true });
    }
  }, [location.hash, navigate]);

  const selectCategory = (id) => {
    interact('tap', 'selection');
    navigate({ pathname: ROUTES.momCare, hash: id });
  };

  const topicCategories = MOM_CARE_CATEGORIES;
  const activeTopicIndex = topicCategories.indexOf(
    isTimeline ? topicCategories[0] : activeCategory
  );

  const { prevCat, nextCat } = useMemo(() => {
    if (isTimeline) {
      return {
        prevCat: momCareCategoryConfig[topicCategories[topicCategories.length - 1]],
        nextCat: momCareCategoryConfig[topicCategories[0]],
      };
    }
    const prevIdx = activeTopicIndex <= 0 ? topicCategories.length - 1 : activeTopicIndex - 1;
    const nextIdx = activeTopicIndex >= topicCategories.length - 1 ? 0 : activeTopicIndex + 1;
    const prevId = activeTopicIndex <= 0 ? MOM_CARE_TIMELINE_TAB : topicCategories[prevIdx];
    const nextId = activeTopicIndex >= topicCategories.length - 1
      ? MOM_CARE_TIMELINE_TAB
      : topicCategories[nextIdx];
    return {
      prevCat: momCareCategoryConfig[prevId],
      nextCat: momCareCategoryConfig[nextId],
    };
  }, [isTimeline, activeTopicIndex, topicCategories]);

  const goPrev = () => selectCategory(prevCat.id);
  const goNext = () => selectCategory(nextCat.id);

  const cat = momCareCategoryConfig[activeCategory];
  const tips = !isTimeline ? momCareTips[activeCategory] : null;

  return (
    <div className="mom-care-page-content fade-in">
      <div className="mom-care-hero">
        <h1>Mom Care</h1>
        <p className="mom-care-sub">
          Your recovery matters as much as baby&apos;s milestones. Practical, evidence-based self-care.
        </p>
      </div>

      <div className="mom-care-tabs-wrap">
        <div className="diy-filter-tabs mom-care-tabs" role="tablist" aria-label="Mom care sections">
          {MOM_CARE_TAB_IDS.map((id) => {
            const cfg = momCareCategoryConfig[id];
            return (
              <button
                key={id}
                id={`mom-care-tab-${id}`}
                type="button"
                role="tab"
                aria-selected={activeCategory === id}
                aria-controls={`mom-care-panel-${id}`}
                className={`diy-filter-btn ${activeCategory === id ? 'active' : ''}`}
                style={
                  activeCategory === id
                    ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color }
                    : {}
                }
                onClick={() => selectCategory(id)}
              >
                <Icon name={cfg.icon} size={18} /> {cfg.label}
              </button>
            );
          })}
        </div>
      </div>

      {cat && (
        <p className="mom-care-category-desc">{cat.description}</p>
      )}

      {isTimeline ? (
        <MomMilestonesPanel
          birthDate={birthDate}
          checkedItems={momMilestoneChecks}
          toggleCheck={toggleMomMilestone}
        />
      ) : tips && (
        <article
          id={`mom-care-panel-${activeCategory}`}
          role="tabpanel"
          aria-labelledby={`mom-care-tab-${activeCategory}`}
          className="mom-care-tip-card card-accent-top"
          style={{ '--cat-color': cat.color }}
        >
          <div className="mom-care-tip-header">
            <Icon name={cat.icon} size={32} className="mom-care-tip-icon" />
            <div>
              <h2>{tips.title}</h2>
              <p className="mom-care-tip-subtitle">{tips.subtitle}</p>
            </div>
          </div>

          {tips.sections.map((sec) => (
            <section key={sec.heading} className="mom-care-tip-section">
              <h3>{sec.heading}</h3>
              <ul>
                {sec.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          ))}

          <p className="mom-care-disclaimer-inline">{MOM_CARE_DISCLAIMER}</p>

          <nav className="mom-care-prev-next" aria-label="Previous and next topics">
            <button type="button" className="mom-care-nav-btn" onClick={goPrev}>
              <span className="mom-care-nav-arrow">&larr;</span>
              <span className="mom-care-nav-label">{prevCat.label}</span>
            </button>
            <button type="button" className="mom-care-nav-btn" onClick={goNext}>
              <span className="mom-care-nav-label">{nextCat.label}</span>
              <span className="mom-care-nav-arrow">&rarr;</span>
            </button>
          </nav>
        </article>
      )}
    </div>
  );
}

export default MomCareTips;
