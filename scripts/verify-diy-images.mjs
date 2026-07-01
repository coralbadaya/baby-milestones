/**
 * Verify all DIY illustration images exist.
 * Run: node scripts/verify-diy-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { diyImageKeys } from '../src/data/diyImageManifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const diyDir = path.join(__dirname, '../public/images/diy');

const missing = diyImageKeys.filter((key) => !fs.existsSync(path.join(diyDir, `${key}.jpg`)));

if (missing.length > 0) {
  console.error(`Missing ${missing.length} DIY image(s):`);
  missing.forEach((key) => console.error(`  - ${key}.jpg`));
  process.exit(1);
}

console.log(`OK: ${diyImageKeys.length} DIY images present in public/images/diy/`);
