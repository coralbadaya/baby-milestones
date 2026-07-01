import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import {
  MOM_CARE_TAB_IDS,
  MOM_CARE_TIMELINE_TAB,
  MOM_CARE_CATEGORIES,
  MOM_CARE_DEFAULT_TOPIC,
  MOM_CARE_PRIMARY_NAV,
  momCareCategoryConfig,
  momCareTips,
  MOM_CARE_DISCLAIMER,
} from '../data/momCareTips';
import MomMilestonesPanel from './MomMilestonesPanel';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import Icon from './Icon';

const DEFAULT_HASH = MOM_CARE_TIMELINE_TAB;

function parseCareHash(hash) {
  const id = hash.replace(/^#/, '');
  return MOM_CARE_TAB_IDS.includes(id) ? id : DEFAULT_HASH;
}

function MomCareTips({ birthDate }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeCategory = parseCareHash(location.hash);
  const isTimeline = activeCategory === MOM_CARE_TIMELINE_TAB;
  const primarySection = isTimeline ? 'milestones' : 'guides';

  useEffect(() => {
    const fromHash = location.hash.replace(/^#/, '');
    if (!fromHash || !MOM_CARE_TAB_IDS.includes(fromHash)) {
      navigate({ pathname: ROUTES.momCare, hash: DEFAULT_HASH }, { replace: true });
    }
  }, [location.hash, navigate]);

  const selectHash = (id) => {
    interact('tap', 'selection');
    navigate({ pathname: ROUTES.momCare, hash: id });
  };

  const selectPrimary = (section) => {
    const target = section.id === 'milestones'
      ? MOM_CARE_TIMELINE_TAB
      : (isTimeline ? MOM_CARE_DEFAULT_TOPIC : activeCategory);
    selectHash(target);
  };

  const activeTopicIndex = MOM_CARE_CATEGORIES.indexOf(activeCategory);

  const { prevCat, nextCat } = useMemo(() => {
    const prevIdx = activeTopicIndex <= 0
      ? MOM_CARE_CATEGORIES.length - 1
      : activeTopicIndex - 1;
    const nextIdx = activeTopicIndex >= MOM_CARE_CATEGORIES.length - 1
      ? 0
      : activeTopicIndex + 1;
    return {
      prevCat: momCareCategoryConfig[MOM_CARE_CATEGORIES[prevIdx]],
      nextCat: momCareCategoryConfig[MOM_CARE_CATEGORIES[nextIdx]],
    };
  }, [activeTopicIndex]);

  const goPrev = () => selectHash(prevCat.id);
  const goNext = () => selectHash(nextCat.id);

  const cat = momCareCategoryConfig[activeCategory];
  const tips = !isTimeline ? momCareTips[activeCategory] : null;
  const primaryMeta = MOM_CARE_PRIMARY_NAV.find((s) => s.id === primarySection);

  return (
    <div className="mom-care-page-content fade-in">
      <div className="editorial-band-inline editorial-band-inline--ivory">
        <nav className="mom-care-subnav" role="tablist" aria-label="Mom care sections">
        {MOM_CARE_PRIMARY_NAV.map((section) => (
          <button
            key={section.id}
            type="button"
            role="tab"
            aria-selected={primarySection === section.id}
            className={`mom-care-subnav-tab${primarySection === section.id ? ' active' : ''}`}
            onClick={() => selectPrimary(section)}
          >
            <Icon name={section.icon} size={18} className="mom-care-subnav-icon" />
            <span>{section.label}</span>
          </button>
        ))}
      </nav>

      {!isTimeline && (
        <div className="mom-care-tabs-wrap mom-care-topic-tabs-wrap">
          <div
            className="diy-filter-tabs mom-care-tabs mom-care-topic-tabs"
            role="tablist"
            aria-label="Self-care topics"
          >
            {MOM_CARE_CATEGORIES.map((id) => {
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
                  onClick={() => selectHash(id)}
                >
                  <Icon name={cfg.icon} size={18} /> {cfg.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {primaryMeta && (
        <p className="mom-care-category-desc">{primaryMeta.description}</p>
      )}
      </div>

      <div className="editorial-band-inline editorial-band-inline--white">
      {isTimeline ? (
        <MomMilestonesPanel birthDate={birthDate} />
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
    </div>
  );
}

export default MomCareTips;
