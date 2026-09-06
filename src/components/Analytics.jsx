import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCookieConsent } from '../context/CookieConsentContext';
import { initAnalytics, trackPageView } from '../utils/analytics';

/** First-party Insights ingest + optional GA4 after consent. Skips `/admin`. */
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
