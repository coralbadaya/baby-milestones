# Coral Design System 2026

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

### Who They Are

| Generation | Age Range | Key Characteristics |
|------------|-----------|---------------------|
| Gen Z Parents | 22–29 | Digital-native, values-driven, outcome-focused, hybrid parenting style |
| Late Millennials | 30–38 | Emotionally supportive, mental-health conscious, gentle parenting evolved |

### Behavioral Insights (2026 Research)

**Hybrid Parenting Approach**
- 85% of parents blend 3+ parenting styles rather than following one rigidly
- 54% of Gen Z parents prioritize "preparing kids for the real world"
- 62% of millennial parents focus on emotional and mental well-being
- Only 38% of Gen Z parents use gentle parenting exclusively

**Digital Behavior**
- Prefer apps over phone calls or emails
- 48% use TikTok daily for learning
- Video-first content consumption
- Expect seamless, instant experiences

**Values**
- 68% use purchasing decisions to communicate their values
- Prioritize authenticity, sustainability, and transparency
- Reject "perfect parent" pressure—seek realistic, supportive tools
- Conscious of overstimulation; value "boring" time for children

### Usage Context (Critical for UX)

The primary usage state:
- Half asleep
- Holding a baby
- One hand free
- Low light (3am feeds)
- Shaky-handed taps
- Divided attention

**Every screen must assume this context.**

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

The shipped palette is **light, warm, and positive** — soft peach, lavender, and mint pastels on cream. It avoids heavy earth tones and auto dark mode so the app always feels airy and approachable.

**Source of truth:** [`src/styles/global.css`](src/styles/global.css) `:root` tokens.

### Primary Palette

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--coral-primary` | Soft Coral | `#E89060` | CTAs, active nav, accents |
| `--coral-primary-light` | Peach | `#FFD5C2` | Hero gradients, card CTA bg |
| `--coral-primary-dark` | Coral Deep | `#D87850` | Hover on primary |

### Secondary & Accents

| Token | Hex | Usage |
|-------|-----|-------|
| `--lavender` / `--lavender-dark` | `#E8E0F0` / `#9B88C0` | Secondary surfaces, progress rings |
| `--mint` / `--mint-dark` | `#D4ECD9` / `#5FB878` | Success, milestones checked |
| `--baby-blue` / `--baby-blue-dark` | `#D6E9F8` / `#5A9FD8` | Physical activity accent |
| `--rose` / `--rose-dark` | `#F8D4D8` / `#D88090` | Emotional activity accent |
| `--gold` / `--gold-dark` | `#F8ECC0` / `#C8A840` | Warnings, disclaimer borders |

### Neutrals

| Token | Hex | Usage |
|-------|-----|-------|
| `--cream` | `#FFFBF7` | Page background |
| `--cream-dark` | `#F5EDE5` | Subtle fills, inputs |
| `--mushroom` | `#D0C8C0` | Borders, disabled |
| `--text-primary` | `#2D2A2A` | Headings, body |
| `--text-secondary` | `#5A5555` | Meta, subtitles |
| `--text-light` | `#8A8585` | Captions |
| `--white` | `#FFFFFF` | Cards, modals |

### Semantic

| Token | Hex |
|-------|-----|
| `--success` | `#5FB878` |
| `--warning` | `#D8A850` |
| `--error` | `#D87878` |
| `--info` | `#5A9FD8` |

Legacy aliases (`--peach`, `--coral-sage`, etc.) map to the tokens above for backward compatibility.

### Dark Mode

**Deferred** — not shipped. Light palette only. Do not add `prefers-color-scheme: dark` overrides until explicitly designed.

### Accessibility Requirements

- All text must meet **WCAG 2.1 AA** contrast (4.5:1 for normal text, 3:1 for large)
- Never use color alone to convey meaning (pair with icons or text)
- Test palettes under:
  - Low light conditions
  - Direct sunlight (outdoor glare)
  - Protanopia, deuteranopia, tritanopia simulations

---

## Typography

### Philosophy

Move away from clinical neo-grotesks (Inter, SF Pro) toward **bouba grotesks**—soft, rounded, friendly typefaces that project warmth without sacrificing readability.

