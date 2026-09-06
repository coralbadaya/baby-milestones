import { describe, it, expect } from 'vitest';
import { BRAND_WATERMARK_SRC } from '../constants/brandAssets';
import { buildDiyGlobalDefault, buildDiyImageOverrides, getDiyImage } from './diyImages';

describe('getDiyImage', () => {
  const overrides = {
    'm1-1': {
      src: 'https://example.supabase.co/storage/v1/object/public/diy-images/activities/m1-1.jpg',
      alt: 'Custom alt for vision cards',
    },
  };
  const globalDefault = {
    src: 'https://example.supabase.co/storage/v1/object/public/diy-images/defaults/card.jpg',
    alt: 'Hands-on play',
  };

  it('returns Supabase override when activityId matches', () => {
    const result = getDiyImage(
      { activityId: 'm1-1', illustration: 'vision_cards', category: 'sensory' },
      overrides,
      globalDefault,
    );
    expect(result.source).toBe('override');
    expect(result.src).toBe(overrides['m1-1'].src);
    expect(result.alt).toBe('Custom alt for vision cards');
  });

  it('uses the admin site-wide default when there is no per-activity override', () => {
    const result = getDiyImage(
      { activityId: 'm1-2', illustration: 'tummy_time', category: 'motor' },
      overrides,
      globalDefault,
    );
    expect(result.source).toBe('default');
    expect(result.src).toBe(globalDefault.src);
    expect(result.src).not.toContain('/images/diy/');
  });

  it('falls back to the cream lockup when there is no override or site default', () => {
    const result = getDiyImage(
      { activityId: 'm1-2', illustration: 'tummy_time', category: 'motor' },
      overrides,
    );
    expect(result.source).toBe('watermark');
    expect(result.src).toBe(BRAND_WATERMARK_SRC);
    expect(result.src).not.toContain('/images/diy/tummy_time');
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

  it('skips seed bootstrap rows so the site default can show', () => {
    const map = buildDiyImageOverrides(
      [
        { activity_id: 'm1-1', storage_path: 'activities/m1-1.jpg', alt_text: 'Seeded', source: 'seed' },
        { activity_id: 'm1-2', storage_path: 'activities/m1-2.jpg', alt_text: 'Custom', source: 'upload' },
      ],
      'https://project.supabase.co',
    );
    expect(map['m1-1']).toBeUndefined();
    expect(map['m1-2'].src).toContain('activities/m1-2.jpg');
  });

  it('returns empty map without supabase URL', () => {
    expect(buildDiyImageOverrides([{ activity_id: 'm1-1', storage_path: 'x.jpg', alt_text: 'A' }], '')).toEqual({});
  });
});

describe('buildDiyGlobalDefault', () => {
  it('builds a public URL from the singleton row', () => {
    const result = buildDiyGlobalDefault(
      { storage_path: 'defaults/card.jpg', alt_text: 'Hands-on play' },
      'https://project.supabase.co',
    );
    expect(result.src).toBe(
      'https://project.supabase.co/storage/v1/object/public/diy-images/defaults/card.jpg',
    );
    expect(result.alt).toBe('Hands-on play');
  });

  it('returns null without a storage path', () => {
    expect(buildDiyGlobalDefault(null, 'https://project.supabase.co')).toBeNull();
    expect(buildDiyGlobalDefault({ alt_text: 'x' }, 'https://project.supabase.co')).toBeNull();
  });
});
