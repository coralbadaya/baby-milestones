import { Link } from 'react-router-dom';
import { useCookieConsent } from '../context/CookieConsentContext';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';

function CookieConsentBanner() {
  const {
    showBanner,
    consent,
    acceptAnalytics,
    rejectAnalytics,
    closePreferences,
  } = useCookieConsent();

  if (!showBanner) return null;

  const isUpdating = consent !== null;

  return (
    <div
      className="cookie-consent"
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-consent-title"
      aria-describedby="cookie-consent-desc"
    >
      <div className="cookie-consent-inner">
        <div className="cookie-consent-copy">
          <p id="cookie-consent-title" className="cookie-consent-title">
            {isUpdating ? 'Cookie preferences' : 'We respect your privacy'}
          </p>
          <p id="cookie-consent-desc" className="cookie-consent-desc">
            {isUpdating ? (
              <>
                Choose whether Nestbean may use optional analytics cookies to understand aggregate
                usage. Essential storage for your entries always stays on your device.
              </>
            ) : (
              <>
                We use essential storage so the app works on your device. With your permission,
                we also use Google Analytics for anonymous, aggregate usage insights — helpful
                for EU/UK visitors and anyone who prefers an opt-in choice.
                {' '}
                <Link to={ROUTES.cookies} className="cookie-consent-link">Cookie Policy</Link>
              </>
            )}
          </p>
        </div>
        <div className="cookie-consent-actions">
          <button
            type="button"
            className="cookie-consent-btn cookie-consent-btn--primary"
            onClick={() => {
              interact('tap', 'light');
              acceptAnalytics();
            }}
          >
            Accept analytics
          </button>
          <button
            type="button"
            className="cookie-consent-btn cookie-consent-btn--ghost"
            onClick={() => {
              interact('tap', 'light');
              rejectAnalytics();
            }}
          >
            Essential only
          </button>
          {isUpdating ? (
            <button
              type="button"
              className="cookie-consent-btn cookie-consent-btn--text"
              onClick={() => {
                interact('tap', 'light');
                closePreferences();
              }}
            >
              Close
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default CookieConsentBanner;
