import { describe, it, expect, beforeEach } from 'vitest';
import {
  resolveBabyDisplayName,
  babyFirstName,
  loadStoredBabyName,
  saveStoredBabyName,
  BABY_NAME_STORAGE_KEY,
} from './babyName';

describe('babyName', () => {
  beforeEach(() => {
    const store = {};
    globalThis.localStorage = {
      getItem: (k) => store[k] ?? null,
      setItem: (k, v) => { store[k] = String(v); },
      removeItem: (k) => { delete store[k]; },
    };
  });

  it('prefers stored name over profile', () => {
    expect(resolveBabyDisplayName('Aria', 'Parent Name')).toBe('Aria');
  });

  it('falls back to profile first name', () => {
    expect(resolveBabyDisplayName('', 'Parent Name')).toBe('Parent');
  });

  it('defaults when empty', () => {
    expect(resolveBabyDisplayName('', '')).toBe('Your little one');
  });

  it('extracts first name for possessive copy', () => {
    expect(babyFirstName('Aria Rose')).toBe('Aria');
  });

  it('persists to localStorage', () => {
    saveStoredBabyName('Luna');
    expect(loadStoredBabyName()).toBe('Luna');
    expect(localStorage.getItem(BABY_NAME_STORAGE_KEY)).toBe('Luna');
    saveStoredBabyName('');
    expect(loadStoredBabyName()).toBe('');
  });
});
