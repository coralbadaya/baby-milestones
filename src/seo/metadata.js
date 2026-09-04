import {
  BRAND_NAME,
  OG_IMAGE,
  SEO_DEFAULT_DESCRIPTION,
  SEO_DEFAULT_TITLE,
} from '../constants/brand.js';
import { buildCanonicalUrl } from './urls.js';

export const ROBOTS_INDEX = 'index, follow';
export const ROBOTS_NOINDEX = 'noindex, nofollow';

/**
 * @param {string} [title]
 * @param {{ homepage?: boolean }} [opts]
 */
export function formatPageTitle(title, opts = {}) {
  if (opts.homepage || !title) return SEO_DEFAULT_TITLE;
  if (title === SEO_DEFAULT_TITLE) return title;
  if (title.includes(BRAND_NAME)) return title;
  return `${title} | ${BRAND_NAME}`;
}

/**
 * @param {{
 *   title?: string,
 *   description?: string,
 *   path?: string,
 *   image?: string,
 *   type?: string,
 *   robots?: string,
 *   homepage?: boolean,
 * }} [input]
 */
export function buildPageMetadata(input = {}) {
  const homepage = Boolean(input.homepage || input.path === '/');
  const canonical = buildCanonicalUrl(input.path || '/');
  return {
    title: formatPageTitle(input.title, { homepage }),
    description: input.description || SEO_DEFAULT_DESCRIPTION,
    canonical,
    url: canonical,
    image: input.image || OG_IMAGE,
    type: input.type || 'website',
    robots: input.robots || ROBOTS_INDEX,
  };
}
