import { useState, useMemo } from 'react';
import DetailModal from './DetailModal';
import { careTypeConfig } from './careTypeConfig';
import shoppingAndCare from '../data/shoppingAndCare';
import { interact } from '../utils/haptics';
import Icon from './Icon';

const FILTER_TABS = [
  { id: 'all', label: 'All', icon: "target" },
  { id: 'bath', label: 'Bath', icon: "bathtub" },
  { id: 'massage', label: 'Massage', icon: "raised-hand" },
  { id: 'hold', label: 'Hold & Play', icon: "palms-up" },
  { id: 'clothes', label: 'Clothes', icon: "t-shirt" },
  { id: 'pacifier', label: 'Pacifier', icon: "baby-bottle" },
];

function CareGuideModalBody({ guide, type }) {
  const cfg = careTypeConfig[type];
  return (
    <>
      {guide.when && <p className="care-modal-meta"><strong>When:</strong> {guide.when}</p>}
      {guide.waterTemp && <p className="care-modal-meta"><strong>Water:</strong> {guide.waterTemp}</p>}
      {guide.duration && <p className="care-modal-meta"><strong>Duration:</strong> {guide.duration}</p>}
      {guide.bestTime && <p className="care-modal-meta"><strong>Best time:</strong> {guide.bestTime}</p>}
      {guide.oil && <p className="care-modal-meta"><strong>Oil:</strong> {guide.oil}</p>}
      {guide.steps?.length > 0 && (
        <div className="diy-section">
          <h5 className="diy-section-title">Steps</h5>
          <ol className="diy-steps" style={{ '--cat-color': cfg?.color }}>
            {guide.steps.map((step, i) => (
              <li key={i}>
                <span className="step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
      <div className="care-dos-donts">
        <div className="care-col care-dos">
          <h5 className="diy-section-title">Do</h5>
          <ul className="diy-benefits">
            {(guide.dos ?? []).map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
        <div className="care-col care-donts">
          <h5 className="diy-section-title">Don&apos;t</h5>
          <ul className="care-dont-list">
            {(guide.donts ?? []).map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function getGuidePreview(guide) {
  if (guide.steps?.length) return guide.steps[0];
  if (guide.when) return guide.when;
  if (guide.dos?.length) return guide.dos[0];
  return null;
}

function CareGuideCard({ guide, type, isOpen, onOpen, onClose }) {
  const cfg = careTypeConfig[type];
  const preview = getGuidePreview(guide);

  return (
    <>
      <article
        className="content-card care-guide-card card-accent-top"
        style={{ '--cat-color': cfg.color, '--cat-bg': cfg.bg }}
      >
        <div className="content-card-media care-guide-media">
          <Icon name={cfg.icon} size={40} className="care-guide-icon" />
        </div>
        <div className="content-card-body">
          <span className="diy-cat-badge" style={{ background: cfg.bg, color: cfg.color }}>
            {cfg.label}
          </span>
          <h4 className="content-card-title">{guide.title}</h4>
          {(guide.frequency || guide.when) && (
            <p className="content-card-meta-line">{guide.frequency || guide.when}</p>
          )}
          {preview && (
            <p className="content-card-preview">{preview}</p>
          )}
          <button
            type="button"
            className="content-card-cta"
            onClick={() => { onOpen(type); interact('tap', 'selection'); }}
          >
            Open guide
          </button>
        </div>
      </article>
      {isOpen && (
        <DetailModal
          title={guide.title}
          subtitle={guide.frequency || guide.when}
          onClose={onClose}
        >
          <CareGuideModalBody guide={guide} type={type} />
        </DetailModal>
      )}
    </>
  );
}

function HoldingCard({ game, isOpen, onOpen, onClose }) {
  const cfg = careTypeConfig.hold;

  return (
    <>
      <article
        className="content-card care-hold-card card-accent-top"
        style={{ '--cat-color': cfg.color, '--cat-bg': cfg.bg }}
      >
        <div className="content-card-media care-guide-media">
          <Icon name={game.icon} size={40} className="care-guide-icon" />
        </div>
        <div className="content-card-body">
          <span className="diy-cat-badge" style={{ background: cfg.bg, color: cfg.color }}>
            Hold & Play
          </span>
          <h4 className="content-card-title">{game.name}</h4>
          <p className="content-card-preview">{game.description}</p>
          <button
            type="button"
            className="content-card-cta"
            onClick={() => { onOpen(game.id); interact('tap', 'selection'); }}
          >
            How to do it
          </button>
        </div>
      </article>
      {isOpen && (
        <DetailModal title={game.name} subtitle="Holding & play" onClose={onClose}>
          <p className="care-modal-desc">{game.description}</p>
        </DetailModal>
      )}
    </>
  );
}

function ClothesCard({ clothes }) {
  const cfg = careTypeConfig.clothes;

  return (
    <article
      className="content-card care-clothes-card content-card--span-row"
      style={{ '--cat-color': cfg.color, '--cat-bg': cfg.bg }}
    >
      <div className="content-card-media care-guide-media">
        <Icon name={cfg.icon} size={40} className="care-guide-icon" />
      </div>
      <div className="content-card-body">
        <span className="diy-cat-badge" style={{ background: cfg.bg, color: cfg.color }}>
          Clothes · {clothes.size}
        </span>
        <h4 className="content-card-title">What to have ready</h4>
        <div className="diy-materials content-card-chips">
          {clothes.items.map((item, i) => (
            <span key={i} className="diy-material-chip">{item}</span>
          ))}
        </div>
        {clothes.notes && <p className="content-card-preview">{clothes.notes}</p>}
      </div>
    </article>
  );
}

function CareSection({ month, id = 'care' }) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [openKey, setOpenKey] = useState(null);
  const monthData = shoppingAndCare.find((d) => d.month === month);

  const filters = useMemo(() => {
    if (!monthData?.careGuides?.pacifier) {
      return FILTER_TABS.filter((t) => t.id !== 'pacifier');
    }
    return FILTER_TABS;
  }, [monthData]);

  if (!monthData) return null;

  const { careGuides, holdingGames, clothes } = monthData;

  const showBath = activeFilter === 'all' || activeFilter === 'bath';
  const showMassage = activeFilter === 'all' || activeFilter === 'massage';
  const showHold = activeFilter === 'all' || activeFilter === 'hold';
  const showClothes = activeFilter === 'all' || activeFilter === 'clothes';
  const showPacifier = (activeFilter === 'all' || activeFilter === 'pacifier') && careGuides.pacifier;

  let visibleCount = 0;
  if (showBath && careGuides.bath) visibleCount += 1;
  if (showMassage && careGuides.massage) visibleCount += 1;
  if (showPacifier) visibleCount += 1;
  if (showHold) visibleCount += holdingGames.length;
  if (showClothes && clothes) visibleCount += 1;

  return (
    <section id={id} className="month-section care-section-wrapper">
      <div className="month-section-header">
        <h3>Baby Care</h3>
        <p className="month-section-sub">
          Bath, massage, holds, and clothes for month {month}. Based on what we have used—not medical advice.
        </p>
      </div>

      <div className="diy-filter-tabs">
        {filters.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`diy-filter-btn ${activeFilter === tab.id ? 'active' : ''}`}
            onClick={() => { setActiveFilter(tab.id); interact('tap', 'selection'); }}
          >
            <Icon name={tab.icon} size={16} /> {tab.label}
          </button>
        ))}
      </div>

      <div className="content-card-grid">
        {showBath && careGuides.bath && (
          <CareGuideCard
            guide={careGuides.bath}
            type="bath"
            isOpen={openKey === 'bath'}
            onOpen={setOpenKey}
            onClose={() => setOpenKey(null)}
          />
        )}
        {showMassage && careGuides.massage && (
          <CareGuideCard
            guide={careGuides.massage}
            type="massage"
            isOpen={openKey === 'massage'}
            onOpen={setOpenKey}
            onClose={() => setOpenKey(null)}
          />
        )}
        {showPacifier && (
          <CareGuideCard
            guide={careGuides.pacifier}
            type="pacifier"
            isOpen={openKey === 'pacifier'}
            onOpen={setOpenKey}
            onClose={() => setOpenKey(null)}
          />
        )}
        {showHold && holdingGames.map((game) => (
          <HoldingCard
            key={game.id}
            game={game}
            isOpen={openKey === game.id}
            onOpen={setOpenKey}
            onClose={() => setOpenKey(null)}
          />
        ))}
        {showClothes && clothes && <ClothesCard clothes={clothes} />}
      </div>

      {visibleCount === 0 && (
        <p className="month-section-empty">Nothing in this filter for month {month}.</p>
      )}
    </section>
  );
}

export default CareSection;
