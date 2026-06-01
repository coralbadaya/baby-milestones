/** App route paths — use these for links and redirects */
export const ROUTES = {
  home: '/',
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
};

export const COMMUNITY_TABS = ['feed', 'recipes', 'tips', 'create'];

export function isCommunityTab(tab) {
  return COMMUNITY_TABS.includes(tab);
}

/** @param {string} pathname */
export function navSectionFromPath(pathname) {
  if (pathname === ROUTES.home || pathname.startsWith('/month/')) return 'home';
  if (pathname.startsWith('/shopping')) return 'shopping';
  if (pathname.startsWith('/vaccination')) return 'vaccination';
  if (pathname.startsWith('/travel')) return 'travel';
  if (pathname.startsWith('/mom-care')) return 'momCare';
  if (pathname.startsWith('/community')) return 'community';
  if (pathname.startsWith('/progress')) return 'dashboard';
  if (pathname.startsWith('/sources')) return 'sources';
  return '';
}
