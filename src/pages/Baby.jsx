import { useEffect, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import Timeline from '../components/Timeline';
import CurrentMonthPanel from '../components/CurrentMonthPanel';
import DIYPreviewStrip from '../components/DIYPreviewStrip';
import CarePreviewTeaser from '../components/CarePreviewTeaser';
import FirstsJournal from '../components/firsts/FirstsJournal';
import FirstMomentCapture from '../components/firsts/FirstMomentCapture';
import MonthlyAlbumSection from '../components/book/MonthlyAlbumSection';
import VoiceNoteRecorder from '../components/book/VoiceNoteRecorder';
import { ViewerSeatsPanel, PrintDiscountBadge } from '../components/book/PlusExtras';
import Icon from '../components/Icon';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import { usePageMeta } from '../utils/pageMeta';
import { useAuth } from '../context/AuthContext';

function Baby({
  birthDate,
  currentMonth,
  checkedItems,
  toggleCheck,
  onSelectMonth,
  firstMoments = {},
  onFirstMediaSelect,
  onFirstNoteSave,
  onFirstRemove,
}) {
  usePageMeta({
    title: 'My Baby',
    description: 'Month-by-month baby milestones, DIY activities, and care from newborn to toddler.',
  });
  const location = useLocation();
  const { isPremium } = useAuth();
  const onLink = () => interact('tap', 'light');
  const month = currentMonth || 1;

  const [detailFirstId, setDetailFirstId] = useState(null);
  const [captureError, setCaptureError] = useState(null);

  useEffect(() => {
    if (location.hash === '#moments' || location.hash === '#album') {
      const id = location.hash.slice(1);
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    }
  }, [location.hash]);

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

      <PageSection surface="sand" width="wide">
        <SectionHeader
          eyebrow="Nestbean Plus"
          title="Your baby book"
          subtitle="AI stories in your language, photo-book ideas, and a 3D flip-book — the magic rendering tier."
        />
        <Link
          to={ROUTES.babyBookTab('home')}
          className="hub-quick-link card-accent-top card-hover-lift"
          onClick={onLink}
          style={{ display: 'inline-flex', marginTop: '0.5rem' }}
        >
          <Icon name="book-open" size={20} />
          <span>
            <strong>Open baby book</strong>
            <span className="hub-quick-link__meta">Stories · Ideas · 3D Book · Family</span>
          </span>
        </Link>
        <div className="hub-story-teaser card-accent-top">
          <Icon name="sparkles" size={22} />
          <div>
            <strong>Turn this month into a story</strong>
            <p className="hub-story-teaser__copy">
              In your language, in your voice — generate this month&apos;s chapter in the Stories tab.
            </p>
            <Link
              to={ROUTES.babyBookTab('stories')}
              className="btn-secondary hub-story-teaser__btn"
              onClick={onLink}
            >
              Open Stories tab
            </Link>
          </div>
        </div>
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

      <PageSection surface="lavender" width="wide">
        <CarePreviewTeaser month={month} />
      </PageSection>

      <PageSection surface="sand" width="wide" id="album" className="page-section--album">
        <SectionHeader
          id="album-heading"
          eyebrow="Monthly album"
          title="Two photos a month — their story starts here"
          subtitle="Standard 2D album on Basic; unlimited HD on Plus."
        />
        <MonthlyAlbumSection currentMonth={month} />
        <PrintDiscountBadge isPlus={isPremium} />
      </PageSection>

      <PageSection surface="lavender" width="wide" className="page-section--voice">
        <SectionHeader
          id="voice-heading"
          eyebrow="Voice memos"
          title="30-second voice notes"
          subtitle="Attach memories to milestones — 3 stored on Basic."
        />
        <VoiceNoteRecorder attachType="milestone" attachId={`month-${month}`} />
      </PageSection>

      <PageSection surface="ivory" width="wide">
        <ViewerSeatsPanel />
      </PageSection>

      <PageSection surface="ivory" width="wide" id="moments" className="page-section--firsts-journal">
        <SectionHeader
          id="firsts-journal-heading"
          eyebrow="Memories"
          title="Life firsts journal"
          subtitle="Seventeen moments worth a photograph — your private baby book."
        />
        <FirstsJournal
          firstMoments={firstMoments}
          onSelectFile={handleSelectFile}
          onOpenDetail={setDetailFirstId}
        />
      </PageSection>

      <PageSection surface="white" width="wide" className="page-section--timeline page-body--with-mobile-nav">
        <Timeline
          currentMonth={currentMonth}
          checkedItems={checkedItems}
          onSelectMonth={onSelectMonth}
        />
      </PageSection>

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
    </>
  );
}

export default Baby;
