import { describe, it, expect } from 'vitest';
import { parseYouTubeEmbedUrl, isYouTubeSearchUrl } from './youtube';

describe('parseYouTubeEmbedUrl', () => {
  it('parses watch URLs', () => {
    const result = parseYouTubeEmbedUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result).toEqual({
      videoId: 'dQw4w9WgXcQ',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    });
  });

  it('parses youtu.be URLs', () => {
    const result = parseYouTubeEmbedUrl('https://youtu.be/dQw4w9WgXcQ');
    expect(result?.videoId).toBe('dQw4w9WgXcQ');
  });

  it('parses embed URLs', () => {
    const result = parseYouTubeEmbedUrl('https://www.youtube.com/embed/abc123');
    expect(result?.embedUrl).toBe('https://www.youtube.com/embed/abc123');
  });

  it('returns null for search URLs', () => {
    expect(parseYouTubeEmbedUrl('https://www.youtube.com/results?search_query=tummy+time')).toBeNull();
  });

  it('returns null for invalid input', () => {
    expect(parseYouTubeEmbedUrl('')).toBeNull();
    expect(parseYouTubeEmbedUrl('not-a-url')).toBeNull();
  });
});

describe('isYouTubeSearchUrl', () => {
  it('detects search result URLs', () => {
    expect(isYouTubeSearchUrl('https://www.youtube.com/results?search_query=baby')).toBe(true);
  });

  it('returns false for watch URLs', () => {
    expect(isYouTubeSearchUrl('https://www.youtube.com/watch?v=abc')).toBe(false);
  });
});
