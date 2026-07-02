function BookAlbumHero({ currentMonth = 1, onOpenBook }) {
  const filled = Math.min(12, Math.max(0, currentMonth || 0));

  return (
    <button type="button" className="baby-book-album-hero baby-book-glass" onClick={onOpenBook}>
      <div className="baby-book-album-hero__glow" aria-hidden="true" />
      <div className="baby-book-album-hero__inner">
        <div className="baby-book-album-hero__book" aria-hidden="true">
          <span className="baby-book-album-hero__spine" />
        </div>
        <div className="baby-book-album-hero__copy">
          <p className="baby-book-album-hero__eyebrow">Your 3D Album</p>
          <p className="baby-book-album-hero__title">A year you can hold</p>
          <p className="baby-book-album-hero__meta">
            Tap to open · {filled} of 12 pages glowing
          </p>
        </div>
      </div>
    </button>
  );
}

export default BookAlbumHero;
