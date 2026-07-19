import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';

function AnnualTrialOffer({ open, onClose, onAccept }) {
  if (!open) return null;

  return (
    <div className="baby-book-modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="trial-title">
      <div className="baby-book-modal baby-book-glass">
        <h2 id="trial-title">Your first story is ready</h2>
        <p>
          Turn every month into a illustrated page. Try Yarn Trails Plus free for 7 days
          on the annual plan — unlimited stories, voice narration, and the full 3D book.
        </p>
        <div className="baby-book-modal__actions">
          <button type="button" className="baby-book-btn baby-book-btn--primary" onClick={onAccept}>
            Start 7-day trial
          </button>
          <Link to={ROUTES.premium} className="baby-book-btn baby-book-btn--ghost" onClick={onClose}>
            Compare plans
          </Link>
          <button type="button" className="baby-book-btn baby-book-btn--ghost" onClick={onClose}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnnualTrialOffer;
