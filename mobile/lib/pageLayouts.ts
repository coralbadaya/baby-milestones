/**
 * Left page and right page for one open spread.
 * Keep this in step with src/book/pageLayouts.js. The phone app does not import the website bundle.
 * Turn math: mobile/lib/bookEngine.ts ↔ src/book/engine.
 */

export type LayoutId = 'photo-story' | 'story-photo' | 'facing' | 'pair' | 'chapter';

export const PAGE_LAYOUTS: { id: LayoutId; label: string; detail: string; take: 1 | 2 }[] = [
  { id: 'photo-story', label: 'Photo & story', detail: 'Photograph on the left, the words on the right', take: 1 },
  { id: 'story-photo', label: 'Story & photo', detail: 'The words on the left, the photograph on the right', take: 1 },
  { id: 'facing', label: 'Facing photos', detail: 'Two photographs, one on each page', take: 2 },
  { id: 'pair', label: 'Two & words', detail: 'Two photographs on the left, the words on the right', take: 2 },
  { id: 'chapter', label: 'Chapter', detail: 'A chapter page, then the photograph', take: 1 },
];

export type SpreadPage = {
  ending?: boolean;
  uri?: string;
  monthLabel: string;
  title: string;
  caption: string;
  when: string;
  layout?: string;
};

export type Slot = {
  role: 'blank' | 'photo' | 'story' | 'pair' | 'chapter' | 'ending';
  page: SpreadPage | null;
  extra: SpreadPage | null;
};

export type Spread = {
  id: LayoutId;
  take: number;
  next: number;
  left: Slot;
  right: Slot;
};

function layoutById(id?: string) {
  return PAGE_LAYOUTS.find((layout) => layout.id === id) || PAGE_LAYOUTS[0];
}

function slot(role: Slot['role'], page?: SpreadPage | null, extra?: SpreadPage | null): Slot {
  return { role, page: page || null, extra: extra || null };
}

export function composeSpread(pages: SpreadPage[], index: number, layoutId?: string): Spread {
  const page = pages[index];
  if (!page) {
    return { id: 'photo-story', take: 1, next: index, left: slot('blank'), right: slot('blank') };
  }
  if (page.ending) {
    return { id: 'chapter', take: 1, next: index, left: slot('chapter', page), right: slot('ending', page) };
  }
  let layout = layoutById(page.layout || layoutId);
  const upcoming = pages[index + 1];
  if (layout.take === 2 && (!upcoming || upcoming.ending)) layout = layoutById('photo-story');
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
    right = slot('photo', upcoming);
  } else if (layout.id === 'pair') {
    left = slot('pair', page, upcoming);
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

export function previousSpreadIndex(pages: SpreadPage[], index: number) {
  let cursor = 0;
  let prev = 0;
  let hops = 0;
  while (cursor < index && hops <= pages.length) {
    const spread = composeSpread(pages, cursor);
    const step = cursor + spread.take;
    if (step <= cursor || step >= pages.length) break;
    prev = cursor;
    cursor = step;
    hops += 1;
    if (cursor === index) return prev;
  }
  return prev;
}
