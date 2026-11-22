import { trackEvent } from './analytics';
import { checkoutRequestInit } from './checkoutAuth';

const SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

function loadRazorpayScript() {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Razorpay requires a browser'));
      return;
    }
    if (window.Razorpay) {
      resolve(window.Razorpay);
      return;
    }
    const existing = document.querySelector(`script[src="${SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Razorpay));
      existing.addEventListener('error', () => reject(new Error('Razorpay script failed')));
      return;
    }
    const script = document.createElement('script');
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve(window.Razorpay);
    script.onerror = () => reject(new Error('Razorpay script failed'));
    document.head.appendChild(script);
  });
}

/**
 * @param {'plus_monthly'|'plus_annual'|'first_year_bundle'|'gift_subscription'} sku
 */
export async function startRazorpayCheckout(sku) {
  trackEvent('begin_checkout', {
    sku,
    billing_region: 'IN',
    provider: 'razorpay',
    feature: 'razorpay',
    tab: 'IN',
  });

  const { headers } = await checkoutRequestInit();
  const res = await fetch('/api/razorpay-checkout', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ sku, billing_region: 'IN' }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || 'Razorpay checkout unavailable');
  }

  const Razorpay = await loadRazorpayScript();
  const options = {
    key: data.keyId,
    name: 'Yarn Trails',
    description: 'Yarn Trails Plus',
    callback_url: data.callbackUrl,
    redirect: true,
    notes: { sku },
  };

  if (data.subscriptionId) {
    options.subscription_id = data.subscriptionId;
  } else if (data.orderId) {
    options.order_id = data.orderId;
    options.amount = data.amount;
    options.currency = data.currency || 'INR';
  } else {
    throw new Error('Invalid Razorpay session');
  }

  const rzp = new Razorpay(options);
  rzp.open();
}