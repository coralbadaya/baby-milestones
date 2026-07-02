import { describe, it, expect } from 'vitest';
import { getMonthlyChapterReminder, getTimeCapsuleUnlockYear } from './bookReminders';

describe('bookReminders', () => {
  it('returns fallback when no birth date', () => {
    const r = getMonthlyChapterReminder(null);
    expect(r.message).toContain('birth date');
  });

  it('computes unlock year as birth + 18', () => {
    expect(getTimeCapsuleUnlockYear('2024-06-15')).toBe(2042);
  });

  it('includes month turn in reminder', () => {
    const birth = new Date();
    birth.setMonth(birth.getMonth() - 6);
    const r = getMonthlyChapterReminder(birth.toISOString().slice(0, 10), 'Aria');
    expect(r.monthTurn).toBeGreaterThan(6);
    expect(r.message).toContain('Aria');
  });
});
