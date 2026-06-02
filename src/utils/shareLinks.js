import { SHARE_SUFFIX } from '../constants/brand';

export function buildSharePayload({ title, text, url }) {
  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');
  const shareText = text || `${title} ${SHARE_SUFFIX}`;
  const full = `${shareText} ${shareUrl}`.trim();

  return {
    title,
    text: shareText,
    url: shareUrl,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(full)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
  };
}

export async function copyShareText(payload) {
  const { text, url } = buildSharePayload(payload);
  await navigator.clipboard.writeText(`${text}\n${url}`);
}
