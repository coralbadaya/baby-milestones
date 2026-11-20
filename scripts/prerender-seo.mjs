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
import { homepageBodyHtml } from '../src/data/homepageCopy.js';
import { PRODUCT_PAGE_FAQS } from '../src/data/productPageFaqs.js';
import { hubSeoHeading, hubSeoIntroHtml } from '../src/data/hubSeoIntros.js';
import guides from '../src/data/guides.js';
import { PAGES, FAQS } from '../src/data/legalContent.js';
import milestones from '../src/data/milestones.js';
import { ROUTES } from '../src/routes.js';
import { applySeoToHtml, escapeHtml } from '../src/seo/prerenderHtml.js';
import { getIndexableEntries, SPA_SHELL_PAGES } from '../src/seo/routes.js';
import { ROBOTS_NOINDEX } from '../src/seo/metadata.js';
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

function linkEmails(text) {
  return escapeHtml(text).replace(
    /([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/gi,
    (email) => `<a href="mailto:${email}">${email}</a>`,
  );
}

function blocksToHtml(blocks = []) {
  return blocks.map((block) => {
    const heading = block.heading ? `<h2>${escapeHtml(block.heading)}</h2>` : '';
    const chips = block.sources?.length
      ? `<ul>${block.sources.map((source) => `<li><a href="${source.to}">${escapeHtml(source.label)}</a></li>`).join('')}</ul>`
      : '';
    const paragraphs = (block.paragraphs || []).map((p) => `<p>${linkEmails(p)}</p>`).join('');
    const list = block.list?.length
      ? `<ul>${block.list.map((item) => `<li>${linkEmails(item)}</li>`).join('')}</ul>`
      : '';
    return `${heading}${chips}${paragraphs}${list}`;
  }).join('');
}

function guideQuickLinksHtml(guide) {
  /** @type {{ href: string, label: string }[]} */
  const items = [];
  if (guide.milestoneMonth) {
    items.push(
      { href: ROUTES.month(guide.milestoneMonth), label: `Month ${guide.milestoneMonth} tracker` },
      { href: ROUTES.vaccination, label: 'Vaccination schedule' },
      { href: ROUTES.momCare, label: 'Postpartum care' },
      { href: ROUTES.sources, label: 'Sources & citations' },
    );
  }
  for (const link of guide.productLinks || []) {
    items.push({ href: link.to, label: link.label });
  }
  const seen = new Set();
  const unique = items.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });
  if (!unique.length) return '';
  const anchors = unique
    .map((item) => `<a href="${item.href}">${escapeHtml(item.label)}</a>`)
    .join(' · ');
  return `<p>${anchors}</p>`;
}

function faqListBodyHtml(faqs, heading = 'Common questions') {
  if (!faqs?.length) return '';
  const items = faqs
    .map((f) => `<section><h2>${escapeHtml(f.q)}</h2><p>${escapeHtml(f.a)}</p></section>`)
    .join('');
  return `<h2>${escapeHtml(heading)}</h2>${items}`;
}

function guideFaqBodyHtml(guide) {
  return faqListBodyHtml(guide.faqs);
}

function guideBodyHtml(guide) {
  return `<article>
    <nav aria-label="Breadcrumb"><a href="/">Home</a> / <a href="/guides">Guides</a> / ${escapeHtml(guide.title)}</nav>
    <h1>${escapeHtml(guide.title)}</h1>
    <p>${escapeHtml(guide.intro || guide.description || '')}</p>
    ${guideQuickLinksHtml(guide)}
    ${blocksToHtml(guide.body)}
    ${guideFaqBodyHtml(guide)}
  </article>`;
}

function legalBodyHtml(page) {
  const related = page.related?.length
    ? `<p>${page.related.map((link) => `<a href="${link.to}">${escapeHtml(link.label)}</a>`).join(' · ')}</p>`
    : '';
  return `<article>
    <h1>${escapeHtml(page.title)}</h1>
    ${blocksToHtml(page.body)}
    ${related}
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
      bodyHtml: homepageBodyHtml(),
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
  const hubIntro = hubSeoIntroHtml(entry.path);
  const leadHtml = hubIntro || `<p>${escapeHtml(entry.description || '')}</p>`;
  const heading = hubSeoHeading(entry.path, entry.title || 'Yarn Trails');
  let bodyHtml = `<article><h1>${escapeHtml(heading)}</h1>${leadHtml}</article>`;

  if (guide) {
    jsonLd = pageGraph(articleSchema(guide, entry.path));
    jsonLd['@graph'].push(breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Guides', path: ROUTES.guides },
      { name: guide.title, path: entry.path },
    ]));
    if (guide.faqs?.length) {
      jsonLd['@graph'].push(faqSchema(guide.faqs));
    }
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
  } else if (PRODUCT_PAGE_FAQS[entry.path]) {
    const productFaq = PRODUCT_PAGE_FAQS[entry.path];
    jsonLd = pageGraph(breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: entry.title || 'Yarn Trails', path: entry.path },
    ]));
    jsonLd['@graph'].push(faqSchema(productFaq.faqs));
    bodyHtml = `<article>
      <h1>${escapeHtml(heading)}</h1>
      ${leadHtml}
      ${faqListBodyHtml(productFaq.faqs, productFaq.title)}
    </article>`;
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
  const outDir = join(dist, ...rel.split('/'));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  count += 1;
}

for (const shell of SPA_SHELL_PAGES) {
  const html = applySeoToHtml(indexHtml, {
    title: shell.title,
    description: 'Yarn Trails account and staff pages.',
    canonical: buildCanonicalUrl(shell.path),
    robots: ROBOTS_NOINDEX,
    bodyHtml: `<article><h1>${escapeHtml(shell.title)}</h1><p>This page loads in the app.</p></article>`,
  });
  const rel = shell.path.replace(/^\//, '');
  const outDir = join(dist, ...rel.split('/'));
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  count += 1;
}

console.log(`Prerendered ${count} SEO pages in dist/`);
