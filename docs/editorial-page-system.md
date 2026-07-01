# Editorial Page System

> **Master plan** for Nestbean’s visual upgrade — starting on **Today (`/`)**, then rolling out to every major route.  
> **Goal:** Magazine-grade editorial rhythm (photography, contrast, scroll momentum) on a calm utility foundation.  
> **Audience:** Affluent new mothers in tier-1 cities — London, New York, Dubai, Singapore, Hong Kong.  
> **Brand:** Nestbean — *The art of early motherhood.*

**Status:** Shipped (Phases 1–6 implemented June 2026)  
**Last updated:** June 2026

---

## Why this document exists

Phases 0–5 of [`docs/premium-redesign-plan.md`](premium-redesign-plan.md) shipped **structure**: journey nav, PageHero, Today dashboard, hub pages, premium scaffold. Content discoverability was restored via `CurrentMonthPanel` and `DIYPreviewStrip`.

What remains is **presentation depth**. Today still reads as one hero photo followed by same-tone cream cards — functional but not agency-level. This plan defines a **reusable editorial system** (sections, cards, imagery, motion) that Home proves first, then extends to My Baby, My Care, Essentials, Community, and month detail.

---

## Problem statement

| Symptom | Root cause |
|---------|------------|
| “Feels like a student website” | Single photo at top; body is text-only cards on uniform ivory |
| No scroll momentum | Missing section background rhythm and typographic hierarchy |
| DIY feels invisible on Home | `DIYPreviewStrip` uses compact cards **without** photos |
| Month detail vs Home mismatch | Month page uses `ActivityIllustration` (legacy SVG); Home has no imagery for same activities |
| Not reusable | Each page has ad-hoc section styling; no shared “editorial band” primitives |

---

## Design principles (system-wide)

These apply to **every page** that adopts this system:

1. **One hero, many rhythms** — Full-bleed `PageHero` opens the page; body alternates surface tones so scroll has pace.
2. **Photography earns its place** — Every image is art-directed (see [`docs/imagery-system.md`](imagery-system.md)); no stock baby clichés.
3. **Split over stack (when editorial)** — Feature content (DIY, guides, product edits) uses **image + copy** split layouts on desktop; single column on mobile.
4. **Quiet luxury motion** — Hover lift, progress transitions, optional section fade-in, **scroll-synced surface on Home** (`useScrollSurface`). No parallax, no scroll-jacking. Respect `prefers-reduced-motion`.
5. **Exhaustion-aware** — Touch targets ≥ 44px; one-handed CTAs; no extra taps for core actions (milestone check, YouTube link).
6. **Free core, premium curation** — Milestone tracking and DIY previews stay **free and visible**; photos enhance, they do not gate.

---

## Page anatomy (template)

Every editorial page follows this skeleton. Home is the reference implementation.

```
┌─────────────────────────────────────────┐
│  PageHero (full-bleed, imageKey)        │  ← Phase 4 optional: split layout
├─────────────────────────────────────────┤
│  Section A — surface: ivory (default)   │  ← Focus / summary cards
├─────────────────────────────────────────┤
│  Section B — surface: sand              │  ← Primary editorial block (DIY, features)
├─────────────────────────────────────────┤
│  Section C — surface: white / card      │  ← Data panels (milestones, timeline)
├─────────────────────────────────────────┤
│  Section C2 — life firsts (optional)    │  ← Photo journal — first-moments-ui-design.md
├─────────────────────────────────────────┤
│  Section D — surface: ink (optional)    │  ← Max one dark band per page — brand moment
├─────────────────────────────────────────┤
│  Section E — surface: ivory             │  ← Secondary content / footer link
└─────────────────────────────────────────┘
```

**Layout contract** (unchanged from [`docs/page-layout-standardization.md`](page-layout-standardization.md)):

