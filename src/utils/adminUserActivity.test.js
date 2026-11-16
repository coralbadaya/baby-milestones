import { describe, expect, it } from 'vitest';
import { formatActivityEventName, formatSessionEndReason } from './adminUserActivity';

describe('adminUserActivity', () => {
  it('maps known events', () => {
    expect(formatActivityEventName('login_completed')).toBe('Login completed');
    expect(formatActivityEventName('logout_completed')).toBe('Logout');
  });

  it('maps session end reasons', () => {
    expect(formatSessionEndReason('logout_event')).toContain('Signed out');
    expect(formatSessionEndReason('idle_timeout')).toContain('idle');
  });
});