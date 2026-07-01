# Home Redesign — Today Dashboard

> `/` is a calm **concierge**, not a 36-tile wall.

**Visual system (phased):** [`docs/editorial-page-system.md`](editorial-page-system.md) — DIY editorial cards, section rhythm, performance profiles. Home is the reference page; pattern rolls out site-wide.

---

## Layout (top to bottom)

### 1. PageHero (`imageKey: home`)

- **Eyebrow:** Time-aware greeting — "Good morning" / "Good evening"
- **Title:** Personalized age line when birth date set — e.g. *"Your baby is 4 months old"*
- **Subtitle:** One calm line — *"Here's what matters this week."*
- **Children slot:** Compact birth-date form if no date; optional baby name (future)

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

- Uses `DIYEditorialCard` — split layout on Today (2 cards), grid on My Baby (4 cards)
- Photos from `src/data/diyImages.js` keyed by `activity.illustration`
- YouTube button on card face; sand section band via `PageSection`

### 5. Editorial band (`EditorialBand.jsx`)

- Ink band with brand tagline — **Home only** (one per page max)

### 6. Continue your journey (`Timeline` carousel)

- Props: `collapsed`, `variant="carousel"`, `rangeStart`, `rangeEnd` — show current month ±2 only
- Horizontal carousel: prev/next arrows, dot indicators, auto-centers on current month
- Swipe on mobile; keyboard left/right when track is focused
- Footer link: **View full timeline →** `/baby`

### 4. Assistant panel

Unchanged — floating on home.

---

## Empty state (no birth date)

Hero subtitle invites setting birth date. Focus cards show generic welcome copy. **Month 1 sample** milestones + DIY preview shown via `CurrentMonthPanel` / `DIYPreviewStrip`. Collapsed timeline hidden until birth date set.

---

## Visual rhythm (editorial system v2)

Home uses `PageSection` surface bands — see [`docs/editorial-page-system.md`](editorial-page-system.md):

| Section | Surface | Component |
|---------|---------|-----------|
| Focus | ivory | `TodayFocus` + image headers |
| Milestones | white | `CurrentMonthPanel` |
| DIY | sand | `DIYPreviewStrip` |
| Brand | ink | `EditorialBand` |
| Timeline | ivory | carousel `Timeline` (`variant="carousel"`) |

Hero: `PageHero` with `layout="split"` on desktop.

---

## CSS

- `.home-today` — page wrapper
- `.today-focus` — 3-column grid (1 col mobile)
- `.today-focus-card` — `.card-accent-top`, minimal border
- `.timeline-collapsed-footer` — centered link to `/baby`
- `.timeline-carousel` — horizontal month carousel (arrows, dots, scroll-snap)

---

## Shipped files

- `src/pages/Home.jsx`
- `src/components/TodayFocus.jsx`
- `src/components/CurrentMonthPanel.jsx`
- `src/components/DIYPreviewStrip.jsx`
- `src/components/Timeline.jsx` — `collapsed` prop, `variant="carousel"` for Home
- `src/components/DIYEditorialCard.jsx`
- `src/components/PageSection.jsx`
- `src/components/SectionHeader.jsx`
- `src/components/EditorialBand.jsx`
- `src/data/diyImages.js`, `src/data/focusImages.js`
- `src/styles/editorial-system.css`

---

*Last updated: June 2026*
