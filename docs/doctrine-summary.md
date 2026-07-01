# Nestbean Doctrine — One-Page Summary

> **Read this first.** Full constitution: [`doctrine.md`](doctrine.md)

---

## What we are

**Nestbean** — *The art of early motherhood.*  
A quiet-luxury companion for affluent new mothers (0–36 months). Editorial guide + practical tools. Not a social network, medical app, or gamified checklist.

---

## Who we build for

Educated, time-poor mothers in tier‑1 cities. **Design for 3am:** one hand, low light, half asleep. Premium ≠ cluttered.

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

---

## Decision order

When stuck, prioritize:

**Safety → 3am UX → Journey fit → Craft → Smallest scope → Maintainability**

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
| Change UI | [`design-system-2026.md`](design-system-2026.md) + feature doc |
| Nav / routes | [`information-architecture.md`](information-architecture.md) |
| Auth / admin | [`auth-membership-admin.md`](auth-membership-admin.md) |
| Code conventions | [`CLAUDE.md`](../CLAUDE.md) · [`memory.md`](../memory.md) · `.cursor/rules/coral.mdc` |

---

*Nestbean · July 2026*
