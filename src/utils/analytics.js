/** @typedef {Record<string, string | number | boolean | undefined>} AnalyticsParams */

import { ingestAnalyticsEvent } from './analyticsIngest';

const GA_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const GTM_ID = (
  typeof import.meta.env.VITE_GTM_CONTAINER_ID === 'string'
  && import.meta.env.VITE_GTM_CONTAINER_ID.trim()
)
  ? import.meta.env.VITE_GTM_CONTAINER_ID.trim()
  : 'GTM-T7HG74HL';

/** @returns {boolean} */
export function isGtmEnabled() {
  return typeof GTM_ID === 'string' && GTM_ID.length > 0;
}

/** @returns {boolean} */
export function isGaMeasurementConfigured() {
  return typeof GA_ID === 'string' && GA_ID.trim().length > 0;
}

/** Google Tag Manager and/or GA4 measurement ID (after consent). */
export function isAnalyticsEnabled() {
  return isGtmEnabled() || isGaMeasurementConfigured();
}

/** First-party Insights ingest is always available; GA is optional. */
export function isFirstPartyAnalyticsEnabled() {
  return true;
}

/** @returns {string | undefined} */
export function getGaMeasurementId() {
  return isGaMeasurementConfigured() ? GA_ID.trim() : undefined;
}

/** @returns {string | undefined} */
export function getGtmContainerId() {
  return isGtmEnabled() ? GTM_ID : undefined;
}

let initialized = false;

function bootstrapDataLayer() {
  window.dataLayer = window.dataLayer || [];
  if (!window.gtag) {
    window.gtag = function gtag(...args) {
      window.dataLayer.push(args);
    };
    window.gtag('js', new Date());
  }
}

function appendScriptOnce(src, matchSubstring) {
  if (document.querySelector(`script[src*="${matchSubstring}"]`)) return;
  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  document.head.appendChild(script);
}

/** Load GTM and/or gtag.js once when configured — only after consent. */
export function initAnalytics() {
  if (!isAnalyticsEnabled() || initialized || typeof window === 'undefined') return;
  initialized = true;

  bootstrapDataLayer();

  if (isGtmEnabled()) {
    appendScriptOnce(
      `https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(GTM_ID)}`,
      'gtm.js',
    );
  }

  if (isGaMeasurementConfigured()) {
    window.gtag('config', GA_ID.trim(), {
      send_page_view: false,
      anonymize_ip: true,
    });
    appendScriptOnce(
      `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(GA_ID.trim())}`,
      'gtag/js',
    );
  }
}

/**
 * Track a SPA page view. Skips admin staff routes.
 * @param {string} path
 * @param {string} [title]
 */
export function trackPageView(path, title) {
  if (typeof window === 'undefined') return;
  if (path.startsWith('/admin')) return;

  ingestAnalyticsEvent('page_view', {}, { path });

  if (!isAnalyticsEnabled() || !window.gtag) return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title || document.title,
  });
}

/**
 * Track a custom event (GA4/GTM dataLayer when configured + first-party ingest).
 * @param {string} name
 * @param {AnalyticsParams} [params]
 */
export function trackEvent(name, params = {}) {
  if (typeof window === 'undefined') return;
  ingestAnalyticsEvent(name, params);
  if (!isAnalyticsEnabled() || !window.gtag) return;
  window.gtag('event', name, params);
}