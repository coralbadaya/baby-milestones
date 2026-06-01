# Coral UI Design System

> **Before any UI work:** read this file, `docs/design-system-2026.md`, and the feature-specific design doc.  
> **After UI changes:** update this file and the feature doc in the same session.

**Implementation:** shared components in `src/components/`; global styles in `src/styles/global.css`.

---

## Design doc index

| Document | Scope |
|----------|--------|
| **`docs/design-system-2026.md`** | **Complete design system for Gen Z/Millennial parents** |
| **`docs/ui-design.md`** (this file) | Shared components, form controls, tokens |
| `docs/shopping-ui-design.md` | Shopping page grid, cards, images, toolbar |
| `docs/travel-ui-design.md` | Travel page, type tabs, age-aware tip cards |
| `docs/mom-care-ui-design.md` | Mom Care page, self-care topic tabs, tip cards |
| `docs/month-detail-ui-design.md` | DIY & Care grids, detail modal |
| `docs/vaccination-ui-design.md` | Vaccination tracker: chart-first timeline, India/CDC/custom, CRUD, reminders/export/print |

---

## Tokens (CSS variables)

Use `:root` tokens from `global.css`:

- Surfaces: `--white`, `--cream`, `--cream-dark`, `--surface-primary`
- Text: `--text-primary`, `--text-secondary`, `--text-light`
- Accent: `--coral-primary`, `--lavender-dark`, `--mint-dark`, `--baby-blue-dark`
- Card accent: `--card-accent-height` (3px), `--card-accent-color` (from `--cat-color`)
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`
- Shadow: `--shadow-card`, `--shadow-sm`, `--shadow-md`

Font: **General Sans** (Fontshare), app-wide.

---

## App shell

Rendered once in `App.jsx` on every route:

| Piece | Component | Notes |
|-------|-----------|-------|
| Header | `Header.jsx` | Sticky top; desktop nav + mobile bottom nav |
| Main | `<main className="app-main">` | Route content; `flex: 1` |
| Footer | `Footer.jsx` | Brand, nav links, disclaimer, copyright |

Do not add page-specific footers — extend `Footer.jsx` or footer styles in `global.css`.

Spec: [`docs/design-system-2026.md`](design-system-2026.md) — Site footer section.

---

Category-colored 3px top bar on DIY, Care, Shopping, Travel, Mom Care, and activity cards. Pass `--cat-color` inline from category config. No left border. See [`docs/design-system-2026.md`](design-system-2026.md#cards).

**Exceptions:** Care clothes full-width card (no accent).

---

## Select (`Select.jsx`)

**Do not** use raw `<select>` with ad-hoc classes. Use the shared component:

```jsx
import Select from './Select';

<Select
  id="unique-id"
  label="From month"
  value={fromMonth}
  onChange={(value) => setFromMonth(Number(value))}
  options={[
    { value: 1, label: 'Month 1' },
    { value: 2, label: 'Month 2', disabled: true },
  ]}
/>
```

### Props

| Prop | Type | Required | Notes |
|------|------|----------|-------|
| `id` | string | yes | Links label + `htmlFor` |
| `label` | string | no | Visible label above control |
| `value` | string \| number | yes | Controlled value (coerced to string on `<option>`) |
| `onChange` | `(value: string) => void` | yes | Receives `e.target.value` as string |
| `options` | `{ value, label, disabled? }[]` | yes | |
| `disabled` | boolean | no | Disables entire control |
| `className` | string | no | Extra classes on root `.coral-select` |
| `aria-label` | string | no | Overrides accessible name if `label` omitted |

### Anatomy

```
.coral-select
  .coral-select-label     ← optional caption
  .coral-select-wrap
    .coral-select-native   ← native <select>, appearance: none
    .coral-select-chevron  ← decorative ▾
```

### Styling

| Property | Value |
|----------|--------|
| Label | 13px, weight 700, `--text-secondary` |
| Control min-width | 120px (140px from 768px) |
| Padding | 10px 36px 10px 12px (room for chevron) |
| Border | 2px `--cream-dark`, radius `--radius-sm` |
| Background | `--white` |
| Focus | 2px outline `--lavender-dark`, offset 2px |

### Layout in groups

Place multiple selects in a flex row with `align-items: flex-end` and `gap: 16px` (see `.shop-range-controls` in shopping toolbar).

### Accessibility

- Always provide `id` + `label` (or `aria-label`).
- Use `disabled` on individual `options` when values are invalid (e.g. “to month” before “from month”).
- Chevron is `aria-hidden`.

### Current usage

| Location | IDs | Purpose |
|----------|-----|---------|
| `ShoppingChecklist.jsx` | `shop-range-from`, `shop-range-to` | Month range filter |

---

## Content card grid & detail modal

Used on **month detail** for DIY and Care (not shopping).

| Class / component | Purpose |
|-------------------|---------|
| `.content-card-grid` | 1 → 2 → 3 column responsive grid |
| `.content-card` | Compact card with media header + body; add `.card-accent-top` |
| `.content-card-cta` | Opens `DetailModal` |
| `DetailModal` | Scrollable body; bottom sheet mobile; title reserves space for close |

Spec: [`docs/month-detail-ui-design.md`](month-detail-ui-design.md).

---

## Workflow for agents and contributors

1. **Plan** — Check `docs/ui-design.md` + feature design doc.
2. **Build** — Reuse `Select` and other shared components.
3. **Document** — Update design docs when adding props, breakpoints, or new usages.
4. **Verify** — `npm run build`; spot-check mobile (375px) and desktop (1280px).
