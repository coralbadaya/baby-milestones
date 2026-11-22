# Month Detail — DIY & Care UI

> **Before changes:** read [`docs/ui-design.md`](ui-design.md) (shared grid, modal).  
> **After changes:** update this file.

**Implementation:** `DIYSection`, `CareSection`, `DIYActivityCard`, `DetailModal`, styles in `global.css`.

---

## Problem (old)

- Single-column accordion list — long scroll, repetitive expand/collapse
- Full steps hidden until tap; illustrations only inside expanded body

---

## Pattern: smart carousel + modal

| Layer | Role |
|-------|------|
| **Carousel card** | Photo or icon, title, meta, 2-line preview, CTA — one featured slide with a peek of the next |
| **Detail modal** | Full steps, materials, dos/don’ts, YouTube (DIY only) |

`SmartCarousel` at **every width** for DIY and Baby Care (not a dense grid). Phone: ~82% card with a peek. Desktop: ~420px card, 56px arrows, dots.

**Order (smart):** start on the easiest, then shortest; mix categories so the same type is not twice in a row when another type remains (`orderForCarousel` in `src/utils/smartCarouselOrder.js`).

**Clothes** is a later slide (no duration) — chips always visible, no modal.

---

## DIY Games & Activities

- Filter tabs unchanged (category pills); carousel re-orders the filtered set
- Card: `DIYActivityCard` — `.content-card.card-accent-top`, editorial photo (per-activity override, site-wide default, or cream lockup), category badge, duration, difficulty dots, 2 material chips + “+N”, first benefit as preview
- CTA: **Open guide** → `DetailModal` with full content + YouTube button

---

## Baby Care

- Filter: All | Bath | Massage | Hold & Play | Clothes | Pacifier
- **All:** bath, massage, pacifier, clothes, plus **this month’s new holds only** (not the full history)
- **Hold & Play:** this month’s holds first, then earlier holds
- Same mix/easy-first order as DIY
- **Guide cards** (bath, massage, pacifier): `.card-accent-top`, colored icon header, frequency/when line, preview
- **Holding games**: `.card-accent-top`, icon + title + 2-line description, **How to do it** → modal
- **Clothes**: later slide, chips only, no modal

Care types: `careTypeConfig.js` (colors/icons per type).

---

## Deep-link anchors

| Id | Section |
|----|---------|
| `#milestones` | Physical + emotional milestone grid |
| `#diy` | DIY Games & Activities |
| `#care` | Baby Care |

Used by `DIYPreviewStrip`, `CarePreviewTeaser`, and Today focus cards.

Related links under the month summary: **Baby monthly milestones** (head-term guide), the matching `/guides/{n}-month-old-milestones` article when it exists, vaccination, Mom Care, sources.

---

## DIY preview variant (`compact`)

`DIYPreviewStrip` on My Baby uses `SmartCarousel` at every width (`DIYEditorialCard` stack, 4 slides, same easy-first mix). Link: **All for month N →** `#diy`.

---

## Shared components

| Component | File |
|-----------|------|
| `DetailModal` | `DetailModal.jsx` — backdrop, scroll body, Escape to close |
| `content-card-grid` | CSS — shared by DIY and Care |

---

## Accessibility

- Modal: `role="dialog"`, `aria-modal`, labelled title, focus trap via native button close
- Escape closes modal; body scroll locked while open
