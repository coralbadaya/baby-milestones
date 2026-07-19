# Admin Portal — Design & Theme

Professional staff console for Yarn Trails. **Separate visual language** from the consumer app: operational, data-first, calm — not editorial parenting warmth.

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

**Not:** Bootstrap admin templates, neon dashboards, gamification, or consumer Yarn Trails lavender wash.

---

## Layout system

### Desktop (≥769px)

```
┌─────────────┬────────────────────────────────────────────────┐
│  Yarn Trails   │  Overview                                      │
│ Staff console│  ────────────────────────────────────────────  │
│             │  [ toolbar: filters · search · primary action ]│
│ OPERATIONS  │                                                │
│  Overview   │  ┌──────────────────────────────────────────┐  │
│  Inbox  ●3  │  │  admin-panel (white, rounded, shadow-sm)   │  │
│  Users      │  │  table · form · stat grid · empty state    │  │
│  Promo codes│  └──────────────────────────────────────────┘  │
│  Newsletter │                                                │
│  Community  │                                                │
│  DIY images │                                                │
│  ─────────  │                                                │
│  [avatar]   │                                                │
│  Admin pill │                                                │
│  user@…     │                                                │
│  Sign out   │                                                │
│  ← View site│                                                │
└─────────────┴────────────────────────────────────────────────┘
     256px light sidebar              scrollable main workspace
```

- **No desktop top bar** — brand, nav, and account live in the sidebar.
- Full viewport shell (`100dvh`); main content scrolls independently.

### Tablet (769–1023px)

- Same as desktop: persistent light sidebar + scrollable main.

### Mobile (≤768px)

- **Compact top bar:** hamburger · “Staff console” · role pill.
- Sidebar opens as **drawer overlay** (full height below top bar).
- Tables → horizontal scroll or card list; touch targets ≥ 44px.

### Shell structure (target components)

| Component | Role |
|-----------|------|
| `AdminShell` | Full viewport wrapper (`admin-shell`); applies admin theme tokens |
| `AdminSidebar` | Brand, nav groups, inbox badge, user card, sign out, exit link |
| `AdminMobileBar` | Mobile-only: menu toggle, title, role pill |
| `AdminPageHeader` | Breadcrumb, `h1`, optional description + primary action slot |
| `AdminPanel` | White elevated surface for page body (tables, forms) |
| `AdminLayout` | Composes shell; `<Outlet />` in scrollable main workspace |

**Nav order** (match `AdminLayout.jsx`):

1. Overview  
2. Inbox  
3. Users  
4. Promo codes  
5. Newsletter  
6. Community  
7. DIY images *(admin only)*  

Sidebar footer: user avatar + role pill + email, **Sign out**, **View public site** → `/`.

---

## Theme tokens

Add to `src/styles/admin-portal.css` (import from `global.css`). Prefix: `--admin-*`.

### Surfaces

| Token | Value | Use |
|-------|-------|-----|
| `--admin-canvas` | `#F4F5F7` | Page background behind panels |
| `--admin-sidebar-bg` | `#FFFFFF` | Fixed sidebar (light) |
| `--admin-sidebar-border` | `#E4E6EB` | Sidebar dividers |
| `--admin-sidebar-text` | `#3D3A36` | Nav labels |
| `--admin-sidebar-muted` | `#8A827C` | Section labels, icons |
| `--admin-sidebar-hover` | `#F4F5F7` | Nav hover |
| `--admin-sidebar-active-bg` | `#F0EBE4` | Active nav item |
| `--admin-sidebar-active-text` | `#2B2622` | Active nav label |
| `--admin-sidebar-accent` | `#C4956A` | Active icon, accents |
| `--admin-panel` | `#FFFFFF` | Main content cards |
| `--admin-panel-muted` | `#F7F8FA` | Table header row, sidebar foot |
| `--admin-topbar-bg` | `#FFFFFF` | Mobile header only |
| `--admin-border` | `rgba(43, 38, 34, 0.08)` | Panel + table borders |
| `--admin-border-strong` | `rgba(43, 38, 34, 0.14)` | Inputs, dividers |

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

*Last updated: admin portal v2 — light sidebar shell, full-viewport layout, sidebar account footer.*
