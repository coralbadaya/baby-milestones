# Nestbean Admin Portal — Phased Implementation Plan

> Professional staff console for `/admin/*` — operational, data-first, visually distinct from the consumer app.

**Status:** Phase 1 complete · Phases 2–4 planned  
**Design spec:** [`admin-portal-design.md`](admin-portal-design.md) — layout, `--admin-*` tokens, component patterns  
**Implementation skill:** [`.cursor/skills/admin-portal/SKILL.md`](../.cursor/skills/admin-portal/SKILL.md)  
**Auth & roles:** [`auth-membership-admin.md`](auth-membership-admin.md)  
**Local login:** [`development-workflow.md#login-details-local-dev`](development-workflow.md#login-details-local-dev)

---

## Phase status

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Shell and theme | **Complete** |
| 2 | Shared components | Planned |
| 3 | Page refactors | Planned |
| 4 | Polish and ops | Planned |

---

## Current state

| Area | Today | Target |
|------|-------|--------|
| Layout | Lavender wash, text-only sidebar in `AdminLayout.jsx` | Dark sidebar + top bar + drawer (mobile) — **Phase 1 shipped** |
| Styles | `admin-*` in `global.css` (~7128+) | `src/styles/admin-portal.css` — **Phase 1 shipped** |
| Components | Inline per page | `src/components/admin/*` shared primitives |
| Typography | Fraunces sidebar title | Switzer-only ops UI |

**Admin pages** (`src/pages/admin/`):

- `AdminOverview.jsx` — dashboard stats
- `AdminInbox.jsx` — contact submissions
- `AdminUsers.jsx` — profiles + membership
- `AdminPromos.jsx` — promo code CRUD
- `AdminNewsletter.jsx` — campaigns, compose, templates, subscribers
- `AdminDiyImages.jsx` — per-activity image config

**Nav order** (match `AdminLayout.jsx`): Overview · Inbox · Users · Promo codes · Newsletter · DIY images *(admin only)*

---

## Phase 1 — Shell and theme

**Goal:** Professional portal chrome without rewriting page business logic.

### 1.1 Theme tokens and CSS

- [x] Create `src/styles/admin-portal.css` with all `--admin-*` tokens from [`admin-portal-design.md`](admin-portal-design.md)
- [x] Import `admin-portal.css` from `src/styles/global.css`
- [x] Migrate existing `admin-*` rules from `global.css` into `admin-portal.css`
- [x] Remove deprecated `--surface-admin` lavender wash
- [x] Keep existing class names where possible to limit page diffs

### 1.2 Layout shell

- [x] Refactor `src/pages/admin/AdminLayout.jsx`:
  - [x] Sticky top bar: logo mark, "Admin" label, role pill (`Staff` / `Admin`), signed-in email, sign out or account link
  - [x] Fixed 240px dark sidebar with Phosphor icons:
    - Overview → `squares-four` or `chart-bar`
    - Inbox → `envelope`
    - Users → `users`
    - Promo codes → `ticket`
    - Newsletter → `paper-plane`
    - DIY images → `image` *(admin only)*
  - [x] Active nav: terracotta left bar + highlighted label
  - [x] Footer link: **← Back to app** → `/account`
  - [x] Mobile (≤768px): hamburger, full-height drawer overlay, body scroll lock when open
- [x] Wrap `<Outlet />` in `.admin-workspace` (max-width 1200px)

### 1.3 Page header component

- [x] Add `src/components/admin/AdminPageHeader.jsx`
  - Props: `title`, `description`, `breadcrumb`, `action` (React node)
- [x] Use on `AdminOverview.jsx` as reference implementation

### 1.4 Overview reference page

- [x] Update `AdminOverview.jsx`: `AdminPageHeader`, stat cards inside `.admin-panel`
- [x] Remove Fraunces from admin page titles (Switzer 600, 24px)

**Acceptance criteria:**

- [x] Desktop: dark sidebar + white top bar + gray canvas + white content panel
- [x] Mobile 375px: drawer nav works; no horizontal layout overflow
- [x] All six admin routes reachable after sign-in
- [x] `npm test` and `npm run build` pass
- [ ] Sign in as `nestbean-test-admin@mailinator.com` → verify `/admin` and `/admin/diy`

---

## Phase 2 — Shared components

**Goal:** Reusable admin UI primitives in `src/components/admin/`.

### 2.1 Surfaces and chrome

- [ ] `AdminPanel.jsx` — white elevated content surface (tables, forms, stat grids)
- [ ] `AdminPageHeader.jsx` — finalize and export (from Phase 1)

### 2.2 Data display

- [ ] `AdminStatCard.jsx` — metric value + label; optional `to` link
- [ ] `AdminDataTable.jsx` — wrapper with sticky header, row hover, optional `highlightRow` prop for inbox `new` rows
- [ ] `AdminBadge.jsx` — status pills mapping design doc colors (new, active, trial, warning, error, neutral)

### 2.3 States and toolbar

- [ ] `AdminToolbar.jsx` — left slot (filters/search), right slot (ghost Refresh + primary action)
- [ ] `AdminEmpty.jsx` — centered message + optional secondary action
- [ ] `AdminLoading.jsx` — consistent loading copy or skeleton placeholder hook

### 2.4 Adoption

- [ ] Refactor `AdminOverview.jsx` to use `AdminPanel`, `AdminStatCard`
- [ ] Refactor `AdminInbox.jsx` to use `AdminPageHeader`, `AdminToolbar`, `AdminDataTable`, `AdminBadge`

**Acceptance criteria:**

- [ ] Overview and Inbox use shared components exclusively for chrome (not ad-hoc divs)
- [ ] Badge colors match status table in `admin-portal-design.md`
- [ ] Inbox `new` rows: left accent + highlight background via `AdminDataTable`

---

## Phase 3 — Page refactors

**Goal:** Every admin route matches the new system. Mobile: table → card list or horizontal scroll at ≤768px.

### 3.1 Overview (`AdminOverview.jsx`)

- [ ] Completed in Phases 1–2; verify stat cards link to Inbox, Promos, DIY routes
- [ ] Optional: recent activity strip (future — out of scope unless data exists)

**Acceptance criteria:**

- [ ] Stat grid responsive `minmax(180px, 1fr)`; clickable cards have hover lift

### 3.2 Inbox (`AdminInbox.jsx`)

- [ ] `AdminPageHeader` with description + Refresh in toolbar
- [ ] Status filter via shared `Select.jsx`
- [ ] `AdminDataTable` with subject labels from `contactSubjectLabel`
- [ ] Mobile: card list per message (date, from, subject, status) or sticky-first-column scroll

**Acceptance criteria:**

- [ ] Can filter by status, update row status, refresh without full page reload
- [ ] New messages visually distinct from read/archived

### 3.3 Users (`AdminUsers.jsx`)

- [ ] `AdminPageHeader` + search input in `AdminToolbar`
- [ ] Table: display name, email, role, membership status, created date
- [ ] Role/membership edits admin-only (`isAdmin` guard — existing logic preserved)
- [ ] Mobile: stacked user cards

**Acceptance criteria:**

- [ ] Search filters client-side or server-side (match current behavior)
- [ ] Non-admin staff see read-only table

### 3.4 Promo codes (`AdminPromos.jsx`)

- [ ] Inline create form inside `AdminPanel`
- [ ] Table: code, type, uses, expiry, active flag
- [ ] Primary action: Create code

**Acceptance criteria:**

- [ ] Create + list promos without leaving page
- [ ] Mono font for code column

### 3.5 Newsletter (`AdminNewsletter.jsx`)

- [ ] Restyle tab bar (Campaigns · Compose · Templates · Subscribers) with admin tab tokens
- [ ] Compose + preview panels inside `AdminPanel`
- [ ] Modal polish for schedule/send confirmations
- [ ] Feature workflow: [`newsletter-admin.md`](newsletter-admin.md)

**Acceptance criteria:**

- [ ] All four tabs functional; admin-only write actions gated
- [ ] Preview iframe and mobile/desktop preview frames styled consistently

### 3.6 DIY images (`AdminDiyImages.jsx`)

- [ ] Thumbnail grid in `AdminPanel`
- [ ] Upload UX + pagination toolbar
- [ ] Feature workflow: [`diy-images-admin.md`](diy-images-admin.md)

**Acceptance criteria:**

- [ ] Admin-only route hidden from support nav
- [ ] Image upload and prompt expand still work after restyle

---

## Phase 4 — Polish and ops

**Goal:** Production-ready staff experience.

### 4.1 Live data in chrome

- [ ] Inbox sidebar badge: count from `contact_submissions` where `status = 'new'`
- [ ] Badge updates after inbox status change (refetch or optimistic decrement)

### 4.2 Loading and motion

- [ ] Loading skeletons for stat cards and table rows
- [ ] Respect `prefers-reduced-motion` on drawer and nav transitions

### 4.3 Accessibility and keyboard

- [ ] Skip link: "Skip to admin content" as first focusable in shell
- [ ] Esc closes mobile drawer and modals (audit newsletter + DIY modals)
- [ ] `aria-current="page"` on active nav item

### 4.4 Tablet (optional)

- [ ] Icon rail sidebar (64px) at 769–1023px with tooltips; expand on toggle

**Acceptance criteria:**

- [ ] Inbox badge reflects live count after seed + new contact submission
- [ ] Keyboard-only navigation through sidebar and primary inbox actions
- [ ] No consumer-app Fraunces or editorial sand bands visible in admin shell

---

## Success metrics

- Staff can triage inbox, look up users, create promos, and draft newsletter campaigns without visual confusion with the parent-facing app.
- Admin shell reads as a **professional ops dashboard** (Stripe / Linear tone), not a themed consumer page.
- Mobile staff can access all routes; tables remain usable at 375px width.

---

## File map

| Area | Path |
|------|------|
| Phased plan | `docs/admin-portal-plan.md` (this file) |
| Design spec | `docs/admin-portal-design.md` |
| Skill + Phase 1 prompt | `.cursor/skills/admin-portal/SKILL.md` |
| Layout | `src/pages/admin/AdminLayout.jsx` |
| Pages | `src/pages/admin/Admin*.jsx` |
| Shared components | `src/components/admin/*` — `AdminPageHeader.jsx` (Phase 1); primitives Phase 2 |
| Styles | `src/styles/admin-portal.css` |
| Icons | `src/components/Icon.jsx`, `src/utils/phosphorIconMap.js` |

---

## Testing checklist

Before marking a phase complete:

```bash
npm run seed:test-users   # if not already seeded
npm test
npm run build
```

Manual:

- [ ] Sign in as **admin** → all nav items including DIY images
- [ ] Sign in as **support** (if seeded) → DIY images hidden
- [ ] 375px: drawer nav, no overflow on Inbox and Users
- [ ] 1280px: fixed sidebar, top bar sticky on scroll
- [ ] `/admin/inbox` — filter, status update, highlight new rows
- [ ] `/admin/newsletter` — tab switch, compose preview
- [ ] `/admin/diy` — thumbnail grid, upload (admin only)

Credentials: [`development-workflow.md#login-details-local-dev`](development-workflow.md#login-details-local-dev)

---

## Related docs

| Doc | Purpose |
|-----|---------|
| [`admin-portal-design.md`](admin-portal-design.md) | Layout wireframe, theme tokens, component patterns |
| [`auth-membership-admin.md`](auth-membership-admin.md) | Roles, routes, RLS, test users |
| [`newsletter-admin.md`](newsletter-admin.md) | Newsletter tabs and send workflow |
| [`diy-images-admin.md`](diy-images-admin.md) | DIY image admin and storage |
| [`development-workflow.md`](development-workflow.md) | Local dev, seeding, login credentials |

---

*Last updated: admin portal phased plan v1 — Phase 1 complete.*
