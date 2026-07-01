/**
 * @deprecated Use scripts/generate-diy-images.mjs (activity-specific, no gray wash).
 * Legacy hero-crop placeholders — kept for reference only.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';
import diyActivities from '../src/data/diyActivities.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');
const outDir = path.join(root, 'public/images/diy');
const heroesDir = path.join(root, 'public/images/heroes');

const CATEGORY_GRADIENTS = {
  sensory: { from: '#EFD2C4', to: '#F5ECE0', accent: '#C2603E' },
  motor: { from: '#D6E9F8', to: '#EEF5FF', accent: '#5A9FD8' },
  cognitive: { from: '#E8E0F0', to: '#F5F0FF', accent: '#9B88C0' },
  emotional: { from: '#F3D9CC', to: '#FFF0F3', accent: '#C77A5C' },
  bonding: { from: '#D4ECD9', to: '#F0FFF4', accent: '#5FB878' },
};

const HERO_FILES = ['home.jpg', 'baby.jpg', 'mom-care.jpg', 'essentials.jpg', 'community.jpg'];

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i += 1) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function buildIllustrationMap() {
  const map = {};
  diyActivities.forEach((month) => {
    month.activities.forEach((a) => {
      map[a.illustration] = a.category;
    });
  });
  return map;
}

function humanize(key) {
  return key.replace(/_/g, ' ');
}

async function createGradientSvg(width, height, from, to, label) {
  return Buffer.from(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${from}"/>
          <stop offset="100%" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#g)"/>
    </svg>
  `);
}

async function generateImage(key, category, index) {
  const grad = CATEGORY_GRADIENTS[category] || CATEGORY_GRADIENTS.sensory;
  const width = 800;
  const height = 600;
  const hash = hashString(key);

  const svg = await createGradientSvg(width, height, grad.from, grad.to, humanize(key));
  let pipeline = sharp(svg).resize(width, height);

  const heroFile = HERO_FILES[index % HERO_FILES.length];
  const heroPath = path.join(heroesDir, heroFile);
  if (fs.existsSync(heroPath)) {
    const meta = await sharp(heroPath).metadata();
    const imgW = meta.width || 1200;
    const imgH = meta.height || 800;
    const extractW = Math.min(700, imgW);
    const extractH = Math.min(525, imgH);
    const maxLeft = Math.max(0, imgW - extractW);
    const maxTop = Math.max(0, imgH - extractH);
    const left = Math.min((hash % 40) * 4, maxLeft);
    const top = Math.min((hash % 30) * 4, maxTop);

    const overlay = await sharp(heroPath)
      .extract({ left, top, width: extractW, height: extractH })
      .resize(width, height, { fit: 'cover' })
      .blur(1.5)
      .modulate({ saturation: 0.85, brightness: 1.05 })
      .composite([{
        input: Buffer.from(
          `<svg width="${width}" height="${height}"><rect width="100%" height="100%" fill="${grad.from}" opacity="0.5"/></svg>`,
        ),
        blend: 'over',
      }])
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer();

    pipeline = sharp(overlay).composite([
      {
        input: svg,
        blend: 'soft-light',
      },
    ]);
  }

  const outPath = path.join(outDir, `${key}.jpg`);
  await pipeline.jpeg({ quality: 82, mozjpeg: true }).toFile(outPath);
  return outPath;
}

async function main() {
  fs.mkdirSync(outDir, { recursive: true });
  const illustrations = buildIllustrationMap();
  const keys = Object.keys(illustrations).sort();
  console.log(`Generating ${keys.length} DIY placeholder images…`);

  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    await generateImage(key, illustrations[key], i);
  }

  console.log(`Done → public/images/diy/ (${keys.length} files)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
