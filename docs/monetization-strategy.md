# Monetization Strategy

> **Nestbean Basic** = recording habit (free forever). **Nestbean Plus** = magic rendering + editorial perks. Stripe checkout in progress.

---

## Positioning

Layered model: AI baby book is the primary conversion hook; editorial concierge perks stay bundled in Plus.

- **Basic:** Unlimited milestone tracking — never gate the habit loop
- **Plus:** Stories, flip-book, voice, HD photos, export, print discount, viewer seats + existing editorial gates

See [`docs/ai-baby-book-plan.md`](ai-baby-book-plan.md) for feature specs.

---

## Tiers

| Tier | Price (USD anchor) | Includes |
|------|-------------------|----------|
| **Basic** | $0 | Milestone tracking + captions, 2 photos/mo, 1 AI story ever, 3 voice notes, flip-book preview |
| **Plus** | $7.99/mo or **$49.99/yr** | Unlimited stories, 3D flip-book, HD photos, voice notes, 4K export, print discount, 2 viewer seats, editorial perks |
| **First Year Bundle** | $79.99 | Annual Plus + linen hardcover ($99 value) — hero SKU |
| **Gift subscription** | $59.99 one-time | Gift the baby's first year — grandparents |

**Regional display:** `src/utils/premiumPricing.js` — USD default; GBP and INR variants in `PREMIUM_CURRENCIES`.

---

## Gating rules

| Feature | Basic | Plus |
|---------|-------|------|
| Milestone tracking + captions | Full | Full |
| Monthly album photos | 2/mo, 2D | Unlimited HD |
| AI stories | 1 ever | Unlimited |
| Voice notes | 3 × 30s | Unlimited |
| Flip-book | 2D preview + watermark | Full 3D, all themes |
| 4K export | — | Full |
| Print | Full price | 20% off + free shipping |
| Viewer seats | — | 2 |
| Editorial / travel / shopping / assistant / vaccination export | Teaser | Full |

Implementation: `src/utils/entitlements.js`, `PremiumGate`, `AuthContext` + Supabase `usage_entitlements`.

---

## Trial

- **No trial on signup.** Users start Basic.
- **7-day trial on annual only**, triggered immediately after first AI story generation.
- Monthly plan: no free trial.

---

## Revenue streams

1. **Subscriptions** — Plus monthly / annual / bundle / gift
2. **Print** — POD partner (Peecho/RPI); bundle LTV driver
3. **Affiliate commerce** — Essentials shopping edits (Plus)
4. **Partnerships** — Future

---

## Paywall UX

- Never block milestone tracking or emergency/medical guidance
- Emotional-preview paywall after first story (annual trial offer)
- Tone: invitation — *"Turn this month into a page in their story"*

---

## KPI targets (day 90)

| KPI | Target |
|-----|--------|
| Organic sessions/mo | 15k |
| Landing → signup | 8% |
| Signup → paid | 5% |
| Blended CAC | under $8 vs $50–95 LTV |

Events: `story_generated`, `trial_started`, `guide_cta_click`, `install_banner_click` in `src/utils/analytics.js`.

---

## Code

| File | Role |
|------|------|
| `src/constants/premium.js` | Plans, limits, feature flags, Stripe keys |
| `src/utils/premiumPricing.js` | Currency detection + formatting |
| `src/utils/entitlements.js` | Quota checks |
| `src/hooks/useEntitlements.js` | React hook |
| `src/context/AuthContext.jsx` | Session, membership, usage fetch |
| `src/components/PremiumGate.jsx` | Teaser overlay |
| `src/pages/Premium.jsx` | Basic vs Plus comparison, annual-first |
| `api/checkout.js` / `api/stripe-webhook.js` | Stripe integration |

---

*Last updated: July 2026*
