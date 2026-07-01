# Information Architecture

> Journey-ordered navigation for affluent new mothers. **Sequence over surface.**

---

## Top navigation (6 journey links + header chrome)

| Label | Route | Section key | Purpose |
|-------|-------|-------------|---------|
| **Today** | `/` | `today` | Personalized dashboard — focus cards, collapsed timeline |
| **My Baby** | `/baby` | `baby` | Full milestone timeline, vaccination entry |
| **My Care** | `/mom-care` | `momCare` | Postpartum timeline + self-care topics |
| **Essentials** | `/essentials` | `essentials` | Shopping + travel hub |
| **Community** | `/community/feed` | `community` | Feed, recipes, tips |
| **Guides** | `/guides` | `guides` | Editorial articles (desktop top nav only) |

**Header chrome (desktop):** Sign in / Account (auth) + **Premium** filled CTA pill — not in `PRIMARY_NAV` data.

**Mobile bottom bar (5 items):** Today · Baby · Care · Essentials · Community — Guides and Premium elsewhere.

### Demoted to footer

| Label | Route | Reason |
|-------|-------|--------|
| Progress | `/progress` | Secondary analytics; profile-adjacent |
| Sources | `/sources` | Trust footnote, not primary journey |
| Premium | `/premium` | Also header CTA + gates; footer link for discovery |

### Deep links

- `/month/:n` — month detail (nav highlights **My Baby**)
- `/baby#moments` — life firsts journal (deep link from Today)
- `/shopping`, `/vaccination`, `/travel` — reachable from hubs
- `/community/:tab` — community sub-tabs

---

## Mental model

```
Today (what matters now)
  └── My Baby (development + health)
  └── My Care (her recovery)
  └── Essentials (life admin + commerce)
  └── Community (connection)
```

---

## Page hierarchy

### Today (`/`)

1. PageHero — editorial mother+baby, personalized greeting
2. Birth date / baby name (onboarding if missing)
3. This week's focus — 1–3 cards (milestone, mom care, editorial)
4. Current month preview + DIY strip
5. Life firsts carousel — link to `/baby#moments`
6. Month timeline carousel — current month ±2, link to full timeline
7. Assistant panel (existing)

### My Baby (`/baby`)

1. PageHero — developmental moment
2. Quick links — current month, vaccination
3. **CurrentMonthPanel** — checkable milestone preview for current month
4. **DIYPreviewStrip** — horizontal DIY cards with YouTube CTAs
5. **CarePreviewTeaser** — bath/massage guides linking to `#care`
6. **FirstsJournal** — life firsts photo journal (`#moments`) — 17 numbered moments
7. Full 36-month Timeline

### My Care (`/mom-care`)

1. PageHero — serene self-care
2. MomCareTips (existing) — timeline + topic tabs

### Essentials (`/essentials`)

1. PageHero — premium flat-lay
2. Hub cards — Shopping, Travel

### Community (`/community/:tab`)

1. PageHero — diverse mothers
2. Tab bar + feeds (existing)

---

## Account & auth (not in primary nav)

Reachable via Premium CTAs, account links, and direct URLs. Not in top nav or mobile bottom bar.

| Label | Route | Purpose |
|-------|-------|---------|
| Sign in | `/login` | Password login; unverified → `/verify-email` |
| Create account | `/signup` | Email + password; sends OTP |
| Verify email | `/verify-email` | 6-digit OTP entry + resend (post-signup) |
| Account | `/account` | Profile, membership, promo codes (`RequireAuth`) |
| Admin | `/admin` | Staff/admin center |

See [`docs/auth-membership-admin.md`](auth-membership-admin.md) for OTP flow and Supabase dashboard setup.

---

## Mobile bottom nav

Same 5 items as desktop header. Sound toggle remains. Progress, Sources, Premium in footer only.

---

## `navSectionFromPath` mapping

| Path prefix | Section |
|-------------|---------|
| `/`, `/month/` | `today` (home dashboard + month detail) |
| `/baby`, `/vaccination` | `baby` |
| `/mom-care` | `momCare` |
| `/essentials`, `/shopping`, `/travel` | `essentials` |
| `/community` | `community` |
| `/progress` | `progress` (footer only) |
| `/sources` | `sources` (footer only) |
| `/premium` | `premium` (footer only) |

---

*Last updated: June 2026*
