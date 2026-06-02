import { describe, it, expect } from 'vitest';
import {
  getPostpartumWeek,
  getPostpartumMonth,
  isCurrentPeriod,
  getOverallMomMilestoneProgress,
} from './momMilestones';
import { momMilestonePeriods } from '../data/momMilestones';

describe('momMilestones', () => {
  const birth = '2025-01-01';

  it('computes postpartum week from birth date', () => {
    const week = getPostpartumWeek(birth);
    expect(week).toBeTypeOf('number');
    expect(week).toBeGreaterThanOrEqual(0);
  });

  it('computes postpartum month from birth date', () => {
    const month = getPostpartumMonth(birth);
    expect(month).toBeTypeOf('number');
    expect(month).toBeGreaterThanOrEqual(1);
    expect(month).toBeLessThanOrEqual(12);
  });

  it('marks current period for week-based windows', () => {
    const period = momMilestonePeriods.find((p) => p.id === 'pp-weeks-0-2');
    expect(period).toBeDefined();
    expect(isCurrentPeriod(period, birth)).toBeTypeOf('boolean');
  });

  it('tracks overall progress', () => {
    const { total, done } = getOverallMomMilestoneProgress({ 'pp-w02-1': true });
    expect(total).toBeGreaterThan(30);
    expect(done).toBe(1);
  });
});
