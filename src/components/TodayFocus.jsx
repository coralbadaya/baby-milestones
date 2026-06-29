import { Link } from 'react-router-dom';
import milestones from '../data/milestones';
import { formatPostpartumAge } from '../utils/momMilestones';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import Icon from './Icon';
import PremiumGate from './PremiumGate';
import { PREMIUM_FEATURES } from '../constants/premium';

function TodayFocus({ birthDate, currentMonth }) {
  const monthData = currentMonth
    ? milestones.find((m) => m.month === currentMonth)
    : null;
  const postpartum = birthDate ? formatPostpartumAge(birthDate) : null;

  const onLink = () => interact('tap', 'light');

  return (
    <section className="today-focus" aria-labelledby="today-focus-heading">
      <h2 id="today-focus-heading" className="today-focus__heading font-display">
        This week&apos;s focus
      </h2>
      <div className="today-focus__grid">
        <Link
          to={currentMonth ? ROUTES.month(currentMonth) : ROUTES.baby}
          className="today-focus-card card-accent-top"
          onClick={onLink}
          style={{ '--cat-color': 'var(--baby-blue-dark)', '--cat-bg': 'var(--baby-blue)' }}
        >
          <Icon name="baby" size={22} />
          <span className="today-focus-card__label">For your baby</span>
          <span className="today-focus-card__title">
            {monthData
              ? `Month ${currentMonth}: ${monthData.title}`
              : 'Set birth date to see milestones'}
          </span>
          <span className="today-focus-card__meta">
            {monthData?.summary?.slice(0, 80)}
            {monthData?.summary && monthData.summary.length > 80 ? '…' : ''}
          </span>
        </Link>

        <Link
          to={ROUTES.momCare}
          className="today-focus-card card-accent-top"
          onClick={onLink}
          style={{ '--cat-color': 'var(--lavender-dark)', '--cat-bg': 'var(--lavender)' }}
        >
          <Icon name="heart" size={22} />
          <span className="today-focus-card__label">For you</span>
          <span className="today-focus-card__title">Your recovery matters</span>
          <span className="today-focus-card__meta">
            {postpartum
              ? `You're ${postpartum}. Rest, hydration, and gentle movement.`
              : 'Postpartum timeline and self-care when you\'re ready.'}
          </span>
        </Link>

        <PremiumGate feature={PREMIUM_FEATURES.editorialFocus} compact>
          <Link
            to={ROUTES.essentials}
            className="today-focus-card card-accent-top today-focus-card--editorial"
            onClick={onLink}
            style={{ '--cat-color': 'var(--coral-primary-dark)', '--cat-bg': 'var(--coral-primary-light)' }}
          >
            <Icon name="luggage" size={22} />
            <span className="today-focus-card__label">Editorial</span>
            <span className="today-focus-card__title">Travel-ready at any age</span>
            <span className="today-focus-card__meta">
              Long-haul tips for London, Dubai, and New York — curated for your month.
            </span>
          </Link>
        </PremiumGate>
      </div>
    </section>
  );
}

export default TodayFocus;
