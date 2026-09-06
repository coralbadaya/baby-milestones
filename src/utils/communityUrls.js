import { ROUTES } from '../routes';

export const COMMUNITY_ITEM_TABS = ['feed', 'recipes', 'tips'];

/**
 * Kebab slug from a title (matches DB `community_memory_slugify` base, without uuid suffix).
 * @param {string} [title]
 * @returns {string}
 */
export function slugifyCommunityTitle(title = '') {
  const slug = String(title)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return slug || 'post';
}

/**
 * Public feed id: slug, then legacy seed id, then uuid.
 * @param {{ slug?: string | null, legacy_id?: string | null, id?: string | null }} row
 * @returns {string}
 */
export function memoryPublicSlug(row) {
  return row?.slug || row?.legacy_id || row?.id || '';
}

/**
 * @param {string} tab
 * @param {string} [slug]
 * @returns {string}
 */
export function communityItemPath(tab, slug) {
  if (!COMMUNITY_ITEM_TABS.includes(tab)) {
    return ROUTES.communityTab(tab || 'feed');
  }
  if (!slug) return ROUTES.communityTab(tab);
  return ROUTES.communityItem(tab, slug);
}

/**
 * @param {string} tab
 * @param {string} [slug]
 * @param {string} [origin]
 * @returns {string}
 */
export function communityItemUrl(tab, slug, origin) {
  const path = communityItemPath(tab, slug);
  const base = origin
    ?? (typeof window !== 'undefined' && window.location?.origin
      ? window.location.origin
      : '');
  return base ? `${base}${path}` : path;
}

/**
 * @param {{ id?: string, _dbId?: string }} memory
 * @param {string} [itemId]
 */
export function memoryMatchesPermalink(memory, itemId) {
  if (!itemId || !memory) return false;
  return memory.id === itemId || memory._dbId === itemId;
}
