import { NavLink, useNavigate } from 'react-router-dom';
import Icon from '../Icon';
import { ROUTES } from '../../routes';
import StarfieldCanvas from './StarfieldCanvas';
import BookHomeTab from './BookHomeTab';
import StoryStudio from './StoryStudio';
import IdeasGrid from './IdeasGrid';
import FlipBookViewer from './FlipBookViewer';
import FamilyCircleTab from './FamilyCircleTab';
import VoiceBlessingsFeed from './VoiceBlessingsFeed';
import { useVoiceProfiles } from '../../hooks/useVoiceProfiles';
import { useBookIdeas } from '../../hooks/useBookIdeas';
import { useMonthlyAlbum } from '../../hooks/useMonthlyAlbum';

const TABS = [
  { id: 'home', label: 'Home', icon: 'home' },
  { id: 'stories', label: 'Stories', icon: 'book-open' },
  { id: 'ideas', label: 'Ideas', icon: 'sparkles' },
  { id: 'book', label: '3D Book', icon: 'image' },
  { id: 'family', label: 'Family', icon: 'heart' },
];

function BabyBookShell({
  activeTab = 'home',
  birthDate,
  babyName,
  currentMonth,
  firstMoments,
}) {
  const navigate = useNavigate();
  const { photos } = useMonthlyAlbum();
  const { blessings } = useVoiceProfiles();
  const { ideas, generateIdea, generating } = useBookIdeas(
    photos,
    firstMoments,
    { birthDate, currentMonth },
  );

  const goTab = (tabId) => {
    navigate(ROUTES.babyBookTab(tabId));
  };

  const babyAgeMonths = currentMonth || 6;

  return (
    <div className="baby-book-shell">
      <StarfieldCanvas />

      <div className="baby-book-shell__inner">
        <header className="baby-book-shell__topbar">
          <button
            type="button"
            className="baby-book-shell__back"
            onClick={() => navigate(ROUTES.baby)}
          >
            ← My Baby
          </button>
          <h1 className="baby-book-shell__title">Baby Book</h1>
          <span style={{ width: 72 }} aria-hidden="true" />
        </header>

        {activeTab === 'home' && (
          <BookHomeTab
            birthDate={birthDate}
            babyName={babyName}
            currentMonth={babyAgeMonths}
            onNavigateTab={goTab}
          />
        )}

        {activeTab === 'stories' && (
          <StoryStudio
            birthDate={birthDate}
            babyName={babyName}
            babyAgeMonths={babyAgeMonths}
          />
        )}

        {activeTab === 'ideas' && (
          <IdeasGrid
            ideas={ideas}
            totalPhotoCount={
              photos.filter((p) => p.data_url).length
              + Object.values(firstMoments || {}).filter((m) => m?.dataUrl || m?.videoDataUrl).length
            }
            generating={generating}
            onGenerate={(idea) => generateIdea(idea.id, idea.matchedPhotoIds)}
          />
        )}

        {activeTab === 'book' && (
          <FlipBookViewer albumPhotos={photos} />
        )}

        {activeTab === 'family' && (
          <>
            <FamilyCircleTab birthDate={birthDate} />
            <section className="baby-book-family__blessings">
              <h3 className="baby-book-section-title baby-book-family__blessings-title">Voice blessings</h3>
              <VoiceBlessingsFeed blessings={blessings} />
            </section>
          </>
        )}
      </div>

      <nav className="baby-book-tabbar" aria-label="Baby book sections">
        {TABS.map((tab) => (
          <NavLink
            key={tab.id}
            to={ROUTES.babyBookTab(tab.id)}
            className={({ isActive }) => `baby-book-tabbar__btn${isActive ? ' baby-book-tabbar__btn--active' : ''}`}
            end={tab.id === 'home'}
          >
            <Icon name={tab.icon} size={20} />
            {tab.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default BabyBookShell;
