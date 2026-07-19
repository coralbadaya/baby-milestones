import { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import TodayFocus from '../components/TodayFocus';
import CurrentMonthPanel from '../components/CurrentMonthPanel';
import DIYPreviewStrip from '../components/DIYPreviewStrip';
import EditorialBand from '../components/EditorialBand';
import ConversionBand from '../components/ConversionBand';
import WelcomeHero from '../components/WelcomeHero';
import Timeline from '../components/Timeline';
import FirstsCarousel from '../components/firsts/FirstsCarousel';
import FirstMomentCapture from '../components/firsts/FirstMomentCapture';
import { getSuggestedFirst } from '../data/firsts';
import { PLANS } from '../constants/premium';
import { useAuth } from '../context/AuthContext';
import useScrollSurface from '../hooks/useScrollSurface';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';

const WELCOME_META = {
  title: 'Week-by-Week Baby Guides',
  description:
    'Week-by-week guides, milestones, and routines for your baby\'s first year. Create a free account or preview Yarn Trails without signing up.',
};

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
  firstMoments = {},
  onFirstMediaSelect,
  onFirstNoteSave,
  onFirstRemove,
}) {
  const { user, loading, startLocalTrial } = useAuth();
  const isWelcomeMode = !loading && !user && !birthDate;
  const showLoggedOutBands = !loading && !user;
  const showLoggedOutHeroCtas = showLoggedOutBands;

  usePageMeta(isWelcomeMode ? WELCOME_META : {});

  const [detailFirstId, setDetailFirstId] = useState(null);
  const [captureError, setCaptureError] = useState(null);

  const handleSelectFile = useCallback(async (firstId, file) => {
    try {
      setCaptureError(null);
      await onFirstMediaSelect(firstId, file);
      setDetailFirstId(firstId);
    } catch (err) {
      setCaptureError(err.message || 'Could not save media');
      interact('tap', 'error');
    }
  }, [onFirstMediaSelect]);

  const onLocalPreview = () => {
    interact('tap', 'light');
    startLocalTrial();
  };

  const suggestedId = getSuggestedFirst(currentMonth, firstMoments);
  const ageLine = birthDate ? formatAge(birthDate) : null;
  const rangeStart = currentMonth ? Math.max(1, currentMonth - 2) : 1;
  const rangeEnd = currentMonth ? Math.min(36, currentMonth + 2) : 5;
  const month = birthDate && currentMonth ? currentMonth : 1;
  const showPersonalized = Boolean(birthDate && currentMonth);
  const homeRef = useRef(null);
  useScrollSurface(homeRef, { defaultSurface: 'primary', observeKey: birthDate });

  const heroEyebrow = isWelcomeMode ? 'For new mothers' : getGreeting();
  const heroTitle = isWelcomeMode ? 'Yarn Trails' : (ageLine || 'Welcome to Yarn Trails');
  const heroSubtitle = isWelcomeMode
    ? 'Week-by-week guides, milestones, and routines for your baby\'s first year.'
    : (ageLine
      ? "Here's what matters this week."
      : 'Set your baby\'s birth date to personalize your journey.');

  return (
    <div ref={homeRef} className={`home home-today${isWelcomeMode ? ' home-today--welcome' : ''}`}>
      {isWelcomeMode ? (
        <WelcomeHero
          birthDate={birthDate}
          setBirthDate={setBirthDate}
          onLocalPreview={onLocalPreview}
        />
      ) : (
      <PageHero
        imageKey="home"
        layout="split"
        eyebrow={heroEyebrow}
        title={heroTitle}
        subtitle={heroSubtitle}
        eager
      >
          <div className="welcome-hero__actions">
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
            {showLoggedOutHeroCtas && (
              <>
                <Link
                  to={ROUTES.signup}
                  className="btn-primary welcome-hero__cta"
                  onClick={() => interact('tap', 'light')}
                >
                  Create free account
                </Link>
                <button type="button" className="btn-ghost welcome-hero__cta" onClick={onLocalPreview}>
                  Preview without an account
                </button>
              </>
            )}
          </div>
      </PageHero>
      )}

      <PageSection surface="ivory" width="wide" ariaLabelledby="today-focus-heading" blendEdges>
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
        {showLoggedOutBands && !isWelcomeMode && (
          <ConversionBand
            text="Save your progress across devices — milestones, memories, and routines in one place."
            primaryLabel="Create free account"
            primaryTo={ROUTES.signup}
            secondaryLabel="Explore Premium"
            secondaryTo={ROUTES.premium}
          />
        )}
      </PageSection>

      <PageSection surface="white" width="wide" blendEdges>
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
        {isWelcomeMode && (
          <p className="welcome-sample-note">
            Sample content below — enter birth date or create an account to personalize.
          </p>
        )}
      </PageSection>

      <PageSection surface="sand" width="wide" className="page-section--diy" blendEdges>
        <DIYPreviewStrip month={month} limit={2} layout="stack" />
        {showLoggedOutBands && !isWelcomeMode && (
          <ConversionBand
            text="Unlock all months of hands-on play guides — tailored to your baby's age."
            primaryLabel="Create free account"
            primaryTo={ROUTES.signup}
            secondaryLabel="Preview locally"
            onSecondaryClick={onLocalPreview}
          />
        )}
      </PageSection>

      <EditorialBand>
        {showLoggedOutBands && (
          <ConversionBand
            className="conversion-band--on-ink"
            text={`Start your ${PLANS.premium.trialDays}-day Premium preview — no card required during early access.`}
            primaryLabel="Create free account"
            primaryTo={ROUTES.signup}
            secondaryLabel="Preview without an account"
            onSecondaryClick={onLocalPreview}
          />
        )}
      </EditorialBand>

      {birthDate && (
        <PageSection surface="sand" width="wide" className="page-section--firsts" blendEdges>
          <SectionHeader
            id="life-firsts-heading"
            eyebrow="Memories"
            title="Life firsts"
            subtitle="Capture the moments you'll want to remember."
            linkTo={ROUTES.babyMoments}
            linkLabel="View all firsts →"
          />
          <FirstsCarousel
            firstMoments={firstMoments}
            suggestedId={suggestedId}
            onSelectFile={handleSelectFile}
            onOpenDetail={setDetailFirstId}
          />
        </PageSection>
      )}

      {birthDate && (
        <PageSection surface="ivory" width="wide" className="page-section--timeline" blendEdges>
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
            variant="carousel"
            hideHeading
            rangeStart={rangeStart}
            rangeEnd={rangeEnd}
          />
        </PageSection>
      )}

      {detailFirstId && (
        <FirstMomentCapture
          firstId={detailFirstId}
          moment={firstMoments[detailFirstId]}
          onSaveNote={onFirstNoteSave}
          onRemove={onFirstRemove}
          onClose={() => { setDetailFirstId(null); setCaptureError(null); }}
          error={captureError}
        />
      )}
    </div>
  );
}

export default Home;
