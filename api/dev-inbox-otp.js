/**
 * Dev/staging only: read the latest 6-digit Supabase signup OTP from a Mailinator inbox.
 * Requires MAILINATOR_API_KEY. Never enabled on production.
 */

function isMailinatorAddress(email) {
  return /@mailinator\.com$/i.test(String(email || '').trim());
}

/** 404 unless this is not Vercel production and ENABLE_DEV_INBOX=true. */
export function isDevInboxEnabled(env = process.env) {
  if (env.VERCEL_ENV === 'production') return false;
  return env.ENABLE_DEV_INBOX === 'true';
}

function devAssistEnabled() {
  return isDevInboxEnabled();
}

function parseOtpFromText(text) {
  if (!text) return null;
  const matches = String(text).match(/\b(\d{6})\b/g);
  if (!matches?.length) return null;
  return matches[matches.length - 1];
}

async function fetchMailinatorOtp(inbox) {
  const key = process.env.MAILINATOR_API_KEY;
  if (!key) {
    return { error: 'Set MAILINATOR_API_KEY in .env for dev OTP fetch (Mailinator API token).' };
  }

  const headers = { Authorization: `Bearer ${key}` };
  const listRes = await fetch(
    `https://api.mailinator.com/api/v2/domains/public/inboxes/${encodeURIComponent(inbox)}/messages?limit=5`,
    { headers },
  );
  if (!listRes.ok) {
    return { error: `Mailinator list failed (${listRes.status})` };
  }
  const list = await listRes.json();
  const messages = list?.msgs || list?.messages || [];
  for (const msg of messages) {
    const id = msg.id || msg.messageId;
    if (!id) continue;
    const detailRes = await fetch(
      `https://api.mailinator.com/api/v2/domains/public/inboxes/${encodeURIComponent(inbox)}/messages/${encodeURIComponent(id)}`,
      { headers },
    );
    if (!detailRes.ok) continue;
    const detail = await detailRes.json();
    const body = detail?.parts?.map((p) => p.body).join('\n') || detail?.text || detail?.body || '';
    const otp = parseOtpFromText(body);
    if (otp) return { otp, messageId: id };
  }
  return { error: 'No 6-digit code in the last few messages. Resend the code, then try again.' };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!devAssistEnabled()) {
    res.status(404).json({ error: 'Not found' });
    return;
  }

  const qs = (req.url || '').includes('?') ? (req.url || '').slice((req.url || '').indexOf('?')) : '';
  const email = new URLSearchParams(qs).get('email')?.trim().toLowerCase() || '';
  if (!email || !isMailinatorAddress(email)) {
    res.status(400).json({
      error: 'Use a @mailinator.com address (seeded test users) to fetch the server OTP.',
    });
    return;
  }

  const inbox = email.split('@')[0];
  const result = await fetchMailinatorOtp(inbox);
  if (result.error) {
    res.status(result.otp ? 200 : 502).json(result);
    return;
  }
  res.status(200).json({ otp: result.otp, inbox, messageId: result.messageId });
}