import { describe, expect, it } from 'vitest';
import {
  milestonePageEnd,
  milestonePageStart,
  shiftMilestonePage,
} from './milestonePage';

describe('milestonePageStart', () => {
  it('shows 4 recent + current + next around mid journey', () => {
    expect(milestonePageStart(11)).toBe(7);
    expect(milestonePageEnd(7)).toBe(12);
  });

  it('starts at month 1 when there is no past', () => {
    expect(milestonePageStart(1)).toBe(1);
    expect(milestonePageStart(3)).toBe(1);
  });

  it('ends on month 36 near the last year', () => {
    expect(milestonePageStart(36)).toBe(31);
    expect(milestonePageEnd(31)).toBe(36);
  });
});

describe('shiftMilestonePage', () => {
  it('pages by 6 and clamps to 1–36', () => {
    expect(shiftMilestonePage(7, -1)).toBe(1);
    expect(shiftMilestonePage(7, 1)).toBe(13);
    expect(shiftMilestonePage(31, 1)).toBe(31);
    expect(shiftMilestonePage(1, -1)).toBe(1);
  });
});
