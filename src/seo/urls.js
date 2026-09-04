import { SITE_URL } from '../constants/brand.js';

export const CANONICAL_ORIGIN = SITE_URL.replace(/\/$/, '');

/** Production hostname used for sitemap and canonical URLs. */
export const CANONICAL_HOST = 'yarntrails.com';

/**
 * Normalize a path for canonical URLs: no query, no hash, no trailing slash
 * (except `/`), collapsed duplicate slashes.
 * @param {string} [path]
 */
export function normalizePath(path = '/') {
  if (!path || path === '/') return '/';
  const raw = String(path).split('#')[0].split('?')[0].trim();
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) {
    try {
      const parsed = new URL(raw);
      if (parsed.hostname === CANONICAL_HOST && parsed.protocol === 'https:') {
        return normalizePath(parsed.pathname);
      }
    } catch {
      return '/';
    }
    return '/';
  }
  const withSlash = raw.startsWith('/') ? raw : `/${raw}`;
  const collapsed = withSlash.replace(/\/{2,}/g, '/');
  if (collapsed.length > 1 && collapsed.endsWith('/')) {
    return collapsed.slice(0, -1);
  }
  return collapsed || '/';
}

/**
 * Absolute HTTPS canonical URL on yarntrails.com.
 * @param {string} [path]
 */
export function buildCanonicalUrl(path = '/') {
  const normalized = normalizePath(path);
  return normalized === '/' ? `${CANONICAL_ORIGIN}/` : `${CANONICAL_ORIGIN}${normalized}`;
}

/**
 * @param {string} url
 */
export function isCanonicalProductionUrl(url) {
  if (typeof url !== 'string' || !url) return false;
  if (!url.startsWith('https://')) return false;
  if (/localhost|127\.0\.0\.1|vercel\.app|:5173|:3000/i.test(url)) return false;
  if (url.includes('?') || url.includes('#')) return false;
  try {
    const parsed = new URL(url);
    return parsed.hostname === CANONICAL_HOST && parsed.protocol === 'https:';
  } catch {
    return false;
  }
}
