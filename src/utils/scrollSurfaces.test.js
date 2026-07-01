import { describe, it, expect } from 'vitest';
import { SCROLL_SURFACE_VARS, surfaceToCssVar, pickActiveScrollBand } from './scrollSurfaces';

describe('surfaceToCssVar', () => {
  it('maps known surfaces to CSS variables', () => {
    expect(surfaceToCssVar('ivory')).toBe(SCROLL_SURFACE_VARS.ivory);
    expect(surfaceToCssVar('ink')).toBe(SCROLL_SURFACE_VARS.ink);
  });

  it('falls back to primary for unknown surfaces', () => {
    expect(surfaceToCssVar('unknown')).toBe(SCROLL_SURFACE_VARS.primary);
  });
});

function mockBand(surface, rect, className = 'page-section') {
  return {
    classList: { contains: (c) => className.includes(c) },
    getAttribute: (name) => (name === 'data-scroll-surface' ? surface : null),
    getBoundingClientRect: () => rect,
  };
}

describe('pickActiveScrollBand', () => {
  it('prefers the band containing viewport center', () => {
    const bands = [
      mockBand('white', { top: -200, bottom: 300, height: 500 }),
      mockBand('sand', { top: 300, bottom: 900, height: 600 }),
    ];

    expect(pickActiveScrollBand(bands, 800)).toBe('sand');
  });

  it('ignores editorial quote band for scroll-sync', () => {
    const bands = [
      mockBand('sand', { top: 100, bottom: 700, height: 600 }),
      mockBand('ink', { top: 700, bottom: 812, height: 112 }, 'editorial-band'),
    ];

    expect(pickActiveScrollBand(bands, 800)).toBe('sand');
  });

  it('falls back to nearest band center when none spans viewport center', () => {
    const bands = [
      mockBand('ivory', { top: -400, bottom: 50, height: 450 }),
      mockBand('white', { top: 50, bottom: 200, height: 150 }),
    ];

    expect(pickActiveScrollBand(bands, 800)).toBe('white');
  });
});
