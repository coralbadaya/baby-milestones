# Home Redesign — Today Dashboard

> `/` is a calm **concierge**, not a 36-tile wall.

**Visual system (phased):** [`docs/editorial-page-system.md`](editorial-page-system.md) — DIY editorial cards, section rhythm, performance profiles. Home is the reference page; pattern rolls out site-wide.

---

## Layout (top to bottom)

### 1. PageHero (`imageKey: home`)

**Logged-in or birth date set (Today mode):**

- **Eyebrow:** Time-aware greeting — "Good morning" / "Good evening"
- **Title:** Personalized age line when birth date set — e.g. *"Your baby is 4 months old"*
- **Subtitle:** One calm line — *"Here's what matters this week."*
- **Children slot:** Compact birth-date form

**Welcome mode** (`!user && !birthDate` — first visit, logged out):

- **Component:** `WelcomeHero.jsx` — dedicated layout (photo band + ivory copy), not split `PageHero`
- **Eyebrow:** "Yarn Trails"
- **Title (H1):** *"See this month with your baby."* (`HOMEPAGE_COPY.h1`). The brand tagline stays on the logo and in Organization schema, not as the homepage H1.
- **Subtitle:** *"Milestones, vaccines, and memories in one place. Free to start. A range, not a race."*
- **Primary action:** birth-date field. Hint: *"Opens this month on this phone. Free. No account yet."* Setting a date leaves welcome mode. Quiet link under it: **Create a free account to keep it** → `/signup`. `TrustStrip` with privacy note. The hero does not start a Plus trial.
- **Welcome intro:** compact ivory `PageSection` (narrow) under the hero — same copy as prerender (`homepageCopy.js`): intro + H2s (what it is, who it is for, what you can track) + links to Guides, My Baby, Mom Care, About. Logged-in Today does **not** show this block.
- **Visual:** `.home-today--welcome` ivory canvas; mobile stacked image + copy; desktop side-by-side grid (~460px min-height); subtitle `max-width: 46ch`
- **Funnel:** Single `ConversionBand` in `EditorialBand` only (no mid-page bands in welcome mode); sample banner on month preview
- **SEO:** `usePageMeta` with homepage title/description from `SEO_DEFAULT_TITLE` / `SEO_DEFAULT_DESCRIPTION` (`Baby milestones and vaccines | Yarn Trails`). Visible H1 and prerender H1 are the same sentence. Prerender injects the welcome body into `dist/index.html`. Locale signals are `en-IN` / `en_IN`; the free offer in schema is INR. Operating system in schema is Web until store apps ship.

**Logged-out conversion bands** (`!user`): `ConversionBand` after focus and inside `EditorialBand` (ink band). See `ConversionBand.jsx`, `TrustStrip.jsx`. Home does not show a DIY strip.

### 1b. What Yarn Trails does (`HomeJobs.jsx`)

Same on welcome and Today, directly under the hero. Purpose sentence from `HOMEPAGE_COPY.purpose`. Six taps, 56px minimum, two columns on a phone:

My Baby · Baby book · My Care · Vaccination · Guides · Plus

Labels match the crawler links in `homepageBodyHtml()`.

### 2. This week's focus (`TodayFocus.jsx`)

Three cards max, age-aware:

| Card | Source | Link |
|------|--------|------|
| Milestones | Current month progress from `milestones.js` | `/month/:n` |
| For you | Mom care tip or postpartum note | `/mom-care` |
| DIY (when birth date set) | DIY activities for current month | `/month/:n#diy` |
| Editorial (no birth date) | Travel/shopping teaser | `/essentials` |

### 3. Current month preview (`CurrentMonthPanel.jsx`)

- Shown on **Today** (compact, 3 items) and **My Baby** (full, 4 items)
- Inline checkboxes — same `checkedItems` / `toggleCheck` as month detail
- **Empty state:** Month 1 sample with banner to set birth date

### 4. DIY preview strip (`DIYPreviewStrip.jsx`)

- **Not on Home.** Lives on **My Baby** only (4 cards). **&lt;640px:** `SmartCarousel` with stack editorial cards; **≥640px:** 2-column grid.
- Photos via `getDiyImage({ activityId, illustration, category }, overrides, globalDefault)` — per-activity override, else site-wide default, else cream lockup (see [`docs/diy-images-admin.md`](diy-images-admin.md))
- **Open guide** opens in-app modal; video access inside modal only (no card-face YouTube button); sand section band via `PageSection`

