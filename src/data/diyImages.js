/**
 * DIY activity imagery — per-activity Supabase overrides + site-wide default.
 * Illustration JPGs remain in the repo for AI prompts; they are not card faces.
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
 * @property {'override'|'default'|'watermark'|'gradient'} source
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
 * Order: per-activity override → admin site-wide default → cream lockup → category gradient.
 *
 * @param {{ activityId?: string, illustration?: string, category?: string }} params
 * @param {Record<string, DiyImageOverride>} [overrides]
 * @param {DiyImageOverride | null} [globalDefault]
 * @returns {DiyImageConfig}
 */
export function getDiyImage({ activityId, illustration, category }, overrides = {}, globalDefault = null) {
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

  if (globalDefault?.src) {
    return {
      src: globalDefault.src,
      alt: globalDefault.alt || defaultAlt,
      fallbackGradient: fallback.fallbackGradient,
      placeholderColor: fallback.placeholderColor,
      prompt: activityMeta?.prompt,
      watermarkSrc: BRAND_WATERMARK_SRC,
      source: 'default',
    };
  }

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
 * @param {Array<{ activity_id: string, storage_path: string, alt_text: string, source?: string }>} rows
 * @param {string} supabaseUrl
 * @returns {Record<string, DiyImageOverride>}
 */
export function buildDiyImageOverrides(rows, supabaseUrl) {
  if (!supabaseUrl || !rows?.length) return {};
  const base = supabaseUrl.replace(/\/$/, '');
  return Object.fromEntries(
    rows
      .filter((row) => row.activity_id && row.storage_path && row.source !== 'seed')
      .map((row) => [
        row.activity_id,
        {
          src: `${base}/storage/v1/object/public/diy-images/${row.storage_path}`,
          alt: row.alt_text,
          storagePath: row.storage_path,
        },
      ]),
  );
}

/**
 * Build public URL for the site-wide DIY default image row.
 * @param {{ storage_path?: string, alt_text?: string } | null} row
 * @param {string} supabaseUrl
 * @returns {DiyImageOverride | null}
 */
export function buildDiyGlobalDefault(row, supabaseUrl) {
  if (!supabaseUrl || !row?.storage_path) return null;
  const base = supabaseUrl.replace(/\/$/, '');
  return {
    src: `${base}/storage/v1/object/public/diy-images/${row.storage_path}`,
    alt: row.alt_text || '',
    storagePath: row.storage_path,
  };
}

/** Back-compat: illustration-only lookup */
export function getDiyImageByIllustration(illustrationKey, overrides = {}, globalDefault = null) {
  return getDiyImage({ illustration: illustrationKey }, overrides, globalDefault);
}

export { illustrationCategories, diyActivityImages };
