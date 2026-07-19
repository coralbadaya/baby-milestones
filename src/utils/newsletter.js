import { SITE_URL, SOCIAL_LINKS, BRAND_NAME, CONTACT_EMAIL } from '../constants/brand';

export const MERGE_TAGS = ['site_url', 'unsubscribe_url', 'subscriber_email', 'year', 'baby_month', 'feature_name'];

const PREVIEW_UNSUBSCRIBE = `${SITE_URL}/newsletter/unsubscribe?token=preview`;

/** @param {Record<string, string>} [overrides] */
export function buildMergeContext(overrides = {}) {
  return {
    site_url: SITE_URL,
    unsubscribe_url: PREVIEW_UNSUBSCRIBE,
    subscriber_email: 'you@example.com',
    year: String(new Date().getFullYear()),
    baby_month: '6',
    feature_name: 'First Moments',
    ...overrides,
  };
}

/** Replace `{{tag}}` placeholders in text. */
export function applyMergeTags(text, context) {
  if (!text) return '';
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => context[key] ?? `{{${key}}}`);
}

/** Strip HTML to plain text for fallback body. */
export function htmlToPlainText(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<li[^>]*>/gi, '• ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function socialLinksHtml() {
  return SOCIAL_LINKS.map(
    (s) => `<a href="${s.url}" style="color:#8b7355;text-decoration:none;margin:0 8px;">${s.label}</a>`,
  ).join('');
}

/**
 * Wrap fragment HTML in Yarn Trails email shell.
 * @param {{ bodyHtml: string, previewBanner?: string }} opts
 */
export function wrapNewsletterHtml({ bodyHtml, previewBanner }) {
  const banner = previewBanner
    ? `<div style="background:#f0eeeb;color:#6b6560;text-align:center;padding:10px 16px;font-size:13px;">${previewBanner}</div>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${BRAND_NAME}</title>
</head>
<body style="margin:0;padding:0;background:#faf8f5;font-family:Georgia,'Times New Roman',serif;">
${banner}
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f5;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;">
<tr><td style="padding:32px 32px 24px;text-align:center;border-bottom:1px solid #f0eeeb;">
<a href="${SITE_URL}" style="text-decoration:none;font-family:Georgia,serif;font-size:22px;color:#3d3835;letter-spacing:0.02em;">${BRAND_NAME}</a>
</td></tr>
<tr><td style="padding:32px;">
${bodyHtml}
</td></tr>
<tr><td style="padding:24px 32px 32px;border-top:1px solid #f0eeeb;text-align:center;">
<div style="margin-bottom:16px;">${socialLinksHtml()}</div>
<p style="margin:0 0 8px;font-size:12px;line-height:1.5;color:#9a948d;">
<a href="{{unsubscribe_url}}" style="color:#8b7355;">Unsubscribe</a>
&nbsp;·&nbsp;${CONTACT_EMAIL}
</p>
<p style="margin:0;font-size:11px;color:#b5afa8;">© {{year}} ${BRAND_NAME}. Gentle, occasional notes for your journey.</p>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Full rendered HTML with merge tags applied. */
export function renderNewsletterPreview({ subject, bodyHtml, context, previewBanner }) {
  const ctx = buildMergeContext(context);
  const mergedBody = applyMergeTags(bodyHtml, ctx);
  const wrapped = wrapNewsletterHtml({ bodyHtml: mergedBody, previewBanner });
  return applyMergeTags(wrapped, ctx);
}

export const CAMPAIGN_STATUSES = ['draft', 'scheduled', 'sending', 'sent', 'cancelled'];

export function campaignStatusLabel(status) {
  const labels = {
    draft: 'Draft',
    scheduled: 'Scheduled',
    sending: 'Sending',
    sent: 'Sent',
    cancelled: 'Cancelled',
  };
  return labels[status] || status;
}

/** @param {string} status */
export function canEditCampaign(status) {
  return status === 'draft' || status === 'cancelled';
}

/** @param {string} status */
export function canScheduleCampaign(status) {
  return status === 'draft';
}
