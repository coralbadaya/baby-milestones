import { describe, expect, it } from 'vitest';
import { getJourneyCardImage, JOURNEY_MONTH_IMAGES } from './journeyMonthImages.js';

describe('getJourneyCardImage', () => {
  it('returns nothing for future months or missing current month', () => {
    expect(getJourneyCardImage({ month: 8, currentMonth: 6 })).toBeNull();
    expect(getJourneyCardImage({ month: 1, currentMonth: null })).toBeNull();
  });

  it('prefers a user album photo over the bundled still', () => {
    const image = getJourneyCardImage({
      month: 3,
      currentMonth: 3,
      albumPhotos: [{ photo_month: 3, data_url: 'https://example.com/baby.jpg', caption: 'Smile' }],
    });
    expect(image).toEqual({ src: 'https://example.com/baby.jpg', alt: 'Smile' });
  });

  it('uses the owned still for past and current months without an album photo', () => {
    const image = getJourneyCardImage({ month: 1, currentMonth: 6, albumPhotos: [] });
    expect(image).toEqual(JOURNEY_MONTH_IMAGES[1]);
    expect(Object.keys(JOURNEY_MONTH_IMAGES)).toHaveLength(36);
  });
});
