/**
 * Post-build SEO prerender for every indexable public route.
 * Copies dist/index.html with route-specific title, description, canonical,
 * robots, Open Graph, JSON-LD, and crawler-visible body copy.
 *
 * Run via npm run build (after vite build).
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import guides from '../src/data/guides.js';
import { PAGES, FAQS } from '../src/data/legalContent.js';
import milestones from '../src/data/milestones.js';
import { ROUTES } from '../src/routes.js';
import { applySeoToHtml, escapeHtml } from '../src/seo/prerenderHtml.js';
import { getIndexableEntries } from '../src/seo/routes.js';
import { buildCanonicalUrl } from '../src/seo/urls.js';
import {
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  homepageGraph,
  organizationSchema,
  websiteSchema,
} from '../src/utils/structuredData.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dist = join(__dirname, '..', 'dist');
const indexHtml = readFileSync(join(dist, 'index.html'), 'utf8');

const STATIC_PAGE_BY_PATH = {
  [ROUTES.about]: PAGES.about,
  [ROUTES.editorialPolicy]: PAGES.editorialPolicy,
  [ROUTES.reviewers]: PAGES.reviewers,
  [ROUTES.privacy]: PAGES.privacy,
  [ROUTES.terms]: PAGES.terms,
  [ROUTES.cookies]: PAGES.cookies,
  [ROUTES.medicalDisclaimer]: PAGES.medicalDisclaimer,
  [ROUTES.accessibility]: PAGES.accessibility,
};

function blocksToHtml(blocks = []) {
  return blocks.map((block) => {
    const heading = block.heading ? `<h2>${escapeHtml(block.heading)}</h2>` : '';
    const paragraphs = (block.paragraphs || []).map((p) => `<p>${escapeHtml(p)}</p>`).join('');
    const list = block.list?.length
      ? `<ul>${block.list.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`
      : '';
    return `${heading}${paragraphs}${list}`;
  }).join('');
}

function guideBodyHtml(guide) {
  return `<article>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/guides">Guides</a> / ${escapeHtml(guide.title)}</nav>
    <h1>${escapeHtml(guide.title)}</h1>
    <p>${escapeHtml(guide.intro || guide.description || '')}</p>
    ${blocksToHtml(guide.body)}
  </article>`;
}

function legalBodyHtml(page) {
  return `<article>
    <h1>${escapeHtml(page.title)}</h1>
    ${page.intro ? `<p>${escapeHtml(page.intro)}</p>` : ''}
    ${blocksToHtml(page.body)}
  </article>`;
}

function faqBodyHtml() {
  const items = FAQS.map((f) => `<section><h2>${escapeHtml(f.q)}</h2><p>${escapeHtml(f.a)}</p></section>`).join('');
  return `<article><h1>Frequently Asked Questions</h1>${items}</article>`;
}

function monthBodyHtml(data) {
  if (!data) return '';
  const physical = (data.physical || []).map((i) => `<li>${escapeHtml(i.text)}</li>`).join('');
  const emotional = (data.emotional || []).map((i) => `<li>${escapeHtml(i.text)}</li>`).join('');
  return `<article>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/baby">My Baby</a> / Month ${data.month}</nav>
    <h1>Month ${data.month}: ${escapeHtml(data.title)}</h1>
    <p>${escapeHtml(data.summary || '')}</p>
    <h2>Physical milestones</h2><ul>${physical}</ul>
    <h2>Emotional and cognitive milestones</h2><ul>${emotional}</ul>
  </article>`;
}

function pageGraph(extra) {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), websiteSchema(), extra].filter(Boolean),
  };
}

const guidesBySlug = new Map(guides.map((g) => [g.slug, g]));
const milestonesByMonth = new Map(milestones.map((m) => [m.month, m]));
const entries = getIndexableEntries(guides, milestones);

let count = 0;
for (const entry of entries) {
  if (entry.path === '/') {
    const homeHtml = applySeoToHtml(indexHtml, {
      homepage: true,
      title: entry.title,
      description: entry.description,
      canonical: buildCanonicalUrl('/'),
      jsonLd: homepageGraph(),
    });
    writeFileSync(join(dist, 'index.html'), homeHtml);
    count += 1;
    continue;
  }

  const slug = entry.path.startsWith('/guides/') && entry.path !== '/guides'
    ? entry.path.slice('/guides/'.length)
    : null;
  const guide = slug ? guidesBySlug.get(slug) : null;
  const monthMatch = entry.path.match(/^\/month\/(\d+)$/);
  const monthData = monthMatch ? milestonesByMonth.get(Number(monthMatch[1])) : null;
  const legal = STATIC_PAGE_BY_PATH[entry.path];

  let jsonLd;
  let bodyHtml = `<article><h1>${escapeHtml(entry.title || 'Yarn Trails')}</h1><p>${escapeHtml(entry.description || '')}</p></article>`;

  if (guide) {
    jsonLd = pageGraph(articleSchema(guide, entry.path));
    jsonLd['@graph'].push(breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Guides', path: ROUTES.guides },
      { name: guide.title, path: entry.path },
    ]));
    bodyHtml = guideBodyHtml(guide);
  } else if (entry.path === ROUTES.faq) {
    jsonLd = pageGraph(faqSchema(FAQS));
    bodyHtml = faqBodyHtml();
  } else if (legal) {
    jsonLd = pageGraph(breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: legal.title, path: entry.path },
    ]));
    bodyHtml = legalBodyHtml(legal);
  } else if (monthData) {
    jsonLd = pageGraph(breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'My Baby', path: ROUTES.baby },
      { name: `Month ${monthData.month}`, path: entry.path },
    ]));
    bodyHtml = monthBodyHtml(monthData);
  } else {
    jsonLd = pageGraph(breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: entry.title || 'Yarn Trails', path: entry.path },
    ]));
  }

  const html = applySeoToHtml(indexHtml, {
    title: entry.title,
    description: entry.description,
    canonical: buildCanonicalUrl(entry.path),
    type: entry.type || 'website',
    homepage: Boolean(entry.homepage),
    jsonLd,
    bodyHtml,
  });

  const rel = entry.path.replace(/^\//, '');
  const htmlFile = join(dist, `${rel}.html`);
  mkdirSync(dirname(htmlFile), { recursive: true });
  writeFileSync(htmlFile, html);

  const outDir = join(dist, ...rel.split('/'));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  count += 1;
}

console.log(`Prerendered ${count} SEO pages in dist/`);
