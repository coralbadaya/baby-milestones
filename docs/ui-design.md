# Yarn Trails UI Design System

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
| `docs/mom-milestones-ui-design.md` | Mom's postpartum timeline tab (`#timeline`), read-only guidance, birth-date personalization |
| `docs/month-detail-ui-design.md` | DIY & Care grids, detail modal |
| `docs/vaccination-ui-design.md` | Vaccination tracker: chart-first timeline, India/CDC/custom, CRUD, reminders/export/print |
| `docs/navigation-seo.md` | Navigation IA, top bar + page menus + Plus, multi-column footer, SEO/GEO structured data, sitemap/robots |

---

## Tokens (CSS variables)

Use `:root` tokens from `global.css`:

- Surfaces: `--white`, `--cream`, `--cream-dark`, `--surface-primary`
- Text: `--text-primary`, `--text-secondary`, `--text-light`
- Accent: `--coral-primary`, `--lavender-dark`, `--mint-dark`, `--baby-blue-dark`
- Card border: `--card-border` (1px solid `--mushroom`); optional category tint via `--cat-color` on vaccine/status cards
- Radius: `--radius-sm`, `--radius-md`, `--radius-lg`
- Shadow: `--shadow-card`, `--shadow-sm`, `--shadow-md`

Font: **Switzer** (Fontshare), app-wide.

---

## App shell

Rendered once in `App.jsx` on every route:

| Piece | Component | Notes |
|-------|-----------|-------|
| Header | `Header.jsx` | 56px top bar. Phone: logo bar + bottom nav |
| Main | `<main className="app-main">` | Route content; `flex: 1` |
| Footer | `Footer.jsx` | `CoralLogo`, nav links, disclaimer, copyright |

Do not add page-specific footers — extend `Footer.jsx` or footer styles in `global.css`.

Spec: [`docs/design-system-2026.md`](design-system-2026.md) — Site footer section.

---

## Brand logo (`CoralLogo.jsx`)

Use for header/footer brand only — not for in-app emoji icons (`Icon.jsx`).

```jsx
import CoralLogo from './CoralLogo';

<CoralLogo variant="lockup" size={32} tagline="for parents" />
<CoralLogo variant="mark" size={24} />
```

Styles: `.coral-logo--lockup`, `.coral-logo-wordmark`, `.coral-logo-yarn`, `.coral-logo-trails`, `.coral-logo-tagline` in `global.css`.  
Spec: [`docs/design-system-2026.md`](design-system-2026.md) — Brand / Logo. Two-tone wordmark: **Yarn** moss, **Trails** heart terracotta.

---

