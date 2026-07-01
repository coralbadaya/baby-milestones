/**
 * Print DIY AI image prompts for batch generation.
 * Use prompts with Cursor GenerateImage, save to public/images/diy/{key}.jpg
 *
 * Run: node scripts/generate-diy-ai-batch.mjs [offset] [limit]
 * Example: node scripts/generate-diy-ai-batch.mjs 0 10
 */
import { diyImageManifest, diyImageKeys } from '../src/data/diyImageManifest.js';

const offset = parseInt(process.argv[2] || '0', 10);
const limit = parseInt(process.argv[3] || '10', 10);
const batch = diyImageKeys.slice(offset, offset + limit);

if (batch.length === 0) {
  console.log('No keys in this batch.');
  process.exit(0);
}

console.log(`Batch ${offset}–${offset + batch.length - 1} (${batch.length} keys)\n`);

batch.forEach((key, i) => {
  const entry = diyImageManifest[key];
  console.log(`--- ${i + 1}. ${key}.jpg ---`);
  console.log(entry.prompt);
  console.log(`Save as: public/images/diy/${key}.jpg\n`);
});

console.log('After saving images, run: npm run verify:diy-images');
