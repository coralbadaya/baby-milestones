import { createHmac } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import { verifyRazorpaySignature } from './razorpayWebhook';

describe('verifyRazorpaySignature', () => {
  const secret = 'test_webhook_secret';
  const body = JSON.stringify({ event: 'subscription.activated', payload: {} });

  it('accepts a valid signature', () => {
    const signature = createHmac('sha256', secret).update(body).digest('hex');
    const parsed = verifyRazorpaySignature(body, signature, secret);
    expect(parsed.event).toBe('subscription.activated');
  });

  it('rejects invalid signature', () => {
    expect(() => verifyRazorpaySignature(body, 'deadbeef', secret)).toThrow(/mismatch/);
  });

  it('rejects missing inputs', () => {
    expect(() => verifyRazorpaySignature('', '', secret)).toThrow(/Missing/);
  });
});