# Month Detail — DIY & Care UI

> **Before changes:** read [`docs/ui-design.md`](ui-design.md) (shared grid, modal).  
> **After changes:** update this file.

**Implementation:** `DIYSection`, `CareSection`, `DIYActivityCard`, `DetailModal`, styles in `global.css`.

---

## Problem (old)

- Single-column accordion list — long scroll, repetitive expand/collapse
- Full steps hidden until tap; illustrations only inside expanded body

---

## Pattern: compact grid + modal

| Layer | Role |
|-------|------|
| **Grid card** | Illustration/icon header, title, meta, 2-line preview, CTA |
| **Detail modal** | Full steps, materials, dos/don’ts, YouTube (DIY only) |

Same breakpoints as shopping (`content-card-grid`):

| Width | Columns |
|-------|---------|
| &lt; 520px | 1 |
| 520–899px | 2 |
| ≥ 900px | 3 |

**Clothes** card spans full row on ≥520px (`.content-card--span-row`) — chips always visible, no modal.

---

## DIY Games & Activities

- Filter tabs unchanged (category pills)
- Card: `DIYActivityCard` — `.content-card.card-accent-top`, SVG banner, category badge, duration, difficulty dots, 2 material chips + “+N”, first benefit as preview
- CTA: **Open guide** → `DetailModal` with full content + YouTube button

---

## Baby Care

- Filter: All | Bath | Massage | Hold & Play | Clothes | Pacifier
- **Guide cards** (bath, massage, pacifier): `.card-accent-top`, colored icon header, frequency/when line, preview
- **Holding games**: `.card-accent-top`, icon + title + 2-line description, **How to do it** → modal
- **Clothes**: full-width row, **no** top accent — chips only, no modal

Care types: `careTypeConfig.js` (colors/icons per type).

---

## Deep-link anchors

| Id | Section |
|----|---------|
| `#milestones` | Physical + emotional milestone grid |
| `#diy` | DIY Games & Activities |
| `#care` | Baby Care |

Used by `DIYPreviewStrip`, `CarePreviewTeaser`, and Today focus cards.

---

## DIY preview variant (`compact`)

`DIYActivityCard` with `compact` prop — used in `DIYPreviewStrip` on Today and My Baby. Shows YouTube button on card face plus **Open guide** modal.

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
