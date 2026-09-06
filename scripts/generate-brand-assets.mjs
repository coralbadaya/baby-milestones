#!/usr/bin/env node
/**
 * In-house brand asset generator.
 * Master: public/brand/yarntrails-mark.svg
 * Outputs: favicons, iOS/Android/PWA icons, maskable, OG image.
 *
 * Run: npm run generate:brand
 * Re-run whenever the logo changes.
 */
import sharp from 'sharp';
import pngToIco from 'png-to-ico';
import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const MARK = join(PUBLIC, 'brand/yarntrails-mark.svg');

const IVORY = '#F3F5F2';
const SAGE = '#3F5E52';
const HEART = '#C57A58';
const GOLD = '#C4A35A';
const MUTED = '#6B756F';

const markSvg = readFileSync(MARK);

/** Render mark at a given canvas size with optional background + safe-area scale. */
async function renderIcon(size, { background, scale = 0.78, rounded = false } = {}) {
  const inner = Math.round(size * scale);
  const mark = await sharp(markSvg, { density: 512 })
    .resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const pad = Math.round((size - inner) / 2);
  let base = sharp({
    create: {
      width: size,
      height: size,
      channels: 4,
      background: background || { r: 0, g: 0, b: 0, alpha: 0 },
    },
  });

  let img = base.composite([{ input: mark, top: pad, left: pad }]).png();

  if (rounded) {
    const r = Math.round(size * 0.22);
    const maskSvg = Buffer.from(
      `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}"/></svg>`
    );
    const buf = await img.toBuffer();
    img = sharp(buf).composite([{ input: maskSvg, blend: 'dest-in' }]).png();
  }

  return img.toBuffer();
}

function ogFrameSvg() {
  return Buffer.from(`
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="${IVORY}"/>
  <rect x="40" y="40" width="1120" height="550" rx="28" fill="none" stroke="${GOLD}" stroke-width="2" opacity="0.5"/>
  <text x="600" y="470" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="64" font-weight="600" letter-spacing="-1">
    <tspan fill="${SAGE}">Yarn</tspan>
    <tspan fill="${HEART}"> Trails</tspan>
  </text>
  <text x="600" y="520" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="20" letter-spacing="4" fill="${MUTED}">LITTLE MOMENTS. BIG STORIES.</text>
</svg>`);
}

async function main() {
  mkdirSync(PUBLIC, { recursive: true });

  // Favicon SVG (vector)
  copyFileSync(MARK, join(PUBLIC, 'favicon.svg'));

  // Favicon PNGs (transparent)
  for (const s of [16, 32, 48]) {
    const buf = await renderIcon(s, { scale: 0.92 });
    writeFileSync(join(PUBLIC, `favicon-${s}.png`), buf);
  }

  // favicon.ico (16/32/48)
  const icoSources = await Promise.all(
    [16, 32, 48].map((s) => renderIcon(s, { scale: 0.92, background: { r: 243, g: 245, b: 242, alpha: 1 } }))
  );
  const ico = await pngToIco(icoSources);
  writeFileSync(join(PUBLIC, 'favicon.ico'), ico);

  // Apple touch icon (solid bg, rounded handled by iOS)
  writeFileSync(
    join(PUBLIC, 'apple-touch-icon.png'),
    await renderIcon(180, { background: { r: 243, g: 245, b: 242, alpha: 1 }, scale: 0.72 })
  );

  // Android / PWA icons (solid bg)
  for (const s of [192, 512]) {
    writeFileSync(
      join(PUBLIC, `icon-${s}.png`),
      await renderIcon(s, { background: { r: 243, g: 245, b: 242, alpha: 1 }, scale: 0.74 })
    );
  }

  // Maskable (extra safe zone)
  writeFileSync(
    join(PUBLIC, 'icon-maskable-512.png'),
    await renderIcon(512, { background: { r: 243, g: 245, b: 242, alpha: 1 }, scale: 0.56 })
  );

  // App store icon (1024, no transparency)
  writeFileSync(
    join(PUBLIC, 'icon-store-1024.png'),
    await renderIcon(1024, { background: { r: 243, g: 245, b: 242, alpha: 1 }, scale: 0.7 })
  );

  // OG / social image — master mark composited onto the framed wordmark
  const ogMark = await sharp(markSvg, { density: 512 })
    .resize(240, 240, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  writeFileSync(
    join(PUBLIC, 'og-default.png'),
    await sharp(ogFrameSvg())
      .composite([{ input: ogMark, top: 118, left: 480 }])
      .png()
      .toBuffer()
  );

  // Editorial watermark placeholder (4:3 DIY cards, heroes, recipes)
  const watermarkSvg = readFileSync(join(PUBLIC, 'brand/yarntrails-watermark.svg'));
  mkdirSync(join(PUBLIC, 'images/placeholders'), { recursive: true });
  writeFileSync(
    join(PUBLIC, 'images/placeholders/yarntrails-watermark.jpg'),
    await sharp(watermarkSvg, { density: 144 }).jpeg({ quality: 88, mozjpeg: true }).toBuffer()
  );

  console.log('Brand assets generated in public/:');
  console.log('  favicon.svg, favicon.ico, favicon-16/32/48.png');
  console.log('  apple-touch-icon.png, icon-192/512.png, icon-maskable-512.png');
  console.log('  icon-store-1024.png, og-default.png');
  console.log('  images/placeholders/yarntrails-watermark.jpg');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
