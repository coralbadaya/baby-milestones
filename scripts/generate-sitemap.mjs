/**
 * Writes public/sitemap.xml and public/robots.txt from the live route inventory.
 * Run: npm run generate:sitemap (also runs as part of npm run build).
 *
 * lastmod is only written when content provides a real date (e.g. guide.updated).
 */
import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import guides from '../src/data/guides.js';
import milestones from '../src/data/milestones.js';
import { getIndexableEntries } from '../src/seo/routes.js';
import { buildRobotsTxt } from '../src/seo/robots.js';
import { buildSitemapDocuments } from '../src/seo/sitemap.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');

const entries = getIndexableEntries(guides, milestones);
const { files, urls } = buildSitemapDocuments(entries);

for (const file of files) {
  writeFileSync(join(publicDir, file.filename), file.xml);
  console.log(`Wrote ${file.filename} (${file.xml.length} bytes)`);
}

writeFileSync(join(publicDir, 'robots.txt'), buildRobotsTxt());
console.log(`Wrote robots.txt and ${urls.length} sitemap URLs`);
