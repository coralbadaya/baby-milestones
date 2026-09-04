# Navigation, Footer & SEO

Information architecture, navigation chrome, and SEO/GEO infrastructure for Yarn Trails.

> Yarn Trails is a **YMYL** (Your Money or Your Life — baby health) product. The nav and
> footer double as **E-E-A-T** trust surfaces. Treat trust/legal/editorial links as
> first-class, not afterthoughts.

---

## Information architecture

```
Top nav (lean):   Today · My Baby · My Care · Essentials · Community · Guides · Sign up · Sign in/Account · [Premium CTA]
Mobile bottom bar: Today · Baby · Care · Essentials · Community   (Guides/Premium live elsewhere)

Footer (4 columns):
  Explore  | Learn              | Company            | Legal & Trust
  --------- ------------------- -------------------- -------------------
  My Baby  | Guides & Articles  | About Us           | Privacy Policy
  My Care  | Milestones by Month| How We Research    | Terms of Service
  Essentials| Vaccination Sched.| Medical Reviewers  | Cookie Policy
  Vaccination| FAQ              | Sources & Citations| Medical Disclaimer
  Travel   |                    | Contact            | Accessibility
  Community|                    | Premium            |
  Progress |                    |                    |
  Bottom bar: social icons · newsletter · disclaimer · © year
```

## Data model — `src/routes.js`

- `ROUTES` — all paths (incl. `guides`, `guide(slug)`, `faq`, `about`, `contact`,
  `login`, `signup`, `verifyEmail`, `account`, `admin`, legal/trust routes).
- `PRIMARY_NAV` — desktop top-nav items (includes `guides`). **Premium is NOT here.**
- `MOBILE_NAV` — `PRIMARY_NAV` minus `guides` (bottom bar stays at 5 for ergonomics).
- `PREMIUM_NAV` — single object rendered as the distinct CTA button.
- `FOOTER_SECTIONS` — data-driven `[{ heading, links: [{to, label}] }]`.
- `navSectionFromPath(pathname)` — active-state resolver (adds `guides`).

## Components

- **`Header.jsx`** — renders `PRIMARY_NAV` links + Sign up / Sign in (logged out) or Account + a `.header-cta` Premium pill.
  On mobile, `.header-nav` is hidden; `.mobile-nav` renders `MOBILE_NAV`.
  Desktop link chrome: subtle hover tint, active = inset underline (not solid pill); Premium alone stays filled.
- **`Footer.jsx`** — renders `FOOTER_SECTIONS` columns + a bottom bar with
  `SOCIAL_LINKS`, a local-only newsletter capture, disclaimer, and copyright.
- **`ContentPage.jsx`** — renders structured legal/company pages from
  `src/data/legalContent.js` `PAGES`.
- **`StructuredData.jsx`** — injects/removes a JSON-LD `<script>` by id.

### Key CSS classes (`global.css`)

`.header-cta` · `.header-nav` (quiet hover/active on journey links) · `.site-footer-columns` · `.site-footer-col` · `.site-footer-heading` ·
`.site-footer-newsletter*` · `.site-footer-bottom` · `.site-footer-social` ·
`.content-page*` · `.guides-grid` · `.guide-card*` · `.guide-article` · `.faq-*`

## Content data

- **`src/data/guides.js`** — evergreen articles (`getGuideBySlug`). Each has
  `author`, `reviewedBy`, `updated` for Article/MedicalWebPage schema.
- **`src/data/legalContent.js`** — `PAGES` (legal + company copy) and `FAQS`.
  > Legal copy is **drafted placeholder** — must be lawyer-reviewed before launch.
  > Replace `reviewedBy: 'Pending medical review'` with named clinicians.

## SEO / GEO infrastructure

Yarn Trails is a **Vite + React Router SPA**, not Next.js. Sitemap, robots, and
metadata live in `src/seo/` and are applied at build time plus in the client.

