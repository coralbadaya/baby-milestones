import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  getAnalyticsConsent,
  hasAnalyticsConsentDecision,
  writeCookieConsent,
} from '../utils/cookieConsent';
import { ingestAnalyticsEvent } from '../utils/analyticsIngest';

/** @typedef {'accepted' | 'rejected' | null} ConsentValue */

const CookieConsentContext = createContext(null);

export function CookieConsentProvider({ children }) {
  const analyticsConfigured = true;
  const [consent, setConsent] = useState(() => getAnalyticsConsent());
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  const needsPrompt = !hasAnalyticsConsentDecision() && consent === null;
  const showBanner = needsPrompt || preferencesOpen;

  const acceptAnalytics = useCallback(() => {
    writeCookieConsent('accepted');
    setConsent('accepted');
    setPreferencesOpen(false);
    ingestAnalyticsEvent('consent_accepted', {}, { ignoreConsent: true });
  }, []);

  const rejectAnalytics = useCallback(() => {
    writeCookieConsent('rejected');
    setConsent('rejected');
    setPreferencesOpen(false);
    ingestAnalyticsEvent('consent_rejected', {}, { ignoreConsent: true });
  }, []);

  const openPreferences = useCallback(() => {
    setPreferencesOpen(true);
  }, []);

  const closePreferences = useCallback(() => {
    setPreferencesOpen(false);
  }, []);

  const value = useMemo(() => ({
    analyticsConfigured,
    consent,
    analyticsAllowed: consent === 'accepted',
    showBanner,
    acceptAnalytics,
    rejectAnalytics,
    openPreferences,
    closePreferences,
  }), [
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
