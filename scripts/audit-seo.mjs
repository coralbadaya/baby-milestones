/**
 * Local SEO inventory checks: sitemap/robots integrity, no private URLs,
 * canonical domain, no duplicates. Does not fetch production.
 *
 * Run: npm run audit:seo
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import guides from '../src/data/guides.js';
import milestones from '../src/data/milestones.js';
import { getIndexableEntries, isNonIndexablePath } from '../src/seo/routes.js';
import { buildRobotsTxt } from '../src/seo/robots.js';
import { buildSitemapDocuments } from '../src/seo/sitemap.js';
import { isCanonicalProductionUrl } from '../src/seo/urls.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const errors = [];
const entries = getIndexableEntries(guides, milestones);
const { files, urls } = buildSitemapDocuments(entries);
const xml = files.find((f) => f.filename === 'sitemap.xml')?.xml || '';
const robots = buildRobotsTxt();
const diskSitemap = readFileSync(join(publicDir, 'sitemap.xml'), 'utf8');
const diskRobots = readFileSync(join(publicDir, 'robots.txt'), 'utf8');

if (diskSitemap !== xml) {
  errors.push('public/sitemap.xml is stale — run npm run generate:sitemap');
}
if (diskRobots !== robots) {
  errors.push('public/robots.txt is stale — run npm run generate:sitemap');
}

const locs = urls.map((u) => u.loc);
if (new Set(locs).size !== locs.length) errors.push('Duplicate URLs in sitemap');
if (locs.some((loc) => !isCanonicalProductionUrl(loc))) {
  errors.push('Sitemap contains a non-canonical URL');
}
if (locs.some((loc) => isNonIndexablePath(new URL(loc).pathname))) {
  errors.push('Sitemap contains a non-indexable path');
}
if (!robots.includes('Sitemap: https://yarntrails.com/sitemap.xml')) {
  errors.push('robots.txt missing sitemap declaration');
}
if (!robots.includes('Allow: /')) errors.push('robots.txt does not allow public content');
if (!robots.includes('Disallow: /admin')) errors.push('robots.txt does not block /admin');

const report = {
  indexableUrls: entries.length,
  sitemapUrls: urls.length,
  excludedExamples: ['/login', '/signup', '/admin', '/account', '/community/create'],
  duplicateUrls: locs.length - new Set(locs).size,
  files: files.map((f) => f.filename),
};

console.log(JSON.stringify(report, null, 2));

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

console.log('SEO audit passed');