### Font Stack

| Role | Primary | Fallback |
|------|---------|----------|
| Display | **General Sans** | Cabinet Grotesk, system-ui |
| Body | **General Sans** | Hanken Grotesk, system-ui |
| Monospace | Geist Mono | JetBrains Mono, monospace |

**Why General Sans?**
- Gently rounded terminals
- Slightly curved strokes
- Generous counters
- Low contrast
- Free via Fontshare

### Type Scale

Based on a 1.25 ratio with 16px base.

| Token | Size | Weight | Line Height | Usage |
|-------|------|--------|-------------|-------|
| `--text-xs` | 12px | 400 | 1.5 | Captions, timestamps |
| `--text-sm` | 14px | 400 | 1.5 | Secondary text, labels |
| `--text-base` | 16px | 400 | 1.6 | Body text (minimum for mobile) |
| `--text-md` | 18px | 500 | 1.5 | Emphasized body |
| `--text-lg` | 20px | 600 | 1.4 | Card titles, section headers |
| `--text-xl` | 24px | 700 | 1.3 | Page section headers |
| `--text-2xl` | 32px | 700 | 1.2 | Page titles |
| `--text-3xl` | 40px | 800 | 1.1 | Hero headlines |

### Typography Rules

1. **Minimum 16px** for body text on mobile (CRITICAL for tired eyes)
2. **High contrast** between text and background
3. **Left-align** body text (no justify, no center for paragraphs)
4. **Line length** max 65–75 characters for readability
5. **No all-caps** for more than 2 words (accessibility + readability)

---

## Iconography & Imagery

### Icon Style

| Attribute | Specification |
|-----------|---------------|
| Style | Rounded, friendly, 2px stroke |
| Size | 24px default, 20px compact, 32px feature |
| Color | Single color, inherits text color |
| Library | Lucide Icons (recommended) or custom |

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

- **Bezel-less:** no full border frame; `--shadow-card` only
- **Category accent:** `.card-accent-top` — 3px inset top bar (full width within `border-radius`), color from `--cat-color`
- **Radius:** `--radius-lg` (20px) on grid cards

```css
.card-accent-top {
  position: relative;
  overflow: hidden;
}
/* Per card type — inset shadow fills full width inside border-radius */
.content-card.card-accent-top {
  box-shadow:
    inset 0 var(--card-accent-height) 0 0 var(--card-accent-color),
    var(--shadow-card);
}
```

| Card type | Classes | Accent? |
|-----------|---------|---------|
| DIY / Care guides | `.content-card.card-accent-top` | Yes |
| Care clothes (full row) | `.content-card--span-row` | No |
| Shopping | `.shop-product-card.card-accent-top` | Yes; faded when `.shop-item-checked` |
| Travel tips | `.travel-tip-card.card-accent-top` | Yes |
| Month activities | `.activity-card.card-accent-top` | Yes (physical/emotional color) |

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
| Brand | Coral logo + tagline |
| Nav | Home, Shopping, Travel, Mom Care, Community, Progress, Sources |
| Meta | Disclaimer + copyright |

Mobile: footer `padding-bottom` clears fixed bottom nav. Print: hidden.

#### Mom postpartum timeline (`MomMilestonesPanel`)

Inside Mom Care (`/mom-care#timeline`):

- Checkable rows reuse `.milestone-item` / `.milestone-check` (same as baby month detail)
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
<link rel="preconnect" href="https://api.fontshare.com" crossorigin>
<link 
  href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700&display=swap" 
  rel="stylesheet"
>
```

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
| Light warm palette | Shipped — `global.css` |
| General Sans typography | Shipped |
| Card top accent (`.card-accent-top`) | Shipped |
| Bezel-less cards + soft shadow | Shipped |
| Detail modal (scroll, safe area) | Shipped |
| Dark mode | Deferred |
| Framer Motion | Not required; CSS transitions only |

---

## Resources

### Fonts
- [General Sans (Fontshare)](https://www.fontshare.com/fonts/general-sans)
- [Cabinet Grotesk (Fontshare)](https://www.fontshare.com/fonts/cabinet-grotesk)

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
