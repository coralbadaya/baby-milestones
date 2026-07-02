import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  fetchAllDiyImageRows,
  fetchDiyImageRow,
  updateDiyImageAlt,
  validateDiyImageUrl,
} from './diyImageAdmin';

function chain(resolved) {
  const api = {
    select: vi.fn(() => api),
    eq: vi.fn(() => api),
    order: vi.fn(() => api),
    update: vi.fn(() => api),
    maybeSingle: vi.fn(() => Promise.resolve(resolved)),
    single: vi.fn(() => Promise.resolve(resolved)),
  };
  api.then = (onFulfilled, onRejected) => Promise.resolve(resolved).then(onFulfilled, onRejected);
  return api;
}

describe('diyImageAdmin', () => {
  const supabase = { from: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchAllDiyImageRows returns ordered rows', async () => {
    supabase.from.mockReturnValue(chain({
      data: [{ activity_id: 'm1-1', storage_path: 'activities/m1-1.jpg' }],
      error: null,
    }));

    const rows = await fetchAllDiyImageRows(supabase);
    expect(rows).toHaveLength(1);
    expect(supabase.from).toHaveBeenCalledWith('diy_activity_images');
  });

  it('fetchDiyImageRow loads one activity row', async () => {
    supabase.from.mockReturnValue(chain({
      data: { activity_id: 'm1-1', alt_text: 'Alt' },
      error: null,
    }));

    const row = await fetchDiyImageRow(supabase, 'm1-1');
    expect(row.alt_text).toBe('Alt');
  });

  it('updateDiyImageAlt patches alt text', async () => {
    supabase.from.mockReturnValue(chain({
      data: { activity_id: 'm1-1', alt_text: 'New alt' },
      error: null,
    }));

    const row = await updateDiyImageAlt(supabase, 'm1-1', 'New alt', 'user-1');
    expect(row.alt_text).toBe('New alt');
  });

  it('validateDiyImageUrl rejects blocked hosts', () => {
    const result = validateDiyImageUrl('https://i.pinimg.com/example.jpg');
    expect(result.ok).toBe(false);
  });
});
