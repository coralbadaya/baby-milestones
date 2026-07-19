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

- **Per-page meta:** every page calls `usePageMeta({ title, description, robots? })`
  (`src/utils/pageMeta.js`), which sets title, description, OG/Twitter tags (incl.
  `og:site_name`, `og:image:width/height`, `og:locale`, `twitter:site`), and a
  `<link rel="canonical">`. Optional `robots: 'noindex, nofollow'` on `/admin/*`.
- **Home welcome meta:** logged-out empty state sets conversion-focused title/description.
- **Static base meta + JSON-LD:** `index.html` carries the default tags and a static
  `@graph` (Organization, WebSite, WebApplication) — kept static so non-JS crawlers
  read it. Do **not** duplicate Organization/WebSite from React.
- **Per-page JSON-LD:** `src/utils/structuredData.js` builders +
  `<StructuredData />`:
  - Guides → `MedicalWebPage` (Article-like) + `BreadcrumbList`
  - FAQ → `FAQPage`
  - Static pages → `BreadcrumbList`
- **Crawl files:** `public/robots.txt` + `public/sitemap.xml`. Regenerate the sitemap
  with `npm run generate:sitemap` (`scripts/generate-sitemap.mjs`) after adding routes
  or guides.
- **Analytics (GA4):** optional `VITE_GA_MEASUREMENT_ID` in `.env.local` / Vercel.
  Implemented in `src/utils/analytics.js` + `src/components/Analytics.jsx` (SPA page
  views on route change; `/admin/*` excluded). **Consent:** `CookieConsentBanner` +
  `CookieConsentContext` gate GA until the user accepts; choice stored in
  `localStorage` (`yarntrails-cookie-consent`). Footer link **Cookie preferences** reopens
  the banner. Align copy with [Cookie Policy](legalContent) before production EU/UK traffic.

### Prerender (SEO routes)

Run `npm run build:seo` after adding guides or the milestone card tool. This writes static HTML stubs under `dist/guides/*` and `dist/tools/milestone-cards/` for crawlers that do not execute JS. See `scripts/prerender-seo.mjs`.

### Known limitation (Phase 2)

This is a client-rendered SPA. JS-injected meta/JSON-LD is read by Google but **not by
most AI/GEO crawlers** that don't execute JS. For full GEO benefit, add static
prerendering (e.g. a prerender plugin or meta-framework migration). The static tags in
`index.html` are the current mitigation.

## Conventions

- Keep the **top nav ≤ 6 items**; Premium is always a CTA, never a plain link.
- Keep the **mobile bottom bar at 5 items**.
- Footer is **data-driven** — add links via `FOOTER_SECTIONS`, never hard-code `<Link>`s.
- After adding a page/guide: add it to `FOOTER_SECTIONS`/nav as appropriate and run
  `npm run generate:sitemap`.
- **Auth routes** (`/login`, `/signup`, `/verify-email`, `/account`, `/admin/*`) are
  intentionally omitted from the sitemap — account flows, not SEO landing pages.
