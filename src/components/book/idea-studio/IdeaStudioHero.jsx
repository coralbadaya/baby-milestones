function IdeaStudioHero({ heroPhotoUrl, albumCount = 0 }) {
  return (
    <header className="idea-studio-hero baby-book-glass">
      <p className="idea-studio-hero__breadcrumb">
        <span>Baby Book</span>
        <span aria-hidden="true"> / </span>
        <span>Idea Studio</span>
      </p>
      <div className="idea-studio-hero__inner">
        <div className="idea-studio-hero__copy">
          <p className="baby-book-ideas__eyebrow">Idea Studio</p>
          <h2 className="idea-studio-hero__title">Little moments. Beautiful stories.</h2>
          <p className="idea-studio-hero__lead">
            Your camera roll holds thousands of little memories. Let&apos;s turn a few of them into a keepsake your family will treasure.
          </p>
          <p className="idea-studio-hero__tagline baby-book-section-sub">
            Personalized book ideas, thoughtfully created with AI.
          </p>
        </div>

        <figure className="idea-studio-hero__visual" aria-hidden={!heroPhotoUrl}>
          {heroPhotoUrl ? (
            <img src={heroPhotoUrl} alt="" className="idea-studio-hero__photo" />
          ) : (
            <div className="idea-studio-hero__placeholder">
              <span className="idea-studio-hero__book-spine" />
              <span className="idea-studio-hero__book-cover">
                <span className="idea-studio-hero__book-title">Our year</span>
                <span className="idea-studio-hero__book-count">
                  {albumCount > 0 ? `${albumCount} memories` : 'Your story'}
                </span>
              </span>
            </div>
          )}
        </figure>
      </div>
    </header>
  );
}

export default IdeaStudioHero;