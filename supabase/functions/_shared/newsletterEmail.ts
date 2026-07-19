const BRAND_NAME = 'Nestbean';
const DEFAULT_SITE_URL = 'https://yarntrails.com';

export function applyMergeTags(text: string, context: Record<string, string>): string {
  if (!text) return '';
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] ?? `{{${key}}}`);
}

export function wrapNewsletterHtml(bodyHtml: string, previewBanner?: string): string {
  const siteUrl = Deno.env.get('SITE_URL') || DEFAULT_SITE_URL;
  const banner = previewBanner
    ? `<div style="background:#f0eeeb;color:#6b6560;text-align:center;padding:10px 16px;font-size:13px;">${previewBanner}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Georgia,serif;">
${banner}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;">
<tr><td style="padding:32px;text-align:center;border-bottom:1px solid #f0eeeb;">
<a href="${siteUrl}" style="text-decoration:none;font-size:22px;color:#3d3835;">${BRAND_NAME}</a>
</td></tr>
<tr><td style="padding:32px;">${bodyHtml}</td></tr>
<tr><td style="padding:24px 32px;border-top:1px solid #f0eeeb;text-align:center;">
<p style="margin:0 0 8px;font-size:12px;color:#9a948d;">
<a href="{{unsubscribe_url}}" style="color:#8b7355;">Unsubscribe</a>
</p>
<p style="margin:0;font-size:11px;color:#b5afa8;">© {{year}} ${BRAND_NAME}</p>
</td></tr>
</table></td></tr></table></body></html>`;
}

export function buildEmailPayload(opts: {
  to: string;
  subject: string;
  previewText?: string | null;
  bodyHtml: string;
  bodyText: string;
  mergeContext: Record<string, string>;
  sample?: boolean;
}) {
  const mergedBody = applyMergeTags(opts.bodyHtml, opts.mergeContext);
  const wrapped = wrapNewsletterHtml(
    mergedBody,
    opts.sample ? 'This is a preview — only you received this.' : undefined,
  );
  const html = applyMergeTags(wrapped, opts.mergeContext);
  const text = applyMergeTags(opts.bodyText, opts.mergeContext);
  const subject = opts.sample ? `[Sample] ${opts.subject}` : opts.subject;

  return { subject, html, text };
}

export async function sendViaResend(payload: {
  to: string;
  subject: string;
  html: string;
  text: string;
  previewText?: string | null;
}) {
  const apiKey = Deno.env.get('RESEND_API_KEY');
  if (!apiKey) throw new Error('RESEND_API_KEY not configured');

  const from = Deno.env.get('NEWSLETTER_FROM') || 'hello@yarntrails.com';
  const replyTo = Deno.env.get('NEWSLETTER_REPLY_TO') || from;
  const siteUrl = Deno.env.get('SITE_URL') || DEFAULT_SITE_URL;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [payload.to],
      reply_to: replyTo,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
      headers: payload.previewText ? { 'X-Entity-Ref-ID': 'nestbean-newsletter' } : undefined,
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Resend error: ${err}`);
  }

  const data = await res.json();
  return { providerId: data.id as string, siteUrl };
}
