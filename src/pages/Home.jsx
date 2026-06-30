import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import TodayFocus from '../components/TodayFocus';
import CurrentMonthPanel from '../components/CurrentMonthPanel';
import DIYPreviewStrip from '../components/DIYPreviewStrip';
import EditorialBand from '../components/EditorialBand';
import Timeline from '../components/Timeline';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function formatAge(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  const days = now.getDate() - birth.getDate();
  const adjustedMonths = days < 0 ? months - 1 : months;

  if (adjustedMonths < 0) return "Your baby hasn't arrived yet";
  if (adjustedMonths === 0) return 'Your newborn is less than a month old';
  if (adjustedMonths === 1) return 'Your baby is 1 month old';
  if (adjustedMonths <= 36) return `Your baby is ${adjustedMonths} months old`;
  const years = Math.floor(adjustedMonths / 12);
  const rem = adjustedMonths % 12;
  return `Your child is ${years} year${years === 1 ? '' : 's'}${rem ? ` and ${rem} months` : ''} old`;
}

function Home({
  birthDate,
  setBirthDate,
  currentMonth,
  checkedItems,
  toggleCheck,
  onSelectMonth,
}) {
  usePageMeta({});
  const ageLine = birthDate ? formatAge(birthDate) : null;
  const rangeStart = currentMonth ? Math.max(1, currentMonth - 2) : 1;
  const rangeEnd = currentMonth ? Math.min(36, currentMonth + 2) : 5;
  const month = birthDate && currentMonth ? currentMonth : 1;
  const showPersonalized = Boolean(birthDate && currentMonth);

  return (
    <div className="home home-today">
      <PageHero
        imageKey="home"
        layout="split"
        eyebrow={getGreeting()}
        title={ageLine || 'Welcome to Nestbean'}
        subtitle={
          ageLine
            ? "Here's what matters this week."
            : 'Set your baby\'s birth date to personalize your journey.'
        }
        eager
      >
        <div className="birth-date-form birth-date-form--hero">
          <label htmlFor="birthdate">Baby&apos;s birth date</label>
          <input
            type="date"
            id="birthdate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            max={new Date().toISOString().split('T')[0]}
          />
        </div>
      </PageHero>

      <PageSection surface="ivory" width="wide" ariaLabelledby="today-focus-heading">
        <SectionHeader
          id="today-focus-heading"
          eyebrow="Your week"
          title="This week's focus"
          subtitle="Milestones, recovery, and play — three calm priorities."
        />
        <TodayFocus
          birthDate={birthDate}
          currentMonth={currentMonth}
          checkedItems={checkedItems}
        />
      </PageSection>

      <PageSection surface="white" width="wide">
        {showPersonalized ? (
          <CurrentMonthPanel
            currentMonth={currentMonth}
            checkedItems={checkedItems}
            toggleCheck={toggleCheck}
            compact
          />
        ) : (
          <CurrentMonthPanel
            sampleMode
            checkedItems={checkedItems}
            toggleCheck={toggleCheck}
            compact
          />
        )}
      </PageSection>

      <PageSection surface="sand" width="wide" className="page-section--diy">
        <DIYPreviewStrip month={month} limit={2} layout="stack" />
      </PageSection>

      <EditorialBand />

      {birthDate && (
        <PageSection surface="ivory" width="wide" className="page-section--timeline">
          <SectionHeader
            id="timeline-collapsed-heading"
            eyebrow="Journey"
            title="Continue your journey"
            subtitle={`Your timeline around month ${currentMonth || 1}.`}
            linkTo={ROUTES.baby}
            linkLabel="View full timeline →"
          />
          <Timeline
            currentMonth={currentMonth}
            checkedItems={checkedItems}
            onSelectMonth={onSelectMonth}
            collapsed
            hideHeading
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
          />
        </PageSection>
      )}
    </div>
  );
}

export default Home;
