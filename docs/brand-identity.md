# Brand Identity — Nestbean

> **Nestbean** — *The art of early motherhood.*
> Quiet-luxury identity for affluent new mothers in tier-1 cities.

---

## Name & tagline

| Element | Value |
|---------|-------|
| Name | **Nestbean** |
| Tagline | The art of early motherhood |
| Short tagline | early motherhood |
| Source of truth | `src/constants/brand.js` |

---

## Logo

**Mark:** An "N" monogram cradling a golden bean — the baby in the nest. Two terracotta stems + diagonal form the N; a honey-gold bean (with a small head) rests in the cradle.

| Asset | Path | Use |
|-------|------|-----|
| Master mark (SVG) | `public/brand/nestbean-mark.svg` | Source for all generated assets |
| Lockup (SVG) | `public/brand/nestbean-logo.svg` | Mark + wordmark + tagline |
| React | `src/components/CoralLogo.jsx` | In-app header/footer (component name legacy) |
| favicon.svg | `public/favicon.svg` | Browser tab (vector) |

**Wordmark:** Fraunces (display serif), weight 600, letter-spacing −0.01em.

### Clear space & sizing
- Keep clear space ≥ the height of the bean around the mark.
- Minimum mark size: 24px (favicon uses 16–48px PNGs).
- Never recolor the mark outside brand palette; never add shadows/3D.

---

## Color palette (Palette A)

| Token | Hex | Use |
|-------|-----|-----|
| `--brand-terracotta` / `--coral-primary` | `#C2603E` | Primary, logo stems, CTAs |
| `--coral-primary-dark` | `#A54E30` | Hover |
| `--coral-primary-light` | `#EFD2C4` | Tints, hero gradients |
| `--brand-gold` / `--gold-dark` | `#C9A24B` / `#A8842F` | Bean, accents, dividers |
| `--brand-clay` | `#D8A088` | Soft accent |
| `--cream` | `#FCF8F2` | Page background (ivory) |
| `--cream-dark` | `#EFE3D4` | Fills |
| `--sand` | `#F5ECE0` | Subtle surfaces |
| `--brand-ink` / `--text-primary` | `#2B2622` | Headings, body |
| `--text-secondary` | `#5A5048` | Meta |

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
