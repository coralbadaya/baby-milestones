# Navigation, Footer & SEO

Information architecture, navigation chrome, and SEO/GEO infrastructure for Yarn Trails.

> Yarn Trails is a **YMYL** (Your Money or Your Life — baby health) product. The nav and
> footer double as **E-E-A-T** trust surfaces. Treat trust/legal/editorial links as
> first-class, not afterthoughts.

---

## Information architecture

```
Top bar:          Today · My Baby · My Care · Essentials · Community · Guides · Sign up · Sign in/Account · [Plus]
                  A section with more than one page opens a square menu of those page names.
Mobile top bar:   Logo · [Plus] · You menu (Sign in / Sign up / Plus for guests; Profile & account / Plus when signed in)
Mobile bottom bar: Baby · Care · Book · Community · Guides   (Today is the logo; Essentials in desktop nav / footer; Book is the Plus circle)

Footer (4 columns):
  Explore  | Learn              | Company            | Legal & Trust
  --------- ------------------- -------------------- -------------------
  My Baby  | Guides & Articles  | About Us           | Privacy Policy
  My Care  | Milestones by Month| How We Research    | Terms of Service
  Essentials| Vaccination Sched.| Medical Reviewers  | Cookie Policy
  Vaccination| FAQ              | Sources & Citations| Medical Disclaimer
  Travel   |                    | Contact            | Accessibility
  Community|                    | Feedback           |
  Progress |                    | Premium            |
  Bottom bar: social icons · newsletter · disclaimer · © year
```

## Data model — `src/routes.js`

- `ROUTES` — all paths (incl. `guides`, `guide(slug)`, `faq`, `about`, `contact`,
  `feedback`, `login`, `signup`, `verifyEmail`, `account`, `admin`, legal/trust routes).
- `PRIMARY_NAV` — desktop top-bar items (includes `guides`). A `pages` list names the destinations inside that section. **Premium is NOT here.**
- `MOBILE_NAV` — Baby, Care, Book (center circle), Community, Guides. Today is the logo. Essentials stays out of the bottom bar.
- `PREMIUM_NAV` — single object rendered as the distinct CTA button.
- `FOOTER_SECTIONS` — data-driven `[{ heading, links: [{to, label}] }]`.
- `navSectionFromPath(pathname)` — active-state resolver (adds `guides`).

## Components

- **`Header.jsx`** — a 56px top bar (`--header-height`): logo, `PRIMARY_NAV`, Sign up / Sign in or Account, and a square `.header-cta` Plus button.
  Sections with a `pages` list open a square menu of the page titles (My Baby → Vaccination tracker, Baby book; Essentials → Shopping, Travel; Community → Mom Feed, Baby Recipes, Parenting Tips; Today → Progress).
  On a phone, `.header-nav` is hidden; `.header-mobile-actions` shows Plus and the account menu (`HeaderMobileActions.jsx`, `MOBILE_USER_MENU` in `routes.js`). `.mobile-nav` still renders `MOBILE_NAV` at the bottom.
  The current section is a 2px trail rule along the bottom edge of the bar. Corners stay square. Plus is a filled square, not a pill.
- **`Footer.jsx`** — renders `FOOTER_SECTIONS` columns + a bottom bar with
  `SOCIAL_LINKS`, a local-only newsletter capture, disclaimer, and copyright.
- **`ContentPage.jsx`** — renders structured legal/company pages from
  `src/data/legalContent.js` `PAGES` through `TrustShell`: ivory hero, then brief
  cards or policy hairlines. The `breadcrumb` slot sits inside the narrow hero
  (never full-bleed under `<main>`). `layout`, block `tone`, source links, and
  `related` links live on the page record. `intro` is the meta description only.
  Guide articles do not use this shell.
- **`PageBreadcrumb.jsx`** — quiet trail for guides, FAQ, legal/company. Centered
  on `.content-page` (guide articles); left-aligned inside `TrustShell` and other
  `PageSection` heroes. Phosphor caret separator.
- **`StructuredData.jsx`** — injects/removes a JSON-LD `<script>` by id.

### Key CSS classes (`global.css`)

`.header-cta` · `.header-nav` (quiet hover/active on journey links) · `.site-footer-columns` · `.site-footer-col` · `.site-footer-heading` ·
`.site-footer-newsletter*` · `.site-footer-bottom` · `.site-footer-social` ·
`.content-page*` · `.trust-page` · `.trust-hero` · `.trust-status` · `.trust-block` · `.guides-grid` · `.guide-card*` · `.guide-article` · `.faq-*`

