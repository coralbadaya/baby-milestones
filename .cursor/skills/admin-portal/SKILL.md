# Admin Portal Skill

Use when designing or implementing the Yarn Trails **staff admin console** (`/admin/*`).

## Before you start

1. Read [`docs/admin-portal-plan.md`](../../docs/admin-portal-plan.md) — **phased implementation roadmap** (tasks, acceptance criteria, status).
2. Read [`docs/admin-portal-design.md`](../../docs/admin-portal-design.md) — layout, theme tokens, components.
3. Read [`docs/auth-membership-admin.md`](../../docs/auth-membership-admin.md) — roles, routes, RLS.
4. Reuse `Select.jsx`, `Icon.jsx` — do not add raw `<select>` elements.

## Triggers

- Admin layout, sidebar, or top bar changes
- New admin page or table/form patterns
- Admin theme tokens or CSS refactor
- Professional portal redesign

## Rules

| Do | Don't |
|----|-------|
| Dark ink sidebar + neutral canvas | Consumer ivory/sand editorial bands |
| Switzer for all admin UI | Fraunces headlines in admin |
| Phosphor icons in nav (20px) | Twemoji or emoji in admin chrome |
| `admin-portal.css` for admin styles | Sprawling new rules in unrelated CSS |
| Staff vs Admin role badges | Hide role from signed-in user |
| Mobile drawer nav | Persistent sidebar on small screens |

---

## Implementation prompt

Copy everything below the line into a new agent task when implementing the admin portal redesign.

---

### PROMPT: Yarn Trails Admin Portal — Professional Shell (Phase 1)

**Goal:** Transform `/admin/*` into a professional admin portal per `docs/admin-portal-design.md`. Phase 1 = shell + theme only; do not rewrite business logic in admin pages.

**Context:**
- React 19 + Vite; routes in `src/routes.js`; layout in `src/pages/admin/AdminLayout.jsx`.
- Auth: `RequireRole role="staff"`; `useAuth()` exposes `isAdmin`, user email.
- Current styles: `admin-*` classes in `src/styles/global.css` (~line 7128+).
- Consumer app uses quiet luxury (Fraunces, cream) — admin must feel **distinct**: ops dashboard, dark sidebar, white panels.

**Deliverables:**

1. **`src/styles/admin-portal.css`**
   - All `--admin-*` tokens from design doc.
   - Shell: `.admin-shell`, `.admin-topbar`, `.admin-sidebar`, `.admin-sidebar--drawer`, `.admin-main`, `.admin-workspace`.
   - Nav: `.admin-nav-item`, `.admin-nav-item--active`, `.admin-nav-badge`, `.admin-nav-group-label`.
   - Page chrome: `.admin-page-header`, `.admin-breadcrumb`, `.admin-panel`.
   - Migrate existing admin rules from `global.css`; import `admin-portal.css` from `global.css`.
   - Remove deprecated `--surface-admin` lavender wash.

2. **`src/pages/admin/AdminLayout.jsx`**
   - **Top bar:** CoralLogo mark + "Admin" label; role pill (`Staff` / `Admin`); user email; link sign out or `/account`.
   - **Sidebar:** Fixed 240px dark (`--admin-sidebar-bg`); nav items with Phosphor icons:
     - Overview → `chart-bar` or `squares-four`
     - Inbox → `envelope`
     - Users → `users`
     - Promo codes → `ticket`
     - Newsletter → `paper-plane`
     - DIY images → `image` (admin only)
   - Badge slot on Inbox for future count (optional static `0` for now).
   - **Mobile:** Hamburger toggles drawer overlay; body scroll lock when open.
   - **Back to app** link at sidebar footer → `/account`.
   - Wrap `<Outlet />` in `.admin-workspace` with max-width 1200px.

3. **Shared header helper** (optional small component `src/components/admin/AdminPageHeader.jsx`)
   - Props: `title`, `description`, `breadcrumb`, `action` (React node).
   - Use on `AdminOverview` as reference; other pages can adopt incrementally.

4. **Update `AdminOverview.jsx`**
   - Use `AdminPageHeader`.
   - Stat cards inside `.admin-panel`; apply new stat card styles.

5. **Docs**
   - Confirm `docs/admin-portal-design.md` matches shipped shell.
   - One line in `docs/auth-membership-admin.md` Admin UI section pointing to admin-portal-design.md.

**Visual acceptance criteria:**
- Desktop: dark sidebar + white top bar + gray canvas + white content panel.
- Active nav: terracotta left bar + lighter text.
- No Fraunces on admin pages (Switzer titles).
- 375px: drawer nav works; no horizontal overflow on layout shell.
- `npm test` and `npm run build` pass.

**Out of scope Phase 1:**
- Refactoring Inbox/Users/Promos/Newsletter/DIY page internals.
- Live inbox badge count from Supabase.
- Keyboard shortcuts.

**Test:** Sign in as `nestbean-test-admin@mailinator.com` / `NestbeanTestAdmin1!` → `/admin`.

---

## After UI changes

1. Update phase status in `docs/admin-portal-plan.md` when a phase ships.
2. Update `docs/admin-portal-design.md` if layout or tokens change.
3. Test 375px + 1280px.
4. Verify staff vs admin nav (DIY hidden for support role if applicable).
