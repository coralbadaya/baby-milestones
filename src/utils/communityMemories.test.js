import { describe, it, expect } from 'vitest';
import {
  appendMemoryComment,
  COMMUNITY_MEMORIES_STORAGE_KEY,
  createCommunityMemoryRecord,
  findMemoryById,
  incrementMemoryReaction,
  isCommunityMemoryUuid,
  localOnlyMemories,
  mergeCommunityMemories,
  sortMemoriesNewestFirst,
} from './communityMemories';

const sampleMemory = (overrides = {}) => ({
  id: 'memory-1',
  type: 'milestone',
  title: 'First smile',
  content: 'She smiled today.',
  babyAge: '2 months',
  tags: ['milestone'],
  createdAt: '2026-06-01T10:00:00.000Z',
  reactions: { heart: 1, celebrate: 0, support: 0 },
  comments: [],
  ...overrides,
});

describe('community feed memory helpers', () => {
  it('uses stable localStorage key', () => {
    expect(COMMUNITY_MEMORIES_STORAGE_KEY).toBe('coral_memories');
  });

  it('creates a new memory with defaults and reactions at zero', () => {
    const memory = createCommunityMemoryRecord({
      type: 'tip',
      title: 'Teething tip',
      content: 'Cold ring helped.',
    });
    expect(memory.id).toMatch(/^memory-/);
    expect(memory.createdAt).toBeTruthy();
    expect(memory.reactions).toEqual({ heart: 0, celebrate: 0, support: 0 });
    expect(memory.comments).toEqual([]);
    expect(memory.tags).toEqual([]);
  });

  it('sorts feed newest first by createdAt', () => {
    const sorted = sortMemoriesNewestFirst([
      sampleMemory({ id: 'a', createdAt: '2026-05-01T10:00:00.000Z' }),
      sampleMemory({ id: 'b', createdAt: '2026-07-01T10:00:00.000Z' }),
      sampleMemory({ id: 'c', createdAt: '2026-06-01T10:00:00.000Z' }),
    ]);
    expect(sorted.map((m) => m.id)).toEqual(['b', 'c', 'a']);
  });

  it('merges remote and local without duplicating seed legacy ids', () => {
    const remote = [
      sampleMemory({
        id: 'memory-seed-teething',
        _fromSupabase: true,
        createdAt: '2026-05-28T10:00:00.000Z',
      }),
    ];
    const local = [
      sampleMemory({ id: 'memory-seed-teething', createdAt: '2026-05-28T10:00:00.000Z' }),
      sampleMemory({ id: 'memory-local-1', createdAt: '2026-06-15T10:00:00.000Z' }),
    ];
    const merged = mergeCommunityMemories(remote, local);
    expect(merged).toHaveLength(2);
    expect(merged[0].id).toBe('memory-local-1');
    expect(merged[1].id).toBe('memory-seed-teething');
    expect(merged[1]._fromSupabase).toBe(true);
  });

  it('increments each reaction type independently', () => {
    const base = sampleMemory();
    expect(incrementMemoryReaction(base, 'heart').reactions.heart).toBe(2);
    expect(incrementMemoryReaction(base, 'celebrate').reactions.celebrate).toBe(1);
    expect(incrementMemoryReaction(base, 'support').reactions.support).toBe(1);
  });

  it('appends comments with author and timestamp', () => {
    const updated = appendMemoryComment(sampleMemory(), {
      id: 1,
      text: 'Same here!',
      author: 'You',
      timestamp: '2026-06-02T09:00:00.000Z',
    });
    expect(updated.comments).toHaveLength(1);
    expect(updated.comments[0].text).toBe('Same here!');
  });

  it('round-trips memory with comments via JSON (localStorage pattern)', () => {
    const memory = createCommunityMemoryRecord({
      type: 'tip',
      title: 'Baby Teething',
      content: 'Cold ring helped.',
      babyAge: '6 months',
    });
    const withComment = appendMemoryComment(memory, {
      id: 1,
      text: 'Same here!',
      author: 'You',
      timestamp: '2026-06-02T09:00:00.000Z',
    });
    withComment.reactions.heart = 3;

    const restored = JSON.parse(JSON.stringify([withComment]));
    expect(restored[0].comments).toHaveLength(1);
    expect(restored[0].reactions.heart).toBe(3);
  });

  it('finds memory by id for reactions and comments', () => {
    const memories = [
      sampleMemory({ id: 'memory-a' }),
      sampleMemory({ id: 'memory-b', title: 'Second' }),
    ];
    expect(findMemoryById(memories, 'memory-b')?.title).toBe('Second');
    expect(findMemoryById(memories, 'missing')).toBeUndefined();
  });

  it('detects uuid ids for Supabase reaction rpc', () => {
    expect(isCommunityMemoryUuid('550e8400-e29b-41d4-a716-446655440000')).toBe(true);
    expect(isCommunityMemoryUuid('memory-seed-teething')).toBe(false);
  });

  it('filters local-only memories for persistence', () => {
    const memories = [
      sampleMemory({ id: 'remote', _fromSupabase: true }),
      sampleMemory({ id: 'local' }),
    ];
    expect(localOnlyMemories(memories).map((m) => m.id)).toEqual(['local']);
  });
});
