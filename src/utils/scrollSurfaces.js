export const SCROLL_SURFACE_VARS = {
  ivory: 'var(--surface-ivory)',
  white: 'var(--surface-white)',
  sand: 'var(--surface-sand)',
  ink: 'var(--surface-ink)',
  primary: 'var(--surface-primary)',
};

/** @param {string} surface */
export function surfaceToCssVar(surface) {
  return SCROLL_SURFACE_VARS[surface] ?? SCROLL_SURFACE_VARS.primary;
}

/**
 * Pick the scroll-sync band for Home — uses viewport center, not IO ratio
 * (small bands like editorial quotes otherwise win with ratio 1.0).
 * @param {Element[]} bands
 * @param {number} [viewportHeight]
 * @returns {string|null}
 */
export function pickActiveScrollBand(bands, viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 800) {
  const viewportCenter = viewportHeight / 2;
  let fallback = null;
  let fallbackDist = Infinity;

  for (const el of bands) {
    if (el.classList.contains('editorial-band')) continue;

    const rect = el.getBoundingClientRect();
    const visibleBottom = Math.min(viewportHeight, rect.bottom);
    const visibleTop = Math.max(0, rect.top);
    if (visibleBottom <= visibleTop) continue;

    if (rect.top <= viewportCenter && rect.bottom >= viewportCenter) {
      return el.getAttribute('data-scroll-surface');
    }

    const elCenter = rect.top + rect.height / 2;
    const centerDist = Math.abs(elCenter - viewportCenter);
    if (centerDist < fallbackDist) {
      fallbackDist = centerDist;
      fallback = el;
    }
  }

  return fallback?.getAttribute('data-scroll-surface') ?? null;
}
