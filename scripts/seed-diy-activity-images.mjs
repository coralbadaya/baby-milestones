/**
 * Seed per-activity DIY images from bundled illustration JPGs.
 * Copies public/images/diy/{illustration}.jpg → Supabase diy-images/activities/{activityId}.jpg
 *
 * Requires: VITE_SUPABASE_URL + SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY) in .env
 * Run: node scripts/seed-diy-activity-images.mjs [--dry-run] [--limit=N]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import diyActivities from '../src/data/diyActivities.js';
import { diyActivityImages } from '../src/data/diyImageManifest.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const diyDir = path.join(__dirname, '../public/images/diy');

function loadDotEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return;
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadDotEnv();

const dryRun = process.argv.includes('--dry-run');
const limitArg = process.argv.find((a) => a.startsWith('--limit='));
const limit = limitArg ? parseInt(limitArg.split('=')[1], 10) : Infinity;

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!dryRun && (!supabaseUrl || !serviceKey)) {
  console.error('Set VITE_SUPABASE_URL and SUPABASE_SECRET_KEY in .env (or use --dry-run)');
  process.exit(1);
}

const supabase = dryRun ? null : createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

const activities = [];
diyActivities.forEach((monthBlock) => {
  monthBlock.activities.forEach((activity) => {
    activities.push(activity);
  });
});

const batch = activities.slice(0, limit);
let uploaded = 0;
let skipped = 0;
let failed = 0;

for (const activity of batch) {
  const meta = diyActivityImages[activity.id];
  const sourcePath = path.join(diyDir, `${activity.illustration}.jpg`);
  const storagePath = `activities/${activity.id}.jpg`;

  if (!fs.existsSync(sourcePath)) {
    console.warn(`Skip ${activity.id}: missing ${activity.illustration}.jpg`);
    skipped += 1;
    continue;
  }

  if (dryRun) {
    console.log(`[dry-run] ${activity.id} ← ${activity.illustration}.jpg → ${storagePath}`);
    uploaded += 1;
    continue;
  }

  const fileBuffer = fs.readFileSync(sourcePath);

  const { error: uploadError } = await supabase.storage
    .from('diy-images')
    .upload(storagePath, fileBuffer, {
      upsert: true,
      contentType: 'image/jpeg',
    });

  if (uploadError) {
    console.error(`Upload failed ${activity.id}:`, uploadError.message);
    failed += 1;
    continue;
  }

  const { error: rowError } = await supabase.from('diy_activity_images').upsert({
    activity_id: activity.id,
    storage_path: storagePath,
    alt_text: meta?.alt || `Editorial photo for ${activity.name} baby activity`,
    source: 'seed',
    updated_at: new Date().toISOString(),
  });

  if (rowError) {
    console.error(`Row upsert failed ${activity.id}:`, rowError.message);
    failed += 1;
    continue;
  }

  uploaded += 1;
  if (uploaded % 20 === 0) console.log(`… ${uploaded} seeded`);
}

console.log(`Done: ${uploaded} seeded, ${skipped} skipped, ${failed} failed (${batch.length} processed)`);
