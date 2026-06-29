import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Icon from '../components/Icon';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import { usePageMeta } from '../utils/pageMeta';

const ESSENTIALS_CARDS = [
  {
    to: ROUTES.shopping,
    icon: 'shopping-cart',
    title: 'Shopping',
    meta: 'Curated checklist by month — investment pieces, not clutter.',
    color: 'var(--coral-primary-dark)',
    bg: 'var(--coral-primary-light)',
  },
  {
    to: ROUTES.travel,
    icon: 'luggage',
    title: 'Travel',
    meta: 'Age-aware tips for flights, road trips, and long-haul with baby.',
    color: 'var(--baby-blue-dark)',
    bg: 'var(--baby-blue)',
  },
];

function Essentials() {
  usePageMeta({
    title: 'Essentials',
    description: 'Curated baby shopping checklists and age-aware travel tips — practical and calm.',
  });
  const onLink = () => interact('tap', 'light');

  return (
    <div className="essentials-page">
      <PageHero
        imageKey="essentials"
        eyebrow="Life admin"
        title="Essentials"
        subtitle="Shopping and travel — practical, curated, calm."
      />

      <section className="hub-cards" aria-label="Essentials">
        {ESSENTIALS_CARDS.map(({ to, icon, title, meta, color, bg }) => (
          <Link
            key={to}
            to={to}
            className="hub-card card-accent-top"
            onClick={onLink}
            style={{ '--cat-color': color, '--cat-bg': bg }}
          >
            <Icon name={icon} size={28} />
            <h2 className="hub-card__title font-display">{title}</h2>
            <p className="hub-card__meta">{meta}</p>
            <span className="hub-card__cta">Open →</span>
          </Link>
        ))}
      </section>
    </div>
  );
}

export default Essentials;
