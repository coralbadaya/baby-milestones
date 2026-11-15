import { describe, expect, it } from 'vitest';
import { BOOK_IDEA_DEFINITIONS, IDEA_COLLECTIONS, getBookIdeaConceptList } from './bookIdeasConfig';

describe('bookIdeasConfig', () => {
  it('defines 10 ideas across 4 collections', () => {
    expect(getBookIdeaConceptList()).toHaveLength(10);
    expect(IDEA_COLLECTIONS).toHaveLength(4);
    const ids = new Set(Object.keys(BOOK_IDEA_DEFINITIONS));
    IDEA_COLLECTIONS.forEach((c) => {
      c.ideaIds.forEach((id) => expect(ids.has(id)).toBe(true));
    });
    const covered = new Set(IDEA_COLLECTIONS.flatMap((c) => c.ideaIds));
    expect(covered.size).toBe(10);
  });
});