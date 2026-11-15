/**
 * Spreads for the open book. One layout is a left page and a right page.
 * Keep mobile/lib/pageLayouts.ts in step with these ids.
 */

export const PAGE_LAYOUTS = [
  { id: 'photo-story', label: 'Photo & story', take: 1 },
  { id: 'story-photo', label: 'Story & photo', take: 1 },
  { id: 'facing', label: 'Facing photos', take: 2 },
  { id: 'pair', label: 'Two & words', take: 2 },
  { id: 'chapter', label: 'Chapter', take: 1 },
];

const CYCLE = ['chapter', 'photo-story', 'facing', 'story-photo', 'pair'];

function layoutById(id) {
  return PAGE_LAYOUTS.find((layout) => layout.id === id) || PAGE_LAYOUTS[0];
}

function slot(role, page, extra) {
  return { role, page: page || null, extra: extra || null };
}

export function composeSpread(pages, index, layoutId) {
  const page = pages[index] || null;
  if (!page) {
    return { id: 'photo-story', take: 1, next: index, left: slot('blank'), right: slot('blank') };
  }
  if (page.ending) {
    return { id: 'chapter', take: 1, next: index, left: slot('chapter', page), right: slot('ending', page) };
  }
  let layout = layoutById(page.layout || layoutId || 'photo-story');
  const upcoming = pages[index + 1] || null;
  if (layout.take === 2 && (!upcoming || upcoming.ending)) layout = layoutById('photo-story');
  const partner = upcoming;
  let left = slot('blank');
  let right = slot('blank');
  if (layout.id === 'photo-story') {
    left = slot('photo', page);
    right = slot('story', page);
  } else if (layout.id === 'story-photo') {
    left = slot('story', page);
    right = slot('photo', page);
  } else if (layout.id === 'facing') {
    left = slot('photo', page);
    right = slot('photo', partner);
  } else if (layout.id === 'pair') {
    left = slot('pair', page, partner);
    right = slot('story', page);
  } else {
    left = slot('chapter', page);
    right = slot('photo', page);
  }
  return {
    id: layout.id,
    take: layout.take,
    next: Math.min(pages.length, index + layout.take),
    left,
    right,
  };
}

export function walkSpreads(pages) {
  const starts = [];
  let cursor = 0;
  let hops = 0;
  while (cursor < pages.length && hops <= pages.length) {
    const spread = composeSpread(pages, cursor);
    starts.push({ index: cursor, id: spread.id, take: spread.take });
    const step = cursor + spread.take;
    if (step <= cursor || step >= pages.length) break;
    cursor = step;
    hops += 1;
  }
  return starts;
}

export function previousSpreadIndex(pages, index) {
  let prev = 0;
  for (const start of walkSpreads(pages)) {
    if (start.index >= index) break;
    prev = start.index;
  }
  return prev;
}

/** A varied rhythm, so a generated book is not nineteen copies of one card. */
export function assignLayouts(pages) {
  const next = pages.map((page) => ({ ...page }));
  let cursor = 0;
  let n = 0;
  while (cursor < next.length) {
    const page = next[cursor];
    if (page.ending) {
      page.layout = 'chapter';
      break;
    }
    let id = CYCLE[n % CYCLE.length];
    if (layoutById(id).take === 2 && (!next[cursor + 1] || next[cursor + 1].ending)) id = 'photo-story';
    page.layout = id;
    n += 1;
    const step = cursor + layoutById(id).take;
    if (step <= cursor) break;
    cursor = step;
  }
  return next;
}

/** Plain script for the standalone album. No imports, so the file still opens offline. */
export function layoutPlayerScript() {
  return [
    'const PAGE_LAYOUTS = ' + JSON.stringify(PAGE_LAYOUTS) + ';',
    'function layoutById(id) {',
    '  for (let i = 0; i < PAGE_LAYOUTS.length; i += 1) if (PAGE_LAYOUTS[i].id === id) return PAGE_LAYOUTS[i];',
    '  return PAGE_LAYOUTS[0];',
    '}',
    'function slot(role, page, extra) { return { role: role, page: page || null, extra: extra || null }; }',
    'function composeSpread(pages, index, layoutId) {',
    '  const page = pages[index] || null;',
    '  if (!page) return { id: "photo-story", take: 1, next: index, left: slot("blank"), right: slot("blank") };',
    '  if (page.ending) return { id: "chapter", take: 1, next: index, left: slot("chapter", page), right: slot("ending", page) };',
    '  let layout = layoutById(page.layout || layoutId || "photo-story");',
    '  const upcoming = pages[index + 1] || null;',
    '  if (layout.take === 2 && (!upcoming || upcoming.ending)) layout = layoutById("photo-story");',
    '  let left = slot("blank");',
    '  let right = slot("blank");',
    '  if (layout.id === "photo-story") { left = slot("photo", page); right = slot("story", page); }',
    '  else if (layout.id === "story-photo") { left = slot("story", page); right = slot("photo", page); }',
    '  else if (layout.id === "facing") { left = slot("photo", page); right = slot("photo", upcoming); }',
    '  else if (layout.id === "pair") { left = slot("pair", page, upcoming); right = slot("story", page); }',
    '  else { left = slot("chapter", page); right = slot("photo", page); }',
    '  return { id: layout.id, take: layout.take, next: Math.min(pages.length, index + layout.take), left: left, right: right };',
    '}',
    'function previousSpreadIndex(pages, index) {',
    '  let cursor = 0;',
    '  let prev = 0;',
    '  let hops = 0;',
    '  while (cursor < index && hops <= pages.length) {',
    '    const spread = composeSpread(pages, cursor);',
    '    const step = cursor + spread.take;',
    '    if (step <= cursor || step >= pages.length) break;',
    '    prev = cursor;',
    '    cursor = step;',
    '    hops += 1;',
    '    if (cursor === index) return prev;',
    '  }',
    '  return prev;',
    '}',
  ].join('\n');
}
