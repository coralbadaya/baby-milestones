import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useEntitlements } from '../../hooks/useEntitlements';
import PremiumGate from '../PremiumGate';
import { PREMIUM_FEATURES } from '../../constants/premium';
import { ROUTES } from '../../routes';
import RenderStyleSelector from './RenderStyleSelector';
import BookSpreadViewer from './BookSpreadViewer';

function FlipBookViewer({ albumPhotos = [] }) {
  const navigate = useNavigate();
  const { isPlus } = useEntitlements();
  const [renderStyle, setRenderStyle] = useState('parallax');
  const [pageIndex, setPageIndex] = useState(0);

  const reducedMotion = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  );

  const pageCount = 12;

  const viewer = (
    <div>
      <h2 className="baby-book-section-title">The 3D Keepsake</h2>
      <p className="baby-book-section-sub">
        Your year, in your hands — pick a render style and turn the pages.
      </p>

      <RenderStyleSelector activeStyle={renderStyle} onChange={setRenderStyle} />

      <BookSpreadViewer
        pageIndex={pageIndex}
        pageCount={pageCount}
        renderStyle={renderStyle}
        albumPhotos={albumPhotos}
        reducedMotion={reducedMotion}
        onPageChange={setPageIndex}
        onOrderPrint={() => navigate(ROUTES.babyBookTab('family'))}
      />

      {!isPlus && (
        <p className="baby-book-section-sub baby-book-spread-viewer__gate-note">
          Basic: 2D preview with watermark. Plus unlocks full 3D parallax export.
        </p>
      )}
    </div>
  );

  if (!isPlus) {
    return (
      <PremiumGate feature={PREMIUM_FEATURES.flipBookFull}>
        {viewer}
      </PremiumGate>
    );
  }

  return viewer;
}

export default FlipBookViewer;
