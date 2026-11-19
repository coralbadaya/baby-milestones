#!/usr/bin/env node
/**
 * Expands src/seo/keywordSeeds.js into docs/seo-keywords-matrix.md
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const seeds = await import(path.join(root, 'src/seo/keywordSeeds.js'));

const {
  KEYWORD_PILLARS,
  KEYWORD_INTENTS,
  KEYWORD_AGES,
  KEYWORD_GEOS,
  KEYWORD_AUDIENCE,
  KEYWORD_TEMPLATES,
} = seeds;

const MONTH_AGES = KEYWORD_AGES.filter((a) => /month old|newborn|infant|toddler|week old|\d-\d months/.test(a));

function rootShort(root) {
  return root
    .replace(/^baby\s+/i, '')
    .replace(/^newborn\s+/i, '')
    .replace(/^infant\s+/i, '')
    .trim();
}

/** Skip "baby picture ideas" + "ideas" style duplicates */
function rootAlreadyHasIntent(root, intent) {
  if (!intent) return false;
  const r = root.toLowerCase();
  const i = intent.toLowerCase();
  if (r.includes(i)) return true;
  if (i === 'ideas' && r.includes('idea')) return true;
  if (i === 'activities' && r.includes('activit')) return true;
  if (i === 'recommended' && r.includes('recommend')) return true;
  return false;
}

function fillTemplate(tpl, ctx) {
  return tpl
    .replace(/\{root\}/g, ctx.root)
    .replace(/\{rootShort\}/g, ctx.rootShort)
    .replace(/\{intent\}/g, ctx.intent)
    .replace(/\{age\}/g, ctx.age)
    .replace(/\{geo\}/g, ctx.geo)
    .replace(/\{audience\}/g, ctx.audience)
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * @param {import('../src/seo/keywordSeeds.js').KeywordPillar} pillar
 */
function expandPillar(pillar) {
  const set = new Set();
  const intents = pillar.intents ?? KEYWORD_INTENTS.slice(0, 12);
  const ages = pillar.ages ? MONTH_AGES : [''];
  const geos = pillar.geos ? KEYWORD_GEOS : [''];

  for (const root of pillar.roots) {
    const ctxBase = { root, rootShort: rootShort(root), intent: '', age: '', geo: '', audience: '' };
    set.add(root);

    if (pillar.misspellings) {
      for (const m of pillar.misspellings) set.add(m);
    }

    for (const intent of intents) {
      if (rootAlreadyHasIntent(root, intent)) continue;
      set.add(fillTemplate('{root} {intent}', { ...ctxBase, intent }));
    }

    for (const audience of KEYWORD_AUDIENCE) {
      set.add(fillTemplate('{root} {audience}', { ...ctxBase, audience }));
    }

    if (pillar.ages) {
      for (const age of ages) {
        if (!age) continue;
        set.add(fillTemplate('{age} {root}', { ...ctxBase, age }));
        for (const intent of intents.slice(0, 8)) {
          if (rootAlreadyHasIntent(root, intent)) continue;
          set.add(fillTemplate('{age} {root} {intent}', { ...ctxBase, age, intent }));
        }
      }
    }

    if (pillar.geos) {
      for (const geo of geos) {
        set.add(fillTemplate('{root} {geo}', { ...ctxBase, geo }));
        set.add(fillTemplate('{geo} {root}', { ...ctxBase, geo }));
        for (const intent of ['tracker', 'schedule', 'chart', 'app', 'list']) {
          set.add(fillTemplate('{root} {geo} {intent}', { ...ctxBase, geo, intent }));
        }
      }
    }

    for (const tpl of KEYWORD_TEMPLATES) {
      if (tpl.includes('{age}') && !pillar.ages) continue;
      if (tpl.includes('{geo}') && !pillar.geos) continue;
      if (tpl.includes('{intent}')) {
        for (const intent of intents.slice(0, 6)) {
          set.add(
            fillTemplate(tpl, {
              ...ctxBase,
              intent,
              age: ages[0] || '',
              geo: geos[0] || '',
              audience: KEYWORD_AUDIENCE[0],
            }),
          );
        }
      } else {
        set.add(
          fillTemplate(tpl, {
            ...ctxBase,
            age: ages[Math.min(3, ages.length - 1)] || '',
            geo: geos[0] || '',
            audience: KEYWORD_AUDIENCE[0],
          }),
        );
      }
    }
  }

  return [...set].sort((a, b) => a.localeCompare(b));
}

const lines = [];
lines.push('# SEO keyword matrix (generated)');
lines.push('');
lines.push('> **Do not edit by hand.** Regenerate with `npm run generate:seo-keywords`.');
lines.push('> Strategy and URL mapping: [`seo-keywords.md`](./seo-keywords.md).');
lines.push('');
lines.push(`Generated: ${new Date().toISOString().slice(0, 10)} · Pillars: ${KEYWORD_PILLARS.length}`);
lines.push('');

let total = 0;
const allUnique = new Set();

for (const pillar of KEYWORD_PILLARS) {
  const phrases = expandPillar(pillar);
  total += phrases.length;
  for (const p of phrases) allUnique.add(p.toLowerCase());

  lines.push(`## ${pillar.label}`);
lines.push('');
  lines.push(`Pillar id: \`${pillar.id}\` · Phrases: **${phrases.length}**`);
  lines.push('');
  for (const phrase of phrases) {
    lines.push(`- ${phrase}`);
  }
  lines.push('');
}

lines.push('---');
lines.push('');
lines.push(`**Pillar phrase rows:** ${total}`);
lines.push(`**Unique phrases (case-insensitive):** ${allUnique.size}`);
lines.push('');
lines.push('### Combinator reference');
lines.push('');
lines.push('Templates (from `src/seo/keywordSeeds.js`):');
for (const t of KEYWORD_TEMPLATES) {
  lines.push(`- \`${t}\``);
}

const outPath = path.join(root, 'docs/seo-keywords-matrix.md');
fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
console.log(`Wrote ${outPath} (${allUnique.size} unique phrases across ${KEYWORD_PILLARS.length} pillars)`);