import { useCallback, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { buildAlbumHtml } from '../../book/albumHtml';
import { BOOK_CHAPTERS } from '../../data/bookChapters';
import { useEntitlements } from '../../hooks/useEntitlements';
import { PREMIUM_FEATURES } from '../../constants/premium';
import PremiumGate from '../PremiumGate';

function chapterAlbum({ babyName, birthDate, photos }) {
  const pictures = photos.map((photo) => photo?.data_url).filter(Boolean);
  const pages = BOOK_CHAPTERS.map((chapter, index) => ({
    file: pictures[index] || '',
    src: pictures[index] || '',
    monthLabel: `Month ${chapter.month}`,
    title: chapter.title,
    caption: chapter.caption,
    when: chapter.milestone,
  }));
  pages.push({
    ending: true,
    file: '',
    monthLabel: 'The close',
    title: 'The close',
    caption: 'One year of you. The next chapter is still being lived.',
    when: babyName || '',
  });
  return {
    title: babyName ? `${babyName}'s first year` : 'The first year',
    babyName: babyName || 'Your little one',
    dob: birthDate || '',
    pages,
  };
}

function saveHtml(filename, html) {
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function FlipBookViewer({
  albumPhotos = [],
  personalAlbum = null,
  albumReady = true,
  babyName = '',
  birthDate = '',
  downloadSlot = null,
}) {
  const { isPlus } = useEntitlements();
  const [downloading, setDownloading] = useState(false);
  const personal = Boolean(personalAlbum?.pages?.length);
  const album = useMemo(
    () => (personal ? personalAlbum : chapterAlbum({ babyName, birthDate, photos: albumPhotos })),
    [personal, personalAlbum, babyName, birthDate, albumPhotos],
  );
  const html = useMemo(
    () => (albumReady ? buildAlbumHtml(album, { embedded: true, inlinePhotos: true }) : ''),
    [album, albumReady],
  );

  const downloadAlbum = useCallback(async () => {
    setDownloading(true);
    try {
      if (personal) {
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
        return;
      }
      saveHtml('first-year-3d-album.html', buildAlbumHtml(album));
    } finally {
      setDownloading(false);
    }
  }, [album, personal]);

  const downloadButton = (
    <button
      type="button"
      className="baby-book-btn baby-book-btn--ghost"
      onClick={downloadAlbum}
      disabled={!albumReady || downloading}
    >
      {downloading ? 'Preparing…' : 'E-copy'}
    </button>
  );

  if (!albumReady) {
    return <p className="baby-book-section-sub">Opening the book…</p>;
  }

  const viewer = (
    <div className="baby-book-album">
      {downloadSlot ? createPortal(downloadButton, downloadSlot) : downloadButton}
      <iframe
        className="baby-book-album-frame"
        title={album.title}
        srcDoc={html}
      />
    </div>
  );

  if (!isPlus && !personal) {
    return (
      <PremiumGate feature={PREMIUM_FEATURES.flipBookFull}>
        {viewer}
      </PremiumGate>
    );
  }

  return viewer;
}

export default FlipBookViewer;
