/**
 * Builders for JSON-LD structured data (schema.org). Keep these pure so they
 * can be rendered via <StructuredData />.
 */
import { BRAND_NAME, SITE_URL, OG_IMAGE, SOCIAL_LINKS } from '../constants/brand';

const abs = (path = '/') => {
  try {
    return new URL(path, SITE_URL).href;
  } catch {
    return SITE_URL;
  }
};

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: BRAND_NAME,
    url: SITE_URL,
    logo: OG_IMAGE,
    sameAs: SOCIAL_LINKS.map((s) => s.url),
  };
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: BRAND_NAME,
    url: SITE_URL,
  };
}

/**
 * @param {import('../data/guides').Guide} guide
 * @param {string} pathname
 */
export function articleSchema(guide, pathname) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalWebPage',
    headline: guide.title,
    description: guide.description,
    url: abs(pathname),
    dateModified: guide.updated,
    inLanguage: 'en',
    author: { '@type': 'Organization', name: guide.author || BRAND_NAME },
    reviewedBy: guide.reviewedBy ? { '@type': 'Person', name: guide.reviewedBy } : undefined,
    publisher: { '@type': 'Organization', name: BRAND_NAME, logo: OG_IMAGE },
  };
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
      item: abs(c.path),
    })),
  };
}
