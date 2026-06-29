# Information Architecture

> Journey-ordered navigation for affluent new mothers. **Sequence over surface.**

---

## Top navigation (5 items)

| Label | Route | Section key | Purpose |
|-------|-------|-------------|---------|
| **Today** | `/` | `today` | Personalized dashboard — focus cards, collapsed timeline |
| **My Baby** | `/baby` | `baby` | Full milestone timeline, vaccination entry |
| **My Care** | `/mom-care` | `momCare` | Postpartum timeline + self-care topics |
| **Essentials** | `/essentials` | `essentials` | Shopping + travel hub |
| **Community** | `/community/feed` | `community` | Feed, recipes, tips |

### Demoted to footer

| Label | Route | Reason |
|-------|-------|--------|
| Progress | `/progress` | Secondary analytics; profile-adjacent |
| Sources | `/sources` | Trust footnote, not primary journey |
| Premium | `/premium` | Upgrade CTA in footer + gates |

### Deep links (unchanged)

- `/month/:n` — month detail (nav highlights **My Baby**)
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
4. Collapsed timeline — current month ±2, link to full timeline
5. Assistant panel (existing)

### My Baby (`/baby`)

1. PageHero — developmental moment
2. Quick links — current month, vaccination
3. Full 36-month Timeline

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
