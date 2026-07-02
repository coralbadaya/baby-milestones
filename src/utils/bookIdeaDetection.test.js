import { describe, it, expect } from 'vitest';
import { scanAllBookIdeas, detectBookIdeaPhotos, BOOK_IDEA_CONCEPTS } from './bookIdeaDetection';

describe('bookIdeaDetection', () => {
  const album = [
    { id: 'a1', caption: 'sleeping in crib', captured_at: '2025-12-25', data_url: 'x' },
    { id: 'a2', caption: 'tiny hands', captured_at: '2025-11-01', data_url: 'x' },
    { id: 'a3', caption: 'first avocado mess', captured_at: '2025-10-15', photo_month: 7, data_url: 'x' },
  ];

  it('returns 10 concept cards', () => {
    const ideas = scanAllBookIdeas(album, {}, { currentMonth: 8 });
    expect(ideas).toHaveLength(BOOK_IDEA_CONCEPTS.length);
  });

  it('detects sleep gallery photos', () => {
    const matched = detectBookIdeaPhotos('sleepGallery', album, {}, {});
    expect(matched.length).toBeGreaterThan(0);
  });

  it('detects festival from Christmas date', () => {
    const matched = detectBookIdeaPhotos('festivalFirsts', album, {}, {});
    expect(matched.some((p) => p.id === 'a1')).toBe(true);
  });

  it('requires month 6+ for first tastes', () => {
    const young = detectBookIdeaPhotos('firstTastes', album, {}, { currentMonth: 4 });
    expect(young).toHaveLength(0);
    const older = detectBookIdeaPhotos('firstTastes', album, {}, { currentMonth: 8 });
    expect(older.length).toBeGreaterThan(0);
  });
});