- **Canonical domain:** `https://yarntrails.com` (`SITE_URL` in `src/constants/brand.js`).
  Helpers in `src/seo/urls.js` (`buildCanonicalUrl`) never emit localhost, `www`,
  query strings, or hashes. `www.yarntrails.com` 301s to apex via `vercel.json`.
- **SPA crawlability:** `vercel.json` rewrites unknown paths to `/index.html` so
  client routes return HTTP 200 instead of Vercel `NOT_FOUND`. Trailing slashes
  redirect off (`trailingSlash: false`).
- **Per-page meta:** every page calls `usePageMeta` (`src/utils/pageMeta.js`).
  Titles follow `Topic | Yarn Trails` (homepage keeps the brand title). Canonical
  URLs always use the production origin + pathname. Default robots: `index, follow`.
  Private surfaces use `noindex, nofollow`: `/login`, `/signup`, `/verify-email`,
  `/account`, `/admin/*`, `/baby/book`, `/story/preview`, `/book/voice-invite`,
  `/newsletter/unsubscribe`, `/community/create`.
- **Homepage:** `index.html` + Home share the same title/description (The Art of
  Early Motherhood). Do **not** swap homepage meta for logged-out conversion copy.
- **JSON-LD:** `index.html` carries Organization + WebSite + WebApplication for
  non-JS crawlers. Per-page builders in `src/utils/structuredData.js`:
  - Guides → `MedicalWebPage` or `Article` (by category) + `BreadcrumbList`
  - FAQ → `FAQPage` (questions that exist on the page)
  - Static / month pages → `BreadcrumbList`
  Placeholder reviewers (`Pending medical review`) are omitted from schema.
- **Visible breadcrumbs:** `src/components/PageBreadcrumb.jsx` on guides, FAQ,
  legal/company pages. Month pages keep the timeline back control and add related
  internal links (guide, vaccination, mom care, sources).
- **Crawl files:** generated by `npm run generate:sitemap` (`scripts/generate-sitemap.mjs`)
  from `src/seo/routes.js` + published guides + months 1–36. `lastmod` is written
  only when content supplies a real date. `npm run build` regenerates sitemap,
  robots, and prerender stubs. Inventory check: `npm run audit:seo`.
- **Prerender:** `scripts/prerender-seo.mjs` writes a unique HTML shell (title,
  description, canonical, OG, robots, JSON-LD, crawler-visible body) for every
  indexable URL. It emits both `dist/<path>.html` (Vercel `cleanUrls`) and
  `dist/<path>/index.html` (directory index).
- **Analytics (GA4):** optional `VITE_GA_MEASUREMENT_ID` in `.env.local` / Vercel.
  Implemented in `src/utils/analytics.js` + `src/components/Analytics.jsx` (SPA page
  views on route change; `/admin/*` excluded). **Consent:** `CookieConsentBanner` +
  `CookieConsentContext` gate GA until the user accepts; choice stored in
  `localStorage` (`yarntrails-cookie-consent`). Footer link **Cookie preferences** reopens
  the banner. Align copy with [Cookie Policy](legalContent) before production EU/UK traffic.

### Search Console (after deploy)

Submit:

1. Property: `https://yarntrails.com`
2. `https://yarntrails.com/robots.txt`
3. `https://yarntrails.com/sitemap.xml`

Do not submit `www` as a separate property once the apex redirect is live.

### Known limitation

This remains a client-rendered app. Prerendered HTML in `dist/` is the GEO
mitigation for crawlers that do not execute JavaScript. Google still hydrates the
SPA after the first paint.

## Conventions

- Keep the **top nav ≤ 6 items**; Premium is always a CTA, never a plain link.
- Keep the **mobile bottom bar at 5 items**.
- Footer is **data-driven** — add links via `FOOTER_SECTIONS`, never hard-code `<Link>`s.
- After adding a page/guide: add it to `FOOTER_SECTIONS`/nav as appropriate and run
  `npm run generate:sitemap`.
- **Auth routes** (`/login`, `/signup`, `/verify-email`, `/account`, `/admin/*`) are
  intentionally omitted from the sitemap — account flows, not SEO landing pages.
