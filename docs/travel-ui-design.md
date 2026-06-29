# Travel UI Design

> **Implementation:** `Travel.jsx`, `TravelTips.jsx`, `src/data/travelTips.js`, `src/data/travelTypeConfig.js`, styles in `global.css`.  
> **Shared UI:** [`docs/ui-design.md`](ui-design.md) — tokens, General Sans, cream/lavender palette.

## Goals

- Age-aware travel guidance from birth date (`currentMonth`)
- Tips organized by **travel type** (car, flight, train, day outing, hotel)
- Complements Shopping `travel` category — link to Shopping page for gear
- Parenting Assistant uses same `travelTips.js` data

---

## Page shell

Uses shared [`.page-body`](page-layout-standardization.md) utilities on `.travel-page`:

| Viewport | Layout |
|----------|--------|
| Mobile (≤768px) | `.page-body--wide` + `.page-body--with-mobile-nav` |
| Desktop (≥769px) | `max-width: 1100px`, centered |

`<PageHero>` is full-bleed outside `.travel-page`.

---

## Hero

- `h1`: "Travel with Baby"
- Subtitle: educational framing (not medical advice)
- **`.travel-age-banner`** when `currentMonth` set: lavender-tinted pill — "Tips tailored for Month N"
- If no birth date: `.travel-set-dob` CTA button → navigates Home

---

## Type selector

Reuse DIY filter tab pattern:

- Container: `.diy-filter-tabs` (shared)
- Buttons: `.diy-filter-btn` with active state from `travelTypeConfig` (`color`, `bg`)
- Types: car, air, train, dayOuting, hotel
- Persist selection: `localStorage` key `travelType`

---

## Tip cards

Stacked list (not product grid):

```
.travel-tip-card
  .travel-tip-card-header   ← type icon + label + band note
  .travel-tip-section        ← h4 + ul
```

Sections per card: **Packing**, **During the trip**, **Safety**, **When to call the doctor**

| Class | Notes |
|-------|-------|
| `.travel-tips-list` | `display: flex; flex-direction: column; gap: 16px` |
| `.travel-tip-card` | white bg, `.card-accent-top` (3px top bar = type color), `--radius-lg`, `--shadow-card` |

---

## Travel gear footer

- `.travel-gear-footer` — cream panel
- Lists travel-category items from shopping data for months 1..`currentMonth`
- Button "View all in Shopping" → `setPage('shopping')`

---

## Navigation

| Location | Label | Icon | `page` id |
|----------|-------|------|-----------|
| Desktop header | Travel | — | `travel` |
| Mobile nav | Travel | 🧳 | `travel` |

Order: Home → Shopping → **Travel** → Progress → Sources (sound stays header/desktop + mobile)

---

## Assistant

- `AssistantPanel` shown on `page === 'travel'` (same FAB as Home)
- Queries routed via `parseTravelType` + `getTravelParagraphs(month, type)`

---

## Verify

- 375px, 768px, 1280px
- Month 4 + Flight tab + assistant "flying with 4 month old"
- No birth date → CTA visible
