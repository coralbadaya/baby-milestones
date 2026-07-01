/**
 * Generate activity-specific editorial DIY images (no gray wash, no text).
 * Reads src/data/diyImageManifest.js — run build-diy-image-manifest.mjs first.
 * Run: node scripts/generate-diy-images.mjs
 *
 * For AI art-directed photos, use prompts in diyImageManifest.js with Cursor GenerateImage
 * and save to public/images/diy/{key}.jpg — then run verify-diy-images.mjs.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import { diyImageManifest, diyImageKeys } from '../src/data/diyImageManifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../public/images/diy');

/** Visual motifs keyed by illustration archetype */
const MOTIF_HINTS = {
  cup_tower: 'stacked rings',
  nesting_cups: 'nested cups',
  first_foods: 'bowl and spoon',
  tummy_time: 'mirror and towel',
  peekaboo: 'soft blanket',
  shakers: 'small rattles',
  water_play: 'water bowl',
  reading: 'board book',
  block_tower: 'wooden blocks',
  ball_ramp: 'balls and ramp',
  shape_sorter: 'shape blocks',
  tunnel: 'play tunnel',
  obstacle_course: 'soft cushions',
  kitchen_band: 'wooden spoons',
  nature_walk: 'leaves and basket',
};

function motifForKey(key) {
  if (MOTIF_HINTS[key]) return MOTIF_HINTS[key];
  if (key.includes('cup') || key.includes('tower')) return 'stacked cups';
  if (key.includes('water') || key.includes('bath')) return 'water play props';
  if (key.includes('book') || key.includes('read')) return 'soft book';
  if (key.includes('ball')) return 'soft balls';
  if (key.includes('dance') || key.includes('music') || key.includes('drum')) return 'musical props';
  if (key.includes('mirror')) return 'mirror';
  if (key.includes('food') || key.includes('sensory')) return 'bowl and textures';
  if (key.includes('walk') || key.includes('cruis')) return 'supportive furniture edge';
  return 'gentle play props';
}

function propShapes(key, accent, width, height) {
  const cx = width * 0.62;
  const cy = height * 0.48;
  const motif = motifForKey(key);

  let props = '';
  if (motif.includes('cup') || motif.includes('stack')) {
    props = `
      <rect x="${cx - 30}" y="${cy + 20}" width="60" height="42" rx="8" fill="${accent}" opacity="0.55"/>
      <rect x="${cx - 22}" y="${cy - 8}" width="44" height="34" rx="7" fill="${accent}" opacity="0.65"/>
      <rect x="${cx - 14}" y="${cy - 34}" width="28" height="28" rx="6" fill="${accent}" opacity="0.75"/>
    `;
  } else if (motif.includes('bowl') || motif.includes('food') || motif.includes('texture')) {
    props = `
      <ellipse cx="${cx}" cy="${cy + 18}" rx="72" ry="28" fill="${accent}" opacity="0.35"/>
      <path d="M ${cx - 55} ${cy + 8} Q ${cx} ${cy - 30} ${cx + 55} ${cy + 8}" fill="none" stroke="${accent}" stroke-width="6" opacity="0.6"/>
      <circle cx="${cx + 40}" cy="${cy - 10}" r="14" fill="${accent}" opacity="0.45"/>
    `;
  } else if (motif.includes('book')) {
    props = `
      <rect x="${cx - 50}" y="${cy - 10}" width="100" height="70" rx="6" fill="${accent}" opacity="0.5"/>
      <rect x="${cx - 42}" y="${cy - 2}" width="84" height="54" rx="4" fill="#FFFFFF" opacity="0.55"/>
    `;
  } else if (motif.includes('ball')) {
    props = `
      <circle cx="${cx - 30}" cy="${cy + 10}" r="26" fill="${accent}" opacity="0.55"/>
      <circle cx="${cx + 20}" cy="${cy - 8}" r="20" fill="${accent}" opacity="0.45"/>
    `;
  } else if (motif.includes('mirror')) {
    props = `
      <rect x="${cx - 45}" y="${cy - 30}" width="90" height="110" rx="14" fill="${accent}" opacity="0.35"/>
      <rect x="${cx - 36}" y="${cy - 22}" width="72" height="88" rx="10" fill="#FFFFFF" opacity="0.65"/>
    `;
  } else if (motif.includes('water')) {
    props = `
      <ellipse cx="${cx}" cy="${cy + 24}" rx="80" ry="32" fill="${accent}" opacity="0.4"/>
      <path d="M ${cx - 60} ${cy + 10} Q ${cx - 20} ${cy - 20} ${cx + 20} ${cy + 10} T ${cx + 60} ${cy + 10}" fill="none" stroke="${accent}" stroke-width="5" opacity="0.55"/>
    `;
  } else {
    props = `
      <circle cx="${cx - 20}" cy="${cy}" r="24" fill="${accent}" opacity="0.45"/>
      <rect x="${cx + 4}" y="${cy - 18}" width="48" height="48" rx="10" fill="${accent}" opacity="0.55"/>
    `;
  }

  return `
    <ellipse cx="${width * 0.34}" cy="${height * 0.74}" rx="120" ry="38" fill="#2B2622" opacity="0.05"/>
    <path d="M ${width * 0.2} ${height * 0.58} Q ${width * 0.3} ${height * 0.46} ${width * 0.4} ${height * 0.58} L ${width * 0.36} ${height * 0.72} Q ${width * 0.26} ${height * 0.76} ${width * 0.2} ${height * 0.72} Z" fill="#D8A088" opacity="0.82"/>
    <path d="M ${width * 0.44} ${height * 0.56} Q ${width * 0.54} ${height * 0.44} ${width * 0.64} ${height * 0.56} L ${width * 0.6} ${height * 0.7} Q ${width * 0.5} ${height * 0.74} ${width * 0.44} ${height * 0.7} Z" fill="#D8A088" opacity="0.72"/>
    ${props}
  `;
}

function buildSceneSvg(key, entry) {
  const width = 1200;
  const height = 900;
  const { gradientFrom, gradientTo, accent } = entry;

  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${gradientFrom}"/>
          <stop offset="100%" stop-color="${gradientTo}"/>
        </linearGradient>
        <radialGradient id="light" cx="28%" cy="18%" r="75%">
          <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.6"/>
          <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#bg)"/>
      <rect width="100%" height="100%" fill="url(#light)"/>
      ${propShapes(key, accent, width, height)}
    </svg>
  `);
}

async function generateImage(key, entry) {
  const svg = buildSceneSvg(key, entry);
  const outPath = path.join(outDir, `${key}.jpg`);
  await sharp(svg)
    .resize(1200, 900, { fit: 'cover' })
    .modulate({ saturation: 0.92, brightness: 1.02 })
    .jpeg({ quality: 88, mozjpeg: true })
    .toFile(outPath);
  return outPath;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`Generating ${diyImageKeys.length} DIY editorial images…`);

  for (const key of diyImageKeys) {
    const entry = diyImageManifest[key];
    await generateImage(key, entry);
  }

  console.log(`Done → public/images/diy/ (${diyImageKeys.length} files)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
