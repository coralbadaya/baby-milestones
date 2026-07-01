/**
 * Verify per-activity DIY image manifest matches diyActivities.js (180 activities).
 * Run: node scripts/verify-diy-activity-images.mjs
 */
import diyActivities from '../src/data/diyActivities.js';
import { diyActivityIds, diyActivityImages } from '../src/data/diyImageManifest.js';

const expectedIds = [];
diyActivities.forEach((monthBlock) => {
  monthBlock.activities.forEach((activity) => {
    expectedIds.push(activity.id);
  });
});

const missing = expectedIds.filter((id) => !diyActivityImages[id]);
const extra = diyActivityIds.filter((id) => !expectedIds.includes(id));

if (missing.length > 0) {
  console.error('Missing activity entries in diyActivityImages:', missing.slice(0, 10).join(', '), missing.length > 10 ? `… +${missing.length - 10} more` : '');
  process.exit(1);
}

if (extra.length > 0) {
  console.error('Extra activity entries in diyActivityImages:', extra.slice(0, 10).join(', '));
  process.exit(1);
}

if (expectedIds.length !== diyActivityIds.length) {
  console.error(`Count mismatch: expected ${expectedIds.length}, got ${diyActivityIds.length}`);
  process.exit(1);
}

console.log(`OK: ${expectedIds.length} per-activity DIY image entries in diyImageManifest.js`);
