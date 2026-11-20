# Yarn Trails Doctrine — One-Page Summary

> **Read this first.** Full constitution: [`doctrine.md`](doctrine.md)

---

## What we are

**Yarn Trails** — *The art of early motherhood.*  
A quiet-luxury companion for affluent new mothers (0–36 months). Editorial guide + practical tools. Not a social network, medical app, or gamified checklist.

**Ambition:** the best product in this market — tracker, India schedule, mom care, baby book — and the **best honest answer** on Google and AI search for every job we claim. One canonical page per head term. Trust before rankings. Playbook: [`seo-page-one.md`](seo-page-one.md).

---

## Who we build for

Educated, time-poor mothers in tier‑1 cities. **Design for 3am:** one hand, low light, half asleep. The phone is the product — start at 390px. Premium means calm space, not a dense grid.

---

## Three pillars

| Pillar | Rule |
|--------|------|
| **Sequence over surface** | Nav follows the journey: Today → My Baby → My Care → Essentials → Community |
| **Editorial craft** | Fraunces + Switzer, PageHero photos, generous space, magazine not spreadsheet |
| **Trust before growth** | Educational only; cite sources; never paywall core tracking or emergency guidance |

---

## Non‑negotiables

- **Watch For** (not "Take Care") on warning cards  
- Baby emergencies → pediatrician / emergency services  
- Postpartum emergencies → obstetrician / emergency services  
- Signup → email OTP before session  
- Premium = invitation tone, not punishment  
- Reuse shared components (`Select`, `PageHero`, `Footer`, `PremiumGate`)  
- Update design docs when UI changes
- Phone first: 56px targets, heroes that grow with their copy, one tap from Today to each parent job  

---

## Decision order

When stuck, prioritize:

**Safety → phone-first 3am UX → Journey fit → Craft → Smallest scope → Maintainability**

If Safety or 3am UX fails, don't ship.

---

## We will not build

Gamification · ad-dense layouts · unverified medical claims · deep nav for core logging · stock baby clichés · feature stacks that fight the journey

---

## Stack & commands

React 19 · Vite · Vitest · Supabase · Vercel

```bash
npm run dev          # local
npm test             # unit tests
npm run verify:data  # after data edits
npm run build        # before merge
```

---

## Where to go next

| I need to… | Read |
|------------|------|
| Understand principles in depth | [`doctrine.md`](doctrine.md) |
| Set up Git, Vercel, Supabase | [`development-workflow.md`](development-workflow.md) |
| Change UI | [`design-system-2026.md`](design-system-2026.md) + feature doc — phone first |
| Nav / routes | [`information-architecture.md`](information-architecture.md) |
| Search, GEO, AISO | [`navigation-seo.md`](navigation-seo.md) · **page one:** [`seo-page-one.md`](seo-page-one.md) |
| App Store / Play readiness | [`store-readiness.md`](store-readiness.md) |
| iPhone and Android app | [`mobile-app-plan.md`](mobile-app-plan.md) · [`mobile/`](../mobile/) |
| Auth / admin | [`auth-membership-admin.md`](auth-membership-admin.md) |
| Staff Insights | [`product-analytics.md`](product-analytics.md) |
| Code conventions | [`CLAUDE.md`](../CLAUDE.md) · [`memory.md`](../memory.md) · `.cursor/rules/coral.mdc` |

---

*Yarn Trails · July 2026*
