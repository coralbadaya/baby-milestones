import { describe, it, expect } from 'vitest';
import { buildStoryTitle, generateBabyStoryPages } from './generateBabyStory';

describe('generateBabyStoryPages', () => {
  it('returns three pages', () => {
    const pages = generateBabyStoryPages({ month: 3, babyName: 'Luna' });
    expect(pages).toHaveLength(3);
    expect(pages[0].text).toMatch(/Month 3/);
    expect(pages[0].text).toMatch(/Luna/);
  });
});

describe('buildStoryTitle', () => {
  it('formats month title', () => {
    expect(buildStoryTitle(6)).toBe('Month 6 — Their Story So Far');
  });
});
