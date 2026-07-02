/**
 * Post-build SEO prerender stubs for guide and tool routes.
 * Copies dist/index.html with route-specific <title> for non-JS crawlers.
 * Run: npm run build && node scripts/prerender-seo.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import guides from '../src/data/guides.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const indexHtml = readFileSync(join(dist, 'index.html'), 'utf8');

/** @type {{ path: string, title: string }[]} */
const routes = [
  { path: '/tools/milestone-cards', title: 'Free Printable Milestone Cards — Nestbean' },
  ...guides.map((g) => ({
    path: `/guides/${g.slug}`,
    title: `${g.title} — Nestbean`,
  })),
];

for (const { path, title } of routes) {
  const outDir = join(dist, ...path.split('/').filter(Boolean));
  mkdirSync(outDir, { recursive: true });
  const html = indexHtml.replace(
    /<title>[^<]*<\/title>/,
    `<title>${title}</title>`,
  );
  writeFileSync(join(outDir, 'index.html'), html);
}

console.log(`Prerendered ${routes.length} SEO stub pages in dist/`);