- `PageHero` = direct child of route, outside `max-width`
- Body sections use `.page-body` + width modifier (`--wide` / `--narrow`)
- New: `.page-section` + surface modifiers (`.page-section--sand`, `--white`, `--lavender`, `--mist`, `--ink`)
- Home only: `data-scroll-surface` on bands + `useScrollSurface` on `.home-today` — parent background tracks the band at viewport center; bands transparent on Home. Editorial ink quote band is excluded (keeps its own fill). Section fade-in disabled on Home. Other routes keep per-section fills until opted in.

### Scroll-synced surface (Home reference)

| Piece | Path |
|-------|------|
| Hook | `src/hooks/useScrollSurface.js` |
| Token map | `src/utils/scrollSurfaces.js` |
| Bands | `PageSection` (`data-scroll-surface`, optional `blendEdges`), `EditorialBand` (`data-scroll-surface="ink"`) |
| CSS | `.home-today` in `editorial-system.css`; `--motion-surface`, `--surface-blend-height` in `global.css` |

---

### Per-route section rhythm (shipped)

| Route | Bands (top → bottom) |
|-------|----------------------|
| `/` Home | ivory → white → sand → ink (EditorialBand) → ivory |
| `/baby` | ivory → white → sand → lavender → white |
| `/mom-care` | lavender (ivory nav band + white content via inline bands) |
| `/essentials` | sand → ivory |
| `/shopping` | sand → white (inline bands) |
| `/travel` | mist → white (inline bands) |
| `/vaccination` | ivory → white |
| `/community` | sand (tabs) → white (feed) |
| `/guides`, `/premium` | ivory → white |
| `/month/:n` | white → sand (DIY) → ivory (care + tips) |

Cards on tinted bands use white backgrounds + `--shadow-card` for elevation.

---

## Component map (new + extended)

| Component | Role | Phase |
|-----------|------|-------|
| `PageHero` | Full-bleed hero; later split variant on desktop | 4 |
| `TodayFocus` | 1–3 focus cards; optional image header | 5 |
| `CurrentMonthPanel` | Milestone preview with inline checks | Exists — restyle in 2 |
| `DIYEditorialCard` | **New** — split image + title, duration, YouTube CTA | 1 |
| `DIYPreviewStrip` | Horizontal strip → uses `DIYEditorialCard` on Home | 1 |
| `EditorialBand` | **New** — optional ink scrim + tagline / quote | 3 |
| `SectionHeader` | **New** — Fraunces title + eyebrow + optional “View all →” | 2 |
| `diyImages` manifest | `src/data/diyImages.js` — per-activity lookup via `activity.id` + illustration fallbacks | 1 |

**Image tiers:**

| Tier | Scope | Count | Status |
|------|-------|-------|--------|
| **A** | Visible on Home / hub previews | 2–4 per visit | Current month only |
| **B** | Archetype library (bundled fallbacks) | 65 keys | Shipped in `public/images/diy/` |
| **C** | Per-activity unique | 180 activities | **Admin-configurable** — see [`docs/diy-images-admin.md`](diy-images-admin.md) |

---

## Phased roadmap

### Phase 1 — DIY editorial imagery + split cards

**Target:** Home DIY strip looks like a magazine spread, not a checklist row.

**Scope:**

- Add `src/data/diyImages.js` manifest + `public/images/diy/` (WebP preferred, JPG fallback)
- Create `DIYEditorialCard.jsx` — desktop: 40/60 or 50/50 split; mobile: image top, content below
- Replace compact `DIYActivityCard` in `DIYPreviewStrip` on **Today** and **My Baby**
- YouTube CTA remains on card face (no extra modal tap)
- Empty state (no birth date): Month 1 sample uses **real Month 1 archetype images**, not placeholders
- Update [`docs/imagery-system.md`](imagery-system.md) with DIY file layout and AI prompts

**Reasoning:**

DIY is the highest-impact gap. Parents decide in **under 2 seconds** whether an activity is worth opening; compact text cards fail that test. Split editorial cards match tier-1 expectations (Kinfolk, Goop editorial, premium parenting apps) while keeping the same data from `diyActivities.js`.

**Success criteria:**

