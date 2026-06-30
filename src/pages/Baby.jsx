import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import Timeline from '../components/Timeline';
import CurrentMonthPanel from '../components/CurrentMonthPanel';
import DIYPreviewStrip from '../components/DIYPreviewStrip';
import CarePreviewTeaser from '../components/CarePreviewTeaser';
import Icon from '../components/Icon';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import { usePageMeta } from '../utils/pageMeta';

function Baby({ birthDate, currentMonth, checkedItems, toggleCheck, onSelectMonth }) {
  usePageMeta({
    title: 'My Baby',
    description: 'Month-by-month baby milestones, DIY activities, and care from newborn to toddler.',
  });
  const onLink = () => interact('tap', 'light');
  const month = currentMonth || 1;

  return (
    <>
      <PageHero
        imageKey="baby"
        layout="split"
        eyebrow="Development"
        title="My Baby"
        subtitle="Milestones, DIY activities, and care — month by month."
      />

      <PageSection surface="ivory" width="wide" className="page-body--with-mobile-nav">
        {currentMonth && (
          <section className="hub-quick-links">
            <Link
              to={ROUTES.month(currentMonth)}
              className="hub-quick-link card-accent-top card-hover-lift"
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
              className="hub-quick-link card-accent-top card-hover-lift"
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
      </PageSection>

      <PageSection surface="white" width="wide">
        {currentMonth ? (
          <CurrentMonthPanel
            currentMonth={currentMonth}
            checkedItems={checkedItems}
            toggleCheck={toggleCheck}
          />
        ) : (
          <CurrentMonthPanel
            sampleMode
            checkedItems={checkedItems}
            toggleCheck={toggleCheck}
          />
        )}
      </PageSection>

      <PageSection surface="sand" width="wide" className="page-section--diy">
        <DIYPreviewStrip month={month} limit={4} layout="grid" />
      </PageSection>

      <PageSection surface="ivory" width="wide">
        <CarePreviewTeaser month={month} />
      </PageSection>

      <PageSection surface="white" width="wide" className="page-section--timeline page-body--with-mobile-nav">
        <Timeline
          currentMonth={currentMonth}
          checkedItems={checkedItems}
          onSelectMonth={onSelectMonth}
        />
      </PageSection>
    </>
  );
}

export default Baby;
