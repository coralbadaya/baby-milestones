import { describe, expect, it } from 'vitest';
import { formatAdminDateTime } from './adminFormat.js';

describe('formatAdminDateTime', () => {
  it('returns an em dash for missing values', () => {
    expect(formatAdminDateTime(null)).toBe('—');
    expect(formatAdminDateTime('')).toBe('—');
  });

  it('returns an em dash for invalid dates', () => {
    expect(formatAdminDateTime('not-a-date')).toBe('—');
  });

  it('includes a time for valid timestamps', () => {
    const formatted = formatAdminDateTime('2026-09-06T06:37:50.000Z');
    expect(formatted).not.toBe('—');
    expect(formatted).toMatch(/\d/);
    expect(formatted.toLowerCase()).toMatch(/:|am|pm/);
  });
});
