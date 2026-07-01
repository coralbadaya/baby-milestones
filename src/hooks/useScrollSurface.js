import { useEffect } from 'react';
import { pickActiveScrollBand, surfaceToCssVar } from '../utils/scrollSurfaces';

const THRESHOLDS = [0, 0.1, 0.25, 0.5, 0.75, 1];
const SCROLL_BAND_SELECTOR = '[data-scroll-surface]:not(.editorial-band)';

/**
 * Syncs --scroll-surface on a container from the band at viewport center.
 * @param {import('react').RefObject<HTMLElement|null>} containerRef
 * @param {{ defaultSurface?: string, enabled?: boolean, observeKey?: unknown }} [options]
 */
export function useScrollSurface(containerRef, options = {}) {
  const {
    defaultSurface = 'primary',
    enabled = true,
    observeKey,
  } = options;

  useEffect(() => {
    if (!enabled) return undefined;

    const container = containerRef.current;
    if (!container) return undefined;

    const getBands = () => [...container.querySelectorAll(SCROLL_BAND_SELECTOR)];

    const applySurface = () => {
      const bands = getBands();
      if (bands.length === 0) {
        container.style.setProperty('--scroll-surface', surfaceToCssVar(defaultSurface));
        return;
      }

      const surface = pickActiveScrollBand(bands) ?? defaultSurface;
      container.style.setProperty('--scroll-surface', surfaceToCssVar(surface));
    };

    const bands = getBands();
    if (bands.length === 0) {
      applySurface();
      return undefined;
    }

    const observer = new IntersectionObserver(() => applySurface(), { threshold: THRESHOLDS });

    bands.forEach((band) => observer.observe(band));
    applySurface();

    let rafId = 0;
    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(applySurface);
    };

    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [containerRef, defaultSurface, enabled, observeKey]);
}

export default useScrollSurface;
