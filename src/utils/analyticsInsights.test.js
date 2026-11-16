import { describe, expect, it } from 'vitest';
import {
  buildInsightsSummary,
  seriesDelta,
  sliceSeriesForDays,
  sumSeries,
} from './analyticsInsights';

const ROWS = [
  { day: '2026-01-01', sessions: 10, pageviews: 20 },
  { day: '2026-01-02', sessions: 5, pageviews: 8 },
  { day: '2026-01-03', sessions: 15, pageviews: 30 },
  { day: '2026-01-04', sessions: 0, pageviews: 0 },
  { day: '2026-01-05', sessions: 20, pageviews: 40 },
];

describe('analyticsInsights', () => {
  it('slices and sums series', () => {
    const points = sliceSeriesForDays(ROWS, 'sessions', '2');
    expect(points).toHaveLength(2);
    expect(points[0].value).toBe(0);
    expect(points[1].value).toBe(20);
    expect(sumSeries(points)).toBe(20);
  });

  it('computes period delta', () => {
    const { current, previous, label } = seriesDelta(ROWS, 'sessions', 2);
    expect(current).toBe(20);
    expect(previous).toBe(20);
    expect(label).toContain('%');
  });

  it('builds summary bullets', () => {
    const bullets = buildInsightsSummary({
      overview: {
        sessions: 100,
        pageviews: 200,
        signups: 5,
        paid: 1,
        prev_sessions: 80,
        prev_paid: 0,
        mobile_views: 120,
      },
      routes: [{ route_key: '/', pageviews: 50 }],
      funnel: [
        { event_name: 'premium_view', sessions: 10 },
        { event_name: 'begin_checkout', sessions: 4 },
      ],
      habit: { birth_date_set: 3 },
      days: 7,
    });
    expect(bullets.length).toBeGreaterThan(0);
    expect(bullets[0]).toMatch(/sessions/);
  });
});