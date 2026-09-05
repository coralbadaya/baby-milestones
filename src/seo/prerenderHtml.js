import { BRAND_NAME, OG_IMAGE } from '../constants/brand.js';
import { formatPageTitle } from './metadata.js';
import { ROBOTS_INDEX } from './metadata.js';

/**
 * @param {string} value
 */
export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * @param {string} html
 * @param {string} attr
 * @param {string} key
 * @param {string} content
 */
function upsertMeta(html, attr, key, content) {
  const re = new RegExp(`<meta ${attr}="${key}"[^>]*>`, 'i');
  const tag = `<meta ${attr}="${key}" content="${escapeHtml(content)}" />`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

/**
 * @param {string} html
 * @param {string} json
 */
function upsertJsonLd(html, json) {
  const re = /<script type="application\/ld\+json">[\s\S]*?<\/script>/i;
  const tag = `<script type="application/ld+json">\n${json}\n    </script>`;
  if (re.test(html)) return html.replace(re, tag);
  return html.replace('</head>', `    ${tag}\n  </head>`);
}

/**
 * Apply route-specific SEO tags to a Vite index.html shell.
 * @param {string} html
 * @param {{
 *   title?: string,
 *   description?: string,
 *   canonical: string,
 *   image?: string,
 *   type?: string,
 *   robots?: string,
 *   homepage?: boolean,
 *   jsonLd?: object | object[],
 *   bodyHtml?: string,
 * }} page
 */
export function applySeoToHtml(html, page) {
  const title = formatPageTitle(page.title, { homepage: page.homepage });
  const description = page.description || '';
  const image = page.image || OG_IMAGE;
  const type = page.type || 'website';
  const robots = page.robots || ROBOTS_INDEX;
  const canonical = page.canonical;

  let out = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(title)}</title>`);
  out = upsertMeta(out, 'name', 'description', description);
  out = upsertMeta(out, 'name', 'robots', robots);
  out = out.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${escapeHtml(canonical)}" />`,
  );
  out = upsertMeta(out, 'property', 'og:title', title);
  out = upsertMeta(out, 'property', 'og:description', description);
  out = upsertMeta(out, 'property', 'og:url', canonical);
  out = upsertMeta(out, 'property', 'og:type', type);
  out = upsertMeta(out, 'property', 'og:image', image);
  out = upsertMeta(out, 'property', 'og:site_name', BRAND_NAME);
  out = upsertMeta(out, 'name', 'twitter:title', title);
  out = upsertMeta(out, 'name', 'twitter:description', description);
  out = upsertMeta(out, 'name', 'twitter:image', image);

  if (page.jsonLd) {
    out = upsertJsonLd(out, JSON.stringify(page.jsonLd, null, 2));
  }

  if (page.bodyHtml) {
    // Keep #root empty so humans never see the crawler stub. Hidden sibling is
    // for HTML-only crawlers; CSS also forces it off-screen.
    out = out.replace(
      /<div id="root">\s*<\/div>/,
      `<div id="root"></div>\n    <div id="seo-prerender" hidden>${page.bodyHtml}</div>`,
    );
  }

  return out;
}
