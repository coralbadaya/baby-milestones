# Information Architecture

> Journey-ordered navigation for affluent new mothers. **Sequence over surface.** The phone is the product: Today is the front door, and every parent job is one tap from Today or the bottom bar.

---

## Top bar (desktop) and bottom bar (phone)

Six journey links in one 56px row, plus account and Plus. A section that holds more than one page opens a square menu, and each row uses that page's name. On a phone the five jobs are Baby · Care · Book · Community · Guides; Today is the logo.

| Label | Route | Section key | Purpose |
|-------|-------|-------------|---------|
| **Today** | `/` | `today` | Personalized dashboard — focus cards, collapsed timeline |
| **My Baby** | `/baby` | `baby` | Full milestone timeline, vaccination entry |
| **My Care** | `/mom-care` | `momCare` | Postpartum timeline + self-care topics |
| **Essentials** | `/essentials` | `essentials` | Shopping + travel hub |
| **Community** | `/community/feed` | `community` | Feed, recipes, tips |
| **Guides** | `/guides` | `guides` | Editorial articles. Job tags (Milestones, Vaccines, Food, Play, Care, Mom, Memories, Compare). Month-by-month guides sit under Milestones, not on All. `?tag=` is shareable. |

**Named pages inside a section** (desktop menu, same words as the page):

| Section | Pages |
|---------|--------|
| Today | Today, Progress |
| My Baby | My Baby, Vaccination tracker, Baby book |
| Essentials | Essentials, Shopping, Travel |
| Community | Mom Feed, Baby Recipes, Parenting Tips |

**Bar end (desktop):** Sign in / Account + **Plus** square button — not in `PRIMARY_NAV` data.

**Mobile bottom bar (5 items):** Baby · Care · **Book** (center circle) · Community · Guides. Today is the logo. Essentials stays in the desktop top bar + footer.

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
- `/community/:tab` — community sub-tabs (`feed`, `recipes`, `tips`, `create`)
- `/community/feed/:slug` — memory permalink (highlights that post)
- `/community/recipes/:id` — recipe permalink (opens the recipe modal)
- `/community/tips/:id` — tip permalink (expands that tip)

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

1. Purpose line — what Yarn Trails is, in one sentence
2. One-tap jobs — My Baby, Baby book, My Care, Vaccination, Guides, Plus
3. PageHero — editorial mother+baby, personalized greeting
4. Birth date / baby name (onboarding if missing)
5. This week's focus — 1–3 cards (milestone, mom care, editorial)
6. Current month preview
7. Month timeline carousel — current month ±2, link to full timeline
8. Assistant panel (existing)

### My Baby (`/baby`)

1. PageHero — developmental moment
2. Quick links — current month, vaccination; baby book band (stories / 3D book — album & voice live in book tabs)
3. **CurrentMonthPanel** — checkable milestone preview for current month
4. **DIYPreviewStrip** — DIY carousel (easiest first, mixed categories)
5. **CarePreviewTeaser** — bath/massage guides linking to `#care`
6. **FirstsCarousel** — life firsts (`#moments`) — swipeable 17 moments + capture
7. Monthly Milestones — 6 months at a time (4 recent + current + next), paginated Earlier / Later through all 36

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

Reachable from the top bar and from direct URLs. They are not in the mobile bottom bar.

| Label | Route | Purpose |
|-------|-------|---------|
| Sign in | `/login` | Email + password: sign in or create account |
| Create account | `/signup` | Same form as `/login` |
| Verify email | `/verify-email` | Optional 6-digit code; skippable when signed in |
| Account | `/account` | Parent hub: snapshot KPIs, app shortcuts, profile, baby, membership, data (`RequireAuth`) |
| Feedback | `/feedback` | Product feedback — topic cards + optional note; footer + Account |
| Admin | `/admin` | Staff/admin center |

See [`docs/auth-membership-admin.md`](auth-membership-admin.md) for the shared continue form and optional verification.

---

## Mobile bottom nav

Baby · Care · **Book** (raised twilight circle) · Community · Guides. Today is the logo, not a tab. Essentials, Progress, Vaccination tracker, Shopping, and Travel stay in the desktop section menus and in the footer. Sources and Premium stay in the footer.

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

*Last updated: September 2026*
