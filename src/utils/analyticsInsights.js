import { analyticsRange, formatDelta, formatRate } from './analyticsAdmin';

/** @typedef {{ day: string, sessions?: number, pageviews?: number, signups?: number, paid?: number, birth_dates?: number, milestones?: number, gate_hits?: number }} TimeseriesRow */

export const METRIC_DEFS = {
  sessions: { key: 'sessions', label: 'Sessions', insight: 'Unique browsing sessions (page views + session starts).' },
  pageviews: { key: 'pageviews', label: 'Pageviews', insight: 'All consented page_view events.' },
  signups: { key: 'signups', label: 'Signups', insight: 'Completed signup_completed events.' },
  paid: { key: 'paid', label: 'Paid conversions', insight: 'subscribe_success from Stripe webhook.' },
  birth_dates: { key: 'birth_dates', label: 'Birth dates set', insight: 'birth_date_set habit events.' },
  milestones: { key: 'milestones', label: 'Milestone checks', insight: 'milestone_checked events.' },
  gate_hits: { key: 'gate_hits', label: 'Premium gate hits', insight: 'gate_hit — interest in Plus-gated features.' },
};

/**
 * @param {TimeseriesRow[]} rows
 * @param {string} metricKey
 */
export function sliceSeriesForDays(rows, metricKey, days) {
  const n = Number(days) || 7;
  const sorted = [...(rows || [])].sort((a, b) => String(a.day).localeCompare(String(b.day)));
  const slice = sorted.slice(-n);
  return slice.map((row) => ({
    day: row.day,
    value: Number(row[metricKey]) || 0,
  }));
}

/**
 * @param {{ day: string, value: number }[]} points
 */
export function sumSeries(points) {
  return points.reduce((acc, p) => acc + (p.value || 0), 0);
}

/**
 * Compare current window total vs immediately prior window of same length.
 * @param {TimeseriesRow[]} allRows
 * @param {string} metricKey
 * @param {number} days
 */
export function seriesDelta(allRows, metricKey, days) {
  const sorted = [...(allRows || [])].sort((a, b) => String(a.day).localeCompare(String(b.day)));
  const n = Number(days) || 7;
  const cur = sorted.slice(-n);
  const prev = sorted.slice(-n * 2, -n);
  const current = sumSeries(cur.map((r) => ({ value: r[metricKey] })));
  const previous = sumSeries(prev.map((r) => ({ value: r[metricKey] })));
  return { current, previous, label: formatDelta(current, previous) };
}

/**
 * @param {object} ctx
 */
export function buildInsightsSummary(ctx) {
  const {
    overview,
    routes = [],
    funnel = [],
    habit,
    days,
  } = ctx;

  const bullets = [];
  const sessions = Number(overview?.sessions) || 0;
  const pageviews = Number(overview?.pageviews) || 0;
  const signups = Number(overview?.signups) || 0;
  const paid = Number(overview?.paid) || 0;

  if (sessions === 0 && pageviews === 0) {
    return ['No consented traffic in this range — check cookie banner acceptance and /api/analytics on production.'];
  }

  bullets.push(
    `Last ${days} days: ${sessions.toLocaleString()} sessions, ${pageviews.toLocaleString()} pageviews (${formatDelta(sessions, overview?.prev_sessions)}).`,
  );

  if (signups > 0) {
    bullets.push(
      `${signups.toLocaleString()} signups (${formatRate(signups, sessions)} of sessions); paid: ${paid} (${formatDelta(paid, overview?.prev_paid)}).`,
    );
  }

  const topRoute = routes[0];
  if (topRoute?.route_key) {
    bullets.push(`Top route: ${topRoute.route_key} (${Number(topRoute.pageviews || 0).toLocaleString()} pageviews).`);
  }

  const premium = funnel.find((f) => f.event_name === 'premium_view');
  const checkout = funnel.find((f) => f.event_name === 'begin_checkout');
  if (premium && checkout) {
    const drop = formatRate(checkout.sessions, premium.sessions);
    bullets.push(`Premium → checkout: ${drop} of premium viewers started checkout.`);
  }

  if (habit?.birth_date_set) {
    bullets.push(`${Number(habit.birth_date_set).toLocaleString()} birth dates set in range.`);
  }

  const mobileShare = formatRate(overview?.mobile_views, pageviews);
  if (overview?.mobile_views) {
    bullets.push(`Mobile share of pageviews: ${mobileShare}.`);
  }

  return bullets.slice(0, 6);
}

export { analyticsRange };