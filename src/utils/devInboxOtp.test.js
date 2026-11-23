import { describe, expect, it } from 'vitest';
import { isDevInboxEnabled } from '../../api/dev-inbox-otp.js';

describe('dev inbox OTP gate', () => {
  it('is off in production even if the flag is set', () => {
    expect(isDevInboxEnabled({
      VERCEL_ENV: 'production',
      ENABLE_DEV_INBOX: 'true',
    })).toBe(false);
  });

  it('is off outside production without an explicit flag', () => {
    expect(isDevInboxEnabled({ VERCEL_ENV: 'preview' })).toBe(false);
    expect(isDevInboxEnabled({})).toBe(false);
  });

  it('is on only outside production when ENABLE_DEV_INBOX=true', () => {
    expect(isDevInboxEnabled({
      VERCEL_ENV: 'preview',
      ENABLE_DEV_INBOX: 'true',
    })).toBe(true);
    expect(isDevInboxEnabled({ ENABLE_DEV_INBOX: 'true' })).toBe(true);
  });
});
