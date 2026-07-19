import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes';
import { trackEvent } from '../../utils/analytics';
import { interact } from '../../utils/haptics';

const DISMISS_KEY = 'yarntrails-install-prompt-dismissed';

function isMobile() {
  if (typeof navigator === 'undefined') return false;
  return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
}

function InstallPrompt() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!isMobile()) return;
    if (localStorage.getItem(DISMISS_KEY)) return;
    if (window.matchMedia('(display-mode: standalone)').matches) return;
    setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, '1');
    setVisible(false);
  };

  return (
    <div className="install-prompt" role="region" aria-label="Install app">
      <p>
        <strong>Yarn Trails on your home screen</strong>
        {' — '}
        Add to Home Screen for one-tap access to milestones and stories.
      </p>
      <div className="install-prompt__actions">
        <Link
          to={ROUTES.signup}
          className="btn-primary"
          onClick={() => {
            trackEvent('install_banner_click', { action: 'signup' });
            interact('tap', 'light');
            dismiss();
          }}
        >
          Get the app experience
        </Link>
        <button type="button" className="btn-ghost" onClick={dismiss}>
          Not now
        </button>
      </div>
    </div>
  );
}

export default InstallPrompt;
