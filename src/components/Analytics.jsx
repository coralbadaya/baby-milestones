import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import { useCookieConsent } from '../context/CookieConsentContext';
import { initAnalytics, trackPageView } from '../utils/analytics';

function skipAdmin(event) {
  try {
    if (new URL(event.url, window.location.origin).pathname.startsWith('/admin')) return null;
  } catch {
    if (String(event.url).includes('/admin')) return null;
  }
  return event;
}

/** Cookieless Vercel page counts on public pages. First-party Insights and GA4 wait for consent. */
function Analytics() {
  const location = useLocation();
  const { analyticsAllowed } = useCookieConsent();
  const isAdmin = location.pathname.startsWith('/admin');

  useEffect(() => {
    if (analyticsAllowed) initAnalytics();
  }, [analyticsAllowed]);

  useEffect(() => {
    if (!analyticsAllowed) return;
    const path = `${location.pathname}${location.search}${location.hash}`;
    trackPageView(path);
  }, [analyticsAllowed, location.pathname, location.search, location.hash]);

  if (isAdmin) return null;

  return (
    <VercelAnalytics
      path={`${location.pathname}${location.search}`}
      route={location.pathname}
      beforeSend={skipAdmin}
    />
  );
}

export default Analytics;
