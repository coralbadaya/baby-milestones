# Yarn Trails Doctrine

> **The art of early motherhood.**  
> This document is the project's constitution — what we build, who we serve, and what we refuse to compromise.  
> **New here?** Start with the one-page [`doctrine-summary.md`](doctrine-summary.md).  
> Detailed specs live in linked docs; this file states **principles and non‑negotiables**.

---

## 1. Mission

Yarn Trails is a **quiet-luxury companion** for the first three years of parenthood. We help educated, time-poor mothers in tier‑1 cities move through early motherhood with **sequence, calm, and trust** — not more noise.

We are not a social network, a medical device, or a gamified checklist. We are an **editorial guide** with practical tools woven in.

---

## 2. Who we serve

| Primary | Affluent new mothers, tier‑1 cities (London, NYC, Dubai, Manchester, Abu Dhabi, similar) |
| Secondary | Late millennials / early Gen Z — digital-native, curation over clutter |

**Always design for the worst case:** half asleep, holding a baby, one hand free, low light at 3am. Premium positioning does not excuse small touch targets or deep navigation.

**Voice:** Confident, calm, never condescending. No "mama" clichés, no gamification, no achievement pressure.

→ Audience & UX context: [`design-system-2026.md`](design-system-2026.md)  
→ Journey & nav: [`information-architecture.md`](information-architecture.md)

---

## 3. Product pillars

These three pillars govern every feature decision.

### I. Sequence over surface

Information follows the mother's journey — **Today → My Baby → My Care → Essentials → Community** — not a flat feature list.

- Primary nav stays journey-ordered (5–6 items max on mobile).
- Secondary tools (Progress, Sources, Premium discovery) belong in footer or contextual links.
- Each page answers one question: *What matters now?*

### II. Editorial craft

The product should feel like a **magazine with utility**, not a spreadsheet with photos.

- Fraunces for display; Switzer for UI.
- `<PageHero>` editorial photography on major surfaces.
- Generous whitespace; one primary action per section.
- Warm ivory palette — terracotta + honey gold — never clinical white or pastel baby clichés.

### III. Trust before growth

Health and postpartum content is **educational only**. We cite sources, demote unverified claims, and never block emergency guidance behind a paywall.

- Baby emergencies → pediatrician / local emergency number.
- Postpartum emergencies → obstetrician / local emergency number.
- UI label **Watch For** (not "Take Care") for warning cards.

→ Premium repositioning roadmap: [`premium-redesign-plan.md`](premium-redesign-plan.md)  
→ Sources & citations: [`navigation-seo.md`](navigation-seo.md), `/sources`

---

## 4. Trust & safety (non‑negotiable)

| Rule | Rationale |
|------|-----------|
| **Educational, not medical** | We inform; we do not diagnose or prescribe. |
| **Never paywall core tracking** | Milestones, vaccination log, mom care basics stay free. |
| **Never paywall emergency paths** | Assistant and static pages must route to professional care when appropriate. |
| **Verified accounts for membership** | Signup requires email OTP before session — reduces abuse, protects list quality. |
| **Honest premium framing** | Early access / founding membership until Stripe ships — no fake checkout. |
| **Privacy by default** | Baby data in localStorage until cloud sync is designed; no silent exfiltration. |
| **Staff data is operational** | Contact inbox, users, promos — staff roles only; RLS enforced in Supabase. |

→ Auth, membership, admin: [`auth-membership-admin.md`](auth-membership-admin.md)  
→ Monetization ethics: [`monetization-strategy.md`](monetization-strategy.md)  
→ Parenting assistant boundaries: [`memory.md`](../memory.md), `.cursor/rules/claude.mdc`

---

## 5. Design doctrine

### Consumer app

| Do | Don't |
|----|-------|
| Reuse shared components (`Select`, `PageHero`, `Footer`, `PremiumGate`) | One-off styled `<select>` elements or duplicate footers |
| Phosphor Light icons via `Icon.jsx` | Twemoji in nav, cards, or buttons |
| Left-align body copy; center only heroes & short CTAs | Dense feature stacks or 8+ nav items |
| Teaser gates with invitation tone | Aggressive paywalls on health tracking |
| Update design docs in the same session as UI changes | Ship UI without syncing specs |

**Before UI work:** read [`design-system-2026.md`](design-system-2026.md), [`ui-design.md`](ui-design.md), and the feature doc.  
**Skills:** `.cursor/skills/premium-ui/`, `image-curation/`, `brand-assets/`.

### Admin portal

The staff console is a **separate product surface** — operational, data-first, trustworthy. It does not reuse consumer editorial warmth.

→ Layout, theme, phased rollout: [`admin-portal-design.md`](admin-portal-design.md)

### Brand

- Name: **Yarn Trails** (source: `src/constants/brand.js`)
- Logo & palette: [`brand-identity.md`](brand-identity.md)
- Regenerate icons after logo changes: `npm run generate:brand`