- [ ] 2 DIY cards on Home each show art-directed photo
- [ ] Same manifest key resolves image from `activity.illustration`
- [ ] YouTube link works from card without navigation
- [ ] Lighthouse LCP on Home still ≤ 2.5s (hero eager; DIY lazy)

**Files:**

- `src/data/diyImages.js` (new)
- `src/components/DIYEditorialCard.jsx` (new)
- `src/components/DIYPreviewStrip.jsx` (update)
- `public/images/diy/*` (new assets)
- `src/styles/global.css` — `.diy-editorial-card`, strip layout

---

### Phase 2 — Section rhythm + typography scale

**Target:** Scrolling Home feels intentional — contrast between bands, clear section hierarchy.

**Scope:**

- Introduce `.page-section` wrapper with surface tokens:
  - `--surface-ivory` (default page bg — `#FCF8F2`)
  - `--surface-sand` (warm alternate — `#EFE3D4`, cream-dark)
  - `--surface-white` (elevated panels)
  - `--surface-lavender` (My Care / wellness — `#F3EEF8`)
  - `--surface-mist` (Travel / cool accent — `#EEF5FF`)
  - `--surface-ink` (reserved for EditorialBand — max one per page)
- Wrap Home sections: `TodayFocus` → ivory; `DIYPreviewStrip` → sand; `CurrentMonthPanel` → white card on ivory; timeline → ivory
- Add `SectionHeader` — Fraunces H2, uppercase eyebrow, optional footer link
- Increase vertical rhythm: `--space-10` / `--space-12` between major sections on desktop
- Restyle `CurrentMonthPanel` to match elevated white card pattern

**Reasoning:**

Affluent users perceive quality through **rhythm and restraint**, not more widgets. Alternating surfaces create scroll momentum without adding content. This pattern copies directly to hub pages (Baby, Essentials) and feature pages (Shopping, Travel).

**Success criteria:**

- [ ] At least 3 distinct surface tones visible on Home scroll
- [ ] Section titles use display type; body stays Switzer
- [ ] Mobile: no horizontal overflow; sand/ivory bands full-bleed edge-to-edge
- [ ] Pattern documented for reuse on `/baby`, `/essentials`

**Files:**

- `src/pages/Home.jsx` (section wrappers)
- `src/components/SectionHeader.jsx` (new)
- `src/styles/global.css` — section + surface tokens
- [`docs/home-redesign.md`](home-redesign.md) — Visual rhythm v2 section

---

### Phase 3 — Cross-page consistency (Baby, month detail)

**Target:** Same DIY photos on Home, My Baby hub, and `/month/:n#diy`.

**Scope:**

- Wire `DIYEditorialCard` or image-top variant into `DIYSection` on month detail (replace or supplement `ActivityIllustration` for grid cards)
- My Baby: sand band for DIY strip (4 cards), ivory band for **FirstsJournal** (`#moments`), white band for full timeline
- Optional: one `EditorialBand` (ink) on Home only — brand tagline *“The art of early motherhood.”* — **max one per page**
- Essentials hub: apply section rhythm to shopping/travel/vaccination teaser cards (image headers from existing heroes or category thumbs)

**Reasoning:**

Inconsistent imagery (photos on Home, cartoons on month page) breaks trust. Phase 3 aligns depth pages with the editorial system before expanding to Community and static guides.

**Success criteria:**

- [ ] Month detail DIY grid shows same archetype photo as Home preview for same activity
- [ ] My Baby scroll matches Home section pattern
- [ ] `ActivityIllustration` deprecated for DIY cards (keep fallback until all keys mapped)
- [ ] Ink band appears on Home only (not stacked on every page)

**Files:**

- `src/pages/Baby.jsx`
- `src/pages/MonthDetail.jsx`, `src/components/DIYSection.jsx`, `src/components/DIYActivityCard.jsx`
- `src/components/EditorialBand.jsx` (new, optional)
- [`docs/month-detail-ui-design.md`](month-detail-ui-design.md)

---

### Phase 4 — PageHero split layout (site-wide)

**Target:** Desktop heroes show **face + context** (mother/baby visibility) without losing mobile full-bleed impact.

**Scope:**

