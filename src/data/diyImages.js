/**
 * DIY activity imagery — per-activity Supabase overrides + illustration fallbacks.
 * See docs/diy-images-admin.md and docs/imagery-system.md
 */
import { BRAND_WATERMARK_ALT, BRAND_WATERMARK_SRC } from '../constants/brandAssets';
import diyActivities from './diyActivities';
import { diyImageManifest, diyActivityImages } from './diyImageManifest';

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

function gradientFromManifest(entry) {
  return `linear-gradient(145deg, ${entry.gradientFrom} 0%, ${entry.gradientTo} 100%)`;
}

/** @type {Record<string, { src: string, alt: string, fallbackGradient: string, placeholderColor: string, prompt?: string }>} */
export const diyImages = Object.fromEntries(
  Object.entries(diyImageManifest).map(([key, entry]) => [
    key,
    {
      src: `/images/diy/${key}.jpg`,
      alt: entry.alt,
      prompt: entry.prompt,
      fallbackGradient: gradientFromManifest(entry),
      placeholderColor: entry.gradientFrom,
    },
  ]),
);

/**
 * @typedef {Object} DiyImageConfig
 * @property {string} src
 * @property {string} alt
 * @property {string} fallbackGradient
 * @property {string} placeholderColor
 * @property {string} [prompt]
 * @property {'override'|'bundled'|'watermark'|'gradient'} source
 * @property {string} watermarkSrc
 */

/**
 * @typedef {Object} DiyImageOverride
 * @property {string} src
 * @property {string} alt
 * @property {string} [storagePath]
 */

/**
 * Resolve DIY image for an activity.
 * Order: Supabase override → bundled illustration JPG → Yarn Trails watermark → category gradient.
 *
 * @param {{ activityId?: string, illustration?: string, category?: string }} params
 * @param {Record<string, DiyImageOverride>} [overrides]
 * @returns {DiyImageConfig}
 */
export function getDiyImage({ activityId, illustration, category }, overrides = {}) {
  const resolvedCategory = category
    || (illustration && illustrationCategories[illustration])
    || 'sensory';
  const fallback = CATEGORY_FALLBACK[resolvedCategory] || CATEGORY_FALLBACK.sensory;
  const activityMeta = activityId ? diyActivityImages[activityId] : null;
  const defaultAlt = activityMeta?.alt
    || (illustration && diyImages[illustration]?.alt)
    || `Baby activity: ${(illustration || activityId || 'activity').replace(/_/g, ' ')}`;

  if (activityId && overrides[activityId]?.src) {
    return {
      src: overrides[activityId].src,
      alt: overrides[activityId].alt || defaultAlt,
      fallbackGradient: fallback.fallbackGradient,
      placeholderColor: fallback.placeholderColor,
      prompt: activityMeta?.prompt,
      watermarkSrc: BRAND_WATERMARK_SRC,
      source: 'override',
    };
  }

  if (illustration && diyImages[illustration]) {
    return {
      ...diyImages[illustration],
      alt: defaultAlt,
      watermarkSrc: BRAND_WATERMARK_SRC,
      source: 'bundled',
    };
  }

  const humanized = (illustration || activityId || 'activity').replace(/_/g, ' ');
  return {
    src: BRAND_WATERMARK_SRC,
    alt: defaultAlt || BRAND_WATERMARK_ALT,
    fallbackGradient: fallback.fallbackGradient,
    placeholderColor: fallback.placeholderColor,
    prompt: activityMeta?.prompt,
    watermarkSrc: BRAND_WATERMARK_SRC,
    source: 'watermark',
  };
}

/**
 * Build public URL map from diy_activity_images rows.
 * @param {Array<{ activity_id: string, storage_path: string, alt_text: string }>} rows
 * @param {string} supabaseUrl
 * @returns {Record<string, DiyImageOverride>}
 */
export function buildDiyImageOverrides(rows, supabaseUrl) {
  if (!supabaseUrl || !rows?.length) return {};
  const base = supabaseUrl.replace(/\/$/, '');
  return Object.fromEntries(
    rows.map((row) => [
      row.activity_id,
      {
        src: `${base}/storage/v1/object/public/diy-images/${row.storage_path}`,
        alt: row.alt_text,
        storagePath: row.storage_path,
      },
    ]),
  );
}

/** Back-compat: illustration-only lookup */
export function getDiyImageByIllustration(illustrationKey, overrides = {}) {
  return getDiyImage({ illustration: illustrationKey }, overrides);
}

export { illustrationCategories, diyActivityImages };
