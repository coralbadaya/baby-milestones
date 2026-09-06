import { describe, it, expect, vi } from 'vitest';
import { createHmac } from 'node:crypto';
import { skuToInterval, verifyStripeSignature, plusUntilFromUnix, recordSubscribeSuccess } from './stripeWebhook';

function sign(body, secret, ts = Math.floor(Date.now() / 1000)) {
  const v1 = createHmac('sha256', secret).update(`${ts}.${body}`, 'utf8').digest('hex');
  return { header: `t=${ts},v1=${v1}`, ts };
}

describe('stripeWebhook helpers', () => {
  it('maps SKUs to billing intervals', () => {
    expect(skuToInterval('plus_monthly')).toBe('monthly');
    expect(skuToInterval('plus_annual')).toBe('annual');
    expect(skuToInterval('gift_subscription')).toBe('gift');
    expect(skuToInterval('first_year_bundle')).toBe('bundle');
  });

  it('converts unix period end to ISO', () => {
    expect(plusUntilFromUnix(1700000000)).toBe(new Date(1700000000 * 1000).toISOString());
    expect(plusUntilFromUnix(null)).toBeNull();
  });

  it('accepts a valid Stripe signature', () => {
    const secret = 'whsec_test';
    const body = JSON.stringify({ id: 'evt_1', type: 'ping' });
    const { header } = sign(body, secret);
    const event = verifyStripeSignature(body, header, secret);
    expect(event.id).toBe('evt_1');
  });

  it('rejects a tampered body', () => {
    const secret = 'whsec_test';
    const { header } = sign(JSON.stringify({ id: 'evt_1' }), secret);
    expect(() => verifyStripeSignature(JSON.stringify({ id: 'evt_2' }), header, secret)).toThrow(/mismatch/i);
  });

  it('records subscribe_success without throwing on insert errors', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const supabase = {
      from: () => ({
        insert: async () => ({ error: { message: 'blocked' } }),
      }),
    };
    await expect(recordSubscribeSuccess(supabase, { userId: null, sku: 'plus_annual' }))
      .resolves.toBeUndefined();
    warn.mockRestore();
  });
});
