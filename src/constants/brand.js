/** Public brand name and SEO defaults (user-facing). */
export const BRAND_NAME = 'Nestbean';

export const BRAND_TAGLINE = 'The art of early motherhood';

/** Short tagline for compact placements (e.g. header lockup). */
export const BRAND_TAGLINE_SHORT = 'early motherhood';

export const SEO_DEFAULT_TITLE = `${BRAND_NAME} — AI Baby Book & Milestones`;

export const SEO_DEFAULT_DESCRIPTION =
  'Free milestone tracking forever. Turn photos into AI stories and an interactive flip-book with Nestbean Plus — the modern AI baby book.';

/** Canonical site URL for OG tags. */
export const SITE_URL = 'https://yarntrails.com';

export const OG_IMAGE = `${SITE_URL}/og-default.png`;

export const COMMUNITY_TAGLINE = 'Milestones, recipes, and tips shared by mothers';

export const SHARE_SUFFIX = `— ${BRAND_NAME}`;

/** Contact email (update to the production inbox before launch). */
export const CONTACT_EMAIL = 'hello@yarntrails.com';

/**
 * Social profile URLs. Placeholders — replace with live handles once secured.
 * @type {{ key: string, label: string, icon: string, url: string }[]}
 */
export const SOCIAL_LINKS = [
  { key: 'instagram', label: 'Instagram', icon: 'instagram', url: 'https://instagram.com/nestbean' },
  { key: 'tiktok', label: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com/@nestbean' },
  { key: 'pinterest', label: 'Pinterest', icon: 'pinterest', url: 'https://pinterest.com/nestbean' },
  { key: 'youtube', label: 'YouTube', icon: 'youtube', url: 'https://youtube.com/@nestbean' },
];

/** Legal entity name for structured data / copyright. */
export const LEGAL_ENTITY = BRAND_NAME;
