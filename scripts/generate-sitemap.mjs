/**
 * Generates public/sitemap.xml from the app's routes and content data.
 * Run: npm run generate:sitemap
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { SITE_URL } from '../src/constants/brand.js';
import guides from '../src/data/guides.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = join(__dirname, '..', 'public', 'sitemap.xml');

const today = new Date().toISOString().slice(0, 10);

/** @type {{ path: string, priority: number, changefreq: string }[]} */
const routes = [
  { path: '/', priority: 1.0, changefreq: 'daily' },
  { path: '/baby', priority: 0.9, changefreq: 'weekly' },
  { path: '/mom-care', priority: 0.9, changefreq: 'weekly' },
  { path: '/essentials', priority: 0.7, changefreq: 'weekly' },
  { path: '/shopping', priority: 0.6, changefreq: 'monthly' },
  { path: '/travel', priority: 0.6, changefreq: 'monthly' },
  { path: '/vaccination', priority: 0.8, changefreq: 'weekly' },
  { path: '/community/feed', priority: 0.7, changefreq: 'daily' },
  { path: '/progress', priority: 0.5, changefreq: 'weekly' },
  { path: '/sources', priority: 0.6, changefreq: 'monthly' },
  { path: '/premium', priority: 0.6, changefreq: 'monthly' },
  { path: '/guides', priority: 0.9, changefreq: 'weekly' },
  { path: '/faq', priority: 0.7, changefreq: 'monthly' },
  { path: '/about', priority: 0.6, changefreq: 'monthly' },
  { path: '/contact', priority: 0.4, changefreq: 'yearly' },
  { path: '/editorial-policy', priority: 0.5, changefreq: 'yearly' },
  { path: '/medical-reviewers', priority: 0.5, changefreq: 'yearly' },
  { path: '/privacy', priority: 0.3, changefreq: 'yearly' },
  { path: '/terms', priority: 0.3, changefreq: 'yearly' },
  { path: '/cookies', priority: 0.3, changefreq: 'yearly' },
  { path: '/medical-disclaimer', priority: 0.4, changefreq: 'yearly' },
  { path: '/accessibility', priority: 0.3, changefreq: 'yearly' },
];

for (const guide of guides) {
  routes.push({ path: `/guides/${guide.slug}`, priority: 0.8, changefreq: 'monthly' });
}

for (let m = 1; m <= 36; m += 1) {
  routes.push({ path: `/month/${m}`, priority: 0.7, changefreq: 'monthly' });
}

const base = SITE_URL.replace(/\/$/, '');

const urls = routes
  .map(
    ({ path, priority, changefreq }) =>
      `  <url>\n    <loc>${base}${path}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${changefreq}</changefreq>\n    <priority>${priority.toFixed(1)}</priority>\n  </url>`,
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

writeFileSync(OUT, xml);
console.log(`Wrote ${routes.length} URLs to ${OUT}`);
