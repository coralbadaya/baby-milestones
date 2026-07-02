function FamilyCirclePanel({ blessings = [], viewerCount = 1 }) {
  const sample = blessings[0];
  const displayName = sample?.voice_profiles?.display_name || 'Nani';
  const quote = sample?.transcript || sample?.note || 'मेरी गुड़िया, हमेशा हँसती रहो…';

  return (
    <div className="baby-book-glass baby-book-family-circle">
      <div className="baby-book-family-circle__avatars">
        <span className="baby-book-family-circle__avatar">👵</span>
        <span className="baby-book-family-circle__avatar">👴</span>
        <span className="baby-book-family-circle__avatar">👩</span>
        <span className="baby-book-family-circle__avatar baby-book-family-circle__avatar--add">+</span>
      </div>
      <div className="baby-book-family-circle__meta">
        <strong>{viewerCount} in your circle</strong>
        <p>Grandparents watch the album grow and leave voice blessings.</p>
      </div>
      {sample && (
        <div className="baby-book-family-circle__blessing">
          <span className="baby-book-family-circle__play" aria-hidden="true">▶</span>
          <div>
            <strong>A blessing from {displayName}</strong>
            <p className="baby-book-family-circle__quote">&ldquo;{quote}&rdquo;</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default FamilyCirclePanel;
