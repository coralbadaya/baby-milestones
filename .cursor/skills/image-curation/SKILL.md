# Image Curation Skill

Use when adding, replacing, or optimizing page hero images and editorial photography for Nestmile.

## Triggers

- New page needs a hero image
- Regenerating AI art for a section
- Optimizing images for LCP
- Updating `src/data/pageImages.js`

## Before you start

1. Read `docs/imagery-system.md`
2. Check existing assets in `public/images/heroes/`
3. Never scrape Pinterest or unlicensed web images

## Workflow

### 1. Choose image key

Use keys from `src/data/pageImages.js`: `home`, `baby`, `momCare`, `essentials`, `community`, `shopping`, `travel`, `vaccination`.

### 2. Generate (AI primary)

Use the prompt template from `docs/imagery-system.md`:

```
Editorial [SUBJECT] for premium parenting app. [SCENE].
Warm natural light, minimalist luxury [SETTING], desaturated warm tones,
magazine editorial style, candid not posed. Horizontal 16:9, no text, no logos.
```

Generate at 16:9. Save to `public/images/heroes/{key}.jpg`.

### 3. Wire manifest

Update `src/data/pageImages.js`:

```js
home: {
  src: '/images/heroes/home.jpg',
  alt: '...',
  fallbackGradient: 'linear-gradient(...)',
},
```

### 4. Use PageHero

```jsx
<PageHero
  imageKey="home"
  eyebrow="Good evening"
  title="Your baby is 4 months old"
  subtitle="Here's what matters this week."
/>
```

### 5. Optimize (optional)

Run `node scripts/optimize-heroes.mjs` when WebP/AVIF pipeline exists.

## Quality checklist

- [ ] Text readable on scrim (WCAG AA)
- [ ] No stock clichés (storks, pacifier clipart)
- [ ] Diverse, tier-1 aesthetic
- [ ] File < 400KB where possible
- [ ] `alt` describes scene, not "hero image"
- [ ] Design doc updated if new page type

## Legal

- AI-generated: owned for product use
- Unsplash: verify license + attribution if required
- Never: Pinterest, Google Image scrape
