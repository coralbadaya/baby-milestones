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
  purpose:
    'Yarn Trails follows your baby’s month and your recovery — milestones, care, and a private baby book.',
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
        'Follow baby milestones from newborn to three years, postpartum care, vaccination, and long-form guides on development and recovery. A private baby book on Plus turns photos and firsts you already keep into stories — it is optional, and basic tracking stays free.',
        'Start from Today: My Baby, the baby book, My Care, vaccination, Guides, or Plus.',
      ],
    },
  ],
  links: [
    { to: ROUTES.baby, label: 'My Baby' },
    { to: ROUTES.babyBook, label: 'Baby book' },
    { to: ROUTES.momCare, label: 'My Care' },
    { to: ROUTES.vaccination, label: 'Vaccination' },
    { to: ROUTES.guides, label: 'Guides' },
    { to: ROUTES.premium, label: 'Plus' },
  ],
};

/** One-tap jobs on Today. Labels match `HOMEPAGE_COPY.links`. */
export const HOME_JOBS = [
  { to: ROUTES.baby, label: 'My Baby', detail: 'Milestones', icon: 'baby' },
  { to: ROUTES.babyBook, label: 'Baby book', detail: 'Stories and photos', icon: 'books' },
  { to: ROUTES.momCare, label: 'My Care', detail: 'Postpartum', icon: 'heart' },
  { to: ROUTES.vaccination, label: 'Vaccination', detail: 'Schedule and log', icon: 'medical' },
  { to: ROUTES.guides, label: 'Guides', detail: 'Read by month', icon: 'book-open' },
  { to: ROUTES.premium, label: 'Plus', detail: 'Membership', icon: 'sparkles' },
];

/**
 * Crawler-visible homepage body — same words as the logged-out welcome intro.
 * @returns {string}
 */
export function homepageBodyHtml() {
  const { h1, subtitle, purpose, intro, sections, links } = HOMEPAGE_COPY;
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
    <p>${escapeHtml(purpose)}</p>
    <p>${escapeHtml(intro)}</p>
    ${sectionHtml}
    ${nav}
  </article>`;
}
