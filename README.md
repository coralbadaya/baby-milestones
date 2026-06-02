# Nestmile

Baby milestone tracker and mom care app for Gen Z and millennial parents — React 19 + Vite.

## Features

- **Home** — Birth date, monthly timeline, parenting assistant
- **Month detail** — Baby physical/emotional milestones, DIY, baby care
- **Shopping** — Age-range checklist with product cards
- **Vaccination** — India / CDC / custom schedules with timeline charts
- **Travel** — Age-aware travel tips
- **Mom Care** — Postpartum **Timeline** tab (mom milestones) + 16 self-care topic guides
- **Community** — Memories, baby recipes, parenting tips
- **Progress** — Milestone completion dashboard
- **Sources** — Referenced guidelines (WHO, IAP, ICMR, etc.)

## Commands

```bash
npm run dev          # local dev server
npm test             # Vitest unit tests
npm run verify:data  # milestone + mom-milestone data integrity
npm run build        # production build
```

## Design docs

Before UI work, read `docs/design-system-2026.md`, `docs/ui-design.md`, and the feature-specific doc (e.g. `docs/mom-milestones-ui-design.md`). See `.cursor/rules/coral.mdc` for the full index.

## Project guides

- [CLAUDE.md](CLAUDE.md) — stack, conventions, assistant
- [memory.md](memory.md) — parenting assistant knowledge base
