import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  DIY_DEFAULT_ID,
  diyDefaultStoragePath,
  fetchAllDiyImageRows,
  fetchDiyImageDefault,
  fetchDiyImageRow,
  resetDiyImageDefault,
  updateDiyImageAlt,
  validateDiyImageUrl,
} from './diyImageAdmin';

function chain(resolved) {
  const api = {
    select: vi.fn(() => api),
    eq: vi.fn(() => api),
    order: vi.fn(() => api),
    update: vi.fn(() => api),
    upsert: vi.fn(() => api),
    delete: vi.fn(() => api),
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

  it('diyDefaultStoragePath uses the defaults/ prefix', () => {
    expect(diyDefaultStoragePath('jpg')).toBe('defaults/card.jpg');
    expect(diyDefaultStoragePath('webp')).toBe('defaults/card.webp');
  });

  it('fetchDiyImageDefault loads the singleton row', async () => {
    supabase.from.mockReturnValue(chain({
      data: { id: DIY_DEFAULT_ID, storage_path: 'defaults/card.jpg', alt_text: 'Hands-on play' },
      error: null,
    }));

    const row = await fetchDiyImageDefault(supabase);
    expect(row.storage_path).toBe('defaults/card.jpg');
    expect(supabase.from).toHaveBeenCalledWith('diy_image_defaults');
  });

  it('resetDiyImageDefault deletes the singleton row', async () => {
    supabase.from.mockReturnValue(chain({ data: null, error: null }));
    supabase.storage = {
      from: vi.fn(() => ({
        remove: vi.fn(() => Promise.resolve({ error: null })),
      })),
    };

    await resetDiyImageDefault(supabase, 'defaults/card.jpg');
    expect(supabase.from).toHaveBeenCalledWith('diy_image_defaults');
    expect(supabase.storage.from).toHaveBeenCalledWith('diy-images');
  });
});
