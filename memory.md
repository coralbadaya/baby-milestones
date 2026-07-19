# Yarn Trails — Project Memory

> Living reference for humans and AI agents. **Principles:** [`docs/doctrine-summary.md`](docs/doctrine-summary.md) · **Full constitution:** [`docs/doctrine.md`](docs/doctrine.md)

Last updated: July 2026

---

## Product snapshot

| | |
|---|---|
| **Name** | Yarn Trails — *The art of early motherhood* |
| **Audience** | Affluent new mothers, tier‑1 cities; babies 0–36 months |
| **Positioning** | Quiet-luxury editorial + **AI baby book** (Basic free / Plus magic) |
| **Stack** | React 19 · Vite 8 · Vitest · Supabase · Vercel |

### Journey nav (primary)

Today · My Baby · My Care · Essentials · Community · Guides (desktop top nav; Guides not in mobile bottom bar)

Footer-only: Progress · Sources · Premium (also header CTA)

### Mental model

```
Today (what matters now)
  └── My Baby (milestones, life firsts, vaccination)
  └── My Care (postpartum timeline + self-care)
  └── Essentials (shopping + travel hub)
  └── Community (feed, recipes, tips)
```

Routes source of truth: `src/routes.js` · IA spec: `docs/information-architecture.md`

---

## Conventions (always apply)

| Rule | Detail |
|------|--------|
| Warning cards | Label **Watch For** — never "Take Care" |
| Baby health | Educational only; emergencies → pediatrician / local emergency number |
| Mom / postpartum | Educational only; emergencies → obstetrician / local emergency number |
| Assistant | Every response includes `MEDICAL_DISCLAIMER`; never diagnose |
| Premium | Invitation tone; **Basic** = free tracking; **Plus** = stories, flip-book, editorial |
| UI dropdowns | Use `src/components/Select.jsx` — no raw `<select>` |
| Brand copy | `src/constants/brand.js` — user-facing name is **Yarn Trails** |
| Legacy CSS names | Repo/CSS may still say `coral` — do not rename casually |

---

## localStorage keys

| Key | Purpose |
|-----|---------|
| `babyBirthDate` | Baby DOB (ISO date string) |
| `babyName` | Optional baby display name for stories & baby book copy |
| `babyMilestoneChecks` | `{ [milestoneId]: boolean }` |
| `babyVaccineScheduleType` | `india` \| `cdc` \| custom default |
| `babyVaccineRecords` | Vaccination completion records |
| `babyCustomVaccines` | User-added vaccines |
| `babyVaccineReminderDays` | Reminder offset (default 7) |
| `yarntrailsFirstMoments` | Life firsts media + notes (`useFirstMoments`) |
| `yarntrailsPremium` | Anonymous premium preview (`PREMIUM_STORAGE_KEY`) |
| `yarntrailsAlbumPhotos` | Monthly album photos (`useMonthlyAlbum`) |
| `yarntrailsVoiceNotes` | Voice notes (`useVoiceNotes`) |
| `yarntrails-cookie-consent` | Cookie consent preference |
| `yarntrails-install-prompt-dismissed` | PWA install prompt dismiss |
| `coral_memories` | Community memories |
| `coral_saved_recipes` | Saved recipe IDs |
| `coral_helpful_tips` | Helpful community tips |
| `shopRangeFrom` / `shopRangeTo` | Shopping checklist month range |

Signed-in users: Supabase `memberships` is source of truth for premium (not localStorage).

---

## Feature file map

### Core app

| Area | Key files |
|------|-----------|
| Shell | `src/App.jsx`, `src/components/Header.jsx`, `src/components/Footer.jsx` |
| Routes | `src/routes.js` |
| Brand / SEO | `src/constants/brand.js`, `src/utils/pageMeta.js`, `src/components/StructuredData.jsx` |
| Styles | `src/styles/global.css`, `src/styles/editorial-system.css` |

### Today & My Baby

| Area | Key files |
|------|-----------|
| Home | `src/pages/Home.jsx`, `docs/home-redesign.md` |
| Baby hub | `src/pages/Baby.jsx` |
| Month detail | `src/pages/MonthDetail.jsx`, `src/data/milestones.js` |
| Timeline | `src/components/Timeline.jsx` (carousel on Home, grid on Baby) |
| Life firsts | `src/data/firsts.js`, `src/hooks/useFirstMoments.js`, `src/components/firsts/*`, `docs/first-moments-ui-design.md` |
| DIY | `src/data/diyActivities.js`, `src/data/diyImages.js`, `docs/diy-images-admin.md` |

### My Care

