/** Allowlisted first-party analytics events and payload sanitizers. */

export const ANALYTICS_EVENT_NAMES = [
  'page_view',
  'session_start',
  'consent_accepted',
  'consent_rejected',
  'signup_view',
  'signup_completed',
  'login_completed',
  'premium_view',
  'begin_checkout',
  'subscribe_success',
  'trial_started',
  'gate_hit',
  'birth_date_set',
  'milestone_checked',
  'first_saved',
  'guide_view',
  'community_tab',
];

const EVENT_SET = new Set(ANALYTICS_EVENT_NAMES);

export const ANALYTICS_PROP_KEYS = [
  'month',
  'guide_slug',
  'sku',
  'feature',
  'media_type',
  'tab',
];

const PROP_SET = new Set(ANALYTICS_PROP_KEYS);

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isAllowedEventName(name) {
  return EVENT_SET.has(String(name || ''));
}

export function isSessionId(value) {
  return UUID_RE.test(String(value || ''));
}

/** @param {string} path */
export function routeKeyFromPath(path) {
  const raw = String(path || '/').split('?')[0].split('#')[0] || '/';
  if (raw === '/') return 'today';
  if (raw.startsWith('/month/')) return 'month';
  if (raw.startsWith('/guides/') && raw !== '/guides') return 'guide';
  if (raw.startsWith('/community')) return 'community';
  if (raw.startsWith('/baby/book')) return 'baby-book';
  if (raw.startsWith('/admin')) return 'admin';
  const first = raw.replace(/^\//, '').split('/')[0];
  return first || 'other';
}

/** @param {Record<string, unknown>} [props] */
export function sanitizeAnalyticsProps(props) {
  const out = {};
  if (!props || typeof props !== 'object') return out;
  for (const key of ANALYTICS_PROP_KEYS) {
    if (props[key] == null || props[key] === '') continue;
    if (!PROP_SET.has(key)) continue;
    const value = props[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      out[key] = key === 'month' ? Math.max(1, Math.min(36, Math.round(value))) : value;
    } else if (typeof value === 'boolean') {
      out[key] = value;
    } else {
      out[key] = String(value).slice(0, 80);
    }
  }
  return out;
}

export function utmFromSearch(search) {
  const params = new URLSearchParams(String(search || '').replace(/^\?/, ''));
  const pick = (key) => {
    const v = params.get(key);
    return v ? v.slice(0, 80) : null;
  };
  return {
    utm_source: pick('utm_source'),
    utm_medium: pick('utm_medium'),
    utm_campaign: pick('utm_campaign'),
  };
}

export function referrerHostFromUrl(referrer) {
  if (!referrer || typeof referrer !== 'string') return null;
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, '');
    return host.slice(0, 120) || null;
  } catch {
    return null;
  }
}

/**
 * @param {unknown} body
 * @returns {{ ok: true, payload: object } | { ok: false, error: string }}
 */
export function validateAnalyticsPayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, error: 'Invalid body' };
  }
  const eventName = String(body.event_name || body.name || '');
  if (!isAllowedEventName(eventName)) {
    return { ok: false, error: 'Unknown event' };
  }
  const sessionId = String(body.session_id || '');
  if (!isSessionId(sessionId)) {
    return { ok: false, error: 'Invalid session' };
  }
  const path = String(body.path || '/').slice(0, 240);
  if (path.startsWith('/admin')) {
    return { ok: false, error: 'Skipped' };
  }
  return {
    ok: true,
    payload: {
      event_name: eventName,
      session_id: sessionId,
      path,
      route_key: body.route_key ? String(body.route_key).slice(0, 64) : routeKeyFromPath(path),
      referrer_host: body.referrer_host ? String(body.referrer_host).slice(0, 120) : null,
      utm_source: body.utm_source ? String(body.utm_source).slice(0, 80) : null,
      utm_medium: body.utm_medium ? String(body.utm_medium).slice(0, 80) : null,
      utm_campaign: body.utm_campaign ? String(body.utm_campaign).slice(0, 80) : null,
      props: sanitizeAnalyticsProps(body.props || body),
    },
  };
}

/** @param {string} milestoneId */
export function monthFromMilestoneId(milestoneId) {
  const match = String(milestoneId || '').match(/^[a-z](\d+)/i);
  if (!match) return null;
  const month = Number(match[1]);
  return month >= 1 && month <= 36 ? month : null;
}
