import { describe, expect, it } from 'vitest';
import { buildCanonicalUrl, isCanonicalProductionUrl, normalizePath } from './urls.js';
import { formatPageTitle, buildPageMetadata, ROBOTS_INDEX, ROBOTS_NOINDEX } from './metadata.js';
import { getIndexableEntries, isNonIndexablePath, INDEXABLE_STATIC_PAGES, SPA_SHELL_PAGES } from './routes.js';
import { buildSitemapDocuments, sanitizeSitemapEntries, buildUrlsetXml } from './sitemap.js';
import { buildRobotsTxt } from './robots.js';
import { applySeoToHtml } from './prerenderHtml.js';
import { articleSchema, breadcrumbSchema, faqSchema, organizationSchema, websiteSchema } from '../utils/structuredData.js';
import { SITE_URL } from '../constants/brand.js';
import { homepageBodyHtml } from '../data/homepageCopy.js';
import { getGuideBySlug } from '../data/guides.js';

describe('canonical URLs', () => {
  it('normalizes trailing slashes, query, and hash', () => {
    expect(normalizePath('/guides/foo/?utm=1#x')).toBe('/guides/foo');
    expect(normalizePath('/')).toBe('/');
  });

  it('always uses the production HTTPS origin', () => {
    expect(buildCanonicalUrl('/guides/foo')).toBe('https://yarntrails.com/guides/foo');
    expect(buildCanonicalUrl('/')).toBe('https://yarntrails.com/');
    expect(isCanonicalProductionUrl('https://yarntrails.com/about')).toBe(true);
    expect(isCanonicalProductionUrl('http://yarntrails.com/about')).toBe(false);
    expect(isCanonicalProductionUrl('https://localhost:5173/about')).toBe(false);
    expect(isCanonicalProductionUrl('https://www.yarntrails.com/about')).toBe(false);
  });
});

describe('page metadata', () => {
  it('uses a unique title, description, canonical, and robots', () => {
    const home = buildPageMetadata({ homepage: true, path: '/', description: 'Home description' });
    const about = buildPageMetadata({ title: 'About Yarn Trails', path: '/about', description: 'About description' });
    expect(home.title).not.toBe(about.title);
    expect(home.description).not.toBe(about.description);
    expect(home.canonical).toBe('https://yarntrails.com/');
    expect(about.canonical).toBe('https://yarntrails.com/about');
    expect(home.robots).toBe(ROBOTS_INDEX);
    expect(formatPageTitle('My Baby')).toBe('My Baby | Yarn Trails');
    expect(formatPageTitle('Yarn Trails Plus — AI Baby Book')).toBe('Yarn Trails Plus — AI Baby Book');
  });
});

describe('indexable inventory', () => {
  const guides = [
    { slug: '3-month-old-milestones', title: '3-Month-Old Milestones', description: 'Guide', updated: '2026-06-29' },
  ];
  const entries = getIndexableEntries(guides, [{ month: 1, title: 'The Awakening', summary: 'Newborn month.' }]);

  it('includes public pages and published guides', () => {
    const paths = entries.map((e) => e.path);
    expect(paths).toContain('/');
    expect(paths).toContain('/about');
    expect(paths).toContain('/contact');
    expect(paths).toContain('/feedback');
    expect(paths).toContain('/guides/3-month-old-milestones');
    expect(paths).toContain('/month/1');
    expect(paths).toContain('/community/recipes');
    expect(paths).toContain('/community/tips');
  });

  it('excludes private and duplicate URLs', () => {
    const paths = entries.map((e) => e.path);
    expect(paths).not.toContain('/login');
    expect(paths).not.toContain('/admin');
    expect(paths).not.toContain('/community/create');
    expect(paths).not.toContain('/account');
    expect(new Set(paths).size).toBe(paths.length);
    expect(isNonIndexablePath('/admin/inbox')).toBe(true);
    expect(isNonIndexablePath('/guides')).toBe(false);
  });
});

