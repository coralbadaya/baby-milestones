# Yarn Trails Design System 2026

> A comprehensive design system for Gen Z and late millennial parents.  
> **Target:** Parents aged 22–38 with babies 0–36 months.  
> **Philosophy:** Calm utility over visual clutter. Human over clinical.

---

## Table of Contents

1. [Audience Profile](#audience-profile)
2. [Design Philosophy](#design-philosophy)
3. [Color System](#color-system)
4. [Typography](#typography)
5. [Iconography & Imagery](#iconography--imagery)
6. [Spacing & Layout](#spacing--layout)
7. [Components](#components)
8. [Motion & Micro-interactions](#motion--micro-interactions)
9. [Accessibility](#accessibility)
10. [Brand Voice](#brand-voice)
11. [Implementation Guidelines](#implementation-guidelines)

---

## Audience Profile

### Who They Are (2026 — Premium repositioning)

| Segment | Profile | Key Characteristics |
|---------|---------|---------------------|
| **Primary** | Affluent new mothers, tier-1 cities | London, New York, Manchester, Dubai, Abu Dhabi — educated, health-conscious, high income |
| **Secondary** | Late millennials / early Gen Z | Digital-native, values curation over clutter, willing to pay for concierge quality |

### Behavioral Insights

- Expect **editorial quality** — magazine, not checklist
- Pay for **curation and sequence**, not more features
- One-handed, low-light usage still applies (3am feeds)
- Reject crude UI and stock baby clichés

### Usage Context (Critical for UX)

The primary usage state:
- Half asleep
- Holding a baby
- One hand free
- Low light (3am feeds)

**Every screen must assume this context** — even in premium positioning.

---

## Quiet Luxury (shipped)

Extension of warm minimalism for affluent tier-1 mothers.

| Element | Spec |
|---------|------|
| Display type | **Newsreader** serif — `--font-display` |
| Body type | **Manrope** — `--font-body` |
| Heroes | `<PageHero>` with AI art-directed photography |
| Nav | 6 journey links (desktop): Today · My Baby · My Care · Essentials · Community · Guides; mobile bottom bar: 5 items (no Guides) |
| Spacing | Generous `--space-8` section gaps |
| Premium | Teaser gates, invitation tone — see `docs/monetization-strategy.md` |

---

## Design Philosophy

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Calm Utility** | Function over decoration. Every element earns its place. |
| **Exhaustion-Aware** | Design for the worst case: tired, one-handed, dim lighting. |
| **Human Warmth** | Soft, approachable, never clinical or sterile. |
| **Inclusive by Default** | Gender-neutral, diverse, accessible. No "mom-coded" clichés. |
| **Forgiving Design** | Every action is reversible. Mistakes are easy to fix. |

### Anti-Patterns to Avoid

| Avoid | Reason |
|-------|--------|
| Gamification | Exhausted parents don't need achievement pressure |
| Ad-dense layouts | Visual noise increases cognitive load |
| Deep navigation hierarchies | 3am logging must be one-tap |
| Pastel baby clichés | Cloud décor, storks, pacifier motifs feel dated |
| Small touch targets | Shaky hands misfire constantly |
| Linear animations | Feels robotic; use spring physics instead |

### Design Direction

**Warm Minimalism** meets **Biophilic Sophistication**

Move away from:
- Clinical white spaces
- Primary-colored baby aesthetics
- Pinterest perfection
- Feature-stacked complexity

Move toward:
- Layered earth tones
- Organic textures
- Editorial photography
- Single-purpose screens

---

## Color System

### Philosophy

**Wool & Trail** — cool wool mist backgrounds, moss trail primary, spun-gold yarn accents. Quiet luxury for Yarn Trails; avoids Nestbean terracotta-on-cream.

**Source of truth:** [`src/styles/global.css`](../src/styles/global.css) `:root` tokens. Plan: [`yarntrails-retheme-plan.md`](yarntrails-retheme-plan.md).

### Primary Palette

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--coral-primary` / `--brand-trail` | Trail moss | `#3F5E52` | CTAs, active nav, accents |
| `--coral-primary-light` | Trail tint | `#D5E3DC` | Hero washes, chips |
| `--coral-primary-dark` | Trail deep | `#2F4A40` | Hover on primary |

### Secondary & Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-gold` / `--gold-dark` | `#C4A35A` / `#9A7D3A` | Yarn accent, dividers, premium spark |
| `--lavender` / `--lavender-dark` | `#E4E0EA` / `#8B7FA8` | Secondary surfaces, progress |
| `--mint` / `--mint-dark` | `#D0E6D6` / `#5A9E6C` | Success, milestones checked |
| `--baby-blue` / `--baby-blue-dark` | `#D2E4F0` / `#5A8FBE` | Physical activity accent |
| `--rose` / `--rose-dark` | `#E8D5CC` / `#B07860` | Emotional activity accent |
| `--gold` | `#EDE0C0` | Soft gold wash |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `--cream` | `#F3F5F2` | Page background (wool mist) |
| `--cream-dark` | `#E4E9E4` | Subtle fills, inputs |
| `--sand` | `#EBEFEC` | Muted strips |
| `--mushroom` | `#C5CDC7` | Borders, disabled |
| `--text-primary` | `#1E2A26` | Headings, body |
| `--text-secondary` | `#4A5650` | Meta, subtitles |
| `--text-light` | `#6B756F` | Captions |
| `--white` | `#FFFFFF` | Cards, modals |

### Semantic

| Token | Hex |
|-------|-----|
| `--success` | `#5A9E6C` |
| `--warning` | `#C49A40` |
| `--error` | `#C87878` |
| `--info` | `#5A8FBE` |

Legacy aliases (`--peach`, `--coral-sage`, `--brand-terracotta` → trail) map to the tokens above.

### Dark Mode

**Deferred** — not shipped. Light palette only. Do not add `prefers-color-scheme: dark` overrides until explicitly designed.

### Accessibility Requirements

- All text must meet **WCAG 2.1 AA** contrast (4.5:1 for normal text, 3:1 for large)
- Never use color alone to convey meaning (pair with icons or text)
- Do not use yarn gold for small body text
- Test palettes under low light, glare, and colorblind simulations

---

## Typography

### Philosophy

Literary **Newsreader** for display (story / trail journal) with **Manrope** for calm UI body — already used in the baby book surfaces.

### Font Stack

| Role | Primary | Fallback |
|------|---------|----------|
| Display | **Newsreader** | Georgia, serif |
| Body | **Manrope** | system-ui, sans-serif |
| Monospace | Geist Mono | JetBrains Mono, monospace |

```css
--font-display: 'Newsreader', Georgia, 'Times New Roman', serif;
--font-body: 'Manrope', system-ui, sans-serif;
```

### Type Scale

Based on a 1.25 ratio with ~15–16px base.

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-xs` | 11–12px | 400–500 | 1.5 | Captions, timestamps |
| `--text-sm` | 13px | 400 | 1.5 | Secondary text, labels |
| `--text-base` | 15px | 400 | 1.65 | Body text (minimum for mobile) |
| `--text-md` | 17px | 500 | 1.5 | Emphasized body |
| `--text-lg` | 19px | 600 | 1.4 | Card titles, section headers |
| `--text-xl` | 22px | 600 | 1.3 | Page section headers |
| `--text-2xl` | 28px | 600 | 1.15 | Page titles |
| `--text-3xl` | 34px | 600 | 1.15 | Hero headlines |

Display headings use `letter-spacing: -0.02em`.

### Typography Rules

1. **Minimum 15–16px** for body text on mobile (CRITICAL for tired eyes)
2. **High contrast** between text and background
3. **Left-align** body text (no justify, no center for paragraphs)
4. **Line length** max 65–75 characters for readability
5. **No all-caps** for more than 2 words (accessibility + readability)

---

## Brand / Logo

**Product name:** Yarn Trails. **Tagline:** `The art of early motherhood`. SEO title/description live in `src/constants/brand.js`. Full spec: `docs/brand-identity.md`.

### Mark

**"N" monogram cradling a golden bean** (the baby in the nest): two terracotta (`--coral-primary`) stems + diagonal form the N; a honey-gold (`--gold-dark`) bean with a small head rests in the cradle. Legible at 16px.

| Asset | Path |
|-------|------|
| Master mark | `public/brand/yarntrails-mark.svg` |
| Lockup | `public/brand/yarntrails-logo.svg` |
| React | `src/components/CoralLogo.jsx` |
| Generated icons/OG | `public/` via `npm run generate:brand` |

### Usage

```jsx
import CoralLogo from './CoralLogo';

<CoralLogo variant="lockup" size={32} tagline="for parents" />
<CoralLogo variant="lockup" size={28} tagline={null} />
<CoralLogo variant="mark" size={24} />
```

| Placement | Spec |
|-----------|------|
| Header | Lockup: **Yarn Trails** + tagline `for parents` |
| Footer | Lockup: **Yarn Trails** only (long tagline in footer copy below) |
| Favicon | `/brand/yarntrails-mark.svg` |

### Rules

| Do | Don't |
|----|-------|
| Use `CoralLogo` for brand | Use `Icon name="baby"` as logo |
| Min size 24px for mark | Heavy gradients or 3D effects |
| Keep clear space ~8px around mark | Storks, pacifiers, stock baby clipart |

### Header navigation (desktop, shipped)

Journey links + Sign in/Account use **quiet luxury** chrome — not filled pills.

| State | Treatment |
|-------|-----------|
| Default | `--text-secondary`, transparent background |
| Hover | Light sand tint (`color-mix` ~35%), `--text-primary` |
| Active | Subtle peach tint (~25%) + **2px inset underline** in `--coral-primary` |
| Premium CTA | Only filled accent — `.header-cta` coral pill, unchanged |

CSS: `.header-nav a:not(.header-cta)` in `global.css` — padding `--space-1` × `--space-2`, radius `--radius-xs` (8px). Mobile `.mobile-nav`: color-only active (no pill).

---

## Iconography & Imagery

### Icon Style (shipped — Phosphor Light)

| Attribute | Specification |
|-----------|---------------|
| Library | **Phosphor Icons** (`@phosphor-icons/react`) |
| Weight | **Light** — monoline, quiet luxury |
| Color | `currentColor` — inherits text |
| Component | `src/components/Icon.jsx` |
| Map | `src/utils/phosphorIconMap.js` |

**Do not** use Twemoji PNGs in UI chrome. Legacy Twemoji remains only in `ActivityIllustration` SVG embeds (migration pending).

### Icon Style (legacy reference)

**Icon Characteristics:**
- Rounded corners on all terminals
- Soft curves, never sharp angles
- Consistent optical weight
- Clear at small sizes

### Photography Style

**Editorial, Not Stock**

| Do | Don't |
|----|-------|
| Real moments, imperfect lighting | Staged studio shots |
| Diverse families, all caregivers | Only young white mothers |
| Natural environments, home settings | Clinical or artificially bright |
| Candid expressions, mid-action | Posed, looking-at-camera |
| Warm, desaturated tones | Over-saturated colors |

**Image Treatment:**
- Apply subtle warmth (+5 temperature)
- Reduce saturation slightly (-10%)
- Soft vignette optional
- Never pure white backgrounds

### Illustration Style

If using illustrations:
- Hand-drawn, slightly imperfect lines
- Earth tone palette
- Minimal detail, focus on silhouettes
- No cartoon babies or storks
- Could pass as editorial magazine art

---

## Spacing & Layout

### Spacing Scale

Based on 4px grid with 8px as the primary unit.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-1` | 4px | Tight inline spacing |
| `--space-2` | 8px | Default element spacing |
| `--space-3` | 12px | Related elements |
| `--space-4` | 16px | Card padding, button padding |
| `--space-5` | 24px | Section separation |
| `--space-6` | 32px | Major section gaps |
| `--space-8` | 48px | Page sections |
| `--space-12` | 64px | Hero spacing |

### Layout Patterns

#### Bento Grid

Modular, scannable layout for dashboard content.

```
┌─────────────────┬──────────┐
│                 │          │
│    Primary      │ Secondary│
│    Content      │   Card   │
│                 │          │
├────────┬────────┼──────────┤
│  Card  │  Card  │   Card   │
│   1    │   2    │    3     │
└────────┴────────┴──────────┘
```

- Cards have consistent 16px padding
- Gap: 16px between cards
- Border radius: 16px (large), 12px (medium), 8px (small)

#### Timeline-First Layout

For tracking feeds, sleep, diapers:

```
┌─────────────────────────────────┐
│ ● 2:30 AM  Feed (Left breast)  │
│   Duration: 12 min             │
├─────────────────────────────────┤
│ ● 1:45 AM  Diaper (Wet)       │
├─────────────────────────────────┤
│ ● 11:00 PM Sleep started       │
└─────────────────────────────────┘
```

- Vertical timeline with clear timestamps
- Tap-to-expand for details
- Swipe-to-edit or undo

#### Bottom-Anchored Navigation

Primary navigation at bottom for thumb-zone reach.

```
┌─────────────────────────────────┐
│                                 │
│         Content Area            │
│                                 │
│                                 │
├─────────────────────────────────┤
│  🏠    📊    ➕    🛒    👤    │
│ Home  Track  Log  Shop  Profile │
└─────────────────────────────────┘
```

- 5 max items
- Center action (➕) is primary CTA
- Icons: 24px with labels below
- Active state: filled icon + accent color

### Touch Targets

| Device | Minimum Size |
|--------|--------------|
| iOS | 44 × 44 pt |
| Android | 48 × 48 dp |
| **Coral Standard** | **56 × 56 dp** |

**Why 56dp?** Shaky-handed taps at 3am misfire constantly. Oversized targets reduce frustration.

---

## Components

### Buttons

#### Primary Button

```css
.btn-primary {
  background: var(--coral-primary);
  color: white;
  padding: 14px 24px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 16px;
  min-height: 56px;
  transition: transform 0.1s ease-out, box-shadow 0.15s ease-out;
}

.btn-primary:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(198, 123, 92, 0.3);
}

.btn-primary:active {
  transform: scale(0.98);
}
```

#### Button Variants

| Variant | Background | Text | Border | Usage |
|---------|------------|------|--------|-------|
| Primary | `--coral-primary` | White | None | Main actions |
| Secondary | Transparent | `--coral-primary` | 2px `--coral-primary` | Secondary actions |
| Ghost | Transparent | `--text-secondary` | None | Tertiary actions |
| Danger | `--coral-error` | White | None | Destructive actions |

### Cards

#### Base pattern (shipped)

- **Minimal border:** `1px solid var(--mushroom)` on all sides (`--card-border`); no drop shadow by default
- **Hover:** slightly stronger border + `--shadow-sm` on interactive cards
- **Legacy class:** `.card-accent-top` — still used in JSX; now applies the shared border (no top bar)
- **Radius:** `--radius-lg` (20px) on grid cards

```css
.card-accent-top {
  border: var(--card-border);
  box-shadow: none;
}
```

| Card type | Classes | Border |
|-----------|---------|--------|
| DIY / Care guides | `.content-card.card-accent-top` | Yes |
| Care clothes (full row) | `.content-card--span-row` | Yes |
| Shopping | `.shop-product-card.card-accent-top` | Yes; softer when `.shop-item-checked` |
| Travel tips | `.travel-tip-card.card-accent-top` | Yes |
| Month activities | `.activity-card.card-accent-top` | Yes |

Set category color on the element:

```jsx
style={{ '--cat-color': cat.color, '--cat-bg': cat.bg }}
```

#### Detail modal

- Mobile: bottom sheet, `max-height: min(75dvh, calc(100dvh - 24px))`, scrollable body
- Desktop: centered, `max-width: 480px`
- Close: subtle `×` top-right; title reserves `padding-right: 44px`
- Safe area: `padding-bottom: env(safe-area-inset-bottom)` on mobile

#### Site footer (`Footer.jsx`)

Persistent on every route in `App.jsx` (below `<main className="app-main">`).

| Region | Content |
|--------|---------|
| Brand | Yarn Trails logo + tagline |
| Nav | Home, Shopping, Travel, Mom Care, Community, Progress, Sources |
| Meta | Disclaimer + copyright |

Mobile: footer `padding-bottom` clears fixed bottom nav. Print: hidden.

#### Mom postpartum timeline (`MomMilestonesPanel`)

Inside Mom Care (`/mom-care#timeline`):

- Read-only bullet lists (`.mom-milestones-list`) — no checkbox tracking
- Period sections: `.mom-milestones-period` with `.card-accent-top`, lavender accent
- Hero shows postpartum week/month when `babyBirthDate` is set; banner if missing
- **Watch for** blocks: short red-flag bullets; never diagnosis — urge provider contact
- Disclaimer at panel footer; calm, exhaustion-aware copy (see Brand Voice)
- Spec: `docs/mom-milestones-ui-design.md`

#### Card Variants (other)

| Variant | Usage | Special Properties |
|---------|-------|-------------------|
| Log Card | Timeline entries | Swipe actions, undo |
| Stat Card | Dashboard metrics | Large number, trend indicator |
| Tip Card | Advice/guidance | Icon header, expandable |
| Action Card | Quick actions | Single-tap to execute |

### Quick Log Buttons

Single-tap logging for high-frequency actions.

```
┌──────────┐  ┌──────────┐  ┌──────────┐
│   🍼     │  │   💤     │  │   🚼     │
│  Feed    │  │  Sleep   │  │  Diaper  │
└──────────┘  └──────────┘  └──────────┘
```

- **56 × 56dp** minimum
- Haptic feedback on tap
- Success state: brief scale + checkmark
- Most common actions ranked by usage frequency

### Form Inputs

#### Text Input

```css
.input {
  background: var(--surface-primary);
  border: 2px solid var(--coral-mushroom);
  border-radius: 12px;
  padding: 14px 16px;
  font-size: 16px; /* CRITICAL: prevents iOS zoom */
  color: var(--text-primary);
  min-height: 56px;
}

.input:focus {
  border-color: var(--coral-primary);
  outline: none;
  box-shadow: 0 0 0 3px rgba(198, 123, 92, 0.15);
}

.input-error {
  border-color: var(--coral-error);
  animation: shake 0.3s ease-out;
}
```

#### Select (shared component)

Use `src/components/Select.jsx` for all dropdowns. See `docs/ui-design.md` for spec.

### Modal / Bottom Sheet

Mobile: Bottom sheet sliding up from bottom.
Desktop: Centered modal with backdrop.

```css
.bottom-sheet {
  background: var(--surface-elevated);
  border-radius: 24px 24px 0 0;
  padding: 24px;
  padding-bottom: calc(24px + env(safe-area-inset-bottom));
}

.modal {
  background: var(--surface-elevated);
  border-radius: 20px;
  padding: 32px;
  max-width: 480px;
  margin: auto;
}
```

### Toast Notifications

Non-intrusive feedback for async actions.

| Type | Icon | Background |
|------|------|------------|
| Success | ✓ | `--coral-success` at 10% |
| Warning | ⚠ | `--coral-warning` at 10% |
| Error | ✕ | `--coral-error` at 10% |
| Info | ℹ | `--coral-info` at 10% |

```css
.toast {
  padding: 14px 20px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  animation: slideIn 0.2s ease-out;
}
```

---

## Motion & Micro-interactions

### Philosophy

Motion is a **design token**, not polish. Every animation communicates meaning, brand, or system state.

### Motion Tokens

| Token | Duration | Curve | Usage |
|-------|----------|-------|-------|
| `--motion-instant` | 100ms | ease-out | Button feedback, hover |
| `--motion-fast` | 150ms | ease-out | Toggles, small state changes |
| `--motion-normal` | 250ms | ease-out | Cards, panels |
| `--motion-surface` | 400ms | ease-out | Home scroll-synced background |
| `--motion-slow` | 400ms | ease-in-out | Page transitions, modals |

### Spring Physics

Use spring animations for interactive elements (not linear or ease).

```javascript
// Framer Motion spring config
const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30
};
```

### Micro-interaction Patterns

| Interaction | Motion |
|-------------|--------|
| Button tap | Scale to 0.98, spring back |
| Button hover | Scale to 1.02, subtle shadow |
| Card expand | Layout animation with spring |
| List reorder | FLIP animation (Framer Motion) |
| Log success | Checkmark + scale pulse |
| Error | Shake (0.3s, 10px horizontal) |
| Page enter | Fade + slide up (150ms) |
| Modal open | Fade backdrop + slide up content |

### Accessibility: Reduced Motion

All motion must respect `prefers-reduced-motion`.

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Replace animations with instant state changes or simple opacity crossfades.

### Performance Rules

1. Only animate `transform` and `opacity` (GPU-accelerated)
2. Never animate `width`, `height`, `margin`, `padding`
3. Use `will-change` sparingly, only on elements about to animate
4. Target 60fps; test on low-end devices

---

## Accessibility

### Core Requirements

| Requirement | Standard |
|-------------|----------|
| Color contrast | WCAG 2.1 AA (4.5:1 text, 3:1 UI) |
| Touch targets | 56 × 56dp minimum |
| Focus indicators | Visible on all interactive elements |
| Screen readers | All interactive elements labeled |
| Reduced motion | Respect `prefers-reduced-motion` |

### Context-Specific Accessibility

**Low Light (3am usage):**
- High contrast mode option
- No pure white (#FFFFFF)—use off-white (#FAF7F2)
- Auto dark mode by time/system

**One-Handed Use:**
- Bottom navigation
- Critical actions in thumb zone
- Swipe gestures for common actions

**Tired/Distracted Users:**
- Reversible actions (undo everywhere)
- Confirmation for destructive actions only
- Clear, concise language
- No time pressure

### Testing Checklist

- [ ] VoiceOver (iOS) full navigation
- [ ] TalkBack (Android) full navigation
- [ ] Keyboard-only navigation (desktop)
- [ ] Color blindness simulation (all 3 types)
- [ ] 200% zoom legibility
- [ ] Low-light readability test
- [ ] Sunlight glare readability test

---

## Brand Voice

### Tone Attributes

| Attribute | Description |
|-----------|-------------|
| **Supportive** | "You're doing great. Here's what comes next." |
| **Practical** | Focus on actionable guidance, not theory |
| **Calm** | Never urgent or stressful in tone |
| **Honest** | Acknowledge hard moments without toxic positivity |
| **Inclusive** | All caregivers, all families, all parenting styles |

### Writing Guidelines

**Do:**
- Use "you" and "your baby" (personal)
- Keep sentences short
- Lead with the action ("Tap to log" not "You can tap to log")
- Acknowledge reality ("Sleep regressions are hard. Here's what helps.")

**Don't:**
- Use "mom" exclusively (use "parent," "caregiver," "you")
- Add unnecessary emoji
- Use medical jargon without explanation
- Make parents feel judged or inadequate

### Example Copy

| Screen | Bad | Good |
|--------|-----|------|
| Empty state | "No logs yet. Start logging!" | "Nothing logged today. That's okay." |
| Error | "Error!" | "Something went wrong. We saved your draft." |
| Success | "Great job, mama! 🎉" | "Logged." |
| Guidance | "You should..." | "Most parents find..." |

---

## Implementation Guidelines

### CSS Variables Setup

```css
:root {
  /* Colors */
  --coral-primary: #C67B5C;
  --coral-primary-light: #E8A48C;
  --coral-primary-dark: #A0522D;
  --coral-sage: #9CAF88;
  --coral-sage-muted: #B5C4A8;
  --coral-sand: #E8DFD4;
  --coral-cream: #FAF7F2;
  --coral-mushroom: #C9C0B5;
  --coral-charcoal: #3D3D3B;
  --coral-charcoal-soft: #5A5A58;
  
  /* Semantic */
  --coral-success: #6B8E6B;
  --coral-warning: #D4A556;
  --coral-error: #C97B7B;
  --coral-info: #7B9CAF;
  
  /* Surfaces */
  --surface-primary: #FAF7F2;
  --surface-elevated: #FFFFFF;
  --surface-raised: #FFFFFF;
  
  /* Text */
  --text-primary: #3D3D3B;
  --text-secondary: #5A5A58;
  
  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-8: 48px;
  --space-12: 64px;
  
  /* Typography */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-md: 18px;
  --text-lg: 20px;
  --text-xl: 24px;
  --text-2xl: 32px;
  --text-3xl: 40px;
  
  /* Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  
  /* Motion */
  --motion-instant: 100ms;
  --motion-fast: 150ms;
  --motion-normal: 250ms;
  --motion-slow: 400ms;
  
  /* Shadows */
  --shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.04);
  --shadow-md: 0 4px 12px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  :root {
    --surface-primary: #1A1A18;
    --surface-elevated: #252523;
    --surface-raised: #2E2E2B;
    --text-primary: #F5F2ED;
    --text-secondary: #A8A5A0;
  }
}
```

### Font Loading

```html
<link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link
  href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;0,6..72,700;1,6..72,400;1,6..72,500&display=swap"
  rel="stylesheet"
>
```

Also loaded via `@import` in `src/styles/global.css`.
### Animation Library

Recommended: Framer Motion (React)

```bash
npm install framer-motion
```

```jsx
import { motion, AnimatePresence } from 'framer-motion';

// Card with spring animation
<motion.div
  layout
  transition={{ type: "spring", stiffness: 300, damping: 30 }}
>
  {/* content */}
</motion.div>
```

### Responsive Breakpoints

| Breakpoint | Width | Usage |
|------------|-------|-------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640–1024px | 2 columns, adapt nav |
| Desktop | > 1024px | 3+ columns, sidebar nav |

```css
/* Mobile-first approach */
.container { }

@media (min-width: 640px) {
  .container { /* tablet */ }
}

@media (min-width: 1024px) {
  .container { /* desktop */ }
}
```

### Testing Checklist

Before shipping any UI change:

- [ ] Mobile: 375px (iPhone SE)
- [ ] Mobile: 390px (iPhone 14)
- [ ] Tablet: 768px
- [ ] Desktop: 1280px
- [ ] Light mode (only shipped theme)
- [ ] Reduced motion preference
- [ ] Screen reader navigation
- [ ] Touch targets ≥ 56dp

---

## Shipped vs planned

| Item | Status |
|------|--------|
| Light Wool & Trail palette | Shipped — `global.css` |
| Manrope body typography | Shipped |
| Newsreader display serif | Shipped |
| Phosphor Light icons | Shipped — `Icon.jsx`, `phosphorIconMap.js` |
| Soothing UI sounds (WAV) | Shipped — `public/sounds/`, always on |
| PageHero + editorial images | Shipped — `PageHero.jsx`, `public/images/heroes/` |
| Journey-ordered nav (6 desktop / 5 mobile) | Shipped |
| Today home dashboard | Shipped |
| Premium scaffold | Shipped — local trial |
| Yarn Trails SVG logo (`CoralLogo`) | Shipped |
| Minimal card border (`.card-accent-top`) | Shipped |
| Full 1px border, no top accent bar | Shipped |
| Detail modal (scroll, safe area) | Shipped |
| Dark mode | Deferred |
| Framer Motion | Not required; CSS transitions only |

---

## Resources

### Fonts
- [Newsreader (Google Fonts)](https://fonts.google.com/specimen/Newsreader)
- [Manrope (Google Fonts)](https://fonts.google.com/specimen/Manrope)

### Icons
- [Lucide Icons](https://lucide.dev/)

### Animation
- [Framer Motion](https://www.framer.com/motion/)
- [Auto Animate](https://auto-animate.formkit.com/)

### Research Sources
- CubTrack UX Case Study (OakFox)
- Huckleberry App Patterns
- Kiddie Academy 2026 Parent Survey
- Color Trends 2026 (ColorArchive)
- Font Trends 2026 (Made Good Designs)

---

*Document Version: 1.0*  
*Last Updated: May 2026*  
*Maintainer: Design Team*
