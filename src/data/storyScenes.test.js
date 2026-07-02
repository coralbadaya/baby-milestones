import { describe, it, expect } from 'vitest';
import { getSceneStoryLines, STORY_SCENES } from '../data/storyScenes';

describe('storyScenes', () => {
  it('exports four dream scenes', () => {
    expect(STORY_SCENES).toHaveLength(4);
  });

  it('fills baby name in Hindi astronaut lines', () => {
    const lines = getSceneStoryLines('astronaut', 'hi', 'Aria');
    expect(lines.opening).toContain('Aria');
    expect(lines.opening).toContain('चंदा');
  });

  it('falls back to English for unsupported language', () => {
    const lines = getSceneStoryLines('musician', 'ja', 'Kai');
    expect(lines.closing).toContain('Kai');
  });
});
