# Imagery System

> Editorial, art-directed photography for Nestbean. **AI-generated primary**; licensed stock for signature moments.

---

## Art direction

| Attribute | Spec |
|-----------|------|
| Mood | Warm, candid, calm — never staged stock |
| Tone | +5 warmth, −10% saturation, soft contrast |
| Settings | Minimal luxury homes, tier-1 urban, spa-adjacent care |
| Diversity | Inclusive families and caregivers |
| Avoid | Storks, pacifiers clipart, Pinterest scrapes, over-bright studio |

---

## Legal sourcing tiers

| Tier | Source | Use |
|------|--------|-----|
| **Primary** | AI-generated (Cursor GenerateImage / DALL·E), brand prompts | All page heroes |
| **Secondary** | Unsplash / Pexels (attribution if required) | Blog, one-offs |
| **Premium** | Stocksy, Adobe Stock | Campaign heroes if AI insufficient |
| **Never** | Pinterest, random Google Images | ❌ Copyright risk |

---

## File layout

```
public/images/heroes/
  home.jpg          — Today dashboard
  baby.jpg          — My Baby hub
  mom-care.jpg      — My Care
  essentials.jpg    — Essentials hub
  community.jpg     — Community
  shopping.jpg      — (optional) Shopping deep link
  travel.jpg        — (optional) Travel deep link
  vaccination.jpg   — (optional) Vaccination
```

Manifest: `src/data/pageImages.js`

---

## `<PageHero>` component

**Path:** `src/components/PageHero.jsx`

| Prop | Type | Description |
|------|------|-------------|
| `imageKey` | string | Key in `pageImages` manifest |
| `eyebrow` | string | Small label above title |
| `title` | string | Display headline (Fraunces) |
| `subtitle` | string | Optional supporting line |
| `children` | node | Optional slot (e.g. birth date form) |
| `size` | `'lg' \| 'md'` | Hero height variant |
| `overlay` | `'dark' \| 'light'` | Scrim for text contrast |

### Placement

**Always full-bleed:** `<PageHero>` must be a **direct child of the page route**, outside any `max-width` wrapper. Page body content uses `.page-body` utilities — see [`docs/page-layout-standardization.md`](page-layout-standardization.md).

### Behavior

- `<picture>` or `<img>` with `loading="eager"` on home, `lazy` elsewhere
- Gradient scrim overlay for WCAG text contrast
- `onError` → CSS gradient fallback from manifest `fallbackGradient`
- Blur placeholder via inline `background-color` until load

### CSS classes

- `.page-hero` — full-viewport-width band, min-height 280px (default) / 360px (lg) / 240px (md); mobile heights in `page-layout-standardization.md`
- `.page-hero__scrim` — gradient overlay
- `.page-hero__content` — max-width container, bottom-aligned text
- `.page-hero__eyebrow` — uppercase tracked label
- `.page-hero__title` — Fraunces, `--text-3xl`

---

## AI prompt template

```
Editorial [SUBJECT] for premium parenting app. [SCENE DESCRIPTION].
Warm natural light, minimalist luxury [SETTING], desaturated warm tones,
magazine editorial style, candid not posed. Horizontal 16:9, no text, no logos.
```

### Page prompts

| Key | Subject |
|-----|---------|
| `home` | Mother holding newborn, golden hour, cream/coral interior |
| `baby` | Baby tummy time on linen blanket, soft window light |
| `momCare` | Woman resting, spa-like bedroom, lavender/cream |
| `essentials` | Premium baby flat-lay on marble |
| `community` | Diverse mothers in bright café, urban tier-1 |
| `travel` | Airport lounge or boutique hotel with travel stroller |
| `vaccination` | Calm pediatric wellness moment (no needles prominent) |

---

## Optimization pipeline (future)

1. Export PNG from AI → `scripts/optimize-heroes.mjs`
2. Generate WebP + AVIF at 640 / 1280 / 1920 widths
3. Update manifest with `srcset` entries

Until then, ship `.jpg` in `public/images/heroes/`.

---

*Last updated: June 2026*
