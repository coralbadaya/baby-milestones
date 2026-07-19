import { describe, it, expect } from 'vitest';
import { buildDiyImageOverrides, getDiyImage } from './diyImages';

describe('getDiyImage', () => {
  const overrides = {
    'm1-1': {
      src: 'https://example.supabase.co/storage/v1/object/public/diy-images/activities/m1-1.jpg',
      alt: 'Custom alt for vision cards',
    },
  };

  it('returns Supabase override when activityId matches', () => {
    const result = getDiyImage(
      { activityId: 'm1-1', illustration: 'vision_cards', category: 'sensory' },
      overrides,
    );
    expect(result.source).toBe('override');
    expect(result.src).toBe(overrides['m1-1'].src);
    expect(result.alt).toBe('Custom alt for vision cards');
  });

  it('falls back to bundled illustration JPG when no override', () => {
    const result = getDiyImage(
      { activityId: 'm1-2', illustration: 'tummy_time', category: 'motor' },
      overrides,
    );
    expect(result.source).toBe('bundled');
    expect(result.src).toBe('/images/diy/tummy_time.jpg');
  });

  it('falls back to Yarn Trails watermark when illustration unknown', () => {
    const result = getDiyImage(
      { activityId: 'unknown-1', illustration: 'not_a_real_key', category: 'bonding' },
      {},
    );
    expect(result.source).toBe('watermark');
    expect(result.src).toContain('yarntrails-watermark');
    expect(result.watermarkSrc).toContain('yarntrails-watermark');
    expect(result.fallbackGradient).toContain('linear-gradient');
  });
});

describe('buildDiyImageOverrides', () => {
  it('builds public URLs from storage paths', () => {
    const map = buildDiyImageOverrides(
      [{ activity_id: 'm1-1', storage_path: 'activities/m1-1.jpg', alt_text: 'Alt' }],
      'https://project.supabase.co',
    );
    expect(map['m1-1'].src).toBe(
      'https://project.supabase.co/storage/v1/object/public/diy-images/activities/m1-1.jpg',
    );
    expect(map['m1-1'].alt).toBe('Alt');
  });

  it('returns empty map without supabase URL', () => {
    expect(buildDiyImageOverrides([{ activity_id: 'm1-1', storage_path: 'x.jpg', alt_text: 'A' }], '')).toEqual({});
  });
});
