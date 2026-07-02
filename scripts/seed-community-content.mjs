/**
 * Seed community_recipes and community_tips from static JS data.
 * Run after migration: node scripts/seed-community-content.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { recipes } from '../src/data/recipes.js';
import { parentingTips } from '../src/data/parentingTips.js';
import { recipeToRow, tipToRow } from '../src/utils/community.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const envPath = path.join(__dirname, '../.env');
  if (!fs.existsSync(envPath)) return {};
  const out = {};
  for (const line of fs.readFileSync(envPath, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) out[m[1]] = m[2].trim();
  }
  return out;
}

const env = loadEnv();
const url = env.SUPABASE_URL || env.VITE_SUPABASE_URL;
const key = env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL and SUPABASE_SECRET_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

async function seedRecipes() {
  const rows = recipes.map((recipe, index) => ({
    ...recipeToRow(recipe),
    published: true,
    featured: false,
    sort_order: index,
  }));

  const { error } = await supabase.from('community_recipes').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
  console.log(`Seeded ${rows.length} recipes`);
}

async function seedTips() {
  const rows = parentingTips.map((tip, index) => ({
    ...tipToRow(tip),
    published: true,
    featured: index === 0,
    sort_order: index,
  }));

  const { error } = await supabase.from('community_tips').upsert(rows, { onConflict: 'id' });
  if (error) throw error;
  console.log(`Seeded ${rows.length} tips`);
}

async function seedMemories() {
  const seeds = [
    {
      legacy_id: 'memory-seed-teething',
      type: 'tip',
      title: 'Baby Teething — What Worked for Us',
      content:
        'Cold teething rings + a little chamomile tea dabbed on gums were our lifesaver. Frozen washcloth knots helped on rough nights too.',
      baby_age: '6 months',
      tags: ['teething', 'remedies'],
      status: 'published',
      reactions: { heart: 5, celebrate: 2, support: 3 },
      author_name: 'Nestbean',
      created_at: '2026-05-28T10:00:00.000Z',
    },
    {
      legacy_id: 'memory-seed-smile',
      type: 'milestone',
      title: 'First Real Smile',
      content: 'She smiled at her dad during tummy time today — we both cried a little.',
      baby_age: '2 months',
      tags: ['milestone', 'smile'],
      status: 'published',
      reactions: { heart: 8, celebrate: 4, support: 1 },
      author_name: 'Nestbean',
      created_at: '2026-05-25T09:00:00.000Z',
    },
  ];

  for (const seed of seeds) {
    const { data: existing } = await supabase
      .from('community_memories')
      .select('id')
      .eq('legacy_id', seed.legacy_id)
      .maybeSingle();

    if (existing) continue;

    const { data: inserted, error } = await supabase
      .from('community_memories')
      .insert(seed)
      .select('id')
      .single();
    if (error) throw error;

    if (seed.legacy_id === 'memory-seed-teething') {
      await supabase.from('community_memory_comments').insert({
        memory_id: inserted.id,
        text: 'Trying the frozen washcloth tonight!',
        author_name: 'NewMom23',
        created_at: '2026-05-29T14:00:00.000Z',
      });
    }
  }
  console.log('Seeded published memories');
}

async function main() {
  await seedRecipes();
  await seedTips();
  await seedMemories();
  console.log('Community seed complete');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