| Area | Key files |
|------|-----------|
| Page | `src/pages/MomCare.jsx`, `src/components/MomCareTips.jsx` |
| Postpartum timeline | `src/components/MomMilestonesPanel.jsx`, `src/data/momMilestones.js`, `src/utils/momMilestones.js` |
| Self-care topics | `src/data/momCareTips.js` — Timeline + 16 topic tabs |

Mom Care topic IDs: `timeline`, `mentalHealth`, `pelvicFloor`, `cSection`, `sleep`, `hairLoss`, `posture`, `nippleCare`, `supplements`, `boneDensity`, `stretchMarks`, `hydration`, `nutrition`, `exercise`, `recovery`, `massage`, `walking`

### Essentials & health

| Area | Key files |
|------|-----------|
| Hub | `src/pages/Essentials.jsx` |
| Shopping | `src/pages/Shopping.jsx`, `src/components/ShoppingChecklist.jsx` |
| Travel | `src/pages/Travel.jsx`, `src/data/travelTips.js` |
| Vaccination | `src/pages/Vaccination.jsx` |

Travel types: `car`, `air`, `train`, `dayOuting`, `hotel` — parsed in `assistantMatch.js` and Travel page tabs.

### Community & content

| Area | Key files |
|------|-----------|
| Community | `src/pages/Community.jsx` — tabs: `feed`, `recipes`, `tips`, `create` |
| Guides | `src/pages/Guides.jsx`, `src/pages/GuideArticle.jsx`, `src/data/guides.js` |
| Static / legal | `src/pages/StaticPage.jsx`, `src/data/legalContent.js` |
| FAQ | `src/pages/Faq.jsx` |
| Contact | `src/pages/Contact.jsx` — uses `submit_contact_form` RPC |

### Auth, membership, admin

| Area | Key files |
|------|-----------|
| Auth | `src/context/AuthContext.jsx`, `src/pages/Login.jsx`, `SignUp.jsx`, `VerifyEmail.jsx`, `Account.jsx` |
| Guards | `src/components/auth/RequireAuth.jsx`, `RequireRole.jsx`, `OtpVerifyForm.jsx` |
| Premium / Plus | `src/pages/Premium.jsx`, `PremiumGate`, `src/constants/premium.js`, `src/utils/entitlements.js` |
| AI baby book | `src/components/book/*`, `src/hooks/useMonthlyAlbum.js`, `useBabyStories.js`, `useVoiceNotes.js` |
| Stripe | `api/checkout.js`, `api/stripe-webhook.js`, `src/utils/stripeCheckout.js` |
| Admin | `src/pages/admin/*`, `docs/auth-membership-admin.md`, `docs/admin-portal-design.md` |

Admin routes: `/admin`, `/admin/inbox`, `/admin/users`, `/admin/promos`, `/admin/diy`, `/admin/newsletter`

Roles: `user` · `support` (inbox) · `admin` (full)

### Shared UI

| Component | Path |
|-----------|------|
| PageHero | `src/components/PageHero.jsx` |
| Select | `src/components/Select.jsx` |
| Icon (Phosphor) | `src/components/Icon.jsx`, `src/utils/phosphorIconMap.js` |
| Logo | `src/components/CoralLogo.jsx` (legacy component name) |
| Assistant | `src/components/AssistantPanel.jsx` |

---

## Parenting Assistant — knowledge base

Implementation: `src/utils/assistantMatch.js` · `src/data/assistantResponses.js` · `src/data/growthData.js`

Shown on: **Today** (`/`) and **Month detail** (`/month/:n`)

### Month resolution (order)

1. Parsed in query: `month 4`, `4 month`, `4mo`
2. Else `selectedMonth` (month detail page)
3. Else `currentMonth` from `babyBirthDate`
4. Clamp 1–36

### Gender in query

- `girl`, `baby girl`, `daughter` → girls WHO ranges
- `boy`, `baby boy`, `son` → boys WHO ranges

### Match priority (high → low)

1. choking / obstruction
2. fever
3. feeding (not spit-up)
4. head circumference
5. weight / height / growth chart
6. sleep regression
7. sleep schedule / night waking
8. safe sleep
9. solids
10. reflux / spit up
11. teething, colic, constipation, skin, vaccines, jaundice, eyes, cold/cough
12. crawling, walking, sitting
13. hearing, language
14. tummy time, growth spurt
15. bath, travel, baby proofing, hiccups, pacifier, separation, bonding, play
16. development check
17. crying / fussy
18. month-aware fallback

### Topics (30+)

#### Growth

