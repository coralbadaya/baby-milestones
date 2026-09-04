/**
 * Indexable vs non-indexable public URL inventory.
 * Source of truth for sitemap, robots, and prerender (not Next.js — this is Vite + React Router).
 */
import { SEO_DEFAULT_DESCRIPTION } from '../constants/brand.js';
import { ROUTES } from '../routes.js';
import { normalizePath } from './urls.js';
import { ROBOTS_NOINDEX } from './metadata.js';

/** Static marketing / product pages that should be indexed. */
export const INDEXABLE_STATIC_PAGES = [
  {
    path: ROUTES.home,
    title: null,
    homepage: true,
    description: SEO_DEFAULT_DESCRIPTION,
    changefreq: 'weekly',
    priority: 1,
  },
  {
    path: ROUTES.baby,
    title: 'My Baby',
    description: 'Month-by-month baby milestones, DIY activities, and care from newborn to 36 months.',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    path: ROUTES.momCare,
    title: 'Mom Care',
    description: 'Postpartum recovery timeline, self-care, and gentle guidance for new mothers.',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    path: ROUTES.essentials,
    title: 'Essentials',
    description: 'Curated baby shopping checklists, vaccination tracking, and age-aware travel tips.',
    changefreq: 'weekly',
    priority: 0.8,
  },
  {
    path: ROUTES.shopping,
    title: 'Shopping Checklist',
    description: 'A curated, month-by-month baby shopping checklist — investment pieces, not clutter.',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    path: ROUTES.travel,
    title: 'Travel with Baby',
    description: 'Age-aware travel tips for flights, road trips, and long-haul journeys with a baby.',
    changefreq: 'monthly',
    priority: 0.6,
  },
  {
    path: ROUTES.vaccination,
    title: 'Vaccination Tracker',
    description: 'Track immunizations with India, CDC, or custom schedules — educational, never alarmist.',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: ROUTES.progress,
    title: 'Progress',
    description: 'See milestone progress across physical and emotional development from newborn to three years.',
    changefreq: 'monthly',
    priority: 0.5,
  },
  {
    path: ROUTES.sources,
    title: 'Medical Sources & Citations',
    description: 'The WHO, CDC, AAP, and other authorities behind Yarn Trails milestone and care guidance.',
    changefreq: 'yearly',
    priority: 0.6,
  },
  {
    path: ROUTES.premium,
    title: 'Yarn Trails Plus — AI Baby Book',
    description: 'Basic milestone tracking is free. Plus unlocks AI stories, the interactive flip-book, and HD memories.',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: ROUTES.guides,
    title: 'Guides & Articles',
    description: 'Evidence-informed guides on baby development, postpartum recovery, vaccinations, and early parenthood.',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    path: ROUTES.milestoneCardsTool,
    title: 'Free Printable Milestone Cards',
    description: 'Download printable monthly milestone cards for baby photos — a free tool from Yarn Trails.',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    path: ROUTES.faq,
    title: 'Frequently Asked Questions',
    description: 'What Yarn Trails is, who it is for, and answers about milestones, mom care, privacy, and the app.',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: ROUTES.about,
    title: 'About Yarn Trails',
    description: 'Yarn Trails is a quiet-luxury companion for early motherhood — editorial guides plus practical tools for the first three years.',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    path: ROUTES.contact,
    title: 'Contact Us',
    description: 'Get in touch with the Yarn Trails team — feedback, partnerships, and questions.',
    changefreq: 'yearly',
    priority: 0.4,
  },
  {
    path: ROUTES.editorialPolicy,
    title: 'How We Research',
    description: 'How Yarn Trails researches, sources, and reviews educational content for new mothers.',
    changefreq: 'yearly',
    priority: 0.5,
  },
  {
    path: ROUTES.reviewers,
    title: 'Medical Reviewers',
    description: 'How health-related Yarn Trails content is reviewed for accuracy and responsibility.',
    changefreq: 'yearly',
    priority: 0.5,
  },
  {
    path: ROUTES.privacy,
    title: 'Privacy Policy',
    description: 'How Yarn Trails handles baby data, accounts, and optional analytics.',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: ROUTES.terms,
    title: 'Terms of Service',
    description: 'Terms of use for the Yarn Trails website and membership.',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: ROUTES.cookies,
    title: 'Cookie Policy',
    description: 'How Yarn Trails uses essential storage and optional analytics cookies.',
    changefreq: 'yearly',
    priority: 0.3,
  },
  {
    path: ROUTES.medicalDisclaimer,
    title: 'Medical Disclaimer',
    description: 'Yarn Trails is educational only and is not a substitute for professional medical advice.',
    changefreq: 'yearly',
    priority: 0.4,
  },
  {
    path: ROUTES.accessibility,
    title: 'Accessibility Statement',
    description: 'Yarn Trails accessibility commitments and how to report barriers.',
    changefreq: 'yearly',
    priority: 0.3,
  },
];

