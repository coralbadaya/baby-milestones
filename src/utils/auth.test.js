import { describe, it, expect } from 'vitest';
import { isEmailVerified, isEmailNotConfirmedError } from './auth';

describe('isEmailVerified', () => {
  it('returns false for null user', () => {
    expect(isEmailVerified(null)).toBe(false);
  });

  it('returns false when email_confirmed_at is missing', () => {
    expect(isEmailVerified({})).toBe(false);
  });

  it('returns true when email_confirmed_at is set', () => {
    expect(isEmailVerified({ email_confirmed_at: '2026-01-01T00:00:00Z' })).toBe(true);
  });
});

describe('isEmailNotConfirmedError', () => {
  it('detects email not confirmed message', () => {
    expect(isEmailNotConfirmedError({ message: 'Email not confirmed' })).toBe(true);
  });

  it('returns false for other errors', () => {
    expect(isEmailNotConfirmedError({ message: 'Invalid login credentials' })).toBe(false);
  });
});
