import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  deleteDiyContentRow,
  fetchAllDiyContentRows,
  fetchDiyContentRow,
  upsertDiyContentFromForm,
  validateDiyVideoUrl,
} from './diyActivityAdmin';

function chain(resolved) {
  const api = {
    select: vi.fn(() => api),
    eq: vi.fn(() => api),
    order: vi.fn(() => api),
    upsert: vi.fn(() => api),
    delete: vi.fn(() => api),
    maybeSingle: vi.fn(() => Promise.resolve(resolved)),
    single: vi.fn(() => Promise.resolve(resolved)),
  };
  api.then = (onFulfilled, onRejected) => Promise.resolve(resolved).then(onFulfilled, onRejected);
  return api;
}

describe('diyActivityAdmin', () => {
  const supabase = { from: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchAllDiyContentRows loads override rows', async () => {
    supabase.from.mockReturnValue(chain({
      data: [{ activity_id: 'm1-1', name: 'Custom' }],
      error: null,
    }));

    const rows = await fetchAllDiyContentRows(supabase);
    expect(rows).toHaveLength(1);
    expect(supabase.from).toHaveBeenCalledWith('diy_activity_content');
  });

  it('fetchDiyContentRow loads one activity override', async () => {
    supabase.from.mockReturnValue(chain({
      data: { activity_id: 'm1-1', name: 'Custom' },
      error: null,
    }));

    const row = await fetchDiyContentRow(supabase, 'm1-1');
    expect(row.name).toBe('Custom');
  });

  it('upsertDiyContentFromForm writes full snapshot', async () => {
    supabase.from.mockReturnValue(chain({
      data: { activity_id: 'm1-1', name: 'Saved' },
      error: null,
    }));

    const row = await upsertDiyContentFromForm(
      supabase,
      {
        id: 'm1-1',
        name: 'Old',
        category: 'sensory',
        duration: '5 min',
        difficulty: 'Easy',
        materials: [],
        steps: [],
        benefits: [],
        whyItWorks: 'Why',
        videoSearch: 'https://www.youtube.com/results?search_query=old',
        illustration: 'vision_cards',
      },
      {
        name: 'Saved',
        category: 'motor',
        duration: '10 min',
        difficulty: 'Medium',
        materials: 'Paper',
        steps: 'Step',
        benefits: 'Benefit',
        whyItWorks: 'Because',
        videoSearch: 'https://www.youtube.com/results?search_query=test',
        illustration: 'wave',
      },
      'user-1',
    );

    expect(row.name).toBe('Saved');
    expect(supabase.from).toHaveBeenCalledWith('diy_activity_content');
  });

  it('deleteDiyContentRow removes override', async () => {
    const deleteChain = chain({ error: null });
    supabase.from.mockReturnValue(deleteChain);

    await deleteDiyContentRow(supabase, 'm1-1');
    expect(deleteChain.delete).toHaveBeenCalled();
    expect(deleteChain.eq).toHaveBeenCalledWith('activity_id', 'm1-1');
  });

  it('validateDiyVideoUrl accepts youtube search links', () => {
    const result = validateDiyVideoUrl('https://www.youtube.com/results?search_query=baby+tummy+time');
    expect(result.ok).toBe(true);
  });

  it('validateDiyVideoUrl rejects non-youtube hosts', () => {
    const result = validateDiyVideoUrl('https://vimeo.com/123');
    expect(result.ok).toBe(false);
  });
});