- Extend `PageHero` with `layout="split"` — desktop: image right (or left), copy left; mobile: stacked (image top, current behavior)
- Apply first to **Home**, then **My Care**, **My Baby**, **Essentials**, **Community**
- Regenerate or crop hero assets for split-safe composition (subject not centered-only)
- Keep `loading="eager"` on Home only

**Reasoning:**

Split hero is a **cross-cutting** change. Doing it after Phases 1–3 avoids rewriting hero + body simultaneously. User feedback flagged face visibility; split layout addresses that for tier-1 editorial sites.

**Success criteria:**

- [ ] Home hero split on ≥769px; single column on mobile
- [ ] Text contrast WCAG AA on all hero variants
- [ ] Rollout checklist for remaining `imageKey` routes
- [ ] `pageImages.js` documents safe crop zones per hero

**Files:**

- `src/components/PageHero.jsx`
- `src/data/pageImages.js`
- `src/styles/global.css` — `.page-hero--split`
- [`docs/imagery-system.md`](imagery-system.md)

---

### Phase 5 — Motion, focus polish, TodayFocus images

**Target:** Subtle craft signals — nothing that fights 3am one-handed use.

**Scope:**

- Card hover: `translateY(-2px)` + soft shadow (desktop only, `@media (hover: hover)`)
- Milestone progress bar animates on check (200–300ms ease)
- Optional `IntersectionObserver` fade-in for sections (`opacity` + `translateY(8px)`), disabled when `prefers-reduced-motion`
- TodayFocus cards: optional 16:9 image header (milestone / mom care / editorial teaser) — lower priority than DIY
- Shopping product cards: align hover + image aspect with DIY editorial tokens

**Reasoning:**

Motion is ** seasoning**, not the meal. Restrained interaction design reads premium; heavy scroll animation reads marketing. Phase 5 runs last so components and surfaces are stable.

**Success criteria:**

- [ ] All motion respects `prefers-reduced-motion: reduce`
- [ ] No CLS from image load (explicit aspect-ratio on cards)
- [ ] Focus card image headers optional — at least 1 of 3 cards has image on Home

**Files:**

- `src/components/TodayFocus.jsx`
- `src/styles/global.css` — motion tokens
- [`docs/design-system-2026.md`](design-system-2026.md) — Motion section update

---

### Phase 6 — Rollout to remaining routes

**Target:** Entire primary journey uses one editorial system.

**Apply section rhythm + imagery to:**

| Route | Hero key | Editorial blocks |
|-------|----------|------------------|
| `/mom-care` | `mom-care` | Tip cards with optional image headers; timeline band |
| `/essentials` | `essentials` | Hub teasers → Shopping, Travel, Vaccination |
| `/shopping` | optional | Product grid — already image-forward; align tokens |
| `/travel` | optional | Tip cards in sand/white alternation |
| `/community` | `community` | Feed cards — narrow column, sand side gutters |
| `/guides`, `/guides/:slug` | TBD | Article hero + inline editorial images |
| `/premium` | TBD | Ink band + tier cards |

**Reasoning:**

Home proves the system; Phase 6 is **application**, not invention. Each feature doc gets a short “Editorial system” subsection pointing here.

**Success criteria:**

- [ ] All primary nav routes use `.page-section` surfaces
- [ ] No page uses one-off cream-on-cream for entire scroll depth
- [ ] Feature design docs cross-link this file

---

## Performance profiles

Budgets per page type. Measure on **4G throttled**, mid-tier Android + iPhone.

### Global budgets

| Metric | Target | Notes |
|--------|--------|-------|
| **LCP** | ≤ 2.5s | Hero image is LCP candidate on most pages |
| **INP** | ≤ 200ms | Checkbox toggle, card tap |
| **CLS** | ≤ 0.1 | Fixed aspect-ratio on all editorial cards |
| **Total page weight (Home)** | ≤ 800KB initial | Hero + 2 DIY thumbs + CSS/JS |

### Per-page profiles

