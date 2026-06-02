# Mom Care — UI Design

> Postpartum self-care page for the parent. Topic tabs with evidence-based tip cards.

## Route

`/mom-care` — hash selects section:

- **`/mom-care#timeline`** — Mom's postpartum milestones (first tab, default landing). Spec: [mom-milestones-ui-design.md](mom-milestones-ui-design.md)
- **Topic tabs:** `/mom-care#posture`, `/mom-care#nippleCare`, etc. (16 self-care topics)

## Navigation

- **Desktop:** `Header.jsx` top nav — "Mom Care" with heart icon, between Travel and Community.
- **Mobile:** `mobile-nav` bottom bar — same position.
- **Footer:** `Footer.jsx` — listed between Travel and Community.

## Data

`src/data/momCareTips.js`

| Export | Type | Purpose |
|--------|------|---------|
| `MOM_CARE_CATEGORIES` | `string[]` | Ordered list of category IDs |
| `momCareCategoryConfig` | `Record<id, { label, icon, color, bg, description }>` | Tab styling & metadata |
| `momCareTips` | `Record<id, { title, subtitle, sections[] }>` | Content per topic |
| `MOM_CARE_DISCLAIMER` | `string` | Footer disclaimer text |

### Timeline tab

| ID | Label | Icon | Color |
|----|-------|------|-------|
| `timeline` | Timeline | `calendar` | `#9B88C0` |

Renders `MomMilestonesPanel` (checkable postpartum milestones). No entry in `momCareTips` — content lives in `src/data/momMilestones.js`.

### Topic categories (16)

| ID | Label | Icon | Color |
|----|-------|------|-------|
| `mentalHealth` | Mental Health | `brain` | `#9B88C0` |
| `recovery` | Recovery | `sparkles` | `#9B88C0` |
| `pelvicFloor` | Pelvic Floor | `flexed-bicep` | `#D88090` |
| `cSection` | C-Section Care | `stethoscope` | `#5A9FD8` |
| `sleep` | Your Sleep | `crescent-moon` | `#9B88C0` |
| `posture` | Posture | `1f9cd` | `#5A9FD8` |
| `nippleCare` | Nipple Care | `1f931` | `#D88090` |
| `supplements` | Supplements | `medical` | `#9B88C0` |
| `boneDensity` | Bone Density | `flexed-bicep` | `#C8A840` |
| `nutrition` | Food & Nutrition | `plate` | `#5FB878` |
| `hydration` | Hydration | `1f4a7` | `#5A9FD8` |
| `exercise` | Exercise | `1f3c3` | `#E89060` |
| `walking` | Brisk Walks | `1f6b6` | `#5FB878` |
| `massage` | Massage | `palms-up` | `#C8A840` |
| `hairLoss` | Hair Loss | `sparkles` | `#C8A840` |
| `stretchMarks` | Stretch Marks | `lotion` | `#D88090` |

## Components

| Component | File | Purpose |
|-----------|------|---------|
| `MomCare` | `src/pages/MomCare.jsx` | Page wrapper |
| `MomCareTips` | `src/components/MomCareTips.jsx` | Full page content: hero, tabs, timeline or tip card |
| `MomMilestonesPanel` | `src/components/MomMilestonesPanel.jsx` | Postpartum timeline when `#timeline` active |

## Layout

```
┌─────────────────────────────────────┐
│ Mom Care                            │  ← hero
│ Your recovery matters...            │
├─────────────────────────────────────┤
│ [Posture] [Nipple] [Suppl] [Bone]…  │  ← scrollable tabs
├─────────────────────────────────────┤
│ Category description (italic)       │
├─────────────────────────────────────┤
│ ┌─────────────────────────────────┐ │
│ │ 🧍 Posture Correction          │ │  ← tip card with accent top
│ │ Undo the breastfeeding hunch…  │ │
│ │                                 │ │
│ │ ## Why posture changes          │ │
│ │ • Nursing creates forward…      │ │
│ │                                 │ │
│ │ ## The golden rule              │ │
│ │ • Bring baby to your body…      │ │
│ │                                 │ │
│ │ ⚠ Educational only…            │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## CSS classes

| Class | Purpose |
|-------|---------|
| `.mom-care-page` | Page container, max-width 1100px |
| `.mom-care-hero` | Title + subtitle area |
| `.mom-care-tabs-wrap` | Horizontally scrollable tab container |
| `.mom-care-tabs` | Extends `.diy-filter-tabs`, no-wrap |
| `.mom-care-category-desc` | Italic description below tabs |
| `.mom-care-tip-card` | White card, `border-radius: var(--radius-lg)` |
| `.mom-care-tip-card.card-accent-top` | Category-colored 3px top accent |
| `.mom-care-tip-header` | Icon + title + subtitle flex row |
| `.mom-care-tip-section` | Section with h3 heading + bullet list |
| `.mom-care-disclaimer-inline` | Disclaimer at bottom of card |

## Design patterns

- Mirrors Travel page structure: hero → filter tabs → single tip card.
- Tab strip is horizontally scrollable on mobile (11 categories overflow).
- Uses existing `.diy-filter-btn` styling for tabs with category `bg`/`color` for active state.
- Card uses `.card-accent-top` with `--cat-color` set per category.
- Section headings use `--lavender-dark` color for visual hierarchy.
- Medical disclaimer appears at the bottom of every tip card.
