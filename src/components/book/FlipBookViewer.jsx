import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntitlements } from '../../hooks/useEntitlements';
import PremiumGate from '../PremiumGate';
import { PREMIUM_FEATURES } from '../../constants/premium';
import { ROUTES } from '../../routes';
import { playTurn } from '../../utils/pageTurnFeel';
import RenderStyleSelector from './RenderStyleSelector';
import BookSpreadViewer from './BookSpreadViewer';

function FlipBookViewer({ albumPhotos = [], personalAlbum = null }) {
  const navigate = useNavigate();
  const { isPlus } = useEntitlements();
  const [renderStyle, setRenderStyle] = useState('parallax');
  const [pageIndex, setPageIndex] = useState(0);

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const personalPages = personalAlbum?.pages || null;
  const pageCount = personalPages?.length || 12;

  const viewer = (
    <div>
      <h2 className="baby-book-section-title">
        {personalAlbum ? personalAlbum.title : 'The 3D Keepsake'}
      </h2>
      <p className="baby-book-section-sub">
        {personalAlbum
          ? 'Ordered by the time each photo was taken, from the morning of 22 January 2026. Parallax, pop-up, and snow-globe use the same pages.'
          : 'Your year, in your hands — pick a render style and turn the pages.'}
      </p>

      <RenderStyleSelector
        activeStyle={renderStyle}
        onChange={(id) => {
          playTurn(id === 'snowglobe' ? 'style-globe' : `style-${id}`);
          setRenderStyle(id);
        }}
      />

      <BookSpreadViewer
        pageIndex={pageIndex}
        pageCount={pageCount}
        renderStyle={renderStyle}
        albumPhotos={albumPhotos}
        personalPages={personalPages}
        reducedMotion={reducedMotion}
        onPageChange={setPageIndex}
        onOrderPrint={() => navigate(ROUTES.babyBookTab('family'))}
      />

      {!isPlus && !personalPages && (
        <p className="baby-book-section-sub baby-book-spread-viewer__gate-note">
          Basic: 2D preview with watermark. Plus unlocks full 3D parallax export.
        </p>
      )}
    </div>
  );

  if (!isPlus && !personalPages) {
    return (
      <PremiumGate feature={PREMIUM_FEATURES.flipBookFull}>
        {viewer}
      </PremiumGate>
    );
  }

  return viewer;
}

export default FlipBookViewer;
