import { describe, it, expect } from 'vitest';
import { generateDemoStory, getFolkBeatLabels } from './storyGeneration';
import { STORY_LANGUAGES } from '../constants/storyLanguages';

describe('storyGeneration', () => {
  it('generates variants for all 12 languages', () => {
    const story = generateDemoStory({ babyName: 'Aria' });
    expect(Object.keys(story.languageVariants)).toHaveLength(STORY_LANGUAGES.length);
  });

  it('includes cultural markers in Hindi variant', () => {
    const story = generateDemoStory({ babyName: 'Aria' });
    const hi = story.languageVariants.hi;
    expect(hi.pages.some((p) => p.text.includes('chanda mama') || p.culturalCaption === 'chanda mama')).toBe(true);
  });

  it('uses folk tale opening when template set', () => {
    const story = generateDemoStory({ babyName: 'Aria', folkTemplateId: 'moonJourney' });
    expect(story.title).toBe('Journey to the Moon');
    expect(story.languageVariants.hi.pages[0].type).toBe('opening');
  });

  it('includes month-aware milestone copy', () => {
    const story = generateDemoStory({ babyName: 'Luna', babyAgeMonths: 7 });
    const enPages = story.languageVariants.en.pages;
    expect(enPages.some((p) => p.text.includes('7 months') && p.text.includes('Luna'))).toBe(true);
  });

  it('generates multi-page content without folk mode', () => {
    const story = generateDemoStory({ babyName: 'Luna', babyAgeMonths: 6 });
    expect(story.languageVariants.en.pages.length).toBeGreaterThanOrEqual(4);
  });

  it('maps folk beat keys to labels', () => {
    const labels = getFolkBeatLabels(['call_to_adventure', 'moon_gift']);
    expect(labels).toEqual(['Call to adventure', 'Moon gift']);
  });

  it('uses scene lines when sceneId set', () => {
    const story = generateDemoStory({ babyName: 'Aria', sceneId: 'astronaut' });
    const en = story.languageVariants.en;
    expect(en.title).toContain('Astronaut');
    expect(en.pages[0].text).toMatch(/stars looked back|looked up/i);
    expect(en.pages).toHaveLength(3);
  });
});
