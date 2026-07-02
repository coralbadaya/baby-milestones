import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  approveAllPendingMemories,
  deleteMemoryComment,
  fetchAdminMemories,
  fetchAdminMemory,
  updateMemory,
  updateMemoryComment,
} from './communityAdmin';

const mockFrom = vi.fn();
const mockRpc = vi.fn();

vi.mock('./supabaseClient', () => ({
  supabase: {
    from: (...args) => mockFrom(...args),
    rpc: (...args) => mockRpc(...args),
  },
}));

function chain(resolved) {
  const api = {
    select: vi.fn(() => api),
    eq: vi.fn(() => api),
    order: vi.fn(() => api),
    in: vi.fn(() => api),
    insert: vi.fn(() => api),
    update: vi.fn(() => api),
    delete: vi.fn(() => api),
    upsert: vi.fn(() => api),
    single: vi.fn(() => Promise.resolve(resolved)),
  };
  api.then = (onFulfilled, onRejected) => Promise.resolve(resolved).then(onFulfilled, onRejected);
  return api;
}

describe('communityAdmin', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchAdminMemories attaches comment counts from nested query', async () => {
    mockFrom.mockImplementation((table) => {
      if (table === 'community_memories') {
        return chain({
          data: [
            {
              id: 'uuid-1',
              title: 'First smile',
              status: 'published',
              community_memory_comments: [{ count: 2 }],
            },
          ],
          error: null,
        });
      }
      return chain({ data: [], error: null });
    });

    const rows = await fetchAdminMemories('published');
    expect(rows).toHaveLength(1);
    expect(rows[0].comment_count).toBe(2);
  });

  it('deleteMemoryComment removes comment by id', async () => {
    const deleteChain = chain({ error: null });
    mockFrom.mockReturnValue(deleteChain);

    await deleteMemoryComment('comment-uuid');
    expect(mockFrom).toHaveBeenCalledWith('community_memory_comments');
    expect(deleteChain.delete).toHaveBeenCalled();
    expect(deleteChain.eq).toHaveBeenCalledWith('id', 'comment-uuid');
  });

  it('approveAllPendingMemories publishes pending queue', async () => {
    const updateChain = chain({ error: null });
    mockFrom.mockReturnValue(updateChain);

    await approveAllPendingMemories();
    expect(mockFrom).toHaveBeenCalledWith('community_memories');
    expect(updateChain.update).toHaveBeenCalled();
    expect(updateChain.eq).toHaveBeenCalledWith('status', 'pending');
  });

  it('fetchAdminMemory loads a single post by id', async () => {
    mockFrom.mockReturnValue(chain({
      data: { id: 'uuid-1', title: 'First smile', status: 'pending' },
      error: null,
    }));

    const row = await fetchAdminMemory('uuid-1');
    expect(row.title).toBe('First smile');
    expect(mockFrom).toHaveBeenCalledWith('community_memories');
  });

  it('updateMemory patches editable fields', async () => {
    const updateChain = chain({
      data: { id: 'uuid-1', title: 'Updated', status: 'published' },
      error: null,
    });
    mockFrom.mockReturnValue(updateChain);

    const row = await updateMemory('uuid-1', {
      title: 'Updated',
      status: 'published',
      tags: ['sleep'],
    });
    expect(row.title).toBe('Updated');
    expect(updateChain.update).toHaveBeenCalled();
    expect(updateChain.eq).toHaveBeenCalledWith('id', 'uuid-1');
  });

  it('updateMemoryComment edits comment text and author', async () => {
    const updateChain = chain({
      data: { id: 'c-1', text: 'Edited', author_name: 'Mod' },
      error: null,
    });
    mockFrom.mockReturnValue(updateChain);

    const row = await updateMemoryComment('c-1', { text: 'Edited', author_name: 'Mod' });
    expect(row.text).toBe('Edited');
    expect(mockFrom).toHaveBeenCalledWith('community_memory_comments');
  });
});
