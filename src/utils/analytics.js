/** @typedef {Record<string, string | number | boolean | undefined>} AnalyticsParams */

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

/** @returns {boolean} */
export function isAnalyticsEnabled() {
  return typeof GA_ID === 'string' && GA_ID.trim().length > 0;
}

/** @returns {string | undefined} */
export function getGaMeasurementId() {
  return isAnalyticsEnabled() ? GA_ID.trim() : undefined;
}

let initialized = false;

/** Load gtag.js once when a measurement ID is configured. */
export function initAnalytics() {
  if (!isAnalyticsEnabled() || initialized || typeof window === 'undefined') return;
  initialized = true;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag(...args) {
    window.dataLayer.push(args);
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID.trim(), {
    send_page_view: false,
    anonymize_ip: true,
  });

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID.trim())}`;
  document.head.appendChild(script);
}

/**
 * Track a SPA page view. Skips admin staff routes.
 * @param {string} path
 * @param {string} [title]
 */
export function trackPageView(path, title) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined' || !window.gtag) return;
  if (path.startsWith('/admin')) return;

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track a custom GA4 event.
 * @param {string} name
 * @param {AnalyticsParams} [params]
 */
export function trackEvent(name, params = {}) {
  if (!isAnalyticsEnabled() || typeof window === 'undefined' || !window.gtag) return;
  window.gtag('event', name, params);
}