## Content data

- **`src/data/guides.js`** — evergreen articles (`getGuideBySlug`). Each has
  `author`, `reviewedBy`, `updated` for Article/MedicalWebPage schema.
- **`src/data/legalContent.js`** — `PAGES` (legal + company copy) and `FAQS`.
  > Legal copy is **drafted placeholder** — must be lawyer-reviewed before launch.
  > Replace `reviewedBy: 'Pending medical review'` with named clinicians.
  > `/medical-reviewers` states that no named review board exists yet. Do not publish role titles as if people had reviewed the site.

## SEO / GEO infrastructure

Yarn Trails is a **Vite + React Router SPA**, not Next.js. Sitemap, robots, and
metadata live in `src/seo/` and are applied at build time plus in the client.

- **Canonical domain:** `https://yarntrails.com` (`SITE_URL` in `src/constants/brand.js`).
  Helpers in `src/seo/urls.js` (`buildCanonicalUrl`) never emit localhost, `www`,
  query strings, or hashes. `www.yarntrails.com` 301s to apex via `vercel.json`.
- **SPA crawlability:** `vercel.json` rewrites unknown paths to `/index.html` so
  client routes (`/login`, `/account`, `/story/preview/:token`, …) return HTTP 200
  instead of Vercel `NOT_FOUND`. Do **not** enable `cleanUrls` — missing `.html`
  files 404 before the rewrite runs. Trailing slashes redirect off
  (`trailingSlash: false`).
- **Per-page meta:** every page calls `usePageMeta` (`src/utils/pageMeta.js`).
  Titles follow `Topic | Yarn Trails` (homepage uses `SEO_DEFAULT_TITLE`). Canonical
  URLs always use the production origin + pathname. Default robots: `index, follow`.
  Private surfaces use `noindex, nofollow`: `/login`, `/signup`, `/verify-email`,
  `/account`, `/admin/*`, `/baby/book`, `/story/preview`, `/book/voice-invite`,
  `/newsletter/unsubscribe`, `/community/create`.
  Community item permalinks (`/community/feed/:slug`, `/community/recipes/:id`,
  `/community/tips/:id`) are SPA deep links; sitemap stays at the tab URLs only.
- **Homepage:** `index.html` + Home share the same title and description
  (`Baby milestones and vaccines | Yarn Trails`, from `brand.js`). Visible
  welcome H1 and prerender H1 are both *See this month with your baby.*
  Yarn Trails is the eyebrow. The brand tagline stays on the logo and in
  Organization `slogan`. Copy lives in `src/data/homepageCopy.js` and is
  prerendered into `dist/index.html`. Welcome-mode Home renders the same
  intro; logged-in Today does not.
- **Locale:** `html lang="en-IN"`, `og:locale` `en_IN`, schema `inLanguage`
  `en-IN`. WebApplication `operatingSystem` is `Web` and the free offer is
  `priceCurrency: INR`. Do not claim iOS or Android in schema until those
  store apps exist. UK and US prices still apply at checkout via `premiumPricing.js`.
- **Brand aliases:** Display name **Yarn Trails**; handle/domain **yarntrails**. `BRAND_ALTERNATE_NAMES` in `src/constants/brand.js` feeds `alternateName` in Organization/WebSite/WebApplication JSON-LD. Homepage and About copy mention `yarntrails.com` so spaced and one-word queries map to the same product.
- **JSON-LD:** `index.html` carries Organization + WebSite + WebApplication for
  non-JS crawlers. Per-page builders in `src/utils/structuredData.js`:
  - Guides → `MedicalWebPage` or `Article` (by category) + `BreadcrumbList`
  - FAQ → `FAQPage` (questions that exist on the page)
  - Static / month pages → `BreadcrumbList`
  Placeholder reviewers (`Pending medical review`) are omitted from schema.
- **Visible breadcrumbs:** `src/components/PageBreadcrumb.jsx` on guides, FAQ,
  legal/company pages. Always inside the page column (`.content-page` or
  `PageSection`), never a sibling of the centered article. Content pages center
  the trail with the hero; the Guides hub left-aligns it with the section header.
  Month pages keep the timeline back control and add related internal links
  (baby monthly milestones guide, per-month guide, vaccination, mom care, sources).
  Milestone guides with `milestoneMonth` show the same related-link row plus
  `/guides/baby-monthly-milestones`. Product hubs (`/vaccination`, `/shopping`,
  `/mom-care`, `/community/recipes`) use `HubSeoBanner` / `hubSeoIntros.js` so
  the first visible sentence matches prerender.
