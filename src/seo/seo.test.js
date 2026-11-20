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
import { KEYWORD_PILLARS } from './keywordSeeds.js';
import { hubSeoHeading, hubSeoIntroHtml } from '../data/hubSeoIntros.js';
import { PRODUCT_PAGE_FAQS } from '../data/productPageFaqs.js';
import { ROUTES } from '../routes.js';

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
    expect(formatPageTitle('Yarn Trails Plus — Baby Book')).toBe('Yarn Trails Plus — Baby Book');
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
    expect(org.alternateName).toContain('yarntrails');
    expect(site.url).toBe(`${SITE_URL}/`);
    expect(site.alternateName).toContain('yarntrails.com');
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
    expect(html).toMatch(/<div id="seo-prerender" hidden>[\s\S]*<h1>See this month with your baby\.<\/h1>/);
    expect(html).toContain('baby milestone tracker');
    expect(html).toContain('private baby book');
    expect(html).toContain('href="/baby/book"');
    expect(html).toContain('href="/premium"');
    expect(html).toContain('<h2>What Yarn Trails is</h2>');
    expect(html).toContain('href="/guides"');
    expect(html).toContain('href="/guides/baby-monthly-milestones"');
    expect(html).toContain('href="/guides/vaccination-tracker-india"');
    expect(html).toContain('baby monthly milestones');
    expect(html).not.toContain('<div id="root"><article');
  });
});

describe('keyword seeds', () => {
  it('defines sixteen priority pillars with unique ids', () => {
    expect(KEYWORD_PILLARS.length).toBe(16);
    const ids = KEYWORD_PILLARS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain('vaccination-india');
    expect(ids).toContain('baby-recipes');
  });
});

const CONTENT_GAP_GUIDE_SLUGS = [
  'baby-monthly-milestones',
  'vaccination-tracker-india',
  'diy-baby-activities',
  'baby-care-first-year',
  'newborn-essentials-checklist',
  'nursery-rhymes-for-babies',
  'lullabies-for-babies',
  'best-books-for-babies-by-age',
  'baby-photoshoot-ideas-at-home',
  'starting-solids-guide',
  'indian-baby-food-recipes',
  'newborn-dos-and-donts',
];

describe('milestone guide SEO', () => {
  it('adds FAQs for months 1–12 milestone slugs', () => {
    for (const month of [1, 2, 4, 6, 12]) {
      const guide = getGuideBySlug(`${month}-month-old-milestones`);
      expect(guide?.faqs?.length, `month ${month}`).toBeGreaterThanOrEqual(4);
      expect(guide?.productLinks?.length, `month ${month} links`).toBeGreaterThanOrEqual(5);
    }
    const three = getGuideBySlug('3-month-old-milestones');
    expect(three?.faqs?.length).toBeGreaterThanOrEqual(4);
    expect(three?.productLinks?.some((l) => l.to === '/guides/baby-monthly-milestones')).toBe(true);
  });
});

const COMPARISON_GUIDE_SLUGS = [
  'yarntrails-vs-qeepsake',
  'best-baby-book-apps-2026',
  'tinybeans-vs-qeepsake',
  'digital-baby-book-guide',
  'milestone-cards-printable',
];

describe('comparison and digital-book guides', () => {
  it('adds FAQs and product links without fake download counts', () => {
    for (const slug of COMPARISON_GUIDE_SLUGS) {
      const guide = getGuideBySlug(slug);
      expect(guide, slug).toBeTruthy();
      expect(guide.faqs?.length, `${slug} faqs`).toBeGreaterThanOrEqual(4);
      expect(guide.productLinks?.length, `${slug} links`).toBeGreaterThanOrEqual(4);
      const blob = JSON.stringify(guide.faqs);
      expect(blob.toLowerCase()).not.toMatch(/\d[\d,]*\s*(downloads|installs)/);
    }
  });
});

describe('first-year vaccination guide', () => {
  it('points India queries at the India tracker canonical', () => {
    const guide = getGuideBySlug('first-year-vaccination-schedule');
    expect(guide?.intro).toMatch(/India/i);
    expect(guide?.intro).toMatch(/IAP/);
    expect(guide?.faqs?.length).toBeGreaterThanOrEqual(4);
    expect(guide?.productLinks?.some((l) => l.to === '/guides/vaccination-tracker-india')).toBe(true);
    expect(guide?.relatedSlugs).toContain('vaccination-tracker-india');
  });
});

describe('product hub SEO intros', () => {
  it('names the canonical guide in visible prerender copy', () => {
    const vaccination = hubSeoIntroHtml(ROUTES.vaccination);
    expect(hubSeoHeading(ROUTES.vaccination)).toBe('Vaccination tracker');
    expect(vaccination).toContain('href="/guides/vaccination-tracker-india"');
    expect(vaccination).toContain('India IAP/UIP');
    const shopping = hubSeoIntroHtml(ROUTES.shopping);
    expect(shopping).toContain('href="/guides/newborn-essentials-checklist"');
    const momCare = hubSeoIntroHtml(ROUTES.momCare);
    expect(momCare).toContain('href="/guides/postpartum-recovery-week-by-week"');
    const recipes = hubSeoIntroHtml(ROUTES.communityTab('recipes'));
    expect(recipes).toContain('href="/guides/starting-solids-guide"');
    expect(recipes).toContain('href="/guides/indian-baby-food-recipes"');
  });

  it('puts canonical guide URLs in product FAQs', () => {
    const vax = PRODUCT_PAGE_FAQS['/vaccination'].faqs.map((f) => f.a).join(' ');
    expect(vax).toContain('/guides/vaccination-tracker-india');
    const shop = PRODUCT_PAGE_FAQS['/shopping'].faqs.map((f) => f.a).join(' ');
    expect(shop).toContain('/guides/newborn-essentials-checklist');
  });
});

describe('content gap guides', () => {
  it('publishes SEO gap guides with meta', () => {
    for (const slug of CONTENT_GAP_GUIDE_SLUGS) {
      const guide = getGuideBySlug(slug);
      expect(guide, slug).toBeTruthy();
      expect(guide.title.length).toBeGreaterThan(10);
      expect(guide.description.length).toBeGreaterThan(40);
      expect(guide.body?.length).toBeGreaterThan(3);
      expect(guide.faqs?.length, `${slug} faqs`).toBeGreaterThanOrEqual(4);
      expect(guide.productLinks?.length, `${slug} links`).toBeGreaterThanOrEqual(4);
    }
  });

  it('includes gap guides in the sitemap inventory', () => {
    const entries = getIndexableEntries(
      CONTENT_GAP_GUIDE_SLUGS.map((slug) => {
        const g = getGuideBySlug(slug);
        return { slug, title: g.title, description: g.description, updated: g.updated };
      }),
    );
    const paths = entries.map((e) => e.path);
    for (const slug of CONTENT_GAP_GUIDE_SLUGS) {
      expect(paths).toContain(`/guides/${slug}`);
    }
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
