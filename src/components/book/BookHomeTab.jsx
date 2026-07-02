import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { getMonthlyChapterReminder } from '../../utils/bookReminders';
import { useMonthlyAlbum } from '../../hooks/useMonthlyAlbum';
import BookHomeHero from './home/BookHomeHero';
import BookAlbumHero from './home/BookAlbumHero';
import BookMonthList from './home/BookMonthList';

const FEATURE_CAROUSEL = [
  { title: 'Live language stories', tab: 'stories', desc: 'EN → हिन्दी → Español in one tap' },
  { title: '10 AI book ideas', tab: 'ideas', desc: 'From photos you already have' },
  { title: '3D parallax book', tab: 'book', desc: 'Depth planes with camera drift' },
  { title: 'Family Circle', tab: 'family', desc: 'Voice blessings from grandparents' },
  { title: 'Time Capsule', tab: 'family', desc: 'Sealed until age 18' },
];

function BookHomeTab({ birthDate, babyName, currentMonth, onNavigateTab }) {
  const reminder = getMonthlyChapterReminder(birthDate, babyName);
  const { photos } = useMonthlyAlbum();
  const memoryCount = photos.filter((p) => p.data_url).length;

  return (
    <div className="baby-book-home">
      <BookHomeHero
        babyName={babyName}
        currentMonth={currentMonth}
        memoryCount={memoryCount}
      />

      <div className="baby-book-banner baby-book-glass baby-book-home__reminder">
        <p className="baby-book-banner__text">{reminder.message}</p>
        <button type="button" className="baby-book-btn baby-book-btn--primary" onClick={() => onNavigateTab('stories')}>
          Add this chapter
        </button>
      </div>

      <BookAlbumHero currentMonth={currentMonth} onOpenBook={() => onNavigateTab('book')} />

      <h2 className="baby-book-section-title">New in Nestbean</h2>
      <div className="baby-book-carousel">
        {FEATURE_CAROUSEL.map((item) => (
          <button
            key={item.title}
            type="button"
            className="baby-book-carousel__item baby-book-glass"
            onClick={() => onNavigateTab(item.tab)}
          >
            <p className="baby-book-idea-card__title">{item.title}</p>
            <p className="baby-book-idea-card__desc">{item.desc}</p>
          </button>
        ))}
      </div>

      <BookMonthList
        currentMonth={currentMonth}
        onSelectMonth={() => onNavigateTab('stories')}
      />

      {!birthDate && (
        <p className="baby-book-section-sub baby-book-home__hint">
          <Link to={ROUTES.home} className="baby-book-studio__link">
            Add birth date on Today
          </Link>
          {' '}to personalize reminders and stories.
        </p>
      )}
    </div>
  );
}

export default BookHomeTab;
