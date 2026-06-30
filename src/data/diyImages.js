/**
 * DIY activity imagery — keyed by `activity.illustration` archetype.
 * See docs/imagery-system.md and docs/editorial-page-system.md
 */
import diyActivities from './diyActivities';

const CATEGORY_FALLBACK = {
  sensory: {
    fallbackGradient: 'linear-gradient(145deg, #EFD2C4 0%, #F5ECE0 100%)',
    placeholderColor: '#EFD2C4',
  },
  motor: {
    fallbackGradient: 'linear-gradient(145deg, #D6E9F8 0%, #EEF5FF 100%)',
    placeholderColor: '#D6E9F8',
  },
  cognitive: {
    fallbackGradient: 'linear-gradient(145deg, #E8E0F0 0%, #F5F0FF 100%)',
    placeholderColor: '#E8E0F0',
  },
  emotional: {
    fallbackGradient: 'linear-gradient(145deg, #F3D9CC 0%, #FFF0F3 100%)',
    placeholderColor: '#F3D9CC',
  },
  bonding: {
    fallbackGradient: 'linear-gradient(145deg, #D4ECD9 0%, #F0FFF4 100%)',
    placeholderColor: '#D4ECD9',
  },
};

/** @type {Record<string, string>} */
const illustrationCategories = {};
diyActivities.forEach((month) => {
  month.activities.forEach((activity) => {
    illustrationCategories[activity.illustration] = activity.category;
  });
});

function humanizeIllustration(key) {
  return key.replace(/_/g, ' ');
}

/** @type {Record<string, { src: string, alt: string, fallbackGradient: string, placeholderColor: string }>} */
export const diyImages = Object.fromEntries(
  Object.keys(illustrationCategories).map((key) => {
    const category = illustrationCategories[key];
    const fallback = CATEGORY_FALLBACK[category] || CATEGORY_FALLBACK.sensory;
    return [
      key,
      {
        src: `/images/diy/${key}.jpg`,
        alt: `Editorial photo for ${humanizeIllustration(key)} baby activity`,
        fallbackGradient: fallback.fallbackGradient,
        placeholderColor: fallback.placeholderColor,
      },
    ];
  }),
);

/**
 * @param {string} illustrationKey
 * @returns {{ src: string, alt: string, fallbackGradient: string, placeholderColor: string }}
 */
export function getDiyImage(illustrationKey) {
  if (diyImages[illustrationKey]) return diyImages[illustrationKey];
  const category = illustrationCategories[illustrationKey] || 'sensory';
  const fallback = CATEGORY_FALLBACK[category];
  return {
    src: '',
    alt: `Baby activity: ${humanizeIllustration(illustrationKey)}`,
    fallbackGradient: fallback.fallbackGradient,
    placeholderColor: fallback.placeholderColor,
  };
}

export { illustrationCategories };
