import { detectFestivalFromDate } from '../data/festivalCalendar';

/** @typedef {{ id: string, photoDataUrl?: string, videoDataUrl?: string, capturedAt?: string, note?: string }} FirstMoment */
/** @typedef {{ id: string, caption?: string, photo_month?: number, captured_at?: string, data_url?: string }} AlbumPhoto */

export const BOOK_IDEA_CONCEPTS = [
  {
    id: 'sameSpotSeries',
    emoji: '🪑',
    title: 'Same-spot series',
    tagLine: 'Monthly growth',
    description: 'Baby in the same chair or blanket each month — AI aligns growth.',
  },
  {
    id: 'littleHandsFeet',
    emoji: '🤲',
    title: 'Little hands, little feet',
    tagLine: 'Crop & arrange',
    description: 'AI crops and arranges a hands-and-feet-only spread.',
  },
  {
    id: 'thenAndNow',
    emoji: '🪞',
    title: 'Then & Now mirror',
    tagLine: 'Grandparent gift',
    description: 'Your baby photo beside your own — a grandparent gift gold.',
  },
  {
    id: 'sleepGallery',
    emoji: '🌙',
    title: 'Twelve dreams',
    tagLine: 'Sleep gallery',
    description: 'Sleeping photos clustered into a "12 dreams" spread.',
  },
  {
    id: 'firstTastes',
    emoji: '🥑',
    title: 'First tastes',
    tagLine: 'Solids era',
    description: 'Solids-era mess montage with AI-cleaned backgrounds.',
  },
  {
    id: 'letterAt18',
    emoji: '✉️',
    title: 'Letter to you at 18',
    tagLine: 'Time capsule',
    description: 'Write or record now; sealed page in the printed book.',
  },
  {
    id: 'familyConstellation',
    emoji: '✨',
    title: 'Family constellation',
    tagLine: 'From Family Circle',
    description: 'Family faces stylized as a star map — fits the night-sky brand.',
  },
  {
    id: 'festivalFirsts',
    emoji: '🪔',
    title: 'Festival firsts',
    tagLine: 'Auto-detected',
    description: 'First Diwali, Christmas, or Eid auto-detected by date.',
  },
  {
    id: 'growthChart',
    emoji: '🚀',
    title: 'Growth rocket',
    tagLine: 'From milestones',
    description: 'Weight and height plotted as a climbing vine or rocket trail.',
  },
  {
    id: 'alphabetOfYou',
    emoji: '🔤',
    title: 'Alphabet of you',
    tagLine: 'One tap',
    description: 'A is for Avocado face, B is for Bath time — AI picks photos.',
  },
];

const SLEEP_KEYWORDS = ['sleep', 'nap', 'asleep', 'bed', 'crib', 'dream'];
const HANDS_FEET_KEYWORDS = ['hand', 'foot', 'feet', 'toe', 'finger', 'palm'];
const FOOD_KEYWORDS = ['food', 'eat', 'solid', 'avocado', 'mess', 'taste', 'spoon'];

function hasKeyword(text, keywords) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return keywords.some((k) => lower.includes(k));
}

function getPhotosFromSources(albumPhotos, firstMoments) {
  const album = (albumPhotos || []).map((p) => ({
    id: p.id,
    dataUrl: p.data_url,
    caption: p.caption,
    capturedAt: p.captured_at,
    month: p.photo_month,
    source: 'album',
  }));

  const moments = Object.entries(firstMoments || {})
    .filter(([, m]) => m?.photoDataUrl || m?.videoDataUrl)
    .map(([id, m]) => ({
      id,
      dataUrl: m.photoDataUrl || m.videoDataUrl,
      caption: m.note,
      capturedAt: m.capturedAt,
      month: null,
      source: 'moment',
    }));

  return [...album, ...moments];
}

function clusterByMonth(photos) {
  const byMonth = {};
  photos.forEach((p) => {
    const month = p.month ?? (p.capturedAt ? new Date(p.capturedAt).getMonth() + 1 : 0);
    if (!byMonth[month]) byMonth[month] = [];
    byMonth[month].push(p);
  });
  return byMonth;
}

/**
 * @param {string} conceptId
 * @param {AlbumPhoto[]} albumPhotos
 * @param {Record<string, FirstMoment>} firstMoments
 * @param {{ birthDate?: string, currentMonth?: number }} context
 */
export function detectBookIdeaPhotos(conceptId, albumPhotos, firstMoments, context = {}) {
  const photos = getPhotosFromSources(albumPhotos, firstMoments);
  const { currentMonth = 12 } = context;

  switch (conceptId) {
    case 'sameSpotSeries':
      return photos.length >= 3 ? photos.slice(0, Math.min(photos.length, 12)) : photos;

    case 'littleHandsFeet':
      return photos.filter((p) => hasKeyword(p.caption, HANDS_FEET_KEYWORDS));

    case 'thenAndNow':
      return photos.slice(0, 2);

    case 'sleepGallery':
      return photos.filter((p) => hasKeyword(p.caption, SLEEP_KEYWORDS)).slice(0, 12);

    case 'firstTastes':
      if (currentMonth < 6) return [];
      return photos.filter((p) => hasKeyword(p.caption, FOOD_KEYWORDS));

    case 'letterAt18':
      return [];

    case 'familyConstellation':
      return photos.slice(0, 6);

    case 'festivalFirsts':
      return photos.filter((p) => detectFestivalFromDate(p.capturedAt));

    case 'growthChart':
      return photos.length >= 4 ? photos.slice(0, 4) : [];

    case 'alphabetOfYou': {
      const withCaption = photos.filter((p) => p.caption?.trim());
      return withCaption.slice(0, 26);
    }

    default:
      return [];
  }
}

/**
 * @param {AlbumPhoto[]} albumPhotos
 * @param {Record<string, FirstMoment>} firstMoments
 * @param {{ birthDate?: string, currentMonth?: number }} context
 */
export function scanAllBookIdeas(albumPhotos, firstMoments, context = {}) {
  return BOOK_IDEA_CONCEPTS.map((concept) => {
    const matched = detectBookIdeaPhotos(concept.id, albumPhotos, firstMoments, context);
    const autoDetected = ['festivalFirsts'].includes(concept.id) && matched.length > 0;
    return {
      ...concept,
      matchedPhotoIds: matched.map((p) => p.id),
      photoCount: matched.length,
      autoDetected,
      ready: matched.length > 0 || concept.id === 'letterAt18',
    };
  });
}

export default scanAllBookIdeas;
