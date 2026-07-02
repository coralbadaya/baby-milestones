import { describe, it, expect } from 'vitest';
import { filterMemory, MEMORY_TYPE_FILTERS } from './memoryFilters';

const memory = (overrides = {}) => ({
  id: 'm1',
  type: 'tip',
  title: 'Teething',
  content: 'Cold ring.',
  tags: ['teething', 'remedies'],
  createdAt: '2026-05-28T10:00:00.000Z',
  reactions: { heart: 0, celebrate: 0, support: 0 },
  comments: [],
  ...overrides,
});

describe('filterMemory', () => {
  it('includes all posts when filters are all', () => {
    expect(filterMemory(memory(), { type: 'all', tag: 'all' })).toBe(true);
  });

  it('filters by memory type', () => {
    expect(filterMemory(memory({ type: 'milestone' }), { type: 'milestone', tag: 'all' })).toBe(true);
    expect(filterMemory(memory({ type: 'tip' }), { type: 'milestone', tag: 'all' })).toBe(false);
  });

  it('filters by tag', () => {
    expect(filterMemory(memory(), { type: 'all', tag: 'teething' })).toBe(true);
    expect(filterMemory(memory(), { type: 'all', tag: 'sleep' })).toBe(false);
  });

  it('requires both type and tag when both set', () => {
    expect(filterMemory(memory(), { type: 'tip', tag: 'teething' })).toBe(true);
    expect(filterMemory(memory(), { type: 'milestone', tag: 'teething' })).toBe(false);
  });
});

describe('MEMORY_TYPE_FILTERS', () => {
  it('includes All posts plus each memory type', () => {
    expect(MEMORY_TYPE_FILTERS[0].id).toBe('all');
    expect(MEMORY_TYPE_FILTERS.some((f) => f.id === 'milestone')).toBe(true);
    expect(MEMORY_TYPE_FILTERS.some((f) => f.id === 'struggle')).toBe(true);
  });
});

describe('feed filter counts', () => {
  it('computes filtered vs total post counts', () => {
    const memories = [
      memory({ id: '1', type: 'tip', tags: ['teething'] }),
      memory({ id: '2', type: 'milestone', tags: ['smile'] }),
      memory({ id: '3', type: 'tip', tags: ['sleep'] }),
    ];
    const filtered = memories.filter((m) => filterMemory(m, { type: 'tip', tag: 'all' }));
    expect(filtered).toHaveLength(2);
    expect(`${filtered.length} of ${memories.length} posts`).toBe('2 of 3 posts');
  });
});
