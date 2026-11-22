/**
 * Editorial color themes for long-form guides — keyed by primary hub tag.
 * Wool & Trail palette with WCAG-friendly accent contrast on cream/ivory surfaces.
 * Surface hexes are mirrored as `--surface-{id}` in `global.css` for Home bands.
 */

import { primaryTag } from './guideTags';

/** @typedef {{ id: string, label: string, tag: string | null, accent: string, accentDark: string, surface: string, onAccent: string }} GuideTheme */

/** @type {Record<string, GuideTheme>} */
export const GUIDE_THEMES = {
  default: {
    id: 'default',
    label: 'Trail',
    tag: null,
    accent: '#3F5E52',
    accentDark: '#2E4A40',
    surface: '#E8EFEC',
    onAccent: '#FFFFFF',
  },
  milestones: {
    id: 'milestones',
    label: 'Milestones',
    tag: 'milestones',
    accent: '#35594F',
    accentDark: '#243D36',
    surface: '#E4ECE9',
    onAccent: '#FFFFFF',
  },
  vaccines: {
    id: 'vaccines',
    label: 'Vaccines',
    tag: 'vaccines',
    accent: '#2D5A6B',
    accentDark: '#1F3F4B',
    surface: '#E3EEF2',
    onAccent: '#FFFFFF',
  },
  food: {
    id: 'food',
    label: 'Food',
    tag: 'food',
    accent: '#6B5424',
    accentDark: '#4A3A18',
    surface: '#F0E9DA',
    onAccent: '#FFFFFF',
  },
  play: {
    id: 'play',
    label: 'Play',
    tag: 'play',
    accent: '#3D4F7A',
    accentDark: '#2A3856',
    surface: '#E8EBF4',
    onAccent: '#FFFFFF',
  },
  care: {
    id: 'care',
    label: 'Care',
    tag: 'care',
    accent: '#3F5E52',
    accentDark: '#2B4239',
    surface: '#E8EFEC',
    onAccent: '#FFFFFF',
  },
  mom: {
    id: 'mom',
    label: 'Mom',
    tag: 'mom',
    accent: '#6B3D5C',
    accentDark: '#4A2A3F',
    surface: '#F3E8EE',
    onAccent: '#FFFFFF',
  },
  memories: {
    id: 'memories',
    label: 'Memories',
    tag: 'memories',
    accent: '#5C4638',
    accentDark: '#3F3027',
    surface: '#F0EBE6',
    onAccent: '#FFFFFF',
  },
  compare: {
    id: 'compare',
    label: 'Compare',
    tag: 'compare',
    accent: '#3D4A5C',
    accentDark: '#2A3340',
    surface: '#E6E9EF',
    onAccent: '#FFFFFF',
  },
};

/**
 * @param {{ slug?: string, category?: string, milestoneMonth?: number } | null | undefined} guide
 * @param {Record<string, string[]> | null} [overrides]
 */
export function resolveGuideTheme(guide, overrides = null) {
  const tag = primaryTag(guide, overrides);
  if (tag && GUIDE_THEMES[tag]) return GUIDE_THEMES[tag];
  return GUIDE_THEMES.default;
}

/** @param {GuideTheme} theme */
export function guideThemeClassName(theme) {
  return `guide-article--theme-${theme.id}`;
}