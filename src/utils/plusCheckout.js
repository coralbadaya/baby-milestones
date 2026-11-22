import { startRazorpayCheckout } from './razorpayCheckout';
import { startStripeCheckout } from './stripeCheckout';

/**
 * @param {import('../constants/premium').BillingRegion} billingRegion
 * @param {import('../constants/premium').BillingRegion extends never ? never : string} sku
 */
export async function startPlusCheckout(sku, billingRegion) {
  if (billingRegion === 'IN') {
    await startRazorpayCheckout(sku);
    return;
  }
  await startStripeCheckout(sku);
}