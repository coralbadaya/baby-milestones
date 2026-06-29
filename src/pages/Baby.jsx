import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Timeline from '../components/Timeline';
import Icon from '../components/Icon';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import { usePageMeta } from '../utils/pageMeta';

function Baby({ birthDate, currentMonth, checkedItems, onSelectMonth }) {
  usePageMeta({
    title: 'My Baby',
    description: 'Month-by-month baby milestones, activities, and health from newborn to toddler.',
  });
  const onLink = () => interact('tap', 'light');

  return (
    <div className="baby-page">
      <PageHero
        imageKey="baby"
        eyebrow="Development"
        title="My Baby"
        subtitle="Month-by-month milestones, activities, and health — from newborn to toddler."
      />

      {currentMonth && (
        <section className="hub-quick-links">
          <Link
            to={ROUTES.month(currentMonth)}
            className="hub-quick-link card-accent-top"
            onClick={onLink}
          >
            <Icon name="calendar" size={20} />
            <span>
              <strong>Current month</strong>
              <span className="hub-quick-link__meta">Month {currentMonth}</span>
            </span>
          </Link>
          <Link
            to={ROUTES.vaccination}
            className="hub-quick-link card-accent-top"
            onClick={onLink}
          >
            <Icon name="medical" size={20} />
            <span>
              <strong>Vaccination tracker</strong>
              <span className="hub-quick-link__meta">Schedules & reminders</span>
            </span>
          </Link>
        </section>
      )}

      {!birthDate && (
        <p className="hub-banner">
          Add your baby&apos;s birth date on{' '}
          <Link to={ROUTES.home} onClick={onLink}>Today</Link>
          {' '}to highlight the current month.
        </p>
      )}

      <Timeline
        currentMonth={currentMonth}
        checkedItems={checkedItems}
        onSelectMonth={onSelectMonth}
      />
    </div>
  );
}

export default Baby;
