const DEFAULT_BASE =
  process.env.EXPO_PUBLIC_DEV_API_BASE
  ?? (__DEV__ ? 'http://localhost:5173' : '');

export async function fetchDevInboxOtp(email: string): Promise<string> {
  const base = DEFAULT_BASE.replace(/\/$/, '');
  const res = await fetch(`${base}/api/dev-inbox-otp?email=${encodeURIComponent(email)}`);
  const data = (await res.json().catch(() => ({}))) as { otp?: string; error?: string };
  if (!res.ok) throw new Error(data.error || `Could not fetch code (${res.status})`);
  if (!data.otp) throw new Error(data.error || 'No OTP in response');
  return data.otp;
}