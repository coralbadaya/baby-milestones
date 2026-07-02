import { useState } from 'react';
import SectionHeader from './SectionHeader';
import Icon from './Icon';
import PremiumGate from './PremiumGate';
import { PREMIUM_FEATURES } from '../constants/premium';
import { useEntitlements } from '../hooks/useEntitlements';
import { interact } from '../utils/haptics';
import {
  LONG_HAUL_CITY_IDS,
  getLongHaulCity,
  longHaulPlaceholderSections,
} from '../data/longHaulCities';

function TravelLongHaulGuides({ currentMonth }) {
  const { isPlus } = useEntitlements();
  const [activeCity, setActiveCity] = useState('london');
  const city = getLongHaulCity(activeCity);

  const monthLabel = currentMonth != null ? `Month ${currentMonth}` : 'your baby\'s age';

  const selectCity = (id) => {
    interact('tap', 'selection');
    setActiveCity(id);
  };

  const detailSections = (
    <div className="travel-longhaul__sections">
      {longHaulPlaceholderSections.map((sec) => (
        <section key={sec.heading} className="travel-tip-section">
          <h3>{sec.heading}</h3>
          <ul>
            {sec.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );

  return (
    <section className="travel-longhaul" aria-labelledby="longhaul-heading">
      <SectionHeader
        id="longhaul-heading"
        eyebrow="Nestbean Plus"
        title="Long-haul city guides"
        subtitle={`Curated packing and jet-lag routines for ${monthLabel} — London, Dubai, and New York.`}
      />

      <div
        className="diy-filter-tabs travel-longhaul__city-tabs"
        role="tablist"
        aria-label="City guide"
      >
        {LONG_HAUL_CITY_IDS.map((id) => {
          const cfg = getLongHaulCity(id);
          const selected = activeCity === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="longhaul-city-panel"
              className={`diy-filter-btn ${selected ? 'active' : ''}`}
              style={
                selected
                  ? { background: cfg.bg, color: cfg.color, borderColor: cfg.color }
                  : {}
              }
              onClick={() => selectCity(id)}
            >
              <Icon name={cfg.icon} size={18} />
              {cfg.label}
            </button>
          );
        })}
      </div>

      <article
        id="longhaul-city-panel"
        role="tabpanel"
        className="travel-longhaul__card card-accent-top card-hover-lift"
        style={{ '--cat-color': city.color }}
      >
        <div
          className="travel-longhaul__media"
          style={{ background: city.gradient }}
          aria-hidden="true"
        >
          <span className="travel-longhaul__media-label font-display">{city.label}</span>
        </div>

        <div className="travel-longhaul__body">
          <p className="travel-longhaul__eyebrow">
            <Icon name="luggage" size={16} />
            Plus city guide
          </p>
          <h3 className="travel-longhaul__title font-display">{city.label}</h3>
          <p className="travel-longhaul__tagline">{city.tagline}</p>
          <p className="travel-longhaul__flight">{city.flightNote}</p>

          {isPlus ? (
            detailSections
          ) : (
            <div className="travel-longhaul__gate-target">
              <PremiumGate feature={PREMIUM_FEATURES.travelLongHaul} compact>
                {detailSections}
              </PremiumGate>
            </div>
          )}
        </div>
      </article>
    </section>
  );
}

export default TravelLongHaulGuides;
