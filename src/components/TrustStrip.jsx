import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';

/**
 * Honest E-E-A-T line with links to research, disclaimer, and privacy.
 */
function TrustStrip({ className = '', showPrivacyNote = false }) {
  const onLink = () => interact('tap', 'light');

  return (
    <aside className={`trust-strip ${className}`.trim()} aria-label="Trust and sources">
      <p className="trust-strip__line">
        Educational guidance sourced from WHO, CDC, and AAP — not a substitute for your pediatrician.
      </p>
      <p className="trust-strip__links">
        <Link to={ROUTES.editorialPolicy} onClick={onLink}>How We Research</Link>
        <span aria-hidden="true"> · </span>
        <Link to={ROUTES.medicalDisclaimer} onClick={onLink}>Medical Disclaimer</Link>
        <span aria-hidden="true"> · </span>
        <Link to={ROUTES.privacy} onClick={onLink}>Privacy Policy</Link>
      </p>
      {showPrivacyNote && (
        <p className="trust-strip__note">
          Your baby&apos;s details stay on your device until you create an account.
        </p>
      )}
    </aside>
  );
}

export default TrustStrip;
