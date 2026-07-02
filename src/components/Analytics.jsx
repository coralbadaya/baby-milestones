import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookieConsent } from '../context/CookieConsentContext';
import { initAnalytics, trackPageView } from '../utils/analytics';

/** GA4 — loads only after analytics consent; tracks route changes (excludes `/admin`). */
function Analytics() {
  const location = useLocation();
  const { analyticsAllowed } = useCookieConsent();

  useEffect(() => {
    if (analyticsAllowed) initAnalytics();
  }, [analyticsAllowed]);

  useEffect(() => {
    if (!analyticsAllowed) return;
    const path = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(path);
  }, [analyticsAllowed, location.pathname, location.search, location.hash]);

  return null;
}

export default Analytics;
