# Yarn Trails

*The art of early motherhood.* A quiet-luxury companion for the first three years — curated milestones, mom care, and practical essentials. Built with **React 19 + Vite**.

---

## Start here

| Doc | Purpose |
|-----|---------|
| [`docs/doctrine-summary.md`](docs/doctrine-summary.md) | One-page principles — **read first** |
| [`docs/doctrine.md`](docs/doctrine.md) | Full project constitution |
| [`memory.md`](memory.md) | Living reference — file map, storage keys, assistant KB |
| [`docs/development-workflow.md`](docs/development-workflow.md) | Git, Vercel, Supabase, local dev, test credentials |
| [`CLAUDE.md`](CLAUDE.md) | Agent / Cursor quick guide |

---

## Features

### Journey (primary nav)

- **Today** — Personalized dashboard: focus cards, life firsts carousel, month timeline, assistant
- **My Baby** — 36-month milestone timeline, current month preview, DIY strip, life firsts journal (`#moments`)
- **My Care** — Postpartum timeline + 16 self-care topic guides
- **Essentials** — Hub for shopping checklist and travel tips
- **Community** — Feed, baby recipes, parenting tips
- **Guides** — Editorial articles (desktop top nav)

### Deep links & tools

- **Month detail** (`/month/:n`) — Milestones, DIY, baby care, assistant
- **Shopping** — Age-range checklist with product cards
- **Vaccination** — India / CDC / custom schedules
- **Travel** — Age-aware tips by transport type
- **Progress** — Milestone completion dashboard (footer)
- **Sources** — WHO, IAP, ICMR, and other citations (footer)

### Account & admin

- **Auth** — Email + password signup with **OTP verification** before session
- **Premium** — Early-access membership, promo codes, teaser gates
- **Admin** — Staff console: inbox, users, promos, DIY images, newsletter (`/admin/*`)

---

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm test             # unit tests
npm run test:it      # Supabase integration tests
npm run verify:data  # milestone + mom-milestone data integrity
npm run build        # production build
```

---

## Design & docs

Before UI work:

1. [`docs/doctrine-summary.md`](docs/doctrine-summary.md) or [`docs/doctrine.md`](docs/doctrine.md)
2. [`docs/design-system-2026.md`](docs/design-system-2026.md)
3. [`docs/ui-design.md`](docs/ui-design.md)
4. Feature-specific doc (e.g. [`docs/home-redesign.md`](docs/home-redesign.md))

Full index: [`.cursor/rules/coral.mdc`](.cursor/rules/coral.mdc)

---

## Project guides

- [`docs/development-workflow.md`](docs/development-workflow.md) — beginner workflow, login credentials
- [`docs/auth-membership-admin.md`](docs/auth-membership-admin.md) — Supabase auth, OTP, membership, admin
- [`docs/admin-portal-design.md`](docs/admin-portal-design.md) — staff console layout & theme
- [`docs/information-architecture.md`](docs/information-architecture.md) — nav order, page hierarchy
- [`docs/brand-identity.md`](docs/brand-identity.md) — logo, palette, SEO assets
- [`memory.md`](memory.md) — file map, localStorage keys, parenting assistant KB
- [`CLAUDE.md`](CLAUDE.md) — stack, conventions, commands for agents

---

## Stack

React 19 · Vite 8 · Vitest · React Router 7 · Supabase (auth, Postgres, storage) · Vercel (hosting)

Brand source of truth: `src/constants/brand.js`

---

*Yarn Trails · July 2026*