| Page | LCP element | Eager images | Lazy images | Max new images above fold |
|------|-------------|--------------|-------------|---------------------------|
| **Today `/`** | `home.jpg` | Hero only | 2 DIY WebP, focus headers (Phase 5) | 1 hero + 2 DIY |
| **My Baby `/baby`** | `baby.jpg` | Hero | 4 DIY, panel icons | 1 hero + 4 DIY lazy |
| **My Care `/mom-care`** | `mom-care.jpg` | Hero | Tip thumbnails (if added) | 1 hero |
| **Essentials `/essentials`** | `essentials.jpg` | Hero | Hub teaser thumbs | 1 hero + 3 lazy |
| **Month detail `/month/:n`** | — (no hero) | None | DIY grid images | 0 above fold; lazy grid |
| **Community `/community`** | `community.jpg` | Hero | Avatar/post media user-generated | 1 hero |

### Image file rules

| Asset type | Format | Max dimensions | Max file size |
|------------|--------|----------------|---------------|
| Page hero | JPG/WebP | 1920×1080 | 180KB |
| DIY archetype | WebP | 800×600 | 80KB |
| Focus card header | WebP | 600×338 (16:9) | 50KB |
| OG / social | PNG | 1200×630 | 200KB |

**Loading strategy:**

- `loading="eager"` + `fetchpriority="high"` — Home hero only
- `loading="lazy"` + `decoding="async"` — all DIY and below-fold images
- Blur placeholder: `background-color` from manifest until load

---

## Rollout order (summary)

```
Phase 1  DIY images + DIYEditorialCard     → Home + Baby strip
Phase 2  Section rhythm + SectionHeader     → Home
Phase 3  Month detail + Baby hub alignment  → /baby, /month/:n
Phase 4  Split PageHero                     → all hero routes
Phase 5  Motion + TodayFocus images         → Home, shared tokens
Phase 6  Remaining routes                   → Care, Essentials, Community, guides
```

**Explicitly deferred:**

- Automated bulk AI generation from admin UI
- Parallax, scroll-triggered animations, video backgrounds
- Multiple ink bands per page
- Pinterest / scraped imagery

---

## Success metrics (qualitative + quantitative)

| Type | Signal |
|------|--------|
| **Brand** | User feedback: “feels like a magazine, not a checklist” |
| **Engagement** | Tap-through Home → `/month/:n#diy` increases |
| **Engagement** | YouTube CTA clicks from DIY cards |
| **Performance** | Home LCP ≤ 2.5s after Phase 1 images |
| **Consistency** | Design review: same card DNA on Home, Baby, month detail |
| **Accessibility** | WCAG AA contrast on sand, white, and ink surfaces |

---

## Related documentation

| Doc | Relationship |
|-----|--------------|
| [`docs/premium-redesign-plan.md`](premium-redesign-plan.md) | Strategic repositioning — phases 0–5 shipped |
| [`docs/home-redesign.md`](home-redesign.md) | Today dashboard content IA — update after Phase 2 |
| [`docs/page-layout-standardization.md`](page-layout-standardization.md) | Hero + body width contract |
| [`docs/imagery-system.md`](imagery-system.md) | Art direction — extend with DIY manifest |
| [`docs/design-system-2026.md`](design-system-2026.md) | Tokens, typography, motion |
| [`docs/information-architecture.md`](information-architecture.md) | Nav and route hierarchy |
| [`.cursor/skills/premium-ui/SKILL.md`](../.cursor/skills/premium-ui/SKILL.md) | Agent skill for quiet luxury UI |
| [`.cursor/skills/image-curation/SKILL.md`](../.cursor/skills/image-curation/SKILL.md) | Agent skill for hero + DIY images |

---

## Implementation checklist (agent / dev)

When starting a phase:

1. Read this doc + relevant feature design doc
2. Update imagery manifest before adding assets
3. Run `npm test` and `npm run build`
4. Verify mobile bottom nav clearance on touched pages
5. Update the feature design doc and this doc’s phase status
6. Do not commit `.env` or secrets

---

*Nestbean editorial page system — Home first, then everywhere.*
