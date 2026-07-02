import { useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getTravelTips } from '../data/travelTips';
import { travelTypeConfig, TRAVEL_TYPES } from '../data/travelTypeConfig';
import { getShoppingListForRange } from '../data/shoppingAndCare';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import Icon from './Icon';
import TravelLongHaulGuides from './TravelLongHaulGuides';

const DEFAULT_TRAVEL_TYPE = 'car';

function parseTravelHash(hash) {
  const id = hash.replace(/^#/, '');
  return TRAVEL_TYPES.includes(id) ? id : DEFAULT_TRAVEL_TYPE;
}

function TravelTips({ currentMonth }) {
  const navigate = useNavigate();
  const location = useLocation();
  const activeType = parseTravelHash(location.hash);

  useEffect(() => {
    const fromHash = location.hash.replace(/^#/, '');
    if (!fromHash || !TRAVEL_TYPES.includes(fromHash)) {
      navigate({ pathname: ROUTES.travel, hash: DEFAULT_TRAVEL_TYPE }, { replace: true });
    }
  }, [location.hash, navigate]);

  const selectType = (id) => {
    interact('tap', 'selection');
    navigate({ pathname: ROUTES.travel, hash: id });
  };

  const tips = useMemo(
    () => getTravelTips(currentMonth, activeType),
    [currentMonth, activeType]
  );

  const travelGear = useMemo(() => {
    if (currentMonth == null) return [];
    const list = getShoppingListForRange(1, currentMonth);
    return list.all.filter((i) => i.category === 'travel');
  }, [currentMonth]);

  const cat = travelTypeConfig[activeType];

  return (
    <div className="travel-page-content fade-in">
      <div className="editorial-band-inline editorial-band-inline--mist">
      {currentMonth != null ? (
        <p className="travel-age-banner" role="status">
          Tips tailored for <strong>Month {currentMonth}</strong> (from birth date)
        </p>
      ) : (
        <div className="travel-set-dob">
          <p>Set your baby&apos;s birth date on Today to unlock age-specific travel guidance.</p>
          <button type="button" className="travel-dob-btn" onClick={() => navigate(ROUTES.home)}>
            Go to Today
          </button>
        </div>
      )}

      <div className="diy-filter-tabs travel-type-tabs" role="tablist" aria-label="Travel type">
        {TRAVEL_TYPES.map((id) => {
          const cfg = travelTypeConfig[id];
          return (
            <button
              key={id}
              id={`travel-tab-${id}`}
              type="button"
              role="tab"
              aria-selected={activeType === id}
              aria-controls={`travel-panel-${id}`}
              className={`diy-filter-btn ${activeType === id ? 'active' : ''}`}
              style={
                activeType === id
                  ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color }
                  : {}
              }
              onClick={() => selectType(id)}
            >
              <Icon name={cfg.icon} size={18} /> {cfg.label}
            </button>
          );
        })}
      </div>
      </div>

      <div className="editorial-band-inline editorial-band-inline--white">
      {tips && (
        <article
          id={`travel-panel-${activeType}`}
          role="tabpanel"
          aria-labelledby={`travel-tab-${activeType}`}
          className="travel-tip-card card-accent-top"
          style={{ '--cat-color': cat.color }}
        >
          <div className="travel-tip-card-header">
            <Icon name={tips.typeIcon} size={32} className="travel-tip-type-icon" />
            <div>
              <h2>{tips.typeLabel}</h2>
              <p className="travel-tip-band">{tips.bandLabel}</p>
            </div>
          </div>
          {tips.sections.map((sec) => (
            <section key={sec.heading} className="travel-tip-section">
              <h3>{sec.heading}</h3>
              <ul>
                {sec.items.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
            </section>
          ))}
          <p className="travel-disclaimer-inline">
            Educational only — confirm plans with your pediatrician, especially for illness, prematurity, or long journeys.
          </p>
        </article>
      )}
      </div>

      <div className="editorial-band-inline editorial-band-inline--sand">
        <TravelLongHaulGuides currentMonth={currentMonth} />
      </div>

      <div className="editorial-band-inline editorial-band-inline--white">
      {currentMonth != null && travelGear.length > 0 && (
        <footer className="travel-gear-footer">
          <h3>Travel gear we use (Months 1–{currentMonth})</h3>
          <ul className="travel-gear-list">
            {travelGear.map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
          <button type="button" className="travel-shop-link" onClick={() => navigate(ROUTES.shopping)}>
            View all in Shopping →
          </button>
        </footer>
      )}
      </div>
    </div>
  );
}

export default TravelTips;