describe('sitemap XML', () => {
  it('emits valid XML with canonical HTTPS URLs only', () => {
    const guides = [{ slug: 'postpartum-recovery-week-by-week', title: 'Postpartum', updated: '2026-06-29' }];
    const entries = getIndexableEntries(guides);
    const { files, urls } = buildSitemapDocuments(entries);
    const xml = files[0].xml;

    expect(files[0].filename).toBe('sitemap.xml');
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<urlset');
    expect(xml).toContain('https://yarntrails.com/');
    expect(xml).toContain('https://yarntrails.com/guides/postpartum-recovery-week-by-week');
    expect(xml).toContain('<lastmod>2026-06-29</lastmod>');
    expect(xml).not.toContain('localhost');
    expect(xml).not.toMatch(/<loc>http:\/\//);
    expect(xml).not.toContain('/login');
    expect(xml).not.toContain('/admin');
    expect(urls.every((u) => !u.loc.includes('?') && !u.loc.includes('#'))).toBe(true);
    expect(urls.every((u) => isCanonicalProductionUrl(u.loc))).toBe(true);
  });

  it('drops duplicates and non-canonical hosts', () => {
    const cleaned = sanitizeSitemapEntries([
      { path: '/about' },
      { path: '/about/' },
      { path: '/about?utm=1' },
      { path: 'https://evil.example/about' },
    ]);
    expect(cleaned.map((r) => r.path)).toEqual(['/about']);
  });

  it('splits into a sitemap index when the URL count is large', () => {
    const entries = Array.from({ length: 5 }, (_, i) => ({ path: `/page-${i}` }));
    const { files } = buildSitemapDocuments(entries, { maxPerFile: 2 });
    expect(files[0].filename).toBe('sitemap.xml');
    expect(files[0].xml).toContain('<sitemapindex');
    expect(files.length).toBe(4);
  });

  it('does not fabricate lastmod', () => {
    const xml = buildUrlsetXml([{ path: '/faq' }]);
    expect(xml).not.toContain('<lastmod>');
  });
});

describe('robots.txt', () => {
  const txt = buildRobotsTxt();

  it('allows public content and declares the sitemap', () => {
    expect(txt).toContain('User-agent: *');
    expect(txt).toContain('Allow: /');
    expect(txt).toContain('Sitemap: https://yarntrails.com/sitemap.xml');
  });

  it('blocks private areas without blocking CSS or public pages', () => {
    expect(txt).toContain('Disallow: /admin');
    expect(txt).toContain('Disallow: /login');
    expect(txt).toContain('Disallow: /signup');
    expect(txt).toContain('Disallow: /account');
    expect(txt).toContain('Disallow: /api/');
    expect(txt).not.toContain('Disallow: /guides');
    expect(txt).not.toContain('Disallow: /assets');
    expect(txt).not.toContain('Disallow: /css');
  });
});

describe('SPA shells', () => {
  it('covers login and admin without putting them in the sitemap', () => {
    const paths = SPA_SHELL_PAGES.map((page) => page.path);
    expect(paths).toContain('/login');
    expect(paths).toContain('/admin');
    expect(paths).toContain('/account');
    const sitemapPaths = getIndexableEntries([], []).map((entry) => entry.path);
    for (const path of paths) {
      expect(isNonIndexablePath(path)).toBe(true);
      expect(sitemapPaths).not.toContain(path);
    }
  });
});

describe('structured data', () => {
  it('emits valid JSON with canonical URLs and no fabricated reviewer', () => {
    const org = organizationSchema();
    const site = websiteSchema();
    const crumbs = breadcrumbSchema([
      { name: 'Home', path: '/' },
      { name: 'Guides', path: '/guides' },
    ]);
    const article = articleSchema({
      title: 'A guide',
      description: 'About recovery',
      updated: '2026-06-29',
      author: 'Yarn Trails Editorial Team',
      reviewedBy: 'Pending medical review',
      category: 'Mom Care',
    }, '/guides/postpartum-recovery-week-by-week');
    const faq = faqSchema([{ q: 'What is Yarn Trails?', a: 'A companion for early motherhood.' }]);

    for (const data of [org, site, crumbs, article, faq]) {
      expect(() => JSON.parse(JSON.stringify(data))).not.toThrow();
    }
    expect(org.url).toBe(`${SITE_URL}/`);
    expect(site.url).toBe(`${SITE_URL}/`);
    expect(article.url).toBe('https://yarntrails.com/guides/postpartum-recovery-week-by-week');
    expect(article.reviewedBy).toBeUndefined();
    expect(article.datePublished).toBeUndefined();
    expect(crumbs.itemListElement[0].item).toBe('https://yarntrails.com/');
    expect(INDEXABLE_STATIC_PAGES.length).toBeGreaterThan(10);
    expect(ROBOTS_NOINDEX).toBe('noindex, nofollow');
  });
});

describe('prerender HTML', () => {
  it('injects unique title, description, canonical, and robots', () => {
    const shell = `<!doctype html><html><head>
      <title>Old</title>
      <meta name="description" content="old" />
      <link rel="canonical" href="https://yarntrails.com/" />
      </head><body><div id="root"></div></body></html>`;
    const html = applySeoToHtml(shell, {
      title: 'About Yarn Trails',
      description: 'Who we are',
      canonical: 'https://yarntrails.com/about',
      bodyHtml: '<h1>About Yarn Trails</h1>',
    });
    expect(html).toContain('<title>About Yarn Trails</title>');
    expect(html).toContain('content="Who we are"');
    expect(html).toContain('href="https://yarntrails.com/about"');
    expect(html).toContain('name="robots"');
    expect(html).toContain('<h1>About Yarn Trails</h1>');
    expect(html).toContain('<div id="root"></div>');
    expect(html).toContain('<div id="seo-prerender" hidden><h1>About Yarn Trails</h1></div>');
    expect(html).not.toContain('<div id="root"><h1>');
  });

  it('injects the welcome homepage H1 and intro outside #root', () => {
    const shell = `<!doctype html><html><head>
      <title>Old</title>
      <meta name="description" content="old" />
      <link rel="canonical" href="https://yarntrails.com/" />
      </head><body><div id="root"></div></body></html>`;
    const html = applySeoToHtml(shell, {
      homepage: true,
      description: 'Home description',
      canonical: 'https://yarntrails.com/',
      bodyHtml: homepageBodyHtml(),
    });
    expect(html).toContain('<div id="root"></div>');
    expect(html).toMatch(/<div id="seo-prerender" hidden>[\s\S]*<h1>The art of early motherhood<\/h1>/);
    expect(html).toContain('baby milestone tracker');
    expect(html).toContain('<h2>What Yarn Trails is</h2>');
    expect(html).toContain('href="/guides"');
    expect(html).not.toContain('<div id="root"><article');
  });
});

describe('3-month-old milestones guide', () => {
  it('answers the query with sleep, feeding, and pediatrician sections', () => {
    const guide = getGuideBySlug('3-month-old-milestones');
    expect(guide).toBeTruthy();
    expect(guide.milestoneMonth).toBe(3);
    const headings = (guide.body || []).map((block) => block.heading);
    expect(headings).toContain('Sleep at 3 months');
    expect(headings).toContain('Feeding at 3 months');
    expect(headings).toContain('When to talk to your pediatrician');
    const text = [guide.intro, ...(guide.body || []).flatMap((b) => b.paragraphs || [])].join(' ');
    expect(text.length).toBeGreaterThan(4000);
  });
});