- **Crawl files:** generated by `npm run generate:sitemap` (`scripts/generate-sitemap.mjs`)
  from `src/seo/routes.js` + published guides + months 1–36. `lastmod` is written
  only when content supplies a real date. `npm run build` regenerates sitemap,
  robots, and prerender stubs. Inventory check: `npm run audit:seo`.
- **Prerender:** `scripts/prerender-seo.mjs` writes a unique HTML shell (title,
  description, canonical, OG, robots, JSON-LD, crawler-visible body) for every
  indexable URL as `dist/<path>/index.html` (directory index). Crawler body copy
  lives in a hidden `#seo-prerender` sibling, never inside `#root`. `#root` stays
  hidden until React commits, so users never see unstyled HTML before the designed
  UI. Unprerendered client routes fall through to `index.html` via the SPA rewrite.
- **Analytics:** first-party Insights ingest (`POST /api/analytics`) plus optional GA4
  (`VITE_GA_MEASUREMENT_ID`). Implemented in `src/utils/analytics.js` + `src/components/Analytics.jsx`
  (SPA page views on route change; `/admin/*` excluded). **Consent:** `CookieConsentBanner` +
  `CookieConsentContext` gate first-party events and GA until the user accepts; choice stored in
  `localStorage` (`yarntrails-cookie-consent`). Staff console: [`/admin/insights`](product-analytics.md).
  Footer link **Cookie preferences** reopens the banner. Align copy with [Cookie Policy](legalContent)
  before production EU/UK traffic.

### Search Console (after deploy)

Submit:

1. Property: `https://yarntrails.com`
2. `https://yarntrails.com/robots.txt`
3. `https://yarntrails.com/sitemap.xml`

Do not submit `www` as a separate property once the apex redirect is live.

### Known limitation

This remains a client-rendered app. Prerendered HTML in `dist/` is the GEO
mitigation for crawlers that do not execute JavaScript. Google still hydrates the
SPA. Users see an ivory canvas, then the designed UI — never a plain-text stub.

## AISO

AI search (answer engines, assistants, and generative overviews) should meet the same page a person sees.

- The visible sentence and the prerendered sentence are the same. Do not write a crawler-only pitch.
- Homepage entity copy names the product, who it is for, and the jobs: My Baby, baby book, My Care, vaccination, Guides, Plus. Source of truth: `src/data/homepageCopy.js` and `SEO_DEFAULT_DESCRIPTION`.
- Headings answer a question (“What Yarn Trails is”, “What you can track”). Add `FAQPage` schema only for questions that are on the page.
- Health pages state that the guidance is educational and link the medical disclaimer. Do not imply diagnosis or treatment.
- After copy changes, run `npm run audit:seo`.

### Keyword inventory (content planning)

- **Page one:** [`seo-page-one.md`](seo-page-one.md) — market ambition, one URL per head term, GSC.
- **Strategy:** [`seo-keywords.md`](seo-keywords.md) — sixteen pillars, canonical URL map, YMYL rules.
- **Matrix:** [`seo-keywords-matrix.md`](seo-keywords-matrix.md) — ~14k generated phrase permutations from `src/seo/keywordSeeds.js`; refresh with `npm run generate:seo-keywords`.
- **Agents:** [`.cursor/skills/seo-keywords/SKILL.md`](../.cursor/skills/seo-keywords/SKILL.md).

Do not add `<meta name="keywords">`; use phrases in titles, headings, prerender body, and guides.

- **Guide FAQs:** `src/data/guideSeoEnrichment.js` + `GuideFaqSection` (visible) + `FAQPage` JSON-LD; prerender mirrors FAQ HTML in `scripts/prerender-seo.mjs`.
- **Internal links:** `GuideQuickLinks` on every enriched guide; footer Learn column lists pillar guides.

## Conventions

- Keep the **top bar ≤ 6 journey items**; further pages live in that section's menu, under the name the page itself uses. Premium is always a CTA, never a plain link.
- Keep the **mobile bottom bar at 5 items** (Baby · Care · Book · Community · Guides).
- Footer is **data-driven** — add links via `FOOTER_SECTIONS`, never hard-code `<Link>`s.
- After adding a page/guide: add it to `FOOTER_SECTIONS`/nav as appropriate and run
  `npm run generate:sitemap`.
- **Auth routes** (`/login`, `/signup`, `/verify-email`, `/account`, `/admin/*`) are
  intentionally omitted from the sitemap — account flows, not SEO landing pages.
