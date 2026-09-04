import { buildCanonicalUrl, isCanonicalProductionUrl, normalizePath } from './urls.js';

export const SITEMAP_URL_LIMIT = 45000;

/**
 * @typedef {{ path: string, lastModified?: string, changefreq?: string, priority?: number }} SitemapEntry
 */

/**
 * @param {string} value
 */
function escapeXml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Drop invalid, duplicate, or non-canonical entries. Never fabricates lastmod.
 * @param {SitemapEntry[]} entries
 */
export function sanitizeSitemapEntries(entries) {
  const seen = new Set();
  const out = [];

  for (const entry of entries || []) {
    if (String(entry.path || '').includes('://')) continue;
    const path = normalizePath(entry.path);
    if (!path || seen.has(path)) continue;
    if (path.includes('?') || path.includes('#')) continue;

    const loc = buildCanonicalUrl(path);
    if (!isCanonicalProductionUrl(loc)) continue;

    seen.add(path);
    const row = { path, loc };
    if (entry.lastModified && /^\d{4}-\d{2}-\d{2}/.test(entry.lastModified)) {
      row.lastModified = entry.lastModified.slice(0, 10);
    }
    if (entry.changefreq) row.changefreq = entry.changefreq;
    if (typeof entry.priority === 'number') row.priority = entry.priority;
    out.push(row);
  }

  return out;
}

/**
 * @param {SitemapEntry[]} entries
 */
export function buildUrlsetXml(entries) {
  const urls = sanitizeSitemapEntries(entries);
  const body = urls
    .map((row) => {
      const lines = [`    <loc>${escapeXml(row.loc)}</loc>`];
      if (row.lastModified) lines.push(`    <lastmod>${escapeXml(row.lastModified)}</lastmod>`);
      if (row.changefreq) lines.push(`    <changefreq>${escapeXml(row.changefreq)}</changefreq>`);
      if (typeof row.priority === 'number') {
        lines.push(`    <priority>${row.priority.toFixed(1)}</priority>`);
      }
      return `  <url>\n${lines.join('\n')}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

/**
 * @param {{ loc: string, lastModified?: string }[]} sitemaps
 */
export function buildSitemapIndexXml(sitemaps) {
  const body = sitemaps
    .map((item) => {
      const lines = [`    <loc>${escapeXml(item.loc)}</loc>`];
      if (item.lastModified) lines.push(`    <lastmod>${escapeXml(item.lastModified)}</lastmod>`);
      return `  <sitemap>\n${lines.join('\n')}\n  </sitemap>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

/**
 * Single urlset today; splits into a sitemap index when volume requires it.
 * @param {SitemapEntry[]} entries
 * @param {{ maxPerFile?: number }} [opts]
 * @returns {{ files: { filename: string, xml: string }[], urls: ReturnType<typeof sanitizeSitemapEntries> }}
 */
export function buildSitemapDocuments(entries, opts = {}) {
  const maxPerFile = opts.maxPerFile ?? SITEMAP_URL_LIMIT;
  const urls = sanitizeSitemapEntries(entries);

  if (urls.length <= maxPerFile) {
    return {
      files: [{ filename: 'sitemap.xml', xml: buildUrlsetXml(entries) }],
      urls,
    };
  }

  const chunks = [];
  for (let i = 0; i < urls.length; i += maxPerFile) {
    chunks.push(urls.slice(i, i + maxPerFile));
  }

  const files = chunks.map((chunk, index) => ({
    filename: `sitemap-${index + 1}.xml`,
    xml: buildUrlsetXml(chunk),
  }));

  files.unshift({
    filename: 'sitemap.xml',
    xml: buildSitemapIndexXml(
      chunks.map((_, index) => ({
        loc: buildCanonicalUrl(`/sitemap-${index + 1}.xml`),
      })),
    ),
  });

  return { files, urls };
}
