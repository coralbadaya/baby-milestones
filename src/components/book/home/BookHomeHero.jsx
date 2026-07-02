import { babyFirstName } from '../../../utils/babyName';

function BookHomeHero({ babyName, currentMonth, memoryCount = 0 }) {
  const first = babyFirstName(babyName);
  const yearLabel = currentMonth && currentMonth <= 12
    ? `${first}'s first year`
    : `${first}'s story`;

  return (
    <header className="baby-book-home-hero">
      <div>
        <p className="baby-book-home-hero__eyebrow">Memory Lane</p>
        <h1 className="baby-book-home-hero__title">{yearLabel}</h1>
      </div>
      {currentMonth && (
        <div className="baby-book-home-hero__stats">
          <span>{currentMonth} months old</span>
          <span className="baby-book-home-hero__stats-accent">
            {memoryCount} {memoryCount === 1 ? 'memory' : 'memories'}
          </span>
        </div>
      )}
    </header>
  );
}

export default BookHomeHero;