Minimal **full border** on cards (`.card-accent-top` and shared card types). No top accent bar. Category color remains in badges/icons/chips via `--cat-color`. See [`docs/design-system-2026.md`](design-system-2026.md#cards).

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

## Breadcrumb (`PageBreadcrumb.jsx`)

Quiet trail for editorial pages. Render **inside** the page column, never as a
full-bleed child of `<main>` (that pins crumbs to the viewport left).

```jsx
<PageBreadcrumb
  items={[
    { name: 'Home', to: ROUTES.home },
    { name: 'Guides', to: ROUTES.guides },
    { name: 'Current page' },
  ]}
/>
```

| Context | Alignment |
|---------|-----------|
| `.content-page` (guide articles) | Centered with the hero |
| Trust pages (`TrustShell`, inside a narrow `PageSection`) | Left-aligned with the hero |
| `PageSection` (Guides hub) | Left-aligned with the section header |

Separator is Phosphor `caret-right`. Current page uses `aria-current="page"`.
Legal and company pages pass the nav into `ContentPage`, which renders it inside the ivory hero band.

### Trust pages

`TrustShell` (`src/components/TrustShell.jsx`) is the reading rhythm for legal copy, FAQ, Contact, Feedback, Sources, and the missing-page screen. Guide articles stay on `.content-page` and do not use it.

**Guide article themes:** primary hub tag maps to `guide-article--theme-*` via `src/data/guideThemes.js` — hero band, section rule, FAQ chrome. Staff list + live preview: `/admin/guides`.

**Guides hub tags:** compact filled chips, not 56px tabs. Phone: wrap in the content width (no horizontal scroll), 28px filter chips, 22px card chips, 11px/10px type. Each job tag uses that article theme’s fill + ink; the selected filter is the solid accent. Desktop: 32px / 12px.

| Band | Surface | What sits there |
|------|---------|-----------------|
| Hero | Ivory, narrow, left-aligned | Breadcrumb, 56px sand icon disc, title, date |
| Body | White for long policies and FAQ; ivory for short pages so card gaps show the page mist | Brief pages: one white card per block, 1px mushroom border. Policy pages: hairline sections. A `tone: 'boundary'` block keeps the trail rule. No lead status panel |

Source organization marks on `/sources` use one trail disc. They do not take a color from the organization record. Authority names on Medical Reviewers are underlined text links, not capsules.

---

## Content card grid & detail modal

Used on **month detail** for DIY and Care cards (not shopping). DIY and Care **browse** with `SmartCarousel` at every width.

| Class / component | Purpose |
|-------------------|---------|
| `SmartCarousel` | Snap carousel — arrows, dots, easy-first mixed order |
| `.content-card-grid` | Still used by shopping and other grids |
| `.content-card` | Compact card with media header + body; add `.card-accent-top` |
| `.content-card-cta` | Opens `DetailModal` |
| `DetailModal` | Scrollable body; bottom sheet mobile; title reserves space for close. Optional `meta` (chip row), `lead` (description), `displayTitle` (Fraunces) for editorial headers (recipes). |
| `ShareButton` | Community share row: icon-first 44px buttons (WhatsApp, X, Facebook, Copy link, native Share). Props: `label`, `compact`. See `docs/community-feature-plan.md` §5.2. |
| `RecipeMetaChips` | Prep time + age chips for recipe modal header (`Timer` + `Baby` icons). |

Spec: [`docs/month-detail-ui-design.md`](month-detail-ui-design.md). Community share/modal: [`docs/community-feature-plan.md`](community-feature-plan.md).

---

## Auth forms (`Login`, `SignUp`, `VerifyEmail`)

Shared shell: `AuthPageShell`, `AuthForm` in `src/components/auth/AuthForm.jsx`. OTP step: `OtpVerifyForm.jsx`.

| Class | Purpose |
|-------|---------|
| `.auth-page` | Centered column, max-width 28rem |
| `.auth-card` | Card with `.card-accent-top` |
| `.auth-form` | Vertical field stack |
| `.auth-field` | Label + input |
| `.auth-error` | Inline error with warning icon |
| `.auth-otp-input` | Centered 6-digit code (tabular nums, letter-spacing) |
| `.auth-resend-btn` | Text button for OTP resend (60s cooldown in component) |

`/login` and `/signup` share one Continue form. The account is created with email + password; the code at `/verify-email` is optional. Full flow: [`docs/auth-membership-admin.md`](auth-membership-admin.md).

---

## Feedback (`Feedback.jsx`)

`/feedback` — footer Company column + Account link. Not in primary nav.

Tappable topic cards (radio group, `.feedback-topics` / `.feedback-topic`), optional description, required email. Submits via `submit_contact_form` into the admin Inbox. Contact keeps press / partnership / general; its intro links here.

Touch targets ≥ 56px. Two columns from 641px; stacked at 375px.

---

## Account (`Account.jsx`)

Parent hub at `/account` (`RequireAuth`): split **PageHero** (`momCare`), **snapshot** tiles (membership, baby age, milestones, firsts/vaccines), dense **hub-quick-links** to primary journeys, two-column layout (forms + aside). Main column: profile, baby DOB/name, privacy export & delete (`<details>`). Aside: membership CTA, promo redeem, vaccine nudge when due, staff admin link, trust links, sign out. Classes: `.account-hub`, `.account-snapshot`, `.account-panel`, `.account-membership`. Fields reuse `.account-input` / auth labels. Baby identity syncs via `useBabyIdentity`.

---

## Workflow for agents and contributors

1. **Plan** — Check `docs/ui-design.md` + feature design doc.
2. **Build** — Reuse `Select` and other shared components.
3. **Document** — Update design docs when adding props, breakpoints, or new usages.
4. **Verify** — `npm run build`; spot-check mobile (375px) and desktop (1280px).
