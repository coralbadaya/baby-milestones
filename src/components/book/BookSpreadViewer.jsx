import { useCallback, useEffect, useRef, useState } from 'react';
import { getBookChapter } from '../../data/bookChapters';
import { FOLD_MS } from '../../book/pageFold';
import { playTurn } from '../../utils/pageTurnFeel';
import ParallaxPage from './ParallaxPage';

const BOOK_STYLE_HINTS = {
  parallax: 'Photos separate into floating depth layers as pages turn.',
  popup: 'Cut-paper scenes rise off the page like a pop-up book.',
  snowglobe: 'Each month lives in a glass orb with golden dust instead of snow.',
};

function PageArt({ page, photo, renderStyle, reducedMotion }) {
  if (page?.ending) {
    return (
      <div className="baby-book-spread__ending">
        <span>The close</span>
      </div>
    );
  }
  const src = page?.src || photo;
  if (!src) return <div className="baby-book-spread__placeholder">Photo</div>;

  if (renderStyle === 'parallax') {
    return (
      <div className="baby-book-spread__parallax">
        <ParallaxPage imageUrl={src} reducedMotion={reducedMotion} />
      </div>
    );
  }

  if (renderStyle === 'snowglobe') {
    return (
      <div className="baby-book-spread__globe">
        <img src={src} alt="" />
        <span className="baby-book-spread__glass" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="baby-book-spread__popup">
      <img src={src} alt="" className="baby-book-spread__popup-back" />
      <img src={src} alt="" className="baby-book-spread__popup-front" />
    </div>
  );
}

function BookSpreadViewer({
  pageIndex,
  pageCount,
  renderStyle,
  albumPhotos = [],
  personalPages = null,
  reducedMotion = false,
  onPageChange,
  onOrderPrint,
}) {
  const [turning, setTurning] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const stageRef = useRef(null);
  const page = personalPages?.[pageIndex] || null;
  const chapter = page || getBookChapter(pageIndex + 1);
  const photo = albumPhotos[pageIndex]?.data_url || albumPhotos.find((p) => p.data_url)?.data_url;

  const downloadAlbum = useCallback(async () => {
    setDownloading(true);
    try {
      const response = await fetch('/api/personal-album/export');
      if (!response.ok) return;
      const blob = await response.blob();
      const match = /filename="([^"]+)"/.exec(response.headers.get('Content-Disposition') || '');
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = match?.[1] || 'first-year-3d-album.html';
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  }, []);

  const turn = useCallback((delta, kind) => {
    if (turning) return;
    const next = pageIndex + delta;
    if (next < 0 || next >= pageCount) return;
    playTurn(kind);

    if (reducedMotion) {
      onPageChange(next);
      return;
    }

    setTurning(true);
    window.setTimeout(() => {
      onPageChange(next);
      setTurning(false);
    }, FOLD_MS);
  }, [turning, pageIndex, pageCount, reducedMotion, onPageChange]);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return undefined;
    let drag = null;

    const onDown = (event) => {
      if (turning || event.target.closest('button, a')) return;
      drag = { x: event.clientX, y: event.clientY, progress: 0 };
      el.classList.add('is-dragging');
    };
    const onMove = (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      if (Math.abs(dy) > Math.abs(dx) && Math.abs(drag.progress) < 0.08) return;
      drag.progress = Math.max(-1, Math.min(1, -dx / 140));
      el.style.setProperty('--turn', String(drag.progress));
    };
    const onUp = () => {
      if (!drag) return;
      const progress = drag.progress;
      drag = null;
      el.classList.remove('is-dragging');
      el.style.setProperty('--turn', '0');
      if (progress > 0.33) turn(1, 'swipe-next');
      else if (progress < -0.33) turn(-1, 'swipe-back');
    };

    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerup', onUp);
    el.addEventListener('pointercancel', onUp);
    return () => {
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerup', onUp);
      el.removeEventListener('pointercancel', onUp);
    };
  }, [turn, turning]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.target.closest('input, textarea')) return;
      if (event.key === 'ArrowRight') turn(1, 'key-next');
      if (event.key === 'ArrowLeft') turn(-1, 'key-back');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [turn]);

  const depthClass = renderStyle === 'popup'
    ? 'baby-book-spread__depth baby-book-spread__depth--popup'
    : renderStyle === 'snowglobe'
      ? 'baby-book-spread__depth baby-book-spread__depth--globe'
      : 'baby-book-spread__depth baby-book-spread__depth--parallax';

  return (
    <div className="baby-book-spread-viewer">
      <p className="baby-book-spread-viewer__hint">{BOOK_STYLE_HINTS[renderStyle]}</p>

      <div className="baby-book-spread-stage" ref={stageRef}>
        <div className={`baby-book-spread${personalPages ? ' baby-book-spread--album' : ''}${turning ? ' baby-book-spread--turning' : ''}`}>
          <div className="baby-book-spread__left">
            <PageArt page={page} photo={photo} renderStyle={renderStyle} reducedMotion={reducedMotion} />
            {!personalPages && <div className={depthClass} aria-hidden="true" />}
            <span className="baby-book-spread__album-tag">{page ? page.monthLabel : `Month ${pageIndex + 1}`}</span>
          </div>
          <div className="baby-book-spread__spine" aria-hidden="true" />
          <div className="baby-book-spread__right">
            <div className="baby-book-spread__mark" aria-hidden="true">
              <span>{page ? String(page.month).padStart(2, '0') : String(pageIndex + 1).padStart(2, '0')}</span>
            </div>
            <span className="baby-book-spread__chap-tag">{page ? page.when : `Chapter ${pageIndex + 1}`}</span>
            <p className="baby-book-spread__chap-title">{chapter.title}</p>
            <p className="baby-book-spread__chap-caption">{page ? page.caption : `“${chapter.caption}”`}</p>
            {!page && <p className="baby-book-spread__chap-mile">✦ {chapter.milestone}</p>}
          </div>
          <div className={`baby-book-spread__turn-page${turning ? ' baby-book-spread__turn-page--on' : ''}`} aria-hidden="true" />
        </div>
      </div>

      <div className="baby-book-spread-controls">
        <button type="button" className="baby-book-btn baby-book-btn--ghost" disabled={pageIndex <= 0} onClick={() => turn(-1, 'button-back')}>
          ‹
        </button>
        <span className="baby-book-spread-controls__label">
          Spread {pageIndex + 1} of {pageCount}
        </span>
        <button type="button" className="baby-book-btn baby-book-btn--primary" disabled={pageIndex >= pageCount - 1} onClick={() => turn(1, 'button-next')}>
          ›
        </button>
      </div>

      <div className="baby-book-spread-actions">
        <button type="button" className="baby-book-btn baby-book-btn--primary" onClick={onOrderPrint}>
          Order the printed book
        </button>
        {personalPages ? (
          <button
            type="button"
            className="baby-book-btn baby-book-btn--ghost"
            onClick={downloadAlbum}
            disabled={downloading}
          >
            {downloading ? 'Preparing…' : 'Download this album'}
          </button>
        ) : (
          <button
            type="button"
            className="baby-book-btn baby-book-btn--ghost"
            onClick={() => window.alert('Interactive 3D album download — coming soon on Plus.')}
          >
            Download interactive 3D album
          </button>
        )}
      </div>
      {personalPages && (
        <p className="baby-book-spread-viewer__hint">
          Open personal/first-year-3d-album.html on your phone. Turn pages by hand, or press Play and set how many seconds each page stays. Reel saves a vertical video for Instagram, WhatsApp Status, or a Facebook Story.
        </p>
      )}
    </div>
  );
}

export default BookSpreadViewer;
