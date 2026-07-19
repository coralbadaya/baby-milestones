# Brand Assets Skill

Use when changing the Yarn Trails logo, favicon, app icons, OG image, colors, or SEO/PWA metadata.

## Triggers

- Update or redraw the logo / mark
- Regenerate favicons or app icons
- Change brand colors
- Fix SEO, OG image, manifest, robots, or sitemap

## Before you start

Read `docs/brand-identity.md` (logo, palette, asset list, SEO files).

## Logo workflow

1. The master is `public/brand/yarntrails-mark.svg` (viewBox 0 0 64 64).
2. Edit the SVG paths; keep yarn gold `#C4A35A` and trail moss `#3F5E52`.
3. Mirror geometry into `src/components/CoralLogo.jsx` (`CoralMark`) and `public/brand/yarntrails-logo.svg`.
4. Inspect by rendering to PNG with sharp before committing.

## Regenerate all assets

```bash
npm run generate:brand
```

Outputs favicons, iOS/Android/PWA icons, maskable, store icon, and OG image into `public/`. Script: `scripts/generate-brand-assets.mjs`.

## Colors

Edit tokens in `src/styles/global.css` `:root`. Wool & Trail anchors: `--brand-trail` / `--coral-primary` (`#3F5E52`), `--brand-gold` (`#C4A35A`), `--cream` mist (`#F3F5F2`), `--brand-ink`. Keep WCAG AA contrast. See `docs/yarntrails-retheme-plan.md`.

## Typography

- Display: Newsreader (`--font-display`)
- Body: Manrope (`--font-body`)


## SEO / PWA checklist

- `index.html`: title, description, canonical, OG/Twitter, theme-color, JSON-LD
- `public/manifest.webmanifest`: name, icons, theme_color
- `public/robots.txt` + `public/sitemap.xml`
- Live domain: `https://yarntrails.com` (`SITE_URL` in `brand.js`)
- After changes, validate with a Lighthouse SEO/PWA run

## Rules

- AI generates concepts only (raster); production logo is hand-built SVG.
- Never ship a logo that isn't legible at 16px.
- Keep one master SVG → all sizes via the generator (single source of truth).
