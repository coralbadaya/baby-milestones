import { describe, it, expect } from 'vitest';
import { rowToMemory, memoryStatusLabel, memoryPatchToRow } from './community';

describe('rowToMemory', () => {
  const baseRow = {
    id: '550e8400-e29b-41d4-a716-446655440000',
    legacy_id: 'memory-seed-teething',
    type: 'tip',
    title: 'Baby Teething — What Worked for Us',
    content: 'Cold teething rings helped.',
    baby_age: '6 months',
    tags: ['teething', 'remedies'],
    created_at: '2026-05-28T10:00:00.000Z',
    reactions: { heart: 5, celebrate: 2, support: 3 },
  };

  it('maps Supabase row to feed memory with legacy id preferred', () => {
    const memory = rowToMemory(baseRow);
    expect(memory.id).toBe('memory-seed-teething');
    expect(memory.type).toBe('tip');
    expect(memory.title).toBe('Baby Teething — What Worked for Us');
    expect(memory.babyAge).toBe('6 months');
    expect(memory.tags).toEqual(['teething', 'remedies']);
    expect(memory.createdAt).toBe('2026-05-28T10:00:00.000Z');
  });

  it('normalizes reaction counts from jsonb', () => {
    const memory = rowToMemory(baseRow);
    expect(memory.reactions).toEqual({ heart: 5, celebrate: 2, support: 3 });
  });

  it('defaults missing reactions to zero', () => {
    const memory = rowToMemory({ ...baseRow, reactions: null });
    expect(memory.reactions).toEqual({ heart: 0, celebrate: 0, support: 0 });
  });

  it('maps nested comments with author_name and created_at', () => {
    const memory = rowToMemory(baseRow, [
      {
        id: 'comment-1',
        text: 'Trying the frozen washcloth tonight!',
        author_name: 'NewMom23',
        created_at: '2026-05-29T14:00:00.000Z',
      },
    ]);
    expect(memory.comments).toHaveLength(1);
    expect(memory.comments[0]).toEqual({
      id: 'comment-1',
      text: 'Trying the frozen washcloth tonight!',
      author: 'NewMom23',
      timestamp: '2026-05-29T14:00:00.000Z',
    });
  });

  it('uses uuid id when legacy_id is absent', () => {
    const memory = rowToMemory({
      ...baseRow,
      legacy_id: null,
      id: '550e8400-e29b-41d4-a716-446655440000',
    });
    expect(memory.id).toBe('550e8400-e29b-41d4-a716-446655440000');
  });
});

describe('memoryStatusLabel', () => {
  it('labels moderation statuses for admin', () => {
    expect(memoryStatusLabel('pending')).toBe('Pending');
    expect(memoryStatusLabel('published')).toBe('Published');
    expect(memoryStatusLabel('hidden')).toBe('Hidden');
  });
});

describe('memoryPatchToRow', () => {
  it('maps admin form fields to database columns', () => {
    const row = memoryPatchToRow({
      title: 'New title',
      content: 'Body',
      baby_age: '8 months',
      tags: ['sleep'],
      status: 'published',
      featured: true,
      author_name: 'Sam',
    });
    expect(row.title).toBe('New title');
    expect(row.baby_age).toBe('8 months');
    expect(row.tags).toEqual(['sleep']);
    expect(row.featured).toBe(true);
    expect(row.updated_at).toMatch(/^\d{4}-/);
  });

  it('clears optional string fields with null', () => {
    const row = memoryPatchToRow({ baby_age: '', author_name: '' });
    expect(row.baby_age).toBeNull();
    expect(row.author_name).toBeNull();
  });
});
