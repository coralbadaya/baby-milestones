/**
 * First-line copy on product hubs. Same words in the UI and prerender (AISO — no cloaking).
 */
import { ROUTES } from '../routes.js';
import { escapeHtml } from '../seo/prerenderHtml.js';

/** @typedef {{ text?: string, to?: string, label?: string }} HubSeoPart */

/** @type {Record<string, { parts: HubSeoPart[] }>} */
export const HUB_SEO_INTROS = {
  [ROUTES.vaccination]: {
    h1: 'Vaccination tracker',
    parts: [
      { text: 'Baby vaccination tracker for India IAP/UIP, CDC, or a custom list. Educational only. ' },
      { to: ROUTES.guide('vaccination-tracker-india'), label: 'Read the India vaccination tracker guide' },
      { text: ', then log doses with your clinic card.' },
    ],
  },
  [ROUTES.shopping]: {
    h1: 'Shopping',
    parts: [
      { text: 'Month-by-month baby shopping — quality over clutter. ' },
      { to: ROUTES.guide('newborn-essentials-checklist'), label: 'Read the newborn essentials checklist' },
      { text: ' before you buy a full nursery.' },
    ],
  },
  [ROUTES.momCare]: {
    h1: 'My Care',
    parts: [
      { text: 'Postpartum recovery timeline and self-care. ' },
      { to: ROUTES.guide('postpartum-recovery-week-by-week'), label: 'Read the week-by-week recovery guide' },
      { text: ', then open the timeline on this page.' },
    ],
  },
  [ROUTES.communityTab('recipes')]: {
    h1: 'Baby Recipes',
    parts: [
      { text: 'Baby food recipes and first foods from other parents. Start with ' },
      { to: ROUTES.guide('starting-solids-guide'), label: 'starting solids' },
      { text: ' and ' },
      { to: ROUTES.guide('indian-baby-food-recipes'), label: 'Indian baby food recipes' },
      { text: ', then swipe this tab.' },
    ],
  },
};

/** Visible product H1 — keep prerender aligned with PageHero (AISO). */
export function hubSeoHeading(pathname, fallback = '') {
  return HUB_SEO_INTROS[pathname]?.h1 || fallback;
}

/** @param {string} pathname */
export function hubSeoIntroHtml(pathname) {
  const intro = HUB_SEO_INTROS[pathname];
  if (!intro) return '';
  const inner = intro.parts.map((part) => {
    if (part.to) return `<a href="${escapeHtml(part.to)}">${escapeHtml(part.label)}</a>`;
    return escapeHtml(part.text || '');
  }).join('');
  return `<p>${inner}</p>`;
}