---

## 6. Engineering doctrine

### Stack

React 19 · Vite 8 · Vitest · Supabase (auth, Postgres, storage) · Vercel (hosting)

### Principles

| Principle | Practice |
|-----------|----------|
| **Minimal diff** | Smallest correct change; no drive-by refactors. |
| **Conventions over invention** | Match surrounding code; extend existing hooks and components. |
| **Data integrity** | Run `npm run verify:data` after milestone or mom-care data edits. |
| **Tests for logic** | Unit tests for pure utils and hooks; integration tests for Supabase with seeded creds. |
| **Migrations are truth** | Schema changes live in `supabase/migrations/`; never hand-edit production without a migration. |
| **Security definer for public writes** | Anonymous users must not rely on SELECT-after-INSERT (e.g. contact form → RPC). |
| **Docs stay current** | Code and docs ship together; `.cursor/rules/coral.mdc` indexes the doc map. |

### Quality gate (before merge)

```bash
npm test
npm run verify:data   # when data changed
npm run build
```

→ Day-to-day workflow: [`development-workflow.md`](development-workflow.md)

### State & persistence

| Data | Storage |
|------|---------|
| Birth date, milestone checks, vaccines | `localStorage` (keys documented in `CLAUDE.md`) |
| Auth, membership, contact, DIY images | Supabase |
| Life firsts media (v1) | `localStorage` data URLs — cloud sync planned |
| Anonymous premium preview | `localStorage` — signed-in users use Supabase membership |

---

## 7. Content doctrine

| Type | Standard |
|------|----------|
| **Milestones & mom care** | Curated, age-banded, sourced where possible |
| **Assistant responses** | Static KB in `src/data/assistantResponses.js`; extend via parenting-assistant skill |
| **DIY imagery** | Per-activity admin config with bundled fallbacks — [`diy-images-admin.md`](diy-images-admin.md) |
| **Hero photography** | AI art-directed, legally sourced — [`imagery-system.md`](imagery-system.md) |
| **Legal & trust pages** | Privacy, terms, medical disclaimer, accessibility — always reachable from footer |

We prefer **fewer, better** articles over content farms. Guides and FAQ support SEO; they must match editorial quality.

---

## 8. Monetization doctrine

Revenue comes from **curation and concierge**, not from anxiety or lock-in.

- **Free:** Tracking, mom care, vaccination, community browse, assistant basics.
- **Premium:** Editorial depth, travel/shopping edits, exports, advanced assistant — teaser + invitation, never punishment.
- **Early access:** Trial on verified signup; promo codes and founding `comp` via admin — no broken Stripe buttons.

Future Stripe integration updates `memberships` via webhooks; until then, Supabase is source of truth for signed-in users.

---

## 9. Decision framework

When choosing between options, apply in order:

1. **Safety** — Does it respect medical boundaries and user privacy?
2. **Exhaustion-aware UX** — Can it be used one-handed at 3am?
3. **Journey fit** — Does it belong in the sequence (Today → … → Community)?
4. **Craft** — Does it feel editorial and calm, not cluttered?
5. **Scope** — Is this the smallest shippable slice?
6. **Maintainability** — Shared component? Documented? Tested?

If a feature fails **Safety** or **Exhaustion-aware UX**, it does not ship until fixed.

---

## 10. What we will not build

- Gamification (streaks, badges, leaderboards)
- Ad-dense or interruptive monetization
- Unverified medical claims presented as fact
- Deep navigation hierarchies for core logging flows
- Stock baby clichés (storks, pacifier motifs, rainbow gradients)
- Feature stacks that compete with the primary journey
- Admin tools on the consumer nav for non-staff users

---

## 11. Document hierarchy

| Layer | Document | Role |
|-------|----------|------|
| **Constitution** | **`doctrine.md` (this file)** | Principles & non‑negotiables |
| **Onboarding** | **`doctrine-summary.md`** | One-page quick reference |
| **System** | `design-system-2026.md`, `information-architecture.md`, `editorial-page-system.md` | Cross-cutting design & IA |
| **Feature** | `home-redesign.md`, `mom-care-ui-design.md`, etc. | Per-surface specs |
| **Operations** | `development-workflow.md`, `auth-membership-admin.md` | How we build & run |
| **Agent** | `CLAUDE.md`, `memory.md`, `.cursor/rules/coral.mdc` | Cursor quick guide + living file map & assistant KB |

When docs conflict, resolve in this order: **doctrine → feature spec → code**. Update the lower layer to match after deliberate doctrine changes.

---

## 12. Names & legacy

- **Product name:** Yarn Trails (user-facing)
- **Repo / internal paths:** Some legacy `coral` / `Yarn Trails` identifiers remain in filenames and CSS tokens — do not rename casually; new work uses Yarn Trails in copy and `src/constants/brand.js`.

---

*Established: July 2026 · Yarn Trails*
