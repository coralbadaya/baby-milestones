/**
 * Builders for JSON-LD structured data (schema.org). Keep these pure so they
 * can be rendered via <StructuredData /> or prerendered into HTML.
 */
import { BRAND_NAME, BRAND_TAGLINE, LOGO_URL, SEO_DEFAULT_DESCRIPTION, SITE_URL } from '../constants/brand.js';
import { buildCanonicalUrl } from '../seo/urls.js';

const MEDICAL_CATEGORIES = new Set(['Baby Development', 'Mom Care', 'Health & Safety']);

function isPendingAttribution(value) {
  return !value || /^pending/i.test(String(value).trim());
}

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: BRAND_NAME,
    url: `${SITE_URL}/`,
    logo: { '@type': 'ImageObject', url: LOGO_URL },
    slogan: BRAND_TAGLINE,
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    url: `${SITE_URL}/`,
    name: BRAND_NAME,
    description: SEO_DEFAULT_DESCRIPTION,
    inLanguage: 'en-GB',
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function webApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: BRAND_NAME,
    url: `${SITE_URL}/`,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'Web, iOS, Android',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
    publisher: { '@id': `${SITE_URL}/#organization` },
  };
}

export function homepageGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [organizationSchema(), websiteSchema(), webApplicationSchema()],
  };
}

/**
 * @param {import('../data/guides').Guide} guide
 * @param {string} pathname
 */
export function articleSchema(guide, pathname) {
  const medical = MEDICAL_CATEGORIES.has(guide.category);
  const schema = {
    '@context': 'https://schema.org',
    '@type': medical ? 'MedicalWebPage' : 'Article',
    headline: guide.title,
    description: guide.description,
    url: buildCanonicalUrl(pathname),
    mainEntityOfPage: buildCanonicalUrl(pathname),
    inLanguage: 'en-GB',
    author: { '@type': 'Organization', name: guide.author || BRAND_NAME },
    publisher: {
      '@type': 'Organization',
      name: BRAND_NAME,
      url: `${SITE_URL}/`,
      logo: { '@type': 'ImageObject', url: LOGO_URL },
    },
  };
  if (guide.updated) schema.dateModified = guide.updated;
  if (!isPendingAttribution(guide.reviewedBy)) {
    schema.reviewedBy = { '@type': 'Person', name: guide.reviewedBy };
  }
  return schema;
}

/** @param {{ q: string, a: string }[]} faqs */
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

/** @param {{ name: string, path: string }[]} crumbs */
export function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: buildCanonicalUrl(c.path),
    })),
  };
}
