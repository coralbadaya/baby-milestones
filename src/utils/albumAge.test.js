import { describe, expect, it } from 'vitest';
import { monthAge, monthLabel } from './albumAge';

const DOB = '2026-01-22';

describe('monthAge', () => {
  it('treats the birthday as month 0 and rolls on the same day each month', () => {
    expect(monthAge('2026-01-22T08:47:04', DOB)).toBe(0);
    expect(monthAge('2026-03-03T18:27:13', DOB)).toBe(1);
    expect(monthAge('2026-05-18T21:20:01', DOB)).toBe(3);
    expect(monthAge('2026-05-23T19:30:21', DOB)).toBe(4);
    expect(monthAge('2026-06-22T19:43:47', DOB)).toBe(5);
    expect(monthAge('2026-07-22T20:44:03', DOB)).toBe(6);
    expect(monthAge('2026-10-19T13:12:46', DOB)).toBe(8);
    expect(monthAge('2026-11-06T19:50:58', DOB)).toBe(9);
  });

  it('labels month 0 without adding a year', () => {
    expect(monthLabel(0)).toBe('Month 0');
    expect(monthLabel(9)).toBe('Month 9');
  });
});