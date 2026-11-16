/** Fetch latest Mailinator OTP via dev API (local Vite or preview with DEV_AUTH_ASSIST). */

export async function fetchDevInboxOtp(email) {
  const base = import.meta.env.VITE_DEV_API_BASE || '';
  const url = `${base}/api/dev-inbox-otp?email=${encodeURIComponent(email)}`;
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Could not fetch code (${res.status})`);
  }
  if (!data.otp) throw new Error(data.error || 'No OTP in response');
  return String(data.otp);
}