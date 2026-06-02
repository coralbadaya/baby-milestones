# Mom's Milestones — UI Design

> Postpartum timeline for the parent inside Mom Care. Checkable milestones anchored to baby birth date.

## Route

`/mom-care#timeline` — **first tab** in the Mom Care tab strip (label: **Timeline**).

Default landing when visiting Mom Care with no hash: `#timeline`.

## Goals

- Normalize postpartum expectations week-by-week and month-by-month
- Reduce "is this normal?" anxiety with calm, evidence-based checkpoints
- Deep-link to existing Mom Care topic guides (`#mentalHealth`, `#pelvicFloor`, etc.)
- Let parents track recovery progress with low-friction checkboxes (same mental model as baby milestones)

## Navigation

- **Desktop / mobile:** Existing Mom Care nav in `Header.jsx` / `Footer.jsx` — no new top-level route
- **In-page:** Timeline tab first; 16 topic tabs unchanged after it

## Data

| File | Purpose |
|------|---------|
| `src/data/momMilestones.js` | Curated periods + checkable items |
| `src/utils/momMilestones.js` | Postpartum week/month math, progress, current period |
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
| `momMilestoneChecks` | `Record<itemId, boolean>` | Checkbox state per item id |
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
| `MomMilestonesPanel` | `src/components/MomMilestonesPanel.jsx` | Timeline sections, checkboxes, progress, learn-more links |

### Layout (Timeline tab)

```
┌─────────────────────────────────────┐
│ Mom Care (hero)                     │
├─────────────────────────────────────┤
│ [Timeline] [Mental] [Recovery] …    │  ← timeline first
├─────────────────────────────────────┤
│ You are ~6 weeks postpartum         │
│ ████████░░ 12/48 milestones       │
├─────────────────────────────────────┤
│ ▌ Weeks 3–6  (current)              │
│   ☐ Six-week checkup booked         │
│   ☐ Pelvic floor gentle start       │
│   ⚠ Watch for: fever, heavy bleed…  │
│   [Learn more: Recovery →]          │
├─────────────────────────────────────┤
│ ▌ Weeks 7–12                        │
│   …                                 │
└─────────────────────────────────────┘
```

## Interaction

- Checkbox tap toggles item in `momMilestoneChecks` (haptic `selection`)
- **Learn more** navigates to `{ pathname: /mom-care, hash: relatedTopic }`
- Period sections use `.card-accent-top` with lavender accent (`--cat-color: var(--lavender-dark)`)
- Reuse `.milestone-item` / `.milestone-check` from Month Detail for consistency

## CSS classes

| Class | Purpose |
|-------|---------|
| `.mom-milestones-panel` | Panel wrapper |
| `.mom-milestones-hero` | Postpartum age + overall progress |
| `.mom-milestones-progress` | Progress bar track/fill |
| `.mom-milestones-birth-banner` | Missing birth date CTA |
| `.mom-milestones-period` | One period section card |
| `.mom-milestones-period.is-current` | Highlight active window |
| `.mom-milestones-period-header` | Label + title + summary |
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
- [x] Checkbox state persists after refresh (`momMilestoneChecks`)
- [x] Current period highlights when birth date set
- [x] Learn more opens correct topic tab
- [x] All item ids unique; verify script passes

### UI

- [x] Mobile 375px: tabs scroll; milestone rows readable
- [x] Desktop 1280px: max-width 1100px aligned with Mom Care page
- [x] Checkbox targets usable one-handed

### Accessibility

- [x] Checkboxes: `role="checkbox"`, `aria-checked`, Enter key
- [x] Period headings use semantic `<section>` + `aria-labelledby`

## Related docs

- [mom-care-ui-design.md](mom-care-ui-design.md) — topic tabs and tip cards
- [design-system-2026.md](design-system-2026.md) — tokens, disclaimer tone
- [ui-design.md](ui-design.md) — shared components index
