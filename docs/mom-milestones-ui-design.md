# Mom's Milestones — UI Design

> Postpartum timeline for the parent inside Mom Care. Read-only guidance anchored to baby birth date.

## Route

`/mom-care#timeline` — **first tab** in the Mom Care tab strip (label: **Timeline**).

Default landing when visiting Mom Care with no hash: `#timeline`.

## Goals

- Normalize postpartum expectations week-by-week and month-by-month
- Reduce "is this normal?" anxiety with calm, evidence-based checkpoints
- Deep-link to existing Mom Care topic guides (`#mentalHealth`, `#pelvicFloor`, etc.)
- Present clear expectations without checkbox tracking (read-only guide)

## Navigation

- **Desktop / mobile:** Existing Mom Care nav in `Header.jsx` / `Footer.jsx` — no new top-level route
- **In-page:** Primary sub-nav row — **Mom Milestones** | **Self-care Guides** (separate from topic tabs). Milestones uses `#timeline`; guides show the 16 topic tabs on a second row.

## Data

| File | Purpose |
|------|---------|
| `src/data/momMilestones.js` | Curated periods + guidance items |
| `src/utils/momMilestones.js` | Postpartum week/month math, current period |
| `docs/research/mom-postpartum-timeline-raw.md` | Working research outline (not user-facing) |

### Period schema

```js
{
  id: 'pp-weeks-0-2',           // stable period key
  label: 'Weeks 0–2',           // section heading
  periodType: 'week',            // 'week' | 'month'
  periodStart: 0,                // inclusive (week or month index)
  periodEnd: 2,                  // inclusive
  title: 'The fourth trimester',
  summary: 'One-line expectation for this window',
  items: [
    { id: 'pp-w02-1', text: '...', tip: 'optional short tip' },
  ],
  relatedTopic: 'recovery',      // momCare hash id, or null
  watchFor: ['Call doctor if ...'],  // optional red flags
  sources: ['icmr', 'iap'],      // keys aligned with sources.js org ids where possible
}
```

### Storage

| Key | Type | Purpose |
|-----|------|---------|
| `babyBirthDate` | string (existing) | Personalizes "current" period and hero copy |

## Personalization

From `babyBirthDate`:

- `getPostpartumWeek(birthDate)` — weeks since birth (0-based through week 12+)
- `getPostpartumMonth(birthDate)` — months since birth (1-based, capped at 12 for timeline)
- `isCurrentPeriod(period, birthDate)` — highlights the active section
- Hero: "You are about X weeks postpartum" (weeks 0–12) or "Month X postpartum" (after week 12)

**No birth date:** Banner — "Set baby birth date on Home to personalize your timeline." Timeline still visible; no current-period highlight.

## UI components

| Component | File | Role |
|-----------|------|------|
| `MomCare` | `src/pages/MomCare.jsx` | Passes birth date + check state |
| `MomCareTips` | `src/components/MomCareTips.jsx` | Tab strip includes `timeline`; renders panel or topic card |
| `MomMilestonesPanel` | `src/components/MomMilestonesPanel.jsx` | Timeline sections, guidance lists, learn-more links |

### Layout (Timeline tab)

Two-column on desktop: **range selector** (left) + **selected period** (right). Detail uses guidance **2-column grid** + sticky **aside** (Watch for, Learn more).

```
┌──────────────────────────────────────────────────────────┐
│ You are ~6 weeks postpartum                              │
├─────────────┬────────────────────────────────────────────┤
│ Weeks 0–2   │  Weeks 3–6 · title · summary               │
│ Weeks 3–6 * │  ┌──────────────┬─────────────────────┐    │
│ Weeks 7–12  │  │ item cards   │ Watch for           │    │
│ Months 3–4  │  │ (2-col grid) │ Learn more →        │    │
└─────────────┴────────────────────────────────────────────┘
```

Below 900px: layout stacks. Range chips wrap in a compact row (auto width — never `width: 100%` in a horizontal strip, which hid later periods off-screen). Guidance cards and Watch for are single column.

## Interaction

- **Range buttons** select one period at a time (defaults to current period from birth date)
- **Jump to now** when viewing a non-current range
- **Learn more** navigates to `{ pathname: /mom-care, hash: relatedTopic }`
- Panel uses `.card-accent-top` with lavender accent (`--cat-color: var(--lavender-dark)`)

## CSS classes

| Class | Purpose |
|-------|---------|
| `.mom-milestones-layout` | Range nav + detail grid |
| `.mom-milestones-ranges` | Vertical range buttons (sticky) |
| `.mom-milestones-range-btn` | Week/month range selector |
| `.mom-milestones-detail-grid` | Guidance grid + aside |
| `.mom-milestones-list` | 2-column guidance cards (desktop) |
| `.mom-milestones-aside` | Sticky Watch for + Learn more |
| `.mom-milestones-watch` | Watch-for list (rose-tinted) |
| `.mom-milestones-learn` | Link-styled button to topic tab |

## Disclaimer

`MOM_MILESTONES_DISCLAIMER` in data file — shown at bottom of timeline panel:

> Educational organizer only. Postpartum recovery varies widely. Always follow your obstetrician, midwife, or primary care provider. Seek urgent care for heavy bleeding, fever, severe pain, breathing difficulty, or thoughts of harming yourself or your baby.

## Research workflow

1. **Sources** — IAP/ICMR maternal nutrition, WHO maternal mental health, NHS/ACOG postpartum visit norms (bibliography in `docs/research/mom-postpartum-timeline-raw.md`)
2. **Draft** — Outline in research markdown
3. **Curate** — Normalize to schema; remove diagnostic language; India-relevant notes where helpful
4. **Verify** — `npm run verify:data` includes `scripts/verify-mom-milestones.mjs`
5. **No automated medical scraping** — unlike Community recipes, content is hand-curated only

## QA checklist

### Functional

- [x] `/mom-care` with no hash lands on `#timeline`
- [x] Current period highlights when birth date set
- [x] Learn more opens correct topic tab
- [x] All item ids unique; verify script passes

### UI

- [x] Mobile 375px: range chips wrap in-view; milestone rows readable
- [x] Tablet 768px: stacked layout, chips wrap, no horizontal page overflow
- [x] Desktop 1280px: max-width 1100px aligned with Mom Care page
### Accessibility

- [x] Period headings use semantic `<section>` + `aria-labelledby`
- [x] Guidance lists use semantic `<ul>` / `<li>`

## Related docs

- [mom-care-ui-design.md](mom-care-ui-design.md) — topic tabs and tip cards
- [design-system-2026.md](design-system-2026.md) — tokens, disclaimer tone
- [ui-design.md](ui-design.md) — shared components index
