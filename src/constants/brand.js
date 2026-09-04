/** Public brand name and SEO defaults (user-facing). */
export const BRAND_NAME = 'Yarn Trails';

export const BRAND_TAGLINE = 'The art of early motherhood';

/** Short tagline for compact placements (e.g. header lockup). */
export const BRAND_TAGLINE_SHORT = 'early motherhood';

export const SEO_DEFAULT_TITLE = `${BRAND_NAME} — The Art of Early Motherhood`;

export const SEO_DEFAULT_DESCRIPTION =
  'A calm companion for new mothers: month-by-month baby milestones, postpartum care, parenting guides, and a private AI baby book for the first years.';

/** Canonical origin. Always the production hostname — never localhost or staging. */
export const SITE_URL = 'https://yarntrails.com';

export const OG_IMAGE = `${SITE_URL}/og-default.png`;

export const LOGO_URL = `${SITE_URL}/icon-512.png`;

export const COMMUNITY_TAGLINE = 'Milestones, recipes, and tips shared by mothers';

export const SHARE_SUFFIX = `— ${BRAND_NAME}`;

/** Contact email (update to the production inbox before launch). */
export const CONTACT_EMAIL = 'hello@yarntrails.com';

/**
 * Social profile URLs. Placeholders — replace with live handles once secured.
 * @type {{ key: string, label: string, icon: string, url: string }[]}
 */
export const SOCIAL_LINKS = [
  { key: 'instagram', label: 'Instagram', icon: 'instagram', url: 'https://instagram.com/yarntrails' },
  { key: 'tiktok', label: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com/@yarntrails' },
  { key: 'pinterest', label: 'Pinterest', icon: 'pinterest', url: 'https://pinterest.com/yarntrails' },
  { key: 'youtube', label: 'YouTube', icon: 'youtube', url: 'https://youtube.com/@yarntrails' },
];

/** Legal entity name for structured data / copyright. */
export const LEGAL_ENTITY = BRAND_NAME;