### 5. Editorial band (`EditorialBand.jsx`)

- Ink band with brand tagline — **Home only** (one per page max)
- Optional `children` slot for logged-out `ConversionBand` CTAs

### 6. Continue your journey (`Timeline` carousel)

- Props: `collapsed`, `variant="carousel"`, `rangeStart`, `rangeEnd` — show current month ±2 only
- Horizontal carousel: prev/next arrows, dot indicators, auto-centers on current month
- Swipe on mobile; keyboard left/right when track is focused
- Link in section header: **View full timeline →** `/baby`

### 7. Life firsts

- **Not on Home** — lives on **My Baby** only (`FirstsCarousel`, `#moments`). Today links to the baby book and full timeline, not firsts capture.
- Spec: [`docs/first-moments-ui-design.md`](first-moments-ui-design.md)

### Assistant panel

Unchanged — floating on home.

---

## Empty state (no birth date)

**Welcome mode** (logged out): concrete hero + signup CTAs (see above). Focus cards show generic welcome copy. **Month 1 sample** milestones + DIY preview shown via `CurrentMonthPanel` / `DIYPreviewStrip`. Collapsed timeline hidden until birth date set.

**Logged-in, no birth date:** personalized greeting hero with birth-date form only (no welcome CTAs).

---

## Visual rhythm (editorial system v2)

Home uses `PageSection` surface bands — see [`docs/editorial-page-system.md`](editorial-page-system.md):

| Section | Surface | Component |
|---------|---------|-----------|
| Focus | ivory | `TodayFocus` + image headers |
| Milestones | white | `CurrentMonthPanel` |
| DIY | sand (`#EFE3D4`) | `DIYPreviewStrip` — activity-specific photos, no gray wash |
| Brand | ink | `EditorialBand` |
| Timeline | ivory | carousel `Timeline` (`variant="carousel"`) |

Hero: `PageHero` with `layout="split"` on desktop.

### Scroll-synced surface (Home only)

`.home-today` carries a single `--scroll-surface` background synced to the band at **viewport center** (not IntersectionObserver ratio — avoids tiny bands winning). Driven by `useScrollSurface` on `[data-scroll-surface]` bands; **editorial ink quote band is excluded** and keeps its own fill. Section bands inside Home are **transparent** so the parent color tracks the active band (ivory ↔ white ↔ sand). Hero zone defaults to cream (`--surface-primary`) until a band dominates. Optional `.page-section--blend` feathers band edges (32px). Section fade-in is disabled on Home to avoid flicker over the live background.

---

## CSS

- `.home-today` — page wrapper; scroll-synced `--scroll-surface` background
- `.page-section--blend` — edge feather on Home bands
- `.today-focus` — 3-column grid (1 col mobile)
- `.today-focus-card` — `.card-accent-top`, minimal border
- `.timeline-collapsed-footer` — centered link to `/baby`
- `.firsts-carousel` — life firsts horizontal carousel
- `.firsts-journal` — full numbered journal on My Baby

---

## Shipped files

- `src/pages/Home.jsx`
- `src/hooks/useScrollSurface.js`
- `src/utils/scrollSurfaces.js`
- `src/components/TodayFocus.jsx`
- `src/components/CurrentMonthPanel.jsx`
- `src/components/DIYPreviewStrip.jsx`
- `src/components/Timeline.jsx` — `collapsed` prop, `variant="carousel"` for Home
- `src/components/DIYEditorialCard.jsx`
- `src/components/PageSection.jsx`
- `src/components/SectionHeader.jsx`
- `src/components/EditorialBand.jsx`
- `src/components/ConversionBand.jsx`
- `src/components/TrustStrip.jsx`
- `src/data/diyImages.js`, `src/data/focusImages.js`
- `src/styles/editorial-system.css`
- `src/components/firsts/FirstsCarousel.jsx`, `FirstsJournal.jsx`, `FirstMomentSlot.jsx`
- `src/data/firsts.js`, `src/hooks/useFirstMoments.js`

---

*Last updated: July 2026*
