# Yarn Trails — Claude / Cursor project guide

Baby milestone tracker and mom care (React + Vite). Use this file for **fast agent orientation**; deeper context lives in linked docs.

---

## Read first

| Doc | When |
|-----|------|
| [`docs/doctrine-summary.md`](docs/doctrine-summary.md) | Principles, non‑negotiables (1 page) |
| [`memory.md`](memory.md) | File map, localStorage keys, assistant KB, routes |
| [`.cursor/rules/coral.mdc`](.cursor/rules/coral.mdc) | UI workflow + full design doc index |

---

## Stack

- **Frontend:** React 19, Vite 8, Vitest, React Router 7
- **Backend:** Supabase (auth, Postgres, storage)
- **Hosting:** Vercel
- **Brand:** Yarn Trails — `src/constants/brand.js`

---

## Commands

```bash
npm run dev              # local dev
npm test                 # unit tests (excludes integration)
npm run test:it          # Supabase integration (migration + seed required)
npm run verify:data      # milestone + mom-milestone integrity
npm run build            # production build
npm run seed:test-users  # test admin/user accounts
```

Before merge: `npm test` · `npm run verify:data` (if data changed) · `npm run build`

---

## Routes (summary)

Primary nav: Today · My Baby · My Care · Essentials · Community · Guides

Source of truth: `src/routes.js` · Spec: `docs/information-architecture.md`

Auth: `/login` · `/signup` · `/verify-email` · `/account`  
Admin: `/admin` · `/admin/inbox` · `/admin/users` · `/admin/promos` · `/admin/diy` · `/admin/newsletter`

---

## localStorage (client state)

| Key | Purpose |
|-----|---------|
| `babyBirthDate` | Baby DOB |
| `babyMilestoneChecks` | Milestone checkboxes |
| `yarntrailsFirstMoments` | Life firsts media |
| `yarntrailsPremium` | Anonymous premium preview |

Full list: [`memory.md`](memory.md#localstorage-keys)

---

## Feature map

### Today & My Baby

| File | Role |
|------|------|
| `src/pages/Home.jsx` | Today dashboard |
| `src/pages/Baby.jsx` | My Baby hub + life firsts journal |
| `src/pages/MonthDetail.jsx` | Month detail |
| `src/components/Timeline.jsx` | Carousel (Home) / grid (Baby) |
| `src/data/milestones.js` | 36-month milestone data |
| `src/data/firsts.js` | 17 life-first moments |
| `src/hooks/useFirstMoments.js` | Life firsts storage |

### My Care

| File | Role |
|------|------|
| `src/pages/MomCare.jsx` | Page wrapper |
| `src/components/MomCareTips.jsx` | Timeline + 16 topic tabs |
| `src/components/MomMilestonesPanel.jsx` | Postpartum timeline |
| `src/data/momMilestones.js` | Mom milestone periods |
| `src/data/momCareTips.js` | Self-care content |

### Essentials & health

| File | Role |
|------|------|
| `src/pages/Essentials.jsx` | Shopping + travel hub |
| `src/pages/Shopping.jsx` | Checklist |
| `src/pages/Travel.jsx` | Travel tips |
| `src/pages/Vaccination.jsx` | Vaccine tracker |
| `src/data/travelTips.js` | Travel tips by type |

### Parenting Assistant

| File | Role |
|------|------|
| `src/utils/assistantMatch.js` | Keyword routing + month context |
| `src/data/assistantResponses.js` | Static guides (30+ topics) |
| `src/data/growthData.js` | WHO weight/height, sleep by month |
| `src/components/AssistantPanel.jsx` | UI on Home + Month Detail |

**Extend KB:** update `memory.md`, `assistantResponses.js`, `assistantMatch.js`, `assistantMatch.test.js` — see [`.cursor/rules/claude.mdc`](.cursor/rules/claude.mdc)

### Auth & membership

| File | Role |
|------|------|
| `src/context/AuthContext.jsx` | Session, profile, membership, OTP, promo redeem |
| `src/pages/Login.jsx`, `SignUp.jsx`, `VerifyEmail.jsx` | Auth flow |
| `src/components/auth/*` | `RequireAuth`, `RequireRole`, `OtpVerifyForm` |
| `src/components/PremiumGate.jsx` | Premium content gating |
| `docs/auth-membership-admin.md` | Supabase setup, admin roles, test users |

### Shared UI

| File | Role |
|------|------|
| `src/components/PageHero.jsx` | Editorial heroes |
| `src/components/Select.jsx` | All dropdowns |
| `src/components/Footer.jsx` | Global footer |
| `src/components/CoralLogo.jsx` | Yarn Trails mark + lockup |
| `src/components/Icon.jsx` | Phosphor icons |

---

## Conventions

- UI label **Watch For** (not "Take Care") for warning cards
- Assistant: educational only; emergencies → pediatrician / local emergency number
- Mom milestones: educational only; postpartum emergencies → obstetrician / local emergency number
- Contact form: `submit_contact_form` RPC (not direct table insert)
- UI changes: read design docs first, update docs after — see `.cursor/rules/coral.mdc`
- Data changes: `npm run verify:data` + `npm test`

---

## When to update `memory.md`

Update in the same session when you change:

- Primary routes or nav labels
- localStorage keys
- Assistant topics or match priority
- Major file locations or feature ownership
- Admin routes or roles

---

*Yarn Trails · See [`memory.md`](memory.md) for full living reference*
