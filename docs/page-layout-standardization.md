# Page Layout Standardization

> Hybrid layout: **full-bleed hero** + **centered page body**. Mobile-first clearance for bottom nav and safe areas.

---

## Rule

Every route with `<PageHero>` follows the same structure:

```jsx
<>
  <PageHero imageKey="..." ... />
  <div className="some-page page-body page-body--wide page-body--with-mobile-nav">
    {/* scrollable content only */}
  </div>
</>
```

- **Hero** — always a direct child of the page route, never inside a `max-width` wrapper
- **Body** — centered column with width modifier and mobile-nav clearance

---

## Width tokens

| Modifier | `max-width` | Use |
|----------|-------------|-----|
| `.page-body--wide` | 1100px | My Care, Shopping, Travel, Vaccination, hub grids |
| `.page-body--narrow` | 720px | Community feed (reading column) |

Hero headline text is centered separately via `.page-hero__content` (`max-width: 720px`).

---

## Mobile UX

### Bottom navigation clearance

At `max-width: 768px`, fixed bottom nav is shown. Page bodies use:

```css
.page-body--with-mobile-nav {
  padding-bottom: calc(var(--mobile-nav-height) + env(safe-area-inset-bottom, 0px) + var(--space-6));
}
```

Token: `--mobile-nav-height: 64px` in `:root`.

Desktop (`≥769px`): normal `padding-bottom: var(--space-12)`.

### Horizontal padding

| Breakpoint | Padding |
|------------|---------|
| ≤360px | `var(--space-3)` |
| 361–768px | `var(--space-4)` |
| ≥769px | `var(--space-5)` |

Applied via `.page-body` utilities.

### Hero heights

| Variant | Desktop | Mobile (≤768px) |
|---------|---------|-----------------|
| `size="lg"` | 360px | 260px |
| default | 280px | 220px |
| `size="md"` | 240px | 200px |

Mobile: `.page-hero__title` uses `--text-2xl`; hero `border-radius: 0` (edge-to-edge).

### Preserve (do not change)

- Community tabs — horizontal scroll, `min-width: 72px`
- Mom Care subnav — horizontal scroll, `min-height: 52px`
- Mobile bottom nav — 5-tab icon + label stack, `min-height: 48px`

---

## Hero size guide

| Page | `size` | Rationale |
|------|--------|-----------|
| Today (Home) | `lg` | Primary landing, birth date slot |
| My Baby, Essentials | default | Hub pages |
| My Care, Community, Shopping, Travel, Vaccination | `md` | Secondary depth pages |

---

## New page checklist

1. Place `<PageHero />` **outside** any `max-width` wrapper
2. Wrap body in `.page-body` + width modifier + `.page-body--with-mobile-nav`
3. Do not add top padding to body wrapper (hero `margin-bottom` provides gap)
4. Verify at 360px, 390px, 768px, 1024px — no content hidden under bottom nav
5. Update `docs/imagery-system.md` if adding a new `imageKey`

---

## Related docs

- [`imagery-system.md`](imagery-system.md) — PageHero props and art direction
- [`design-system-2026.md`](design-system-2026.md) — audience, touch targets, one-handed usage
- [`ui-design.md`](ui-design.md) — shared components

*Last updated: June 2026*
