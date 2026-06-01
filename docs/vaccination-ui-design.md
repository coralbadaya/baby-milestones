# Vaccination Tracker — UI & Implementation Plan

> Multi-schedule vaccination tracking for baby timeline use-cases.  
> Scope includes:
> 1) Read-only schedules + status tracking (India/CDC switch)  
> 2) Custom schedule CRUD  
> 3) Polish (reminders/export/print)

## Route

`/vaccination`

- Desktop: add nav item in `Header.jsx`
- Mobile: add nav item in `mobile-nav`
- Footer: add link in `Footer.jsx`

## Goals

- Track vaccine status month-by-month using existing baby DOB logic
- Support three schedule modes:
  - India IAP/Universal Immunization
  - CDC (US)
  - Custom editable schedule
- Keep interactions low-friction for tired, one-handed use
- Persist everything in localStorage (no backend dependency)

---

## Phase 1 — Read-only schedules + status tracking

### Data files

Create:

- `src/data/vaccines/indiaIap.js`
- `src/data/vaccines/cdcUs.js`
- `src/data/vaccines/index.js`

### Data schema (schedule item)

```js
{
  id: 'dtap-6w-dose1',        // stable unique key
  name: 'DTaP',
  dueMonth: 1.5,              // month since birth
  minMonth: 1.5,              // optional due window start
  maxMonth: 2,                // optional due window end
  doseNumber: 1,              // optional
  totalDoses: 3,              // optional
  optional: false,            // optional vaccine indicator
  notes: 'As per selected schedule',
}
```

### App state + storage

Use route-level/global state in `App.jsx` (like milestones/shopping):

- `vaccineScheduleType`: `'india' | 'cdc' | 'custom'`
- `vaccineRecords`: object by schedule + vaccine id

localStorage keys:

- `babyVaccineScheduleType`
- `babyVaccineRecords`

Record schema:

```js
{
  status: 'pending' | 'done' | 'skipped',
  date: 'YYYY-MM-DD', // optional administered date
  notes: ''           // optional parent note
}
```

### Page UI (`Vaccination.jsx`) — chart-first

- Hero summary + reminder banner
- Schedule selector (shared `Select.jsx`)
- Summary charts:
  - `VaccineStatusDonutChart`
  - `VaccineStatusBarChart`
- Timeline chart:
  - `VaccineTimelineChart` (month axis + vaccine points + right-side expected due-date rail for non-marked vaccines)
- Filter tabs: `All`, `Due`, `Upcoming`, `Overdue`, `Done`, `Skipped`
- Point tap opens quick-update modal (status/date/notes)

### Utility functions (`src/utils/vaccines.js`)

- `getCurrentMonthFromBirthDate(birthDate)`
- `getVaccineDueState(vaccine, currentMonth, record)`
- `groupVaccinesByMonth(vaccines)`
- `computeVaccineStats(vaccines, records, currentMonth)`

### Integration files

- `src/routes.js` → add `ROUTES.vaccination`
- `src/App.jsx` → add route and pass DOB/current month props
- `src/components/Header.jsx` + `src/components/Footer.jsx` → navigation link

---

## Phase 2 — Custom schedule CRUD

### Additional storage

- `babyCustomVaccines` (array of custom vaccine definitions)

### Components

Create:

- `src/components/VaccineEditorModal.jsx`
- `src/components/VaccineScheduleSelect.jsx` (optional wrapper around `Select`)
- `src/components/VaccineStatusDonutChart.jsx`
- `src/components/VaccineStatusBarChart.jsx`
- `src/components/VaccineTimelineChart.jsx`

### CRUD operations

- **Create** vaccine entry
- **Edit** existing custom vaccine
- **Delete** vaccine entry
- **Reorder** optional (future)

### Validation rules

- `name` required
- `dueMonth` required and clamped to `0–36` (or allow explicit date mode later)
- `id` unique within custom schedule
- `doseNumber <= totalDoses` when provided

### UX behavior in custom mode

- “Add vaccine” CTA pinned near schedule selector
- Empty state with first action
- Inline badge for optional/non-mandatory custom entries

---

## Phase 3 — Polish (reminders/export/print)

### Reminders

Client-side reminder configuration:

- `babyVaccineReminderDays` (default e.g. 7 days)
- compute “due in N days” based on DOB + dueMonth
- show reminder chip/banner inside vaccination page (no push infra required)

### Export / backup

Provide:

- CSV export (`name`, `dueMonth`, `status`, `date`, `notes`, `scheduleType`)
- JSON export/import (full local backup)

Use browser download APIs only (no server dependency).

### Print

Add print stylesheet section:

- hide `Header`, mobile nav, assistant panel, floating controls
- keep page title, selected schedule, grouped vaccine table/cards
- include status legend

---

## Visual design pattern

Use existing shared patterns from:

- `docs/design-system-2026.md`
- `docs/ui-design.md`

### Chart + interaction style

- Summary charts in two-column layout on desktop, stacked on mobile
- Timeline chart uses horizontal scroll on small screens
- Rightmost due-date rail shows expected due dates for non-marked vaccines (pending/upcoming/due/overdue); hover emphasizes the row and date
- Status colors:
  - done: mint
  - due now: coral/amber
  - upcoming: blue/lavender
  - overdue: rose/coral dark
- skipped: neutral gray

### Touch targets

- 44px+ minimum on status buttons/toggles
- one-tap “Mark done”
- avoid dense inline forms on mobile

---

## Suggested file map

### New

- `src/pages/Vaccination.jsx`
- `src/data/vaccines/indiaIap.js`
- `src/data/vaccines/cdcUs.js`
- `src/data/vaccines/index.js`
- `src/utils/vaccines.js`
- `src/components/VaccineEditorModal.jsx`
- `src/components/VaccineStatusDonutChart.jsx`
- `src/components/VaccineStatusBarChart.jsx`
- `src/components/VaccineTimelineChart.jsx`
- `docs/vaccination-ui-design.md` (this file)

### Update

- `src/routes.js`
- `src/App.jsx`
- `src/components/Header.jsx`
- `src/components/Footer.jsx`
- `src/styles/global.css`
- `src/utils/iconRegistry.js` (if adding vaccine icon alias)
- `docs/ui-design.md` (design doc index + usage references)
- `.cursor/rules/coral.mdc` (design doc index)

---

## QA checklist

### Functional

- [ ] Switch schedule India ↔ CDC keeps records isolated
- [ ] Status persists after refresh
- [ ] Custom create/edit/delete works and persists
- [ ] Overdue/due/upcoming classification is correct by DOB
- [ ] Export CSV and JSON contain expected fields
- [ ] Import JSON merges safely (no crashes)

### UI

- [ ] Mobile 375px: readable, no horizontal overflow
- [ ] Tablet/desktop: grid and grouping remain clear
- [ ] Filters and selector remain sticky/visible enough

### Print

- [ ] Printable vaccination summary excludes nav chrome
- [ ] Includes selected schedule and status legend

---

## Safety + medical disclaimer

Always show an inline disclaimer on this page:

- Vaccination schedules vary by doctor, region, catch-up history, and special medical conditions.
- This tracker is for organization only and does not replace pediatric advice.