| Topic | Keywords |
|-------|----------|
| weightHeight | weight, ideal weight, kg, pounds, percentile, growth chart, height, length |
| headCircumference | head size, fontanelle, soft spot |

Data: `growthData.js` (WHO 15th–85th approx.)

#### Sleep

| Topic | Keywords |
|-------|----------|
| sleepRegression | sleep regression, 4 month sleep |
| sleepSchedule | how much sleep, nap schedule, awake window, overtired |
| nightWaking | night feed, sleeping through, waking at night |
| safeSleep | safe sleep, sids, cosleep, crib |

#### Feeding & digestion

| Topic | Keywords |
|-------|----------|
| feedingIssues | feed, bottle, breast, latch, refuse |
| solids | solids, weaning, puree |
| refluxSpitUp | spit up, reflux, projectile |

#### Illness

| Topic | Keywords |
|-------|----------|
| fever | fever, temperature, thermometer |
| coldCough | cold, cough, congestion |
| jaundice | jaundice, yellow skin |
| eyeCare | sticky eye, tear duct, vision |

#### Motor & language

| Topic | Keywords |
|-------|----------|
| crawling, walking, sittingUp, language, hearing, tummyTime, developmentCheck |

#### Everyday

| Topic | Keywords |
|-------|----------|
| teething, colic, constipation, skinCare, immunizations |
| hiccups, pacifier, babyProofing, playToys |
| separationAnxiety, bonding, bathTime, travel |
| choking, growthSpurt, monthCrying (fallback) |

### Assistant test queries

| Query | Expected |
|-------|----------|
| ideal weight for a 4 month old baby girl | weightHeight, month 4 |
| how much should my 6 month old weigh | weightHeight |
| how many hours should my baby sleep | sleepSchedule |
| when will my baby crawl | crawling |
| baby has fever | fever |
| 3 month old spitting up | refluxSpitUp |
| when will baby say mama | language |
| baby not responding to sounds | hearing |
| is it ok to use pacifier | pacifier |
| flying with my 4 month old baby | travel (air), month 4 |
| road trip with 9 month old | travel (car), month 9 |

### Extending the assistant

When adding a topic:

1. Add content in `src/data/assistantResponses.js`
2. Wire matching in `src/utils/assistantMatch.js`
3. Add tests in `src/utils/assistantMatch.test.js`
4. Update **this file** (topic table + priority if needed)
5. Run `npm test`

Rules (from `.cursor/rules/claude.mdc`):

- Max ~6 paragraphs in body
- Reference AAP/WHO/CDC-style guidance; never diagnose
- Append `MEDICAL_DISCLAIMER` via `withDisclaimer()`

---

## Life firsts (17 moments)

Carousel on **Today**; full journal on **My Baby** (`/baby#moments`).

IDs: `birth`, `homecoming`, `first-smile`, `first-laugh`, `crawling`, `clapping`, `sitting-up`, `standing`, `first-tooth`, `bath-time`, `first-birthday`, `first-words`, `rolling-over`, `waving-bye`, `first-walk`, `first-food`, `first-haircut`

Storage: `yarntrailsFirstMoments` (localStorage data URLs, 2 MB limit). Supabase sync planned.

---

## Commands

```bash
npm run dev              # local dev (http://localhost:5173)
npm test                 # unit tests
npm run test:it          # Supabase integration (needs migration + seed)
npm run verify:data      # milestone + mom-milestone integrity
npm run build            # production build
npm run seed:test-users  # test admin/user accounts
npm run generate:brand   # favicon, PWA icons from logo SVG
npm run generate:sitemap # public/sitemap.xml
```

Quality gate before merge: `npm test` · `npm run verify:data` (if data changed) · `npm run build`

---

## Doc index (quick)

| Need | Doc |
|------|-----|
| Principles (1 page) | `docs/doctrine-summary.md` |
| Constitution | `docs/doctrine.md` |
| Design system | `docs/design-system-2026.md` |
| Nav / IA | `docs/information-architecture.md` |
| Dev workflow + creds | `docs/development-workflow.md` |
| Auth / admin | `docs/auth-membership-admin.md` |
| Agent UI rules | `.cursor/rules/coral.mdc` |
| Assistant rules | `.cursor/rules/claude.mdc` |
| Full doc map | `.cursor/rules/coral.mdc` design doc table |

---

## Changelog (memory)

| Date | Change |
|------|--------|
| Jul 2026 | Expanded memory: project snapshot, file map, localStorage, life firsts, updated nav/IA |
| Earlier | Parenting assistant KB only (topics, priority, test queries) |

When you change routing, storage keys, assistant topics, or major file locations — **update this file in the same session**.
