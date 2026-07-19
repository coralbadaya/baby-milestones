# Brand Assets Skill

Use when changing the Nestbean logo, favicon, app icons, OG image, colors, or SEO/PWA metadata.

## Triggers

- Update or redraw the logo / mark
- Regenerate favicons or app icons
- Change brand colors
- Fix SEO, OG image, manifest, robots, or sitemap

## Before you start

Read `docs/brand-identity.md` (logo, palette, asset list, SEO files).

## Logo workflow

1. The master is `public/brand/nestbean-mark.svg` (viewBox 0 0 64 64).
2. Edit the SVG paths; keep terracotta `#C2603E` stems and gold `#C9A24B` bean.
3. Mirror geometry into `src/components/CoralLogo.jsx` (`CoralMark`) and `public/brand/nestbean-logo.svg`.
4. Inspect by rendering to PNG with sharp before committing.

## Regenerate all assets

```bash
npm run generate:brand
```

Outputs favicons, iOS/Android/PWA icons, maskable, store icon, and OG image into `public/`. Script: `scripts/generate-brand-assets.mjs`.

## Colors

Edit tokens in `src/styles/global.css` `:root`. Anchor tokens: `--brand-terracotta`, `--brand-gold`, `--brand-clay`, `--brand-ink`. Keep WCAG AA contrast.

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
