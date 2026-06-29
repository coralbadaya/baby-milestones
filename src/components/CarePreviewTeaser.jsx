import { Link } from 'react-router-dom';
import shoppingAndCare from '../data/shoppingAndCare';
import { careTypeConfig } from './careTypeConfig';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import Icon from './Icon';

function CarePreviewTeaser({ month }) {
  const monthData = shoppingAndCare.find((d) => d.month === month);
  if (!monthData) return null;

  const teasers = [];
  if (monthData.careGuides.bath) {
    teasers.push({ type: 'bath', title: monthData.careGuides.bath.title, preview: monthData.careGuides.bath.when });
  }
  if (monthData.careGuides.massage) {
    teasers.push({ type: 'massage', title: monthData.careGuides.massage.title, preview: monthData.careGuides.massage.duration });
  }
  if (teasers.length === 0 && monthData.holdingGames[0]) {
    teasers.push({
      type: 'hold',
      title: monthData.holdingGames[0].name,
      preview: monthData.holdingGames[0].description,
    });
  }

  if (teasers.length === 0) return null;

  return (
    <section className="care-preview-teaser" aria-labelledby={`care-preview-heading-${month}`}>
      <div className="care-preview-teaser__header">
        <h2 id={`care-preview-heading-${month}`} className="care-preview-teaser__title font-display">
          Baby care guides
        </h2>
        <Link
          to={`${ROUTES.month(month)}#care`}
          className="care-preview-teaser__all-link"
          onClick={() => interact('tap', 'light')}
        >
          All for month {month} →
        </Link>
      </div>
      <div className="care-preview-teaser__grid">
        {teasers.slice(0, 2).map(({ type, title, preview }) => {
          const cfg = careTypeConfig[type];
          return (
            <Link
              key={type}
              to={`${ROUTES.month(month)}#care`}
              className="care-preview-teaser__card card-accent-top"
              style={{ '--cat-color': cfg.color, '--cat-bg': cfg.bg }}
              onClick={() => interact('tap', 'light')}
            >
              <Icon name={cfg.icon} size={22} />
              <span className="care-preview-teaser__card-title">{title}</span>
              {preview && <span className="care-preview-teaser__card-meta">{preview}</span>}
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default CarePreviewTeaser;
