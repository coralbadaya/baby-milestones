import { describe, expect, it } from 'vitest';
import { FOLD_MS, MOBILE_INPUT, MOBILE_ROTATE_X, MOBILE_ROTATE_Y, planTurn } from './index.js';
import {
  FOLD_MS as MOBILE_FOLD_MS,
  MOBILE_INPUT as MOBILE_IN,
  MOBILE_ROTATE_X as MOBILE_RX,
  MOBILE_ROTATE_Y as MOBILE_RY,
  planTurn as mobilePlanTurn,
} from '../../../mobile/lib/bookEngine.ts';

describe('mobile bookEngine sync', () => {
  it('matches shared constants', () => {
    expect(MOBILE_FOLD_MS).toBe(FOLD_MS);
    expect([...MOBILE_IN]).toEqual([...MOBILE_INPUT]);
    expect([...MOBILE_RX]).toEqual([...MOBILE_ROTATE_X]);
    expect([...MOBILE_RY]).toEqual([...MOBILE_ROTATE_Y]);
  });

  it('matches planTurn decisions', () => {
    const state = {
      busy: false,
      index: 0,
      next: 1,
      pageCount: 4,
      reducedMotion: false,
      mode: 'mobile',
    };
    expect(mobilePlanTurn(state)).toEqual(planTurn(state));
  });
});