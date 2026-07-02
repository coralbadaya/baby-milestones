import { useCallback, useState } from 'react';
import { getBookChapter } from '../../data/bookChapters';
import ParallaxPage from './ParallaxPage';

const BOOK_STYLE_HINTS = {
  parallax: 'Photos separate into floating depth layers as pages turn.',
  popup: 'Cut-paper scenes rise off the page like a pop-up book.',
  snowglobe: 'Each month lives in a glass orb with golden dust instead of snow.',
};

function BookSpreadViewer({
  pageIndex,
  pageCount,
  renderStyle,
  albumPhotos = [],
  reducedMotion = false,
  onPageChange,
  onOrderPrint,
}) {
  const [turning, setTurning] = useState(false);
  const chapter = getBookChapter(pageIndex + 1);
  const photo = albumPhotos[pageIndex]?.data_url || albumPhotos.find((p) => p.data_url)?.data_url;

  const turn = useCallback((delta) => {
    if (turning) return;
    const next = pageIndex + delta;
    if (next < 0 || next >= pageCount) return;

    if (reducedMotion) {
      onPageChange(next);
      return;
    }

    setTurning(true);
    window.setTimeout(() => {
      onPageChange(next);
      setTurning(false);
    }, 640);
  }, [turning, pageIndex, pageCount, reducedMotion, onPageChange]);

  const depthClass = renderStyle === 'popup'
    ? 'baby-book-spread__depth baby-book-spread__depth--popup'
    : renderStyle === 'snowglobe'
      ? 'baby-book-spread__depth baby-book-spread__depth--globe'
      : 'baby-book-spread__depth baby-book-spread__depth--parallax';

  return (
    <div className="baby-book-spread-viewer">
      <p className="baby-book-spread-viewer__hint">{BOOK_STYLE_HINTS[renderStyle]}</p>

      <div className="baby-book-spread-stage">
        <div className={`baby-book-spread${turning ? ' baby-book-spread--turning' : ''}`}>
          <div className="baby-book-spread__left">
            {renderStyle === 'parallax' && photo ? (
              <div className="baby-book-spread__parallax">
                <ParallaxPage imageUrl={photo} reducedMotion={reducedMotion} />
              </div>
            ) : photo ? (
              <img src={photo} alt="" className="baby-book-spread__photo" />
            ) : (
              <div className="baby-book-spread__placeholder">Photo</div>
            )}
            <div className={depthClass} aria-hidden="true" />
            <span className="baby-book-spread__album-tag">Month {pageIndex + 1}</span>
          </div>
          <div className="baby-book-spread__spine" aria-hidden="true" />
          <div className="baby-book-spread__right">
            <span className="baby-book-spread__chap-tag">Chapter {pageIndex + 1}</span>
            <p className="baby-book-spread__chap-title">{chapter.title}</p>
            <p className="baby-book-spread__chap-caption">&ldquo;{chapter.caption}&rdquo;</p>
            <p className="baby-book-spread__chap-mile">✦ {chapter.milestone}</p>
          </div>
          <div className={`baby-book-spread__turn-page${turning ? ' baby-book-spread__turn-page--on' : ''}`} aria-hidden="true" />
        </div>
      </div>

      <div className="baby-book-spread-controls">
        <button type="button" className="baby-book-btn baby-book-btn--ghost" disabled={pageIndex <= 0} onClick={() => turn(-1)}>
          ‹
        </button>
        <span className="baby-book-spread-controls__label">
          Spread {pageIndex + 1} of {pageCount}
        </span>
        <button type="button" className="baby-book-btn baby-book-btn--primary" disabled={pageIndex >= pageCount - 1} onClick={() => turn(1)}>
          ›
        </button>
      </div>

      <div className="baby-book-spread-actions">
        <button type="button" className="baby-book-btn baby-book-btn--primary" onClick={onOrderPrint}>
          Order the printed book
        </button>
        <button
          type="button"
          className="baby-book-btn baby-book-btn--ghost"
          onClick={() => window.alert('Interactive 3D album download — coming soon on Plus.')}
        >
          Download interactive 3D album
        </button>
      </div>
    </div>
  );
}

export default BookSpreadViewer;
