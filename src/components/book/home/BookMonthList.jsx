import { getBookChapter } from '../../../data/bookChapters';

function BookMonthList({ currentMonth, onSelectMonth }) {
  const months = Array.from({ length: 12 }, (_, i) => getBookChapter(i + 1));

  return (
    <section className="baby-book-month-list" aria-labelledby="book-month-list-heading">
      <h2 id="book-month-list-heading" className="baby-book-month-list__heading">
        Tap a month to add this chapter
      </h2>
      <ul className="baby-book-month-list__items">
        {months.map((chapter) => {
          const isCurrent = currentMonth === chapter.month;
          const isPast = currentMonth && chapter.month < currentMonth;
          return (
            <li key={chapter.month}>
              <button
                type="button"
                className={`baby-book-month-row baby-book-glass${isCurrent ? ' baby-book-month-row--current' : ''}${isPast ? ' baby-book-month-row--past' : ''}`}
                onClick={() => onSelectMonth(chapter.month)}
              >
                <span className="baby-book-month-row__num">Month {chapter.month}</span>
                <span className="baby-book-month-row__title">{chapter.title}</span>
                <span className="baby-book-month-row__caption">&ldquo;{chapter.caption}&rdquo;</span>
                {isCurrent && <span className="baby-book-month-row__badge">This month</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default BookMonthList;
