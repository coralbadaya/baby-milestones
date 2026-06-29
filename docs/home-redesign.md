# Home Redesign — Today Dashboard

> `/` is a calm **concierge**, not a 36-tile wall.

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
| Milestone | Current month from `milestones.js` | `/month/:n` |
| For you | Mom care tip or postpartum note | `/mom-care` |
| Editorial | Static premium teaser (travel/shopping) | `/essentials` or `/premium` |

Premium editorial card may show `<PremiumGate>` teaser.

### 3. Continue your journey (`Timeline` collapsed)

- Props: `collapsed`, `rangeStart`, `rangeEnd` — show current month ±2 only
- Footer link: **View full timeline →** `/baby`

### 4. Assistant panel

Unchanged — floating on home.

---

## Empty state (no birth date)

Hero subtitle invites setting birth date. Focus cards show generic welcome copy. Timeline hidden or dimmed with CTA.

---

## CSS

- `.home-today` — page wrapper
- `.today-focus` — 3-column grid (1 col mobile)
- `.today-focus-card` — `.card-accent-top`, minimal border
- `.timeline-collapsed-footer` — centered link to `/baby`

---

## Shipped files

- `src/pages/Home.jsx`
- `src/components/TodayFocus.jsx`
- `src/components/Timeline.jsx` — `collapsed` prop
- `src/components/PageHero.jsx`

---

*Last updated: June 2026*
