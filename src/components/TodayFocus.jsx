import { Link } from 'react-router-dom';
import milestones from '../data/milestones';
import { focusImages } from '../data/focusImages';
import { formatPostpartumAge } from '../utils/momMilestones';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import Icon from './Icon';

function FocusCardImage({ imageKey }) {
  const config = focusImages[imageKey];
  if (!config?.src) return null;

  return (
    <div
      className="today-focus-card__image"
      style={{ background: config.fallbackGradient }}
    >
      <img src={config.src} alt="" loading="lazy" decoding="async" />
    </div>
  );
}

function TodayFocus({ birthDate, currentMonth, checkedItems }) {
  const monthData = currentMonth
    ? milestones.find((m) => m.month === currentMonth)
    : null;
  const postpartum = birthDate ? formatPostpartumAge(birthDate) : null;

  const milestoneProgress = monthData
    ? (() => {
        const allIds = [...monthData.physical, ...monthData.emotional].map((i) => i.id);
        const checked = allIds.filter((id) => checkedItems[id]).length;
        return `${checked} of ${allIds.length} checked`;
      })()
    : null;

  const onLink = () => interact('tap', 'light');

  return (
    <div className="today-focus">
      <div className="today-focus__grid">
        <Link
          to={currentMonth ? ROUTES.month(currentMonth) : ROUTES.baby}
          className="today-focus-card card-accent-top card-hover-lift today-focus-card--with-image"
          onClick={onLink}
          style={{ '--cat-color': 'var(--baby-blue-dark)', '--cat-bg': 'var(--baby-blue)' }}
        >
          <FocusCardImage imageKey="milestones" />
          <div className="today-focus-card__body">
            <Icon name="baby" size={22} />
            <span className="today-focus-card__label">This month&apos;s milestones</span>
            <span className="today-focus-card__title">
              {monthData
                ? `Month ${currentMonth}: ${monthData.title}`
                : 'Set birth date to see milestones'}
            </span>
            <span className="today-focus-card__meta">
              {milestoneProgress || monthData?.summary?.slice(0, 80) || 'Track development month by month.'}
              {monthData?.summary && monthData.summary.length > 80 && !milestoneProgress ? '…' : ''}
            </span>
          </div>
        </Link>

        <Link
          to={ROUTES.momCare}
          className="today-focus-card card-accent-top card-hover-lift today-focus-card--with-image"
          onClick={onLink}
          style={{ '--cat-color': 'var(--lavender-dark)', '--cat-bg': 'var(--lavender)' }}
        >
          <FocusCardImage imageKey="momCare" />
          <div className="today-focus-card__body">
            <Icon name="heart" size={22} />
            <span className="today-focus-card__label">For you</span>
            <span className="today-focus-card__title">Your recovery matters</span>
            <span className="today-focus-card__meta">
              {postpartum
                ? `You're ${postpartum}. Rest, hydration, and gentle movement.`
                : 'Postpartum timeline and self-care when you\'re ready.'}
            </span>
          </div>
        </Link>

        {birthDate && currentMonth ? (
          <Link
            to={`${ROUTES.month(currentMonth)}#diy`}
            className="today-focus-card card-accent-top card-hover-lift today-focus-card--with-image"
            onClick={onLink}
            style={{ '--cat-color': 'var(--coral-primary-dark)', '--cat-bg': 'var(--coral-primary-light)' }}
          >
            <FocusCardImage imageKey="diy" />
            <div className="today-focus-card__body">
              <Icon name="play" size={22} />
              <span className="today-focus-card__label">DIY activities</span>
              <span className="today-focus-card__title">Hands-on play for this month</span>
              <span className="today-focus-card__meta">
                Step-by-step guides with YouTube tutorials for month {currentMonth}.
              </span>
            </div>
          </Link>
        ) : (
          <Link
            to={ROUTES.essentials}
            className="today-focus-card card-accent-top card-hover-lift today-focus-card--with-image today-focus-card--editorial"
            onClick={onLink}
            style={{ '--cat-color': 'var(--coral-primary-dark)', '--cat-bg': 'var(--coral-primary-light)' }}
          >
            <FocusCardImage imageKey="editorial" />
            <div className="today-focus-card__body">
              <Icon name="luggage" size={22} />
              <span className="today-focus-card__label">Editorial</span>
              <span className="today-focus-card__title">Travel-ready at any age</span>
              <span className="today-focus-card__meta">
                Long-haul tips for London, Dubai, and New York — curated for your month.
              </span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}

export default TodayFocus;
