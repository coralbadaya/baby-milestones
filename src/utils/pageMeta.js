import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  BRAND_NAME,
  OG_IMAGE,
  SEO_DEFAULT_DESCRIPTION,
} from '../constants/brand';
import { formatPageTitle, ROBOTS_INDEX } from '../seo/metadata';
import { buildCanonicalUrl } from '../seo/urls';

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

/**
 * @param {{
 *   title?: string,
 *   description?: string,
 *   image?: string,
 *   path?: string,
 *   canonical?: string,
 *   type?: string,
 *   robots?: string,
 *   homepage?: boolean,
 * }} [meta]
 */
export function applyPageMeta(meta = {}) {
  const homepage = Boolean(meta.homepage || meta.path === '/');
  const title = formatPageTitle(meta.title, { homepage });
  const description = meta.description || SEO_DEFAULT_DESCRIPTION;
  const image = meta.image || OG_IMAGE;
  const canonical = meta.canonical || buildCanonicalUrl(meta.path || '/');

  document.title = title;
  setMeta('name', 'description', description);
  setRobots(meta.robots || ROBOTS_INDEX);
  setMeta('property', 'og:title', title);
  setMeta('property', 'og:description', description);
  setMeta('property', 'og:image', image);
  setMeta('property', 'og:url', canonical);
  setMeta('property', 'og:type', meta.type || 'website');
  setMeta('property', 'og:site_name', BRAND_NAME);
  setMeta('property', 'og:image:width', '1200');
  setMeta('property', 'og:image:height', '630');
  setMeta('property', 'og:locale', 'en_GB');
  setMeta('name', 'twitter:card', 'summary_large_image');
  setMeta('name', 'twitter:site', '@yarntrails');
  setMeta('name', 'twitter:title', title);
  setMeta('name', 'twitter:description', description);
  setMeta('name', 'twitter:image', image);
  setCanonical(canonical);
}

export function resetPageMeta() {
  applyPageMeta({ homepage: true, path: '/' });
}

/**
 * Apply per-page SEO meta. Canonical always uses the production origin + path
 * (never window.location, query strings, or hashes).
 * @param {{
 *   title?: string,
 *   description?: string,
 *   image?: string,
 *   path?: string,
 *   canonical?: string,
 *   type?: string,
 *   robots?: string,
 *   homepage?: boolean,
 * }} [meta]
 */
export function usePageMeta(meta = {}) {
  const { pathname } = useLocation();
  const {
    title, description, image, path, canonical, type, robots, homepage,
  } = meta;
  const resolvedPath = path || pathname;

  useEffect(() => {
    applyPageMeta({
      title,
      description,
      image,
      path: resolvedPath,
      canonical,
      type,
      robots,
      homepage: homepage || resolvedPath === '/',
    });
  }, [title, description, image, resolvedPath, canonical, type, robots, homepage]);
}
