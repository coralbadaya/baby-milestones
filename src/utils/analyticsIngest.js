import { supabase } from './supabaseClient';
import {
  isAllowedEventName,
  referrerHostFromUrl,
  routeKeyFromPath,
  sanitizeAnalyticsProps,
  utmFromSearch,
} from './analyticsEvents';
import { isAnalyticsConsented } from './cookieConsent';

const SESSION_KEY = 'yarntrailsAnalyticsSession';
const SESSION_AT_KEY = 'yarntrailsAnalyticsSessionAt';
const SESSION_IDLE_MS = 30 * 60 * 1000;

function randomId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function getAnalyticsSessionId() {
  if (typeof sessionStorage === 'undefined') return { id: randomId(), started: true };
  const now = Date.now();
  let id = sessionStorage.getItem(SESSION_KEY);
  const at = Number(sessionStorage.getItem(SESSION_AT_KEY) || 0);
  if (!id || !at || now - at > SESSION_IDLE_MS) {
    id = randomId();
    sessionStorage.setItem(SESSION_KEY, id);
    sessionStorage.setItem(SESSION_AT_KEY, String(now));
    return { id, started: true };
  }
  sessionStorage.setItem(SESSION_AT_KEY, String(now));
  return { id, started: false };
}

/**
 * Send a first-party event to /api/analytics.
 * @param {string} name
 * @param {Record<string, unknown>} [params]
 * @param {{ ignoreConsent?: boolean, path?: string }} [opts]
 */
export async function ingestAnalyticsEvent(name, params = {}, opts = {}) {
  if (typeof window === 'undefined') return;
  if (!isAllowedEventName(name)) return;
  if (!opts.ignoreConsent && !isAnalyticsConsented()) return;

  const path = opts.path || `${window.location.pathname}${window.location.search}`;
  if (path.startsWith('/admin')) return;

  const session = getAnalyticsSessionId();
  const search = window.location.search;
  const utm = utmFromSearch(search);

  const body = {
    event_name: name,
    session_id: session.id,
    path: path.split('#')[0].slice(0, 240),
    route_key: routeKeyFromPath(path),
    referrer_host: referrerHostFromUrl(document.referrer),
    ...utm,
    props: sanitizeAnalyticsProps(params),
  };

  let authorization;
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session?.access_token) {
      authorization = `Bearer ${data.session.access_token}`;
    }
  } catch {
    /* anonymous */
  }

  const headers = { 'Content-Type': 'application/json' };
  if (authorization) headers.Authorization = authorization;

  try {
    if (session.started && name !== 'session_start' && name !== 'consent_rejected') {
      await fetch('/api/analytics', {
        method: 'POST',
        headers,
        body: JSON.stringify({ ...body, event_name: 'session_start' }),
        keepalive: true,
      });
    }
    await fetch('/api/analytics', {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      keepalive: true,
    });
  } catch {
    /* swallow — analytics must not break the app */
  }
}
