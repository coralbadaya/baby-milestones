function VoiceBlessingsFeed({ blessings }) {
  if (!blessings?.length) {
    return (
      <p className="baby-book-section-sub">
        No voice blessings yet. Invite grandparents to leave a blessing in their language.
      </p>
    );
  }

  return (
    <div>
      {blessings.map((b) => (
        <article key={b.id} className="baby-book-blessing baby-book-glass">
          <p className="baby-book-blessing__from">
            {b.voice_profiles?.display_name || 'Family'}
            {b.language === 'hi' ? ' · Hindi blessing' : b.language ? ` · ${b.language}` : ''}
          </p>
          <p className="baby-book-blessing__text">
            {b.transcript || 'Voice blessing recorded — tap to play when connected.'}
          </p>
        </article>
      ))}
    </div>
  );
}

export default VoiceBlessingsFeed;
