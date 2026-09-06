/** Date range + display helpers for staff Insights. */

export function analyticsRange(days) {
  const n = Number(days) || 7;
  const now = new Date();
  const to = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  const from = new Date(to);
  from.setUTCDate(from.getUTCDate() - (n - 1));
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export function formatRate(num, den) {
  const n = Number(num) || 0;
  const d = Number(den) || 0;
  if (!d) return '—';
  return `${((n / d) * 100).toFixed(1)}%`;
}

export function formatDelta(current, previous) {
  const c = Number(current) || 0;
  const p = Number(previous) || 0;
  if (p === 0) return c === 0 ? 'vs prior period' : 'New vs prior period';
  const pct = Math.round(((c - p) / p) * 100);
  const sign = pct > 0 ? '+' : '';
  return `${sign}${pct}% vs prior period`;
}

export function bounceRate(bounced, sessions) {
  return formatRate(bounced, sessions);
}
