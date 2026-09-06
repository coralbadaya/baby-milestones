# Life Firsts — Photo Journal (Option C)

> Curated “first moments” with photo/video capture — carousel on Today, full journal on My Baby.

**Status:** Shipped (signed-in Storage + `first_moments`; anonymous localStorage)  
**Last updated:** September 2026

---

## Product rationale (Option C)

| Surface | Route | UX |
|---------|-------|-----|
| **Carousel peek** | `/` (Today) | Horizontal carousel — circle photo + label; arrows, dots; auto-centers suggested first |
| **Full journal** | `/baby#moments` | Vertical numbered list (17 items) — reference-inspired layout |

**Separate from:**

- Developmental milestone checkboxes (`babyMilestoneChecks` / `milestones.js`)
- Community memories (`coral_memories` / `useMemories.js`)

Optional `linkedMilestoneIds` in data support a future month-detail capture link — not in v1 UI.

---

## Curated firsts (17)

Defined in [`src/data/firsts.js`](../src/data/firsts.js):

| # | id | Label |
|---|-----|-------|
| 1 | `birth` | Birth |
| 2 | `homecoming` | Homecoming |
| 3 | `first-smile` | First Smile |
| 4 | `first-laugh` | First Laugh |
| 5 | `crawling` | Crawling |
| 6 | `clapping` | Clapping |
| 7 | `sitting-up` | Sitting Up |
| 8 | `standing` | Standing |
| 9 | `first-tooth` | First Tooth |
| 10 | `bath-time` | Bath Time |
| 11 | `first-birthday` | First Birthday |
| 12 | `first-words` | First Words |
| 13 | `rolling-over` | Rolling Over |
| 14 | `waving-bye` | Waving Bye Bye |
| 15 | `first-walk` | First Walk |
| 16 | `first-food` | First Taste Of Food |
| 17 | `first-haircut` | First Haircut |

Each entry may include `monthHint` (for carousel auto-focus) and `linkedMilestoneIds` (best-effort links to `milestones.js` IDs).

---

## Components

| File | Role |
|------|------|
| [`FirstMomentSlot.jsx`](../src/components/firsts/FirstMomentSlot.jsx) | Scalloped circle frame; empty (camera) vs filled (photo/video) |
| [`FirstMomentCapture.jsx`](../src/components/firsts/FirstMomentCapture.jsx) | Modal — preview, optional note, remove |
| [`FirstsCarousel.jsx`](../src/components/firsts/FirstsCarousel.jsx) | Today horizontal carousel |
| [`FirstsJournal.jsx`](../src/components/firsts/FirstsJournal.jsx) | My Baby vertical journal |

### Empty state

- Dashed circle ring + camera icon
- Tap opens native file picker (`accept="image/*,video/*"`)

### Filled state

- Circular cropped photo or video poster
- Tap opens capture modal (view, note, remove)
- Video badge with play icon

---

## Capture flow

1. User taps empty slot → file picker
2. File read via `FileReader` → data URL
3. Max **2MB** per file when signed out (`FIRST_MOMENT_MAX_FILE_BYTES`); **15MB** when signed in (`FIRST_MOMENT_CLOUD_MAX_FILE_BYTES`)
4. Modal opens for optional note + remove
5. Same moment syncs between Today carousel and My Baby journal (shared state)

---

## Data & storage

**Anonymous:** localStorage key `yarntrailsFirstMoments` (data URLs, 2MB cap).

**Signed-in:** private Storage bucket `first-moments` (`{user_id}/{baby_profile_id}/{first_id}`) + table `first_moments`. UI still reads `photoDataUrl` / `videoDataUrl` (signed URLs). Merge on first login uploads local data URLs.

**Hook:** [`useFirstMoments.js`](../src/hooks/useFirstMoments.js) — wired in [`App.jsx`](../src/App.jsx), passed to Home + Baby.

---

## Page integration

### Today ([`Home.jsx`](../src/pages/Home.jsx))

- After `EditorialBand`, before “Continue your journey”
- `PageSection` surface `sand`
- Visible when birth date set
- `getSuggestedFirst(currentMonth, firstMoments)` drives carousel auto-center
- Link: **View all firsts →** [`ROUTES.babyMoments`](../src/routes.js) (`/baby#moments`)

### My Baby ([`Baby.jsx`](../src/pages/Baby.jsx))

- Section `#moments` after Care teaser, before full 36-month timeline
- `PageSection` surface `ivory`
- Hash scroll on mount when `location.hash === '#moments'`

---

## CSS

Styles in [`src/styles/editorial-system.css`](../src/styles/editorial-system.css):

- `.first-moment-slot*` — circle frames
- `.firsts-carousel*` — track, nav, dots (mirrors timeline carousel)
- `.firsts-journal*` — numbered rows
- `.first-moment-capture*` — modal

Yarn Trails quiet luxury: ivory/sand bands, Fraunces labels, coral ring accents — not literal baby-blue from reference mocks.

---

## Future (out of v1)

- Share moment → Community memory (pre-filled)
- Premium export timeline / PDF with photos
- Capture prompt on month-detail milestone row when `linkedMilestoneIds` checked
- Client-side image compression before localStorage write
- Supabase Storage upload

---

## Verification

```bash
npm test    # useFirstMoments.test.js
npm run build
```

Manual: set birth date → Today carousel → add photo → appears on `/baby#moments`; notes persist after refresh.
