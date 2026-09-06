import { describe, expect, it } from 'vitest';
import {
  isAllowedEventName,
  monthFromMilestoneId,
  referrerHostFromUrl,
  routeKeyFromPath,
  sanitizeAnalyticsProps,
  utmFromSearch,
  validateAnalyticsPayload,
} from './analyticsEvents';

describe('analyticsEvents', () => {
  it('allowlists product events and rejects unknown names', () => {
    expect(isAllowedEventName('page_view')).toBe(true);
    expect(isAllowedEventName('subscribe_success')).toBe(true);
    expect(isAllowedEventName('export_4k_requested')).toBe(false);
  });

  it('normalizes route keys', () => {
    expect(routeKeyFromPath('/')).toBe('today');
    expect(routeKeyFromPath('/month/5')).toBe('month');
    expect(routeKeyFromPath('/guides/sleep')).toBe('guide');
    expect(routeKeyFromPath('/premium')).toBe('premium');
    expect(routeKeyFromPath('/admin/insights')).toBe('admin');
  });

  it('keeps allowlisted props and drops baby PII', () => {
    expect(sanitizeAnalyticsProps({
      month: 5,
      guide_slug: 'sleep',
      baby_name: 'Ada',
      note: 'first smile',
      vaccine_id: 'dtap',
    })).toEqual({ month: 5, guide_slug: 'sleep' });
  });

  it('clamps month and parses milestone ids', () => {
    expect(sanitizeAnalyticsProps({ month: 99 })).toEqual({ month: 36 });
    expect(monthFromMilestoneId('p5-1')).toBe(5);
    expect(monthFromMilestoneId('m12-3')).toBe(12);
    expect(monthFromMilestoneId('other')).toBeNull();
  });

  it('parses utm and referrer host', () => {
    expect(utmFromSearch('?utm_source=ig&utm_medium=social&utm_campaign=launch')).toEqual({
      utm_source: 'ig',
      utm_medium: 'social',
      utm_campaign: 'launch',
    });
    expect(referrerHostFromUrl('https://www.google.com/search')).toBe('google.com');
    expect(referrerHostFromUrl('not-a-url')).toBeNull();
  });

  it('validates ingest payloads and skips admin paths', () => {
    const session = 'aaaaaaaa-bbbb-4ccc-8ddd-eeeeeeeeeeee';
    expect(validateAnalyticsPayload({
      event_name: 'page_view',
      session_id: session,
      path: '/baby',
    }).ok).toBe(true);

    expect(validateAnalyticsPayload({ event_name: 'not_real', session_id: session }).error)
      .toBe('Unknown event');
    expect(validateAnalyticsPayload({
      event_name: 'page_view',
      session_id: session,
      path: '/admin/insights',
    }).error).toBe('Skipped');
  });
});
