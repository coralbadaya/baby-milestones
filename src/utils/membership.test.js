import { describe, it, expect } from 'vitest';
import { isPremiumActive, membershipLabel, membershipExpiry } from './membership';

const future = () => new Date(Date.now() + 86400000).toISOString();
const past = () => new Date(Date.now() - 86400000).toISOString();

describe('isPremiumActive', () => {
  it('returns false for null membership', () => {
    expect(isPremiumActive(null)).toBe(false);
  });

  it('returns true for comp status', () => {
    expect(isPremiumActive({ status: 'comp' })).toBe(true);
  });

  it('returns true for active with future premium_until', () => {
    expect(isPremiumActive({ status: 'active', premium_until: future() })).toBe(true);
  });

  it('returns false for active with past premium_until', () => {
    expect(isPremiumActive({ status: 'active', premium_until: past() })).toBe(false);
  });

  it('returns true for active without expiry', () => {
    expect(isPremiumActive({ status: 'active', premium_until: null })).toBe(true);
  });

  it('returns true for trial with future trial_ends_at', () => {
    expect(isPremiumActive({ status: 'trial', trial_ends_at: future() })).toBe(true);
  });

  it('returns false for trial with past trial_ends_at', () => {
    expect(isPremiumActive({ status: 'trial', trial_ends_at: past() })).toBe(false);
  });

  it('returns false for free status', () => {
    expect(isPremiumActive({ status: 'free' })).toBe(false);
  });
});

describe('membershipLabel', () => {
  it('labels comp as Founding Member', () => {
    expect(membershipLabel({ status: 'comp' })).toBe('Founding Member');
  });

  it('labels active trial as Plus Trial', () => {
    expect(membershipLabel({ status: 'trial', trial_ends_at: future() })).toBe('Plus Trial');
  });

  it('labels expired trial as Basic', () => {
    expect(membershipLabel({ status: 'trial', trial_ends_at: past() })).toBe('Basic');
  });

  it('returns Basic for null', () => {
    expect(membershipLabel(null)).toBe('Basic');
  });
});

describe('membershipExpiry', () => {
  it('returns trial_ends_at for trial', () => {
    const ends = future();
    expect(membershipExpiry({ status: 'trial', trial_ends_at: ends })).toBe(ends);
  });

  it('returns premium_until for active', () => {
    const until = future();
    expect(membershipExpiry({ status: 'active', premium_until: until })).toBe(until);
  });

  it('returns null for comp', () => {
    expect(membershipExpiry({ status: 'comp' })).toBe(null);
  });
});
