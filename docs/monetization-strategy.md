# Monetization Strategy

> **Yarn Trails Basic** = recording habit (free forever). **Yarn Trails Plus** = magic rendering + editorial perks. **Dual billing:** India → Razorpay (INR); rest of world → Stripe (USD derived as INR ÷ 100).

---

## Positioning

Layered model: AI baby book is the primary conversion hook; editorial concierge perks stay bundled in Plus.

- **Basic:** Unlimited milestone tracking — never gate the habit loop
- **Plus:** Stories, flip-book, voice, HD photos, export, print discount, viewer seats + existing editorial gates

See [`docs/ai-baby-book-plan.md`](ai-baby-book-plan.md) for feature specs.

---

## Tiers

| Tier | Price (INR — primary) | Includes |
|------|----------------------|----------|
| **Basic** | ₹0 | Milestone tracking + captions, 2 photos/mo, 1 AI story ever, 3 voice notes, flip-book preview |
| **Plus** | **₹399/mo** or **₹2,499/yr** | Unlimited stories, 3D flip-book, HD photos, voice notes, 4K export, print discount, 2 viewer seats, editorial perks |
| **First Year Bundle** | **₹3,999** | Annual Plus + linen hardcover — hero SKU |
| **Gift subscription** | **₹2,999** one-time | Gift the baby's first year — grandparents |

**Regional display & checkout:** `GET /api/billing-region` resolves **IN** vs **ROW** (IP `x-vercel-ip-country`, then `profiles.billing_country` when set). `/premium` uses `formatPremiumRateLineForRegion` and routes checkout via `startPlusCheckout` — Razorpay for IN, Stripe for ROW. USD amounts in `PREMIUM_CURRENCIES.USD` are always **INR anchor ÷ 100** (₹399 → $3.99). Stripe env: `STRIPE_PRICE_*_USD` (or unprefixed fallbacks). Razorpay: plan/order IDs per SKU — see `docs/auth-membership-admin.md`.

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

### Plan selection (`/premium`)

The hero labels the product **Baby book** (Newsreader, gold rule). Each card leads with the plan name as a Newsreader headline (`Yarn Trails Basic`, `Yarn Trails Plus`). Plus uses a yarn-gold rule under the name. The First Year Plan states the yearly price, the monthly equivalent, and how that compares with paying every month (for example, about $4.17 a month — 48% less than $7.99). The two cards share one grid, so the Limits headings start on the same row. Limits come from `PLAN_LIMIT_ROWS` in `src/constants/premium.js`, which reads `ENTITLEMENT_LIMITS`.

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
| `src/constants/premium.js` | Plans, limits, INR anchor, derived USD, `BILLING_REGIONS`, Stripe env map (USD only) |
| `src/utils/premiumPricing.js` | Region-aware formatting (`formatPremiumRateLineForRegion`) |
| `src/hooks/useBillingRegion.js` | Client region + provider for `/premium` |
| `api/billing-region.js` | IP + profile override JSON |
| `src/utils/entitlements.js` | Quota checks |
| `src/hooks/useEntitlements.js` | React hook |
| `src/context/AuthContext.jsx` | Session, membership, usage fetch |
| `src/components/PremiumGate.jsx` | Teaser overlay. On the baby book, the cream card uses dark ink so the title stays readable; the flip-book gate shows an open-book illustration. |
| `src/pages/Premium.jsx` | Basic vs Plus comparison — display names + labeled limits, annual-first |
| `api/checkout.js` / `api/stripe-webhook.js` | Stripe Checkout (ROW only) + webhook (`stripe_events`, `billing_webhook_health`) |
| `api/razorpay-checkout.js` / `api/razorpay-webhook.js` | Razorpay subscriptions/orders (IN) + webhook (`razorpay_events`) |
| `src/pages/admin/AdminBilling.jsx` | Staff plan matrix + webhook health + recent paid Plus |

---

*Last updated: November 2026*
