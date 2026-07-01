import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import Icon from '../components/Icon';
import { pageImages } from '../data/pageImages';
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
    imageKey: 'shopping',
  },
  {
    to: ROUTES.travel,
    icon: 'luggage',
    title: 'Travel',
    meta: 'Age-aware tips for flights, road trips, and long-haul with baby.',
    color: 'var(--baby-blue-dark)',
    bg: 'var(--baby-blue)',
    imageKey: 'travel',
  },
  {
    to: ROUTES.vaccination,
    icon: 'medical',
    title: 'Vaccination',
    meta: 'Schedules and reminders — calm, clear, and age-aware.',
    color: 'var(--mint-dark)',
    bg: 'var(--mint)',
    imageKey: 'vaccination',
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
        layout="split"
        eyebrow="Life admin"
        title="Essentials"
        subtitle="Shopping and travel — practical, curated, calm."
      />

      <PageSection surface="sand" width="wide">
        <SectionHeader
          id="essentials-hub-heading"
          eyebrow="Curated for you"
          title="Choose your path"
          subtitle="Investment pieces, travel edits, and wellness tracking."
        />
        <section className="hub-cards hub-cards--editorial" aria-labelledby="essentials-hub-heading">
          {ESSENTIALS_CARDS.map(({ to, icon, title, meta, color, bg, imageKey }) => {
            const img = pageImages[imageKey];
            return (
              <Link
                key={to}
                to={to}
                className="hub-card hub-card--editorial card-accent-top card-hover-lift"
                onClick={onLink}
                style={{ '--cat-color': color, '--cat-bg': bg }}
              >
                {img?.src && (
                  <div className="hub-card__image" style={{ background: img.fallbackGradient }}>
                    <img src={img.src} alt="" loading="lazy" decoding="async" />
                  </div>
                )}
                <div className="hub-card__body">
                  <Icon name={icon} size={28} />
                  <h2 className="hub-card__title font-display">{title}</h2>
                  <p className="hub-card__meta">{meta}</p>
                  <span className="hub-card__cta">Open →</span>
                </div>
              </Link>
            );
          })}
        </section>
      </PageSection>

      <PageSection surface="ivory" width="wide" className="page-body--with-mobile-nav">
        <p className="essentials-footer-note">
          Calm, curated essentials — shopping edits, travel guidance, and vaccination tracking in one place.
        </p>
      </PageSection>
    </div>
  );
}

export default Essentials;
