import { describe, it, expect, vi, beforeEach } from 'vitest';
import { buildDiyImageOverrides } from '../data/diyImages';

const mockSelect = vi.fn();
const mockFrom = vi.fn(() => ({ select: mockSelect }));

vi.mock('../utils/supabaseClient', () => ({
  supabase: {
    from: (...args) => mockFrom(...args),
  },
}));

describe('useDiyImages fetch pattern', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('builds overrides from successful fetch rows', async () => {
    mockSelect.mockResolvedValue({
      data: [
        { activity_id: 'm1-1', storage_path: 'activities/m1-1.jpg', alt_text: 'Vision cards' },
      ],
      error: null,
    });

    const { data, error } = await mockFrom('diy_activity_images').select('activity_id, storage_path, alt_text');
    expect(error).toBeNull();

    const overrides = buildDiyImageOverrides(data, 'https://test.supabase.co');
    expect(overrides['m1-1'].src).toContain('activities/m1-1.jpg');
    expect(overrides['m1-1'].alt).toBe('Vision cards');
  });

  it('returns empty overrides on fetch error', async () => {
    mockSelect.mockResolvedValue({ data: null, error: { message: 'network' } });

    const { data, error } = await mockFrom('diy_activity_images').select('activity_id, storage_path, alt_text');
    expect(error.message).toBe('network');

    const overrides = buildDiyImageOverrides(data, 'https://test.supabase.co');
    expect(overrides).toEqual({});
  });
});
