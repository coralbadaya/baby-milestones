import { describe, it, expect } from 'vitest';
import { FIRST_MOMENTS_STORAGE_KEY } from '../constants/firstMoments';
import { countCapturedMoments } from '../data/firsts';

describe('first moments persistence pattern', () => {
  it('round-trips moment map via localStorage key', () => {
    const moments = {
      'first-smile': {
        photoDataUrl: 'data:image/png;base64,abc',
        capturedAt: '2026-06-01T12:00:00.000Z',
        mediaType: 'photo',
      },
    };

    const serialized = JSON.stringify(moments);
    const restored = JSON.parse(serialized);

    expect(restored['first-smile'].mediaType).toBe('photo');
    expect(countCapturedMoments(restored)).toBe(1);
    expect(FIRST_MOMENTS_STORAGE_KEY).toBe('yarntrailsFirstMoments');
  });

  it('counts photo and video captures', () => {
    const moments = {
      birth: { photoDataUrl: 'data:image/jpeg;base64,x' },
      'first-walk': { videoDataUrl: 'data:video/mp4;base64,y' },
      'first-laugh': {},
    };
    expect(countCapturedMoments(moments)).toBe(2);
  });
});
