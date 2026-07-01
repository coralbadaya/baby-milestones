# Monetization Strategy

> Revenue model for affluent tier-1 new mothers. **Scaffold shipped**; Stripe integration planned.

---

## Positioning

Nestmile Premium is **curation and concierge**, not more checkboxes. Free tier = tracking; paid = editorial guides, expert framing, commerce edits, and AI depth.

---

## Tiers

| Tier | Price (indicative) | Includes |
|------|-------------------|----------|
| **Free** | £0 | Milestone tracking, mom care tips, vaccination tracker, community browse |
| **Premium** | £14.99/mo or £119/yr | Weekly editorial digest, premium travel/shopping edits, concierge assistant depth, export/print bundles |
| **Premium+** (future) | £29.99/mo | Expert Q&A slots, nanny directory (Phase 8), city-specific guides |

Gulf markets: price in AED/USD; annual preferred.

---

## Gating rules (scaffold)

| Feature | Free | Premium |
|---------|------|---------|
| Today focus — editorial card | Teaser | Full |
| Travel — long-haul guides | Teaser | Full |
| Shopping — premium brand edit | Teaser | Full |
| Vaccination export PDF | — | Full |
| Assistant — advanced topics | Limited | Full |

Implementation: `src/components/PremiumGate.jsx` + `src/context/AuthContext.jsx` (Supabase membership when signed in; localStorage preview when anonymous). See [`docs/auth-membership-admin.md`](auth-membership-admin.md).

Early access: no Stripe yet — signup requires **verified email (OTP)**; after verify, 7-day trial via signup trigger; promo codes and founding `comp` status via admin.

---

## Revenue streams

1. **Subscriptions** — Primary (Premium / Premium+)
2. **Affiliate commerce** — Essentials shopping edits (high AOV brands)
3. **Partnerships** — Pediatric wellness, postpartum care, luxury travel (future)
4. **Nanny concierge** — Referral / listing fees (Phase 8)

---

## Paywall UX

- Never block core health tracking or emergency guidance
- Teaser + blur on premium editorial; CTA → `/premium`
- Tone: invitation, not punishment — *"Unlock the full guide"*

---

## Code

| File | Role |
|------|------|
| `src/constants/premium.js` | Plans, feature flags, copy |
| `src/context/AuthContext.jsx` | Session, membership, OTP verify/resend, promo redeem |
| `src/utils/auth.js` | `isEmailVerified`, `isEmailNotConfirmedError` |
| `src/hooks/usePremium.js` | Legacy wrapper → AuthContext |
| `src/components/PremiumGate.jsx` | Wrapper with teaser overlay |
| `src/pages/Premium.jsx` | Early access membership page |
| `src/pages/VerifyEmail.jsx` | Post-signup OTP verification |

### Future: Stripe

- `POST /api/checkout` → Stripe Checkout Session
- Webhook → Supabase `memberships` status updates
- Replace anonymous localStorage preview with sign-in prompt only

---

*Last updated: June 2026*
