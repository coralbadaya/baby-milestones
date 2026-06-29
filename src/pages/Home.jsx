import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import TodayFocus from '../components/TodayFocus';
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
  onSelectMonth,
}) {
  usePageMeta({});
  const ageLine = birthDate ? formatAge(birthDate) : null;
  const rangeStart = currentMonth ? Math.max(1, currentMonth - 2) : 1;
  const rangeEnd = currentMonth ? Math.min(36, currentMonth + 2) : 5;

  return (
    <div className="home home-today">
      <PageHero
        imageKey="home"
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

      <TodayFocus birthDate={birthDate} currentMonth={currentMonth} />

      {birthDate && (
        <section className="timeline-section timeline-section--collapsed">
          <h2 className="font-display">Continue your journey</h2>
          <p className="timeline-subtitle">Your timeline around month {currentMonth || 1}</p>
          <Timeline
            currentMonth={currentMonth}
            checkedItems={checkedItems}
            onSelectMonth={onSelectMonth}
            collapsed
            hideHeading
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
          />
          <p className="timeline-collapsed-footer">
            <Link
              to={ROUTES.baby}
              className="timeline-full-link"
              onClick={() => interact('tap', 'light')}
            >
              View full timeline →
            </Link>
          </p>
        </section>
      )}
    </div>
  );
}

export default Home;
