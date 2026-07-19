# Brand Identity — Yarn Trails

> **Yarn Trails** — *The art of early motherhood.*
> Quiet-luxury identity for affluent new mothers in tier-1 cities.

---

## Name & tagline

| Element | Value |
|---------|-------|
| Name | **Yarn Trails** |
| Tagline | The art of early motherhood |
| Short tagline | early motherhood |
| Source of truth | `src/constants/brand.js` |

---

## Logo

**Mark:** A spun-gold yarn ball with winding arcs, and moss trail threads leading outward — the path of early motherhood.

| Asset | Path | Use |
|-------|------|-----|
| Master mark (SVG) | `public/brand/yarntrails-mark.svg` | Source for all generated assets |
| Lockup (SVG) | `public/brand/yarntrails-logo.svg` | Mark + wordmark + tagline |
| Watermark SVG | `public/brand/yarntrails-watermark.svg` | Source for editorial placeholder JPG |
| React | `src/components/CoralLogo.jsx` | In-app header/footer (component name legacy) |
| favicon.svg | `public/favicon.svg` | Browser tab (vector) |

**Wordmark:** Newsreader (display serif), weight 600, letter-spacing −0.02em.

### Clear space & sizing
- Keep clear space ≥ the yarn-ball radius around the mark.
- Minimum mark size: 24px (favicon uses 16–48px PNGs).
- Never recolor the mark outside brand palette; never add shadows/3D.

---

## Color palette (Wool & Trail)

| Token | Hex | Use |
|-------|-----|-----|
| `--brand-trail` / `--coral-primary` | `#3F5E52` | Primary CTAs, logo trail, active nav |
| `--coral-primary-dark` | `#2F4A40` | Hover |
| `--coral-primary-light` | `#D5E3DC` | Tints, hero washes |
| `--brand-gold` / `--brand-yarn` | `#C4A35A` | Yarn ball, accents, dividers |
| `--gold-dark` | `#9A7D3A` | Gold hover / strokes |
| `--brand-clay` | `#D2C0A4` | Soft flax accent |
| `--cream` | `#F3F5F2` | Page background (wool mist) |
| `--cream-dark` | `#E4E9E4` | Fills |
| `--sand` | `#EBEFEC` | Subtle surfaces |
| `--brand-ink` / `--text-primary` | `#1E2A26` | Headings, body |
| `--text-secondary` | `#4A5650` | Meta |

**Typography:** Display **Newsreader**; body/UI **Manrope**. Spec: [`yarntrails-retheme-plan.md`](yarntrails-retheme-plan.md).

Source of truth: `src/styles/global.css` `:root`.

---

## In-house asset system

**Script:** `scripts/generate-brand-assets.mjs` (uses `sharp` + `png-to-ico`).
**Run:** `npm run generate:brand` — regenerate after any logo change.

| Output | Size | Use |
|--------|------|-----|
| `favicon.svg` | vector | Modern browsers |
| `favicon.ico` | 16/32/48 | Legacy browsers |
| `favicon-16/32/48.png` | 16/32/48 | Browser tabs |
| `apple-touch-icon.png` | 180 | iOS home screen |
| `icon-192.png` / `icon-512.png` | 192/512 | Android / PWA |
| `icon-maskable-512.png` | 512 (safe zone) | Android adaptive |
| `icon-store-1024.png` | 1024 | App Store / Play Store (future) |
| `og-default.png` | 1200×630 | Social sharing |

To produce native app icons later (iOS `.icns`, Android mipmaps), feed `icon-store-1024.png` into Xcode/Android Studio asset tooling.

---

## SEO infrastructure

| File | Purpose |
|------|---------|
| `index.html` | Title, description, canonical, OG/Twitter, theme-color, JSON-LD (Organization + WebSite + WebApplication) |
| `src/utils/pageMeta.js` | Per-route meta (title/description/OG) |
| `public/manifest.webmanifest` | PWA install metadata |
| `public/robots.txt` | Crawl directives + sitemap link |
| `public/sitemap.xml` | Route index for search engines |

**Live domain:** `https://yarntrails.com` (wired in `SITE_URL`, `index.html`, `robots.txt`, `sitemap.xml`). Point Namecheap DNS at Vercel (`A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`).

---

*Last updated: July 2026*