/** Public community hubs with unique content. `/community/create` is a form — not indexed. */
export const INDEXABLE_COMMUNITY_TABS = [
  {
    path: ROUTES.communityTab('feed'),
    title: 'Mom Feed',
    description: 'Memories, milestones, and notes shared by mothers in the Yarn Trails community.',
    changefreq: 'daily',
    priority: 0.6,
  },
  {
    path: ROUTES.communityTab('recipes'),
    title: 'Baby Recipes',
    description: 'Baby-friendly recipes from the community — purees, khichdi, finger foods, and more.',
    changefreq: 'weekly',
    priority: 0.6,
  },
  {
    path: ROUTES.communityTab('tips'),
    title: 'Parenting Tips',
    description: 'Practical parenting tips from other mothers on sleep, feeding, teething, and everyday care.',
    changefreq: 'weekly',
    priority: 0.6,
  },
];

/**
 * Path prefixes that must not appear in the sitemap and should be noindex.
 * Prefix match (e.g. `/admin` also covers `/admin/inbox`).
 */
export const NON_INDEXABLE_PREFIXES = [
  '/admin',
  '/login',
  '/signup',
  '/verify-email',
  '/account',
  '/api/',
  '/baby/book',
  '/book/voice-invite',
  '/story/preview',
  '/newsletter/unsubscribe',
  '/community/create',
];

/** robots.txt Disallow values — public content is allowed by default. */
export const ROBOTS_DISALLOW = [
  '/admin',
  '/login',
  '/signup',
  '/verify-email',
  '/account',
  '/api/',
  '/baby/book',
  '/book/voice-invite',
  '/story/preview',
  '/newsletter/unsubscribe',
  '/community/create',
];

export const COMMUNITY_CREATE_META = {
  title: 'Share a Memory',
  description: 'Post a milestone, tip, or sweet moment for other mothers.',
  robots: ROBOTS_NOINDEX,
};

/** @param {string} path */
export function getStaticMeta(path) {
  const normalized = normalizePath(path);
  return INDEXABLE_STATIC_PAGES.find((page) => page.path === normalized)
    || INDEXABLE_COMMUNITY_TABS.find((page) => page.path === normalized)
    || null;
}

/**
 * @param {string} pathname
 */
export function isNonIndexablePath(pathname) {
  const path = normalizePath(pathname);
  return NON_INDEXABLE_PREFIXES.some((prefix) => {
    if (prefix.endsWith('/')) return path.startsWith(prefix.slice(0, -1)) || path.startsWith(prefix);
    return path === prefix || path.startsWith(`${prefix}/`);
  });
}

/**
 * @param {string} pathname
 */
export function isIndexablePath(pathname) {
  return !isNonIndexablePath(pathname);
}

/**
 * Build the full indexable URL list from static pages, community hubs,
 * published guides, and month trackers (1–36).
 *
 * @param {{ slug: string, title: string, description?: string, updated?: string }[]} guides
 * @param {{ month?: number, title?: string, summary?: string }[]} [milestones]
 */
export function getIndexableEntries(guides = [], milestones = []) {
  /** @type {{ path: string, title?: string, description?: string, lastModified?: string, changefreq: string, priority: number, homepage?: boolean, type?: string }[]} */
  const entries = [];
  const seen = new Set();

  const push = (entry) => {
    const path = normalizePath(entry.path);
    if (!path || seen.has(path) || isNonIndexablePath(path)) return;
    seen.add(path);
    entries.push({ ...entry, path });
  };

  for (const page of INDEXABLE_STATIC_PAGES) push(page);
  for (const tab of INDEXABLE_COMMUNITY_TABS) push(tab);

  for (const guide of guides) {
    if (!guide?.slug) continue;
    push({
      path: ROUTES.guide(guide.slug),
      title: guide.title,
      description: guide.description,
      lastModified: isIsoDate(guide.updated) ? guide.updated : undefined,
      changefreq: 'monthly',
      priority: 0.8,
      type: 'article',
    });
  }

  const monthMeta = new Map((milestones || []).map((m) => [m.month, m]));
  for (let month = 1; month <= 36; month += 1) {
    const data = monthMeta.get(month);
    push({
      path: ROUTES.month(month),
      title: data?.title ? `Month ${month}: ${data.title}` : `Month ${month} Milestones`,
      description:
        data?.summary
        || `Developmental milestones, activities, and care for month ${month} — from newborn to toddler.`,
      changefreq: 'monthly',
      priority: 0.7,
    });
  }

  return entries;
}

/** @param {string} [value] */
function isIsoDate(value) {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value);
}
