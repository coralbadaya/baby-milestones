import { describe, expect, it } from 'vitest';
import { bounceRate, formatDelta, formatRate } from './analyticsAdmin';

describe('analyticsAdmin', () => {
  it('formats rates and deltas', () => {
    expect(formatRate(8, 100)).toBe('8.0%');
    expect(formatRate(1, 0)).toBe('—');
    expect(formatDelta(12, 10)).toBe('+20% vs prior period');
    expect(formatDelta(8, 10)).toBe('-20% vs prior period');
    expect(bounceRate(25, 100)).toBe('25.0%');
  });
});
