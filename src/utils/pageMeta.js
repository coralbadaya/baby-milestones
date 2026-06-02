import {
  BRAND_NAME,
  OG_IMAGE,
  SEO_DEFAULT_DESCRIPTION,
  SEO_DEFAULT_TITLE,
  SITE_URL,
} from '../constants/brand';

const DEFAULT = {
  title: SEO_DEFAULT_TITLE,
  description: SEO_DEFAULT_DESCRIPTION,
  image: OG_IMAGE,
  url: typeof window !== 'undefined' ? window.location.href : SITE_URL,
};

function setMeta(attr, key, value) {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

export function applyPageMeta(meta = {}) {
  const title = meta.title ? `${meta.title} | ${BRAND_NAME}` : DEFAULT.title;
  const ogTitle = meta.title ? `${meta.title} | ${BRAND_NAME}` : DEFAULT.title;
  const description = meta.description || DEFAULT.description;
  const image = meta.image || DEFAULT.image;
  const url = meta.url || DEFAULT.url;

  document.title = title;
  setMeta('name', 'description', description);
  setMeta('property', 'og:title', ogTitle);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:url', url);
  setMeta('property', 'og:type', meta.type || 'website');
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:title', ogTitle);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
}

export function resetPageMeta() {
  applyPageMeta({});
}
