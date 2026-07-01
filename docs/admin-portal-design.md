# Admin Portal — Design & Theme

Professional staff console for Nestbean. **Separate visual language** from the consumer app: operational, data-first, calm — not editorial parenting warmth.

**Routes:** `/admin`, `/admin/inbox`, `/admin/users`, `/admin/promos`, `/admin/newsletter`, `/admin/diy`  
**Access:** `staff` (read-most) · `admin` (write + DIY images)  
**Auth doc:** [`auth-membership-admin.md`](auth-membership-admin.md)

---

## Design intent

| Consumer app | Admin portal |
|--------------|--------------|
| Fraunces headlines, ivory/sand bands, editorial photos | Switzer UI, neutral canvas, data tables |
| Journey sequencing, soft CTAs | Clear hierarchy, dense but readable tables |
| Parent-facing copy | Internal ops copy — concise, neutral |
| Bottom nav, PageHero | Fixed sidebar + page header + scrollable workspace |

**Reference feel:** Stripe Dashboard, Linear settings, Notion database views — restrained, trustworthy, fast to scan.

**Not:** Bootstrap admin templates, neon dashboards, gamification, or consumer Nestbean lavender wash.

---

## Layout system

### Desktop (≥1024px)

```
┌──────────────────────────────────────────────────────────────┐
│ ■ Nestbean Admin          [Staff badge]  user@…  Sign out    │  admin-topbar (56px, sticky)
├─────────────┬────────────────────────────────────────────────┤
│  Overview   │  Inbox                                         │  admin-breadcrumb
│  Inbox  ●3  │  ────────────────────────────────────────────  │
│  Users      │  [ toolbar: filters · search · primary action ]│
│  Promo codes│                                                │
│  Newsletter │  ┌──────────────────────────────────────────┐  │
│  DIY images │  │  admin-panel (white, rounded, shadow-sm)   │  │
│             │  │  table · form · stat grid · empty state    │  │
│  ─────────  │  └──────────────────────────────────────────┘  │
│  ← Back to app│                                              │
└─────────────┴────────────────────────────────────────────────┘
     240px fixed sidebar              fluid main (max 1200px content)
```

### Tablet (769–1023px)

- Sidebar collapses to **icon rail** (64px) with tooltips; expand on hover or toggle.
- Top bar keeps logo + user menu.

### Mobile (≤768px)

- **No persistent sidebar.** Hamburger opens full-height drawer overlay.
- Top bar: menu · title · user avatar.
- Tables → card list pattern or horizontal scroll with sticky first column.
- Touch targets ≥ 44px.

### Shell structure (target components)

| Component | Role |
|-----------|------|
| `AdminShell` | Full viewport wrapper; applies admin theme tokens |
| `AdminTopBar` | Brand mark, environment pill (`Staff` / `Admin`), signed-in email, sign out |
| `AdminSidebar` | Nav groups + badge counts (e.g. new inbox) |
| `AdminPageHeader` | Breadcrumb, `h1`, optional description + primary action slot |
| `AdminPanel` | White elevated surface for page body (tables, forms) |
| `AdminLayout` | Composes shell; `<Outlet />` in main workspace |

**Nav order** (match `AdminLayout.jsx`):

1. Overview  
2. Inbox  
3. Users  
4. Promo codes  
5. Newsletter  
6. DIY images *(admin only)*  

Footer link: **← Back to app** → `/account`.

---

## Theme tokens

Add to `src/styles/admin-portal.css` (import from `global.css`). Prefix: `--admin-*`.

### Surfaces

| Token | Value | Use |
|-------|-------|-----|
| `--admin-canvas` | `#F0F1F4` | Page background behind panels |
| `--admin-sidebar-bg` | `#2B2622` | Fixed sidebar (brand ink) |
| `--admin-sidebar-text` | `#E8E4DF` | Nav labels |
| `--admin-sidebar-muted` | `#9A928C` | Section labels, disabled |
| `--admin-sidebar-active-bg` | `rgba(255,255,255,0.08)` | Active nav item |
| `--admin-sidebar-active-text` | `#FFFFFF` | Active nav label |
| `--admin-sidebar-accent` | `#C4956A` | Active indicator bar (terracotta) |
| `--admin-panel` | `#FFFFFF` | Main content cards |
| `--admin-panel-muted` | `#F7F8FA` | Table header row |
| `--admin-topbar-bg` | `#FFFFFF` | Sticky header |
| `--admin-border` | `rgba(43, 38, 34, 0.10)` | Panel + table borders |
| `--admin-border-strong` | `rgba(43, 38, 34, 0.16)` | Inputs, dividers |

### Text

| Token | Use |
|-------|-----|
| `--admin-text-primary` | `#2B2622` |
| `--admin-text-secondary` | `#5A5048` |
| `--admin-text-muted` | `#8A827C` |

### Status (badges & rows)

