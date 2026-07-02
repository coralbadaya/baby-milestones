# Nestmile Premium Redesign Plan

> Master plan for repositioning Nestmile from a feature-stacked utility to a **quiet-luxury concierge** for affluent new mothers in tier-1 global cities.

**Status:** In progress (Phase 0–2 shipped in code)  
**Audience:** Educated, health-conscious, high-income new mothers — London, New York, Manchester, Dubai, Abu Dhabi, and similar markets.

---

## Strategic shift

| Before | After |
|--------|-------|
| 8 flat nav items, feature-driven | 5 journey-ordered items: Today → Baby → Care → Essentials → Community |
| Home = birth date + 36-tile wall | Home = personalized **Today** dashboard |
| No photography | Editorial AI art-directed heroes on every major page |
| Gen Z / millennial mass market | Affluent tier-1 mothers willing to pay for curation |
| All Switzer | Fraunces display + Switzer body (**quiet luxury**) |

---

## Three pillars

1. **Sequence over surface** — Information follows the mother's journey (her recovery → baby's development → practical life).
2. **Editorial imagery** — Reusable `<PageHero>` with warm, desaturated, candid photography (AI-generated primary).
3. **Perceived craft** — Generous whitespace, serif headlines, restrained motion, premium gating scaffold.

---

## Phased roadmap

| Phase | Scope | Status |
|-------|-------|--------|
| 0 | Docs, skills, design-system update | ✅ |
| 1 | Nav reorder, footer demotion | ✅ |
| 2 | PageHero + hero images + Fraunces | ✅ |
| 3 | Home Today dashboard | ✅ |
| 4 | Hub pages (My Baby, Essentials) | ✅ |
| 5 | Premium scaffold (gating, pricing UI) | ✅ |
| 6 | Supabase auth + email OTP signup | ✅ |
| 6b | Stripe checkout + webhooks (Plus SKUs) | ✅ scaffold |
| 6c | AI baby book (Basic/Plus, entitlements, story, flip-book) | ✅ |
| 7 | Personalization (name, city, concierge copy) | Planned |
| 8 | Nanny concierge module | Future |

---

## Success metrics

- **Landing:** Hero + personalized greeting within 1s; LCP < 2.5s on 4G.
- **Engagement:** Week-1 return rate; depth to month detail from Today focus cards.
- **Revenue:** Premium trial starts; Essentials affiliate clicks; annual plan uptake in Gulf markets.
- **Brand:** Qualitative — "feels like a magazine, not a checklist."

---

## Related docs

| Doc | Purpose |
|-----|---------|
| `docs/information-architecture.md` | Nav, routes, page hierarchy |
| `docs/imagery-system.md` | Art direction, PageHero, AI prompts |
| `docs/home-redesign.md` | Today dashboard spec |
| `docs/editorial-page-system.md` | **Visual system v2** — phased editorial rhythm, DIY imagery, rollout to all pages |
| `docs/monetization-strategy.md` | Premium tiers, paywall |
| `docs/auth-membership-admin.md` | Supabase auth, OTP signup, membership, admin |
| `docs/design-system-2026.md` | Tokens, typography, components |

---

## Implementation files

| Area | Path |
|------|------|
| Page heroes | `src/components/PageHero.jsx`, `src/data/pageImages.js` |
| Today home | `src/pages/Home.jsx`, `src/components/TodayFocus.jsx` |
| Hub pages | `src/pages/Baby.jsx`, `src/pages/Essentials.jsx` |
| Nav | `src/components/Header.jsx`, `src/routes.js` |
| Premium | `src/constants/premium.js`, `src/hooks/usePremium.js`, `src/components/PremiumGate.jsx`, `src/pages/Premium.jsx` |
| Auth | `src/context/AuthContext.jsx`, `src/pages/Login.jsx`, `SignUp.jsx`, `VerifyEmail.jsx`, `src/components/auth/*` — see `docs/auth-membership-admin.md` |
| Hero assets | `public/images/heroes/*.jpg` |

---

*Last updated: June 2026*
