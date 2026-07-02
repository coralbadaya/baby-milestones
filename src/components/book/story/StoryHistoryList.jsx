function StoryHistoryList({ stories = [], activeStoryId, onSelect }) {
  if (stories.length === 0) return null;

  return (
    <section className="baby-book-studio__section" aria-labelledby="story-history-heading">
      <h3 id="story-history-heading" className="baby-book-studio__section-title">Past chapters</h3>
      <ul className="baby-book-story-history">
        {stories.map((s) => (
          <li key={s.id}>
            <button
              type="button"
              className={`baby-book-story-history__btn baby-book-glass${activeStoryId === s.id ? ' baby-book-story-history__btn--active' : ''}`}
              onClick={() => onSelect(s)}
            >
              <span className="baby-book-story-history__title">{s.title}</span>
              {s.created_at && (
                <span className="baby-book-story-history__date">
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              )}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default StoryHistoryList;
