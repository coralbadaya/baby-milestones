import { describe, it, expect, beforeEach } from 'vitest';
import {
  splitLegacyChecks,
  unionChecks,
  isShopItemId,
  isDomainMerged,
  markDomainMerged,
  mergeBabyIdentity,
  migrateLegacyShoppingSplit,
  MILESTONE_CHECKS_KEY,
  SHOPPING_CHECKS_KEY,
  SHOPPING_SPLIT_KEY,
} from './cloudMerge';

describe('cloudMerge', () => {
  beforeEach(() => {
    const store = {};
    globalThis.localStorage = {
      getItem: (k) => store[k] ?? null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
      clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
    };
  });

  it('detects shop item ids', () => {
    expect(isShopItemId('shop-pram')).toBe(true);
    expect(isShopItemId('p4-1')).toBe(false);
  });

  it('splits legacy shared checkedItems into milestones vs shopping', () => {
    const { milestones, shopping } = splitLegacyChecks({
      'p4-1': true,
      'e4-1': true,
      'shop-pram': true,
      'shop-carrier': false,
      'p4-2': false,
    });
    expect(milestones).toEqual({ 'p4-1': true, 'e4-1': true });
    expect(shopping).toEqual({ 'shop-pram': true });
  });

  it('unions checklist maps (checked if either side is checked)', () => {
    expect(unionChecks({ 'p4-1': true }, ['p4-1', 'e4-1'])).toEqual({
      'p4-1': true,
      'e4-1': true,
    });
  });

  it('migrates shop-* ids out of babyMilestoneChecks once', () => {
    localStorage.setItem(MILESTONE_CHECKS_KEY, JSON.stringify({
      'p4-1': true,
      'shop-pram': true,
    }));
    migrateLegacyShoppingSplit();
    expect(JSON.parse(localStorage.getItem(MILESTONE_CHECKS_KEY))).toEqual({ 'p4-1': true });
    expect(JSON.parse(localStorage.getItem(SHOPPING_CHECKS_KEY))).toEqual({ 'shop-pram': true });
    expect(localStorage.getItem(SHOPPING_SPLIT_KEY)).toBe('1');

    localStorage.setItem(MILESTONE_CHECKS_KEY, JSON.stringify({ 'e4-1': true, 'shop-bibs': true }));
    migrateLegacyShoppingSplit();
    expect(JSON.parse(localStorage.getItem(MILESTONE_CHECKS_KEY))).toEqual({ 'e4-1': true, 'shop-bibs': true });
  });

  it('uses cloud baby identity when birth_date is set', () => {
    const merged = mergeBabyIdentity('Local', '2024-01-01', {
      name: 'Aria',
      birth_date: '2024-06-01',
    });
    expect(merged.birthDate).toBe('2024-06-01');
    expect(merged.name).toBe('Aria');
    expect(merged.source).toBe('cloud');
  });

  it('pushes local baby identity when cloud birth_date is empty', () => {
    const merged = mergeBabyIdentity('Luna', '2024-03-01', { name: 'Baby', birth_date: null });
    expect(merged.birthDate).toBe('2024-03-01');
    expect(merged.name).toBe('Luna');
    expect(merged.source).toBe('local');
  });

  it('accumulates cloud-merge domain flags for the same user', () => {
    markDomainMerged('user-1', 'firsts');
    markDomainMerged('user-1', 'identity');
    expect(isDomainMerged('user-1', 'firsts')).toBe(true);
    expect(isDomainMerged('user-1', 'identity')).toBe(true);
    expect(isDomainMerged('user-1', 'milestones')).toBe(false);
  });
});
