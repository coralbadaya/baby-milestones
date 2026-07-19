# Yarn Trails Rebrand — Phased Plan

> Nestbean / Nestmile → **Yarn Trails** name, copy, brand assets, SEO, and infra cutover.  
> Visual retheme (palette, typography, layout/editorial system) is **out of scope** — see [Retheme follow-up](#retheme-follow-up).

**Status:** Implemented in code (July 2026) — retheme still deferred  
**Domain (live):** `https://yarntrails.com` (Namecheap + Vercel)  
**Brand source of truth:** [`src/constants/brand.js`](../src/constants/brand.js)  
**Identity doc:** [`docs/brand-identity.md`](brand-identity.md)  
**Constitution:** [`docs/doctrine.md`](doctrine.md) · [`docs/doctrine-summary.md`](doctrine-summary.md)

**Implementation note:** Clean rename only — **no** Nestbean/Nestmile localStorage dual-read and **no** guide URL redirects for old slugs. Browsers that only have old keys will not auto-migrate.

---

## Locked decisions

| Element | Value |
|---------|--------|
| Display name | **Yarn Trails** |
| Slug / handles | `yarntrails` |
| Domain | `https://yarntrails.com` |
| Contact email | `hello@yarntrails.com` |
| Tagline (this pass) | *The art of early motherhood* |
| Short tagline | *early motherhood* |
| Plan names | Yarn Trails Basic · Yarn Trails Plus |
| Social URLs | `yarntrails` placeholders until handles are claimed |
| Comparison guide slug | `yarntrails-vs-qeepsake` (no alias for old `nestbean-vs-*`) |
| Logo component file | `CoralLogo.jsx` filename kept; visible mark/wordmark is Yarn Trails |
| Storage keys | Clean rename to `yarntrails*` / `yarntrailsPremium` — no legacy dual-read |
| Test login emails | Keep existing `nestbean-test-*@mailinator.com` seeds (ops identities) |

---

## Non-goals (this plan)

- Palette, CSS token, or typography changes (`global.css`, Fraunces/Switzer roles, cream/terracotta system)
- Editorial page system / PageHero layout redesign
- Information architecture or primary nav reorder
- Monetization model or entitlement limit changes (rename plans only)
- Renaming internal React component filenames (`CoralLogo`, etc.)
- Full rewrite of archived prototypes under `docs/prototypes/`
- Dual-read / migration of Nestbean or Nestmile localStorage keys

---

## Phase status

| Phase | Scope | Status |
|-------|--------|--------|
| 0 | Decisions + inventory | **Complete** |
| 1 | Brand / SEO source of truth | **Complete** |
| 2 | Logo + brand assets | **Complete** |
| 3 | Product copy, plans, guides | **Complete** |
| 4 | Persistence (clean rename) | **Complete** |
| 5 | Infra (auth, email, env, deploy) | **Partial** — code done; dashboard secrets / Resend / Auth URL ops remain |
| 6 | Docs / agent surface + verification | **Complete** (`npm test` + `npm run build` green; push/smoke pending) |

---

## Shipped inventory (post-rebrand)

### Brand

- [`src/constants/brand.js`](../src/constants/brand.js) — `BRAND_NAME = 'Yarn Trails'`, `SITE_URL`, socials, contact
- [`index.html`](../index.html), [`public/manifest.webmanifest`](../public/manifest.webmanifest), [`pageMeta.js`](../src/utils/pageMeta.js)
- Legal pages via `BRAND_NAME` in [`legalContent.js`](../src/data/legalContent.js)

### Logo & assets

- Mark / lockup / watermark: `public/brand/yarntrails-{mark,logo,watermark}.svg`
- Generated favicons, PWA icons, OG, JPG watermark via `npm run generate:brand`
- [`CoralLogo.jsx`](../src/components/CoralLogo.jsx) — yarn ball + trail threads
- [`brandAssets.js`](../src/constants/brandAssets.js) — `BRAND_WATERMARK_*`

### Plans & copy

- [`premium.js`](../src/constants/premium.js) — Yarn Trails Basic / Plus; `yarntrailsPremium`
- UI / book / auth / community strings updated across `src/`
- Guides: `yarntrails-vs-qeepsake`; sitemap regenerated

### localStorage (canonical only)

| Key | Purpose |
|-----|---------|
| `yarntrailsPremium` | Anonymous Plus preview |
| `yarntrailsFirstMoments` | Life firsts |
| `yarntrailsAlbumPhotos` | Monthly album |
| `yarntrailsVoiceNotes` | Voice notes |
| `yarntrails-cookie-consent` | Cookie preference |
| `yarntrails-install-prompt-dismissed` | Install prompt dismiss |

---

## Phase 0 — Decisions

**Acceptance criteria (met):**

- [x] Locked decisions match stakeholder intent (Yarn Trails; no legacy storage)
- [x] Retheme explicitly out of scope
- [x] Inventory covered brand, plans, guides, storage keys

---

## Phase 1 — Brand / SEO source of truth

**Acceptance criteria (met):**

- [x] `BRAND_NAME` is Yarn Trails; SEO description names Yarn Trails Plus
- [x] `index.html` / manifest / JSON-LD use Yarn Trails; canonical is yarntrails.com
- [x] Newsletter shared `BRAND_NAME` aligned
- [x] Related unit tests pass

---

## Phase 2 — Logo + brand assets

**Acceptance criteria (met):**

- [x] Header/footer show Yarn Trails lockup (yarn + trail mark)
- [x] Favicon / PWA / OG regenerated from new mark
- [x] DIY / image fallbacks use `yarntrails-watermark`
- [x] [`docs/brand-identity.md`](brand-identity.md) and brand-assets skill match assets
- [x] No palette/token retheme required for pass

---

## Phase 3 — Product copy, plans, guides

**Acceptance criteria (met):**

- [x] Primary product UI shows Yarn Trails (not Nestbean)
- [x] Plan cards / gates say Yarn Trails Basic / Plus
- [x] `/guides/yarntrails-vs-qeepsake` in data + sitemap (no old-slug redirect)
- [x] `npm test` and `npm run build` pass

---

## Phase 4 — Persistence (clean rename)

**Goal:** Use Yarn Trails keys only; do not dual-read Nestbean/Nestmile keys.

**Acceptance criteria (met):**

- [x] Canonical keys listed above shipped in hooks/constants
- [x] Unit tests updated for new key names
- [x] Documented in [`memory.md`](../memory.md)
- [x] Explicit: no migration path for old keys (by product choice)

---

## Phase 5 — Infra cutover (ops remaining)

### Done in repo

- [x] `SITE_URL` / sitemap / robots / checkout & newsletter fallbacks → yarntrails.com
- [x] Docs examples use yarntrails.com / hello@yarntrails.com

### Still operator actions

- [ ] Push / deploy rebrand commit to production
- [ ] Vercel env: `SITE_URL=https://yarntrails.com`
- [ ] Supabase Auth Site URL + redirect allow list for yarntrails.com / www
- [ ] Edge secrets: `SITE_URL`, `NEWSLETTER_FROM=hello@yarntrails.com`
- [ ] Resend: verify yarntrails.com sending domain
- [ ] Namecheap: forward `hello@yarntrails.com`
- [ ] Stripe branding labels if live
- [ ] Optional: 301 nestbean.app → yarntrails.com if that domain is owned

**Acceptance criteria (partial):**

- [ ] Production View Source shows Yarn Trails after deploy
- [ ] Auth magic links land on yarntrails.com
- [ ] Newsletter From uses verified yarntrails.com domain

---

## Phase 6 — Docs & verification

**Acceptance criteria (met for code):**

- [x] `memory.md`, doctrine, CLAUDE, coral.mdc, brand docs updated
- [x] Design-doc index includes this plan
- [x] `npm test` (197) and `npm run build` pass
- [ ] Production smoke on yarntrails.com after push

---

## Retheme follow-up

**Deferred.** Separate plan for palette, typography, motion, and editorial layout under Yarn Trails. Do not fold retheme into this rebrand’s remaining ops checklist.

---

*Updated: July 2026*
