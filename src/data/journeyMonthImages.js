/**
 * Owned 4:3 stills for Journey timeline cards (past + current months).
 * User album photos override these; future months show no image.
 */

const STILLS = {
  1: { src: '/images/journey/month-01.jpg', alt: 'Newborn on a linen wrap during tummy time' },
  2: { src: '/images/journey/month-02.jpg', alt: 'Baby’s first social smile with a parent close by' },
  3: { src: '/images/journey/month-03.jpg', alt: 'Baby cooing face to face in warm window light' },
  4: { src: '/images/journey/month-04.jpg', alt: 'Baby reaching toward a hanging toy' },
  5: { src: '/images/journey/month-05.jpg', alt: 'Baby sitting with support on a wool rug' },
  6: { src: '/images/journey/month-06.jpg', alt: 'Baby tasting first foods from a small bowl' },
  7: { src: '/images/journey/month-07.jpg', alt: 'Baby rolling and starting to move across the floor' },
  8: { src: '/images/journey/month-08.jpg', alt: 'Baby sitting independently and babbling' },
  9: { src: '/images/journey/month-09.jpg', alt: 'Baby pulling to stand at a low bench' },
  10: { src: '/images/journey/month-10.jpg', alt: 'Baby cruising along furniture' },
  11: { src: '/images/journey/month-11.jpg', alt: 'Baby standing with a parent, curious about the room' },
  12: { src: '/images/journey/month-12.jpg', alt: 'First birthday cake smash in a quiet home kitchen' },
  13: { src: '/images/journey/month-13.jpg', alt: 'Toddler taking early steps indoors' },
  14: { src: '/images/journey/month-14.jpg', alt: 'Toddler opening a cupboard to explore' },
  15: { src: '/images/journey/month-15.jpg', alt: 'Toddler pointing and talking with a parent' },
  16: { src: '/images/journey/month-16.jpg', alt: 'Toddler playing independently with wooden toys' },
  17: { src: '/images/journey/month-17.jpg', alt: 'Toddler collecting words from a board book' },
  18: { src: '/images/journey/month-18.jpg', alt: 'Toddler running across a sunlit floor at eighteen months' },
  19: { src: '/images/journey/month-19.jpg', alt: 'Toddler in quiet pretend play with a wooden set' },
  20: { src: '/images/journey/month-20.jpg', alt: 'Toddler beside another child in gentle play' },
  21: { src: '/images/journey/month-21.jpg', alt: 'Toddler asking about an object, pointing' },
  22: { src: '/images/journey/month-22.jpg', alt: 'Toddler imitating cooking beside a parent' },
  23: { src: '/images/journey/month-23.jpg', alt: 'Almost-two toddler running in a garden' },
  24: { src: '/images/journey/month-24.jpg', alt: 'Second birthday at a small table at home' },
  25: { src: '/images/journey/month-25.jpg', alt: 'Toddler in imaginative play with cloth and blocks' },
  26: { src: '/images/journey/month-26.jpg', alt: 'Toddler sharing a toy with a friend outdoors' },
  27: { src: '/images/journey/month-27.jpg', alt: 'Curious toddler looking closely at leaves' },
  28: { src: '/images/journey/month-28.jpg', alt: 'Toddler drawing with crayons at a low table' },
  29: { src: '/images/journey/month-29.jpg', alt: 'Toddler helping to put toys back in a basket' },
  30: { src: '/images/journey/month-30.jpg', alt: 'Confident toddler climbing a low indoor step' },
  31: { src: '/images/journey/month-31.jpg', alt: 'Toddler telling a story from a picture book' },
  32: { src: '/images/journey/month-32.jpg', alt: 'Toddler lining up toys to count them' },
  33: { src: '/images/journey/month-33.jpg', alt: 'Confident toddler walking a quiet tree-lined path' },
  34: { src: '/images/journey/month-34.jpg', alt: 'Toddler at a low desk with books, ready for preschool' },
  35: { src: '/images/journey/month-35.jpg', alt: 'Almost-three child in a calm park with a parent' },
  36: { src: '/images/journey/month-36.jpg', alt: 'Third birthday with a simple cake at home' },
};

/**
 * @param {{ month: number, currentMonth?: number|null, albumPhotos?: Array<{ photo_month?: number, data_url?: string, caption?: string }> }} args
 * @returns {{ src: string, alt: string } | null}
 */
export function getJourneyCardImage({ month, currentMonth, albumPhotos }) {
  if (!currentMonth || month > currentMonth) return null;
  const album = (albumPhotos || []).find((p) => p.photo_month === month && p.data_url);
  if (album?.data_url) {
    return {
      src: album.data_url,
      alt: album.caption || `Your photo from month ${month}`,
    };
  }
  return STILLS[month] ?? null;
}

export const JOURNEY_MONTH_IMAGES = STILLS;
