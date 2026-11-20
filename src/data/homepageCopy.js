/**
 * Logged-out welcome copy — shared by WelcomeHero, Home intro, and prerender.
 * Keep crawler HTML and the visible welcome UI in lockstep (no cloaking).
 */
import { BRAND_NAME, BRAND_SLUG, SITE_URL } from '../constants/brand.js';
import { ROUTES } from '../routes.js';
import { escapeHtml } from '../seo/prerenderHtml.js';

export const HOMEPAGE_COPY = {
  eyebrow: BRAND_NAME,
  h1: 'See this month with your baby.',
  subtitle:
    'Milestones, vaccines, and memories in one place. Free to start. A range, not a race.',
  purpose:
    'This month: milestones, an India vaccination schedule, recovery, and memories.',
  intro:
    BRAND_NAME
    + ` is a baby milestone tracker for families — also easy to find as ${BRAND_SLUG} at ${SITE_URL.replace('https://', '')}. `
    + 'Set a birth date to open this month: what often shows up, which vaccines are commonly due on an India schedule, and a calm place for memories. Basic tracking stays free on this phone until you create an account.',
  sections: [
    {
      heading: 'What Yarn Trails is',
      paragraphs: [
        BRAND_NAME
        + ' follows development as a range, not a deadline. Month-by-month baby milestones and Watch For notes sit next to an India IAP and UIP style vaccination tracker and postpartum recovery, so the mother’s care is not an afterthought. Guidance is educational, sourced from WHO, CDC, AAP, and IAP, and written for one-handed use at 3am.',
        'The art of early motherhood, here, means sequence: what tends to happen this month, what to watch for without panic, and what can wait until morning.',
      ],
    },
    {
      heading: 'Who it is for',
      paragraphs: [
        'New mothers, fathers, and grandparents through the first 36 months, starting with families in India. The tone is warm and unhurried — a record and a schedule, without a feed, a race, or alarm.',
      ],
    },
    {
      heading: 'What you can do free',
      paragraphs: [
        'Follow baby monthly milestones from newborn to three years, open the India vaccination schedule, and read guides on development and recovery — without an account. A birth date is enough to see this month. Create a free account when you want that record on another phone.',
        'Plus adds AI stories, a flip-book, and family viewer seats. It is optional. A private baby book is not required to track the month. Start from Today: My Baby, the baby book, My Care, vaccination, Guides, or Plus.',
      ],
    },
  ],
  links: [
    { to: ROUTES.baby, label: 'My Baby' },
    { to: ROUTES.babyBook, label: 'Baby book' },
    { to: ROUTES.momCare, label: 'My Care' },
    { to: ROUTES.vaccination, label: 'Vaccination' },
    { to: ROUTES.guide('baby-monthly-milestones'), label: 'Baby monthly milestones' },
    { to: ROUTES.guides, label: 'Guides' },
    { to: ROUTES.premium, label: 'Plus' },
  ],
};

/** One-tap jobs on Today. Welcome intro may list extra crawler links (milestone guide). */
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
