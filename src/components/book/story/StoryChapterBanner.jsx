import { getMonthlyChapterReminder } from '../../../utils/bookReminders';

function StoryChapterBanner({ birthDate, babyName }) {
  const reminder = getMonthlyChapterReminder(birthDate, babyName || 'Your baby');

  return (
    <div className="baby-book-banner baby-book-glass baby-book-studio__section">
      <p className="baby-book-banner__title">Monthly chapter</p>
      <p className="baby-book-banner__text">{reminder.message}</p>
    </div>
  );
}

export default StoryChapterBanner;
