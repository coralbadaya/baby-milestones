import { useEffect } from 'react';
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

function setCanonical(url) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

function setRobots(content) {
  let el = document.querySelector('meta[name="robots"]');
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', 'robots');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
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
  setMeta('property', 'og:site_name', BRAND_NAME);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:locale', 'en_GB');
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:site', '@nestbean');
  setMeta('name', 'twitter:title', ogTitle);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
  setCanonical(meta.canonical || url);
  setRobots(meta.robots);
}

export function resetPageMeta() {
  applyPageMeta({});
}

/**
 * React hook: apply per-page SEO meta on mount / when inputs change.
 * @param {{ title?: string, description?: string, image?: string, url?: string, canonical?: string, type?: string, robots?: string }} meta
 */
export function usePageMeta(meta = {}) {
  const { title, description, image, url, canonical, type, robots } = meta;
  useEffect(() => {
    applyPageMeta({ title, description, image, url, canonical, type, robots });
  }, [title, description, image, url, canonical, type, robots]);
}