| Status | Background | Text |
|--------|------------|------|
| New / draft | `#EEF0FF` | `#3D4EB8` |
| Active / sent | `#E8F5EC` | `#2D6A3E` |
| Trial / scheduled | `#EDE8F5` | `#5C4D7A` |
| Warning / sending | `#FFF4E5` | `#9A6700` |
| Error / cancelled | `#FCE8E8` | `#9B2C2C` |
| Neutral | `#F0EEEB` | `#6B6560` |

### Typography

- **UI:** Switzer only (`--font-body`) — 14px base in tables, 16px in forms.
- **Page titles:** Switzer 600, 24px — **not** Fraunces (keeps ops tone).
- **Stat numbers:** Switzer 700, 28px tabular-nums.
- **Mono:** system ui-monospace for IDs, promo codes, UUIDs.

### Radius & shadow

- Panels: `--radius-md` (16px)
- Inputs/buttons: `--radius-sm` (12px)
- Shadow: `0 1px 3px rgba(43,38,34,0.06), 0 1px 2px rgba(43,38,34,0.04)`

### Motion

- Nav highlight: 150ms ease
- Drawer: 250ms ease-out
- Respect `prefers-reduced-motion`

---

## Component patterns

### Sidebar nav item

- Height 40px; left 3px terracotta bar when active.
- Phosphor icon (20px) + label; badge pill for counts (e.g. new inbox).
- Group label: uppercase 11px letter-spacing, `--admin-sidebar-muted`.

### Page header

```text
[ Breadcrumb: Admin / Inbox ]
Inbox                                    [ Primary: Mark all read ]
Contact form submissions from visitors.
```

### Stat cards (Overview)

- 4–5 cards in responsive grid (`minmax(180px, 1fr)`).
- Clickable cards link to relevant route; subtle hover lift.
- Label above value (small caps optional); no Fraunces.

### Data tables

- Sticky header row on scroll (`--admin-panel-muted`).
- Row hover: `#FAFAFB`.
- Highlight row (new inbox): left 3px accent + `#FFFBF5` background.
- Actions column: icon buttons or compact `Select` for status.
- Empty: centered illustration-free message + secondary action.

### Toolbar

- Left: filters (`Select`), search input.
- Right: ghost **Refresh** + primary action button.
- Wrap on mobile.

### Forms

- Two-column grid on desktop; single column mobile.
- Label above field; helper text below.
- Primary submit right-aligned in footer bar inside panel.

### Modals

- Backdrop `rgba(43,38,34,0.4)`.
- Panel max-width 480px (640px wide variant for newsletter preview).
- Focus trap; Esc closes.

### Role badge (top bar)

- `Staff` — neutral pill  
- `Admin` — terracotta outline pill  

---

## Page specs

| Page | Header | Primary actions | Notes |
|------|--------|-----------------|-------|
| Overview | Dashboard | — | Stat grid + quick links |
| Inbox | Inbox | Refresh | Status filter; highlight `new` |
| Users | Users | Search | Role + membership columns |
| Promo codes | Promo codes | Create code | Inline form + table |
| Newsletter | Newsletter | New campaign | Tabs: Campaigns · Compose · Templates · Subscribers |
| DIY images | DIY images | Upload | Thumbnail grid, pagination |

Feature details: [`newsletter-admin.md`](newsletter-admin.md), [`diy-images-admin.md`](diy-images-admin.md).

---

## Accessibility

- Sidebar: `<nav aria-label="Admin">`; current page `aria-current="page"`.
- Tables: `<th scope="col">`; sortable columns announce state.
- Status badges: visible text (not color-only).
- Focus rings: 2px terracotta offset on interactive elements.
- Skip link: "Skip to admin content" (first focusable in shell).

---

## File map (implementation)

| Area | Path |
|------|------|
| Design spec | `docs/admin-portal-design.md` (this file) |
| Implementation skill | `.cursor/skills/admin-portal/SKILL.md` |
| Layout | `src/pages/admin/AdminLayout.jsx` |
| Pages | `src/pages/admin/Admin*.jsx` |
| Shared components | `src/components/admin/AdminPageHeader.jsx` *(Phase 1)*; more in Phase 2 |
| Styles | `src/styles/admin-portal.css` |
| Icons | `src/components/Icon.jsx` + `phosphorIconMap.js` |

### Migration note

Existing classes (`admin-shell`, `admin-sidebar`, …) in `global.css` (~line 7128+) should move to `admin-portal.css` during Phase 1 refactor. Keep class names where possible to limit page diffs.

---

## Phased rollout

Implementation phases, tasks, acceptance criteria, and status: **[`admin-portal-plan.md`](admin-portal-plan.md)**.

Summary: Phase 1 shell → Phase 2 shared components → Phase 3 page refactors → Phase 4 polish (inbox badge, skeletons, a11y).

---

## Copy tone

- **Do:** "3 new messages", "Save draft", "Active subscribers"
- **Don't:** "Hey team!", emoji in labels, consumer marketing language

---

*Last updated: admin portal design v1 — Phase 1 shell shipped (dark sidebar, admin-portal.css).*
