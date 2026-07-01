/** App route paths — use these for links and redirects */
export const ROUTES = {
  home: '/',
  baby: '/baby',
  essentials: '/essentials',
  premium: '/premium',
  month: (n) => `/month/${n}`,
  shopping: '/shopping',
  vaccination: '/vaccination',
  travel: '/travel',
  travelTab: (type) => `/travel#${type}`,
  momCare: '/mom-care',
  momCareTab: (topic) => `/mom-care#${topic}`,
  community: '/community',
  communityTab: (tab) => `/community/${tab}`,
  progress: '/progress',
  sources: '/sources',

  // Learn / content
  guides: '/guides',
  guide: (slug) => `/guides/${slug}`,
  faq: '/faq',

  // Company / trust
  about: '/about',
  contact: '/contact',
  editorialPolicy: '/editorial-policy',
  reviewers: '/medical-reviewers',

  // Legal
  privacy: '/privacy',
  terms: '/terms',
  cookies: '/cookies',
  medicalDisclaimer: '/medical-disclaimer',
  accessibility: '/accessibility',

  // Auth & account
  login: '/login',
  signup: '/signup',
  verifyEmail: '/verify-email',
  account: '/account',

  // Admin (staff / admin roles)
  admin: '/admin',
  adminInbox: '/admin/inbox',
  adminUsers: '/admin/users',
  adminPromos: '/admin/promos',
};

export const COMMUNITY_TABS = ['feed', 'recipes', 'tips', 'create'];

export function isCommunityTab(tab) {
  return COMMUNITY_TABS.includes(tab);
}

/** Primary nav labels (journey order) */
export const PRIMARY_NAV = [
  { key: 'today', to: ROUTES.home, label: 'Today', mobileLabel: 'Today', icon: 'home' },
  { key: 'baby', to: ROUTES.baby, label: 'My Baby', mobileLabel: 'Baby', icon: 'baby' },
  { key: 'momCare', to: ROUTES.momCare, label: 'My Care', mobileLabel: 'Care', icon: 'heart' },
  { key: 'essentials', to: ROUTES.essentials, label: 'Essentials', mobileLabel: 'Essentials', icon: 'shopping-cart' },
  { key: 'community', to: ROUTES.communityTab('feed'), label: 'Community', mobileLabel: 'Community', icon: 'speech-bubble' },
  { key: 'guides', to: ROUTES.guides, label: 'Guides', mobileLabel: 'Guides', icon: 'book-open' },
];

/**
 * Items shown in the compact mobile bottom bar (kept to 5 for ergonomics).
 * Guides lives in the top nav + footer, not the bottom bar.
 */
export const MOBILE_NAV = PRIMARY_NAV.filter((item) => item.key !== 'guides');

/** Premium upsell — rendered as a distinct CTA button, not a plain nav link. */
export const PREMIUM_NAV = { key: 'premium', to: ROUTES.premium, label: 'Premium', icon: 'sparkles' };

/**
 * Grouped footer columns (data-driven). E-E-A-T / trust surface for a YMYL site.
 * @type {{ heading: string, links: { to: string, label: string }[] }[]}
 */
export const FOOTER_SECTIONS = [
  {
    heading: 'Explore',
    links: [
      { to: ROUTES.baby, label: 'My Baby' },
      { to: ROUTES.momCare, label: 'My Care' },
      { to: ROUTES.essentials, label: 'Essentials' },
      { to: ROUTES.vaccination, label: 'Vaccination' },
      { to: ROUTES.travel, label: 'Travel' },
      { to: ROUTES.communityTab('feed'), label: 'Community' },
      { to: ROUTES.progress, label: 'Progress' },
    ],
  },
  {
    heading: 'Learn',
    links: [
      { to: ROUTES.guides, label: 'Guides & Articles' },
      { to: ROUTES.baby, label: 'Milestones by Month' },
      { to: ROUTES.vaccination, label: 'Vaccination Schedule' },
      { to: ROUTES.faq, label: 'FAQ' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { to: ROUTES.about, label: 'About Us' },
      { to: ROUTES.editorialPolicy, label: 'How We Research' },
      { to: ROUTES.reviewers, label: 'Medical Reviewers' },
      { to: ROUTES.sources, label: 'Sources & Citations' },
      { to: ROUTES.contact, label: 'Contact' },
      { to: ROUTES.premium, label: 'Premium' },
    ],
  },
  {
    heading: 'Legal & Trust',
    links: [
      { to: ROUTES.privacy, label: 'Privacy Policy' },
      { to: ROUTES.terms, label: 'Terms of Service' },
      { to: ROUTES.cookies, label: 'Cookie Policy' },
      { to: ROUTES.medicalDisclaimer, label: 'Medical Disclaimer' },
      { to: ROUTES.accessibility, label: 'Accessibility' },
    ],
  },
];

/** @param {string} pathname */
export function navSectionFromPath(pathname) {
  if (pathname === ROUTES.home) return 'today';
  if (pathname.startsWith('/month/') || pathname.startsWith('/baby') || pathname.startsWith('/vaccination')) {
    return 'baby';
  }
  if (pathname.startsWith('/mom-care')) return 'momCare';
  if (pathname.startsWith('/essentials') || pathname.startsWith('/shopping') || pathname.startsWith('/travel')) {
    return 'essentials';
  }
  if (pathname.startsWith('/community')) return 'community';
  if (pathname.startsWith('/guides')) return 'guides';
  if (pathname.startsWith('/progress')) return 'progress';
  if (pathname.startsWith('/sources')) return 'sources';
  if (pathname.startsWith('/premium')) return 'premium';
  return '';
}
