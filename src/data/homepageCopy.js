/**
 * Logged-out welcome copy — shared by WelcomeHero, Home intro, and prerender.
 * Keep crawler HTML and the visible welcome UI in lockstep (no cloaking).
 */
import { BRAND_NAME, BRAND_TAGLINE } from '../constants/brand.js';
import { ROUTES } from '../routes.js';
import { escapeHtml } from '../seo/prerenderHtml.js';

export const HOMEPAGE_COPY = {
  eyebrow: BRAND_NAME,
  h1: BRAND_TAGLINE,
  subtitle:
    'A calm baby milestone tracker for new mothers — month by month through the first years, with postpartum care beside it.',
  intro:
    BRAND_NAME
    + ' is a quiet companion for early motherhood. It is a baby milestone tracker and editorial guide for the first three years — not a feed, not a medical app, and not a race. Set a birth date to see what typically unfolds this month, or read the guides first.',
  sections: [
    {
      heading: 'What Yarn Trails is',
      paragraphs: [
        BRAND_NAME
        + ' follows development as a range, not a deadline. Month-by-month baby milestones, Watch For notes, and practical activities sit next to postpartum recovery so the mother is not an afterthought. Guidance is evidence-informed, clearly sourced, and written for considered use — including at 3am, with one hand.',
        'The art of early motherhood, here, means sequence: what tends to happen this month, what to watch for without panic, and what can wait until morning.',
      ],
    },
    {
      heading: 'Who it is for',
      paragraphs: [
        'New and expecting mothers, and the people who care for them, through pregnancy aftermath and the first 36 months. The tone is adult, warm, and unhurried — for parents who want sequence without noise, and evidence without alarm.',
      ],
    },
    {
      heading: 'What you can track',
      paragraphs: [
        'Follow baby milestones from newborn to three years, postpartum care, vaccination, and long-form guides on development and recovery. A private AI baby book on Plus turns photos and firsts you already keep into stories — it is optional, and basic tracking stays free.',
        'Start with My Baby, Mom Care, or the Guides — or read About Yarn Trails.',
      ],
    },
  ],
  links: [
    { to: ROUTES.guides, label: 'Guides' },
    { to: ROUTES.baby, label: 'My Baby' },
    { to: ROUTES.momCare, label: 'Mom Care' },
    { to: ROUTES.about, label: `About ${BRAND_NAME}` },
  ],
};

/**
 * Crawler-visible homepage body — same words as the logged-out welcome intro.
 * @returns {string}
 */
export function homepageBodyHtml() {
  const { h1, subtitle, intro, sections, links } = HOMEPAGE_COPY;
  const sectionHtml = sections.map((block) => {
    const heading = `<h2>${escapeHtml(block.heading)}</h2>`;
    const paragraphs = (block.paragraphs || [])
      .map((p) => `<p>${escapeHtml(p)}</p>`)
      .join('');
    return `${heading}${paragraphs}`;
  }).join('');
  const nav = `<p>${links
    .map((link) => `<a href="${escapeHtml(link.to)}">${escapeHtml(link.label)}</a>`)
    .join(' · ')}</p>`;
  return `<article>
    <h1>${escapeHtml(h1)}</h1>
    <p>${escapeHtml(subtitle)}</p>
    <p>${escapeHtml(intro)}</p>
    ${sectionHtml}
    ${nav}
  </article>`;
}
