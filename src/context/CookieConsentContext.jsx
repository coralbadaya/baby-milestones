import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { isAnalyticsEnabled } from '../utils/analytics';
import {
  getAnalyticsConsent,
  hasAnalyticsConsentDecision,
  writeCookieConsent,
} from '../utils/cookieConsent';

/** @typedef {'accepted' | 'rejected' | null} ConsentValue */

const CookieConsentContext = createContext(null);

export function CookieConsentProvider({ children }) {
  const analyticsConfigured = isAnalyticsEnabled();
  const [consent, setConsent] = useState(() => (
    analyticsConfigured ? getAnalyticsConsent() : 'rejected'
  ));
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const needsPrompt = analyticsConfigured && !hasAnalyticsConsentDecision() && consent === null;
  const showBanner = analyticsConfigured && (needsPrompt || preferencesOpen);

  const acceptAnalytics = useCallback(() => {
    writeCookieConsent('accepted');
    setConsent('accepted');
    setPreferencesOpen(false);
  }, []);

  const rejectAnalytics = useCallback(() => {
    writeCookieConsent('rejected');
    setConsent('rejected');
    setPreferencesOpen(false);
  }, []);

  const openPreferences = useCallback(() => {
    if (!analyticsConfigured) return;
    setPreferencesOpen(true);
  }, [analyticsConfigured]);

  const closePreferences = useCallback(() => {
    setPreferencesOpen(false);
  }, []);

  const value = useMemo(() => ({
    analyticsConfigured,
    consent,
    analyticsAllowed: analyticsConfigured && consent === 'accepted',
    showBanner,
    acceptAnalytics,
    rejectAnalytics,
    openPreferences,
    closePreferences,
  }), [
    analyticsConfigured,
    consent,
    showBanner,
    acceptAnalytics,
    rejectAnalytics,
    openPreferences,
    closePreferences,
  ]);

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return ctx;
}
