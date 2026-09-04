import { SITE_URL } from '../constants/brand.js';
import { ROBOTS_DISALLOW } from './routes.js';
import { buildCanonicalUrl } from './urls.js';

/**
 * Production robots.txt. Allows public pages (including CSS/JS/images).
 * Disallow is not a substitute for noindex on private screens.
 */
export function buildRobotsTxt() {
  const lines = [
    'User-agent: *',
    'Allow: /',
    '',
    ...ROBOTS_DISALLOW.map((path) => `Disallow: ${path}`),
    '',
    `Sitemap: ${buildCanonicalUrl('/sitemap.xml')}`,
    '',
  ];
  return lines.join('\n');
}

export { SITE_URL };
