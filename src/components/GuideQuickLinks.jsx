import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';

/**
 * @param {{ guide: import('../data/guidesBase.js').Guide & { productLinks?: { to: string, label: string }[] } }} props
 */
function GuideQuickLinks({ guide }) {
  const links = [...(guide.productLinks || [])];

  if (guide.milestoneMonth) {
    links.unshift(
      { to: ROUTES.month(guide.milestoneMonth), label: `Month ${guide.milestoneMonth} tracker` },
      { to: ROUTES.vaccination, label: 'Vaccination schedule' },
      { to: ROUTES.momCare, label: 'Postpartum care' },
      { to: ROUTES.sources, label: 'Sources & citations' },
    );
  }

  if (links.length === 0) return null;

  const seen = new Set();
  const unique = links.filter((item) => {
    if (seen.has(item.to)) return false;
    seen.add(item.to);
    return true;
  });

  return (
    <nav className="month-related-links" aria-label="Related Yarn Trails pages">
      {unique.map((item, i) => (
        <span key={item.to}>
          {i > 0 ? ' · ' : null}
          <Link to={item.to}>{item.label}</Link>
        </span>
      ))}
    </nav>
  );
}

export default GuideQuickLinks;