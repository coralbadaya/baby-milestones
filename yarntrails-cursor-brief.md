# Yarn Trails — Implementation brief for Cursor

Source: growth audit of yarntrails.com (17 Nov 2026, IST) plus a review of the live HTML and the production JS bundle. Goal: fix trust, let Google see the content, and add the plumbing for traffic (sharing, QR pilots, referrals, analytics) while the site has almost no visitors.

## Status (rechecked 23 Nov 2026)

Audit is against the current repo. “Tested” means an automated check exists and was run in this pass, not a production deploy.

| Ticket | Status | What matches the brief | Still open |
|--------|--------|------------------------|------------|
| YT-00 | **Done** | Handler 404 unless not production and `ENABLE_DEV_INBOX=true` (`api/dev-inbox-otp.js`). Web client loads the URL only under `import.meta.env.DEV`. Production build grep was **0**. Live site already returns **404**. Gate covered by `src/utils/devInboxOtp.test.js`. | Mobile `mobile/lib/fetchDevInboxOtp.ts` still names the path (not in the website bundle). |
| YT-01 | **Partial, tested** | `/medical-reviewers` has no placeholder board (`src/data/legalContent.js`). `src/data/reviewers.js` is an empty list (no invented names). Guide byline uses `guideCreditLine`: pending labels become “Sources checked &lt;date&gt;”. Schema already drops pending `reviewedBy`. Bio template in `docs/reviewer-onboarding.md`. Tests in `src/data/reviewers.test.js`. | No reviewer cards UI until Mohit adds a real person. Page copy is the honest empty state, not a card grid. |
| YT-02 | **Not done** | Home still leads with the current Today hero and title “Baby milestones and vaccines”. India strengths exist on other routes, not as the specified trust strip and single birth-date CTA. | Full hero rewrite, title/description, 360px check. |
| YT-03 | **Partial** | `html lang="en-IN"`, `og:locale=en_IN`, JSON-LD `inLanguage: en-IN`, `operatingSystem: "Web"`, free offer `priceCurrency: INR` (`index.html`, `src/utils/structuredData.js`). | No `hreflang` / `x-default`. No `og:locale:alternate`. Offers are one free INR offer, not Plus 399 / 2499 from pricing constants. |
| YT-04 | **Partial** | Consent-gated GTM `GTM-MNS7GQ24` + `gtag/js` `G-7E22FF9EJN`. First-party `/api/analytics`. Current-URL UTMs (`utm_source/medium/campaign`) attach to ingest. `analyticsEvents.test.js` covers UTM parse. | No first-touch `localStorage`. No `utm_content` / `ref`. Event is `content_shared`, not `share_click`. No `download_click` / invite / PWA events. No Search Console or Bing meta. GA4 conversions not marked in the Google UI. `grep` of published `gtm.js` for `G-7E22FF9EJN` is still **0** (app loads `gtag.js` instead). |
| YT-05 | **Not done** | `src/utils/shareLinks.js` builds `wa.me`. Some pages fire `content_shared`. | No `ShareBar` on month, guide, vaccine, and cards. WhatsApp is not first with the specified copy and UTMs. |
| YT-06 | **Not done** | Sitemap writes `lastmod` only when content has a real date (`src/seo/sitemap.js`, tested). Private routes are `noindex`. `public/robots.txt` exists. | Unknown URLs rewrite to `index.html` (soft 200). No `immutable` cache on `/assets`. Not every sitemap URL has `lastmod`. `changefreq` may still be present. |
| YT-07 | **Not done** | Prerender exists (`scripts/prerender-seo.mjs`) into `#seo-prerender`. | That block is `display:none`. `#root` stays `visibility:hidden` until React. Hub HTML is still a stub. |
| YT-08 | **Partial** | Organization, WebSite, WebApplication, guide `MedicalWebPage`/`Article`, FAQPage, BreadcrumbList. Pending reviewers omitted (`src/seo/seo.test.js`). | No `sameAs`, `areaServed`, citations, or per-page OG images in schema. |
| YT-09 | **Not done** | One `og-default.png`. Milestone cards tool exists. | No per-page OG generation or on-device “Make my card”. |
| YT-10 | **Not done** | India schedule lives in the tracker and a short vaccination guide. | No `/vaccination-schedule-india`, long table, or PDF/PNG from one data source. |
| YT-11 | **Not done** | Month milestone data exists. | No `/whats-normal`. |
| YT-12 | **Not done** | Both `/month/N` and milestone guides are indexable. | No canonical choice, no 1,200-word expansion. |
| YT-13 | **Not done** | `viewerSeats` is Plus-only (`src/utils/entitlements.js`). Invite UI exists for the flip-book. | No free Basic seat, `/join/:token`, or referral month of Plus. |
| YT-14 | **Partial** | India checkout uses Razorpay; other countries use Stripe (`api/razorpay-checkout.js`, `api/checkout.js`). Prices live in `src/constants/premium.js`. | Prices are not a server table. UPI end-to-end in test mode is not verified here. No “Pay with UPI” badge audit in this pass. |
| YT-15 | **Not done** | Admin insights can show UTM columns. | No `/start`, clinic table, or QR script. |
| YT-16 | **Not done** | Fonts still load from Google. Production JS is one ~2 MB chunk. | No route-level split or LCP budget. |
| YT-17 | **Not done** | `manifest.webmanifest` and a dismissible install banner exist. | No service worker / Workbox. Prompt is not tied to the second-visit rule. |
| YT-18 | **Not done** | Story generation has `hi` and other languages. UI is English. | No `i18next`, `/hi/` routes, or hreflang pairs. |
| YT-19 | **Not done** | Expo app is in `mobile/`. | No Trusted Web Activity, `assetlinks.json`, or Play listing. |

**Next code ticket:** YT-02 (homepage), unless you want YT-03 hreflang first.

---

## How to use this with Cursor

1. **One ticket per Cursor session.** Paste only that ticket, plus the "Shared context" section below.
2. **Read the codebase before editing.** Start every session with:
   > "Read the repo structure, `package.json`, `index.html`, the router/routes file, and any build/prerender scripts. Summarise how pages, SEO tags and the `#seo-prerender` block are produced. Don't write code yet."
3. **Plan, then build.** Ask Cursor for a short plan listing the files it will touch, check it, then let it implement.
4. **Commit per ticket** on its own branch (e.g. `yt-01-reviewers`) with the message `YT-01: <title>`. Deploy a Vercel preview and run the "Verify" steps before merging.
5. **Paths are hints.** Every path marked "locate" is a guess from the compiled bundle. Cursor must find the real file and must not create a duplicate.
6. **Never invent facts.** No fake reviewer names, user counts, ratings or testimonials. Leave a clearly marked TODO for Mohit instead.

### Shared context (paste with every ticket)

What the live site shows (observed from outside, not from the source code):
- **Stack:** Vite + React SPA (`/assets/index-*.js`, about 1.98 MB raw / 536 KB brotli, one bundle), React Router, hosted on Vercel, Supabase auth (email OTP + OAuth), serverless routes under `/api/*` (`/api/checkout`, `/api/analytics`, `/api/broadcast`, `/api/personal-album`, `/api/export-*`, `/api/dev-inbox-otp`).
- **SEO stub:** `index.html` carries per-route `<title>`, meta, canonical, OG/Twitter tags and JSON-LD, plus a `<div id="seo-prerender" hidden>` that is hidden with `display:none !important`. `#root` stays `visibility:hidden` until React sets `data-ready`. Locate the script that generates the per-route HTML (likely under `scripts/` or in a Vite plugin).
- **Route constants:** an object with keys such as `home, baby, momCare, essentials, shopping, travel, vaccination, progress, sources, premium, guides, milestoneCardsTool (/tools/milestone-cards), month(n) => /month/n, faq, about, medicalReviewers, editorialPolicy, accessibility, ...`. Locate it (search `milestoneCardsTool`).
- **Pricing constants:** an object keyed by `USD / GBP / INR` with `priceMonthly / priceAnnual / priceBundle / priceGift`; INR = 399 / 2499 / 3999 / 2999. Currency is picked from locale/timezone (Asia/Kolkata, `en-in` or `hi-in` gives INR). Search `priceBundle`.
- **Basic limits object:** `photosPerMonth:2, storiesTotal:1, voiceNotesStored:3, voiceNoteMaxSeconds:30, viewerSeats:2`. Viewer seats are Plus-only today. Search `viewerSeats`.
- **Story languages:** en, hi, ta, te, bn, es, fr, de, pt, ar, ja, zh, each with a `nativeLabel` (search `nativeLabel`). The UI itself is English only.
- **Share util:** already builds `https://wa.me/?text=...`, plus X and Facebook links, and has a native Share button. Search `wa.me`.
- **Analytics:** a first-party event logger posts to `/api/analytics` with events `page_view, session_start, consent_accepted, consent_rejected, signup_view, signup_completed, login_completed, premium_view, begin_checkout, subscribe_success, trial_started, gate_hit, birth_date_set, milestone_checked, first_saved, guide_view, ...`. GA4 (`gtag`) loads only when an ID is configured and consent is given. Search `begin_checkout` and `googletagmanager`.
- **Schema today:** Organization, WebSite and WebApplication (`inLanguage: en-GB`, `priceCurrency: GBP`, `operatingSystem: "Web, iOS, Android"`), BreadcrumbList, FAQPage on /faq, MedicalWebPage on guides. `og:locale = en_GB`. Every page uses `og-default.png`.
- **Brand voice to keep:** calm, warm, evidence-informed, "a range, not a race", never alarmist. Mass-market rewrites must stay plain and kind, not shouty.

---

## Ticket index

| # | Ticket | Horizon | Effort |
|---|---|---|---|
| 00 | Security check: `/api/dev-inbox-otp` in production | This week | S |
| 01 | Medical reviewer page: remove placeholder, add real-bio template | This week | S |
| 02 | Homepage hero rewrite + surface India pricing, IAP schedule, languages | This week | S–M |
| 03 | Locale fix: en-IN, INR, hreflang-ready, honest schema | This week | S |
| 04 | Analytics: GA4 or Plausible, Search Console, key events | This week | S–M |
| 05 | WhatsApp share buttons on month, guide and vaccine pages | This week | S |
| 06 | Technical SEO hygiene: real 404, cache headers, sitemap lastmod, robots | This week | S |
| 07 | Visible server-rendered/static content for hub and month pages | 30 days | M–L |
| 08 | Schema.org upgrade: MedicalWebPage, Article, FAQPage, Organization | 30 days | M |
| 09 | Per-page OG images + shareable milestone image cards | 30 days | M |
| 10 | India vaccination schedule landing page + PDF/PNG download | 30 days | M |
| 11 | "What's normal this month" free checklist (lead magnet) | 30 days | M |
| 12 | Fix /month/N vs /guides/N cannibalisation + deepen guides | 30 days | M |
| 13 | Free family view seat + invite/referral loop | 30 days | M |
| 14 | Checkout: confirm UPI for INR, India pricing test hooks | 30 days | S–M |
| 15 | UTM-tracked QR landing page for hospital/paediatrician pilots | 30 days | S–M |
| 16 | Performance: code-split the bundle, fonts, LCP | 30 days | M |
| 17 | PWA install prompt + service worker (before a native Android app) | 90 days | M |
| 18 | Hindi UI i18n scaffolding (`/hi/` routes, hreflang) | 90 days | L |
| 19 | Android via Trusted Web Activity (Play Store) | 90 days | M |

S = under half a day, M = 1–3 days, L = a week or more (rough estimates).

---

# THIS WEEK

## YT-00 — Security check: `/api/dev-inbox-otp` in production

**Goal:** Make sure the dev-only OTP endpoint can't hand out login codes in production.

**Why:** The production bundle contains a function that calls `/api/dev-inbox-otp?email=...` and reads `otp` from the response. If that endpoint works in production, anyone could sign in as any user. I did not call it, so this is unverified. Treat it as urgent until it is ruled out.

**Look at:** locate the API handler (`api/dev-inbox-otp.*` or a route inside the API router) and the client function that calls it (search `dev-inbox-otp`).

**Changes:**
- In the handler, return `404` unless `process.env.VERCEL_ENV !== 'production'` **and** an explicit `ENABLE_DEV_INBOX=true` is set.
- Wrap the client call in `if (import.meta.env.DEV)` so it is tree-shaken out of production builds.
- If production ever had it enabled, rotate auth secrets and review Supabase auth logs.

**Acceptance:** In production, `GET /api/dev-inbox-otp?email=<your own test email>` returns 404. The string `dev-inbox-otp` no longer appears in the production JS.

**Verify:** `curl -i` against a preview and production with your own email only. Run `grep dev-inbox-otp dist/assets/*.js` after `npm run build`.

---

## YT-01 — Medical reviewer page: remove placeholder, add real-bio template

**Goal:** `/medical-reviewers` must never show "placeholder". Show real, named reviewers, or an honest interim statement.

**Why:** This is a health (YMYL) site. A public "Our review board (placeholder)" hurts trust with parents and with Google's E-E-A-T signals. It is the first page a paediatrician or journalist will check.

**Look at:** the route constant `medicalReviewers`, the page component (search `review board`), the prerender/SEO entry for `/medical-reviewers`, and `/editorial-policy` (search `How We Research`).

**Changes:**
1. Delete the "(placeholder)" heading and the role-only list.
2. Move reviewers into a data file (e.g. `src/content/reviewers.ts`; locate the content folder first) with this shape:
   ```ts
   type Reviewer = {
     slug: string;            // "dr-firstname-lastname"
     name: string;            // real name, exactly as registered
     credentials: string;     // e.g. "MBBS, MD (Paediatrics)"
     registration?: string;   // e.g. "NMC/State Medical Council reg. no. ..." (only with consent)
     role: string;            // "Reviews infant development and vaccination content"
     affiliation?: string;    // hospital/clinic, with permission
     photo?: string;          // /reviewers/<slug>.jpg, with permission
     bio: string;             // 40–80 words, first person or third person
     reviewedSince: string;   // ISO date
     links?: { label: string; url: string }[]; // clinic page, IAP profile, LinkedIn
   };
   export const reviewers: Reviewer[] = []; // TODO(Mohit): add only real, consenting reviewers
   ```
3. Render each reviewer as a card: photo, name, credentials, role, a short bio, links, and "Reviewing since <date>".
4. **Empty state** (when `reviewers.length === 0`): no fake names. Show:
   > **How our content is checked**
   > Our milestone and vaccination content follows published guidance from the WHO, CDC, AAP and the Indian Academy of Pediatrics (IAP). We're inviting practising paediatricians and obstetric clinicians in India to review our guides; their names and credentials will appear here once they've signed off. Until then, every guide lists its sources and the date it was last checked. [See our sources →](/sources)
5. Add "Reviewed by <name>, <credentials> · Last reviewed <date>" to guide pages, shown only when a guide has a `reviewedBy` slug. Otherwise show "Sources checked <date>".
6. Bio template for Mohit to send to reviewers (put it in `docs/reviewer-onboarding.md`, not on the site):
   > Dr. [Full name], [Degrees], is a [paediatrician / obstetrician / lactation consultant] at [Hospital/Clinic, City] with [N] years of practice. [One sentence on clinical focus.] At Yarn Trails, [he/she/they] review[s] [topic area] content for accuracy against current [IAP/WHO/FOGSI] guidance. Reviews are voluntary/paid [choose] and do not constitute personal medical advice.

**Acceptance:** No "placeholder" anywhere in the repo's user-facing strings or the rendered HTML. The page renders both states correctly. Guide bylines show only when real data exists.

**Verify:** `grep -ri placeholder src/` shows no user-facing copy. `curl -s https://<preview>/medical-reviewers | grep -i placeholder` returns nothing.

---

## YT-02 — Homepage hero rewrite + surface India strengths

**Goal:** A mother landing from WhatsApp should understand in 3 seconds what she gets, that it's free, and that it fits India.

**Why:** Today's H1 "The art of early motherhood" is abstract, and the hero offers three competing actions (Create free account / Preview / birth date). The India assets (INR pricing, India vaccine schedule, IAP citations, stories in Hindi/Tamil/Telugu/Bengali) are invisible.

**Look at:** the home/Today route component (search `Preview without an account` and `Or personalize with birth date`), the hero image, the SEO entry for `/` (title, description), and the `#seo-prerender` home block.

**Changes:**
1. **One primary action: set the birth date.** Put the date input + button first. "Create free account" becomes a secondary text link; "Preview without an account" becomes a tertiary link.
2. **Headline options** (pick one, A/B later with YT-04 events):
   - A: **Know what's normal for your baby this month.**
   - B: **Your baby's month, your recovery — one calm guide.**
   - C: **Month by month, from birth to age 3. Free.**
3. **Subhead options:**
   - "Milestones, the IAP vaccine schedule and postpartum care for you — in one calm place. Free, no sign-up needed."
   - "Enter your baby's birth date to see this month's milestones, vaccines due and gentle activities. Free forever."
4. **CTA button:** "See my baby's month" (or "Show this month"). Microcopy under it: "No account needed · Stays on your phone".
5. **Trust strip under the CTA** (icons + short text, no fake numbers):
   - "Follows IAP & WHO guidance" (links /sources)
   - "India vaccine schedule built in" (links /vaccination)
   - "Baby-book stories in हिन्दी, தமிழ், తెలుగు, বাংলা" (links /premium)
   - "Free tracking · Plus from ₹399/month" (INR only when currency = INR; otherwise the local price)
6. **"For the whole family" line:** "Share the month with Papa, Nani and Dadi on WhatsApp." (Wire to YT-05.)
7. **Hero image:** add a TODO for an Indian family image (licensed or own photography). Keep the current image until one is supplied.
8. **Date input:** make sure the format reads DD/MM/YYYY for en-IN users (use the locale for display; keep ISO internally).
9. Keep "not a feed, not a medical app, not a race" lower on the page as the brand line.
10. Update `<title>` to `Baby Milestones Month by Month & Vaccine Tracker (India) | Yarn Trails` (≤ 60 chars; adjust) and the meta description to `Free month-by-month baby milestones, IAP vaccination schedule and postpartum care for new mothers in India. No sign-up needed.`

**Acceptance:** Exactly one filled primary button above the fold on a 390 px viewport. Trust strip visible without scrolling on a common Android size (360×780). INR shows for Asia/Kolkata users. `birth_date_set` still fires.

**Verify:** Chrome DevTools device mode at 360×780 with the timezone overridden to Asia/Kolkata (Sensors panel), and once with Europe/London. Screenshot both.

---

## YT-03 — Locale fix: en-IN, INR, honest schema

**Goal:** Tell search engines the site is for India in English, and stop claiming store apps that don't exist.

**Why:** `og:locale=en_GB`, JSON-LD `inLanguage: en-GB`, `priceCurrency: GBP` and `operatingSystem: "Web, iOS, Android"` all conflict with an India-first product, and the iOS/Android claim is false today.

**Look at:** `index.html` JSON-LD block and the per-route SEO generator (search `en-GB`, `en_GB`, `priceCurrency`, `operatingSystem`).

**Changes:**
- `<html lang="en-IN">`; `og:locale` = `en_IN`; add `og:locale:alternate` = `en_GB`, `en_US` (later `hi_IN`, from YT-18).
- WebSite/WebApplication `inLanguage: "en-IN"`.
- WebApplication `operatingSystem: "Web"` (add Android when YT-19 ships).
- `offers`: an array of `Offer` items: `{price:"0", priceCurrency:"INR", name:"Basic"}`, `{price:"399", priceCurrency:"INR", name:"Plus monthly"}`, `{price:"2499", priceCurrency:"INR", name:"Plus First Year"}`. Read them from the pricing constants, not hard-coded.
- Add `<link rel="alternate" hreflang="en-IN" href="https://yarntrails.com/<path>">` and `hreflang="x-default"` on every page now. YT-18 adds `hi-IN`.
- Spelling: keep British/Indian English ("paediatrician" in body copy; "pediatrician" in title tags only if Mohit prefers it for search volume — leave a comment).

**Acceptance:** No `en-GB`/`GBP` left in the SEO output. Every page has self-referencing hreflang + x-default. JSON-LD validates.

**Verify:** Google Rich Results Test + validator.schema.org on `/`, `/faq`, and one guide. `curl -s https://<preview>/ | grep -E 'hreflang|og:locale|inLanguage|priceCurrency'`.

---

## YT-04 — Analytics: GA4 or Plausible, Search Console, key events

**Goal:** Measure the funnel from day one so every other ticket can be judged.

**Why:** With near-zero traffic, every visitor matters. A first-party event logger already exists; GA4 loads only if an ID is configured. Search Console tells us whether Google indexes the site at all (a `site:` search returned nothing during the audit, which isn't conclusive).

**Look at:** the analytics module (search `googletagmanager`, `begin_checkout`, `/api/analytics`), the consent banner (search `Accept analytics`), env config (`VITE_*` vars; locate `.env.example`), and the admin funnel view (search `Premium → checkout`).

**Changes:**
1. **Choose one** third-party tool (Mohit decides; default GA4 because it's free and links to Search Console):
   - GA4: set `VITE_GA_MEASUREMENT_ID` in Vercel env for Production and Preview. Keep loading gated by consent.
   - Or Plausible (cookie-less, no consent needed in most setups): add `<script defer data-domain="yarntrails.com" src="https://plausible.io/js/script.tagged-events.outbound-links.js">` and map events with `window.plausible(name, {props})`.
2. **Search Console:** add the HTML meta tag `<meta name="google-site-verification" content="TODO">` via an env var (`VITE_GSC_VERIFICATION`), or use DNS TXT verification (preferred; nothing to deploy). Submit `https://yarntrails.com/sitemap.xml`. Also add Bing Webmaster Tools (`msvalidate.01`).
3. **Key events.** Make sure these fire to both first-party and GA4/Plausible, with these exact names:
   | Event | When | Params |
   |---|---|---|
   | `birth_date_set` | birth date saved | `months_old`, `source` (hero/today/vaccination) |
   | `signup_completed` | account created | `method` (email_otp/google) |
   | `premium_view` | Plus page viewed | `currency` |
   | `begin_checkout` | checkout started | `sku`, `currency`, `value` |
   | `subscribe_success` | payment confirmed (server webhook preferred) | `sku`, `currency`, `value` |
   | `share_click` | **new**: any share button | `channel` (whatsapp/native/copy/x/facebook), `content_type` (month/guide/vaccine/card/invite), `item_id` |
   | `download_click` | **new**: PDF/PNG download (YT-10/11) | `asset` |
   | `invite_sent` / `invite_accepted` | **new** (YT-13) | `role` |
   | `pwa_install_prompted` / `pwa_installed` | **new** (YT-17) | — |
4. **UTM persistence:** on first load, read `utm_source / utm_medium / utm_campaign / utm_content` + `ref`, store them in `localStorage` (first touch) and attach them to `signup_completed` and `subscribe_success`. That is how the QR pilots (YT-15) and creators get attributed.
5. Mark `signup_completed`, `subscribe_success` and `share_click` as conversions/key events in GA4.

**Acceptance:** GA4 DebugView (or the Plausible dashboard) shows each event from a preview session. UTMs show up on signup. Search Console is verified and the sitemap is submitted.

**Verify:** Open `/?utm_source=test&utm_medium=qr&utm_campaign=pilot1`, set a birth date, sign up with a test email, and click share. Confirm all events and UTM fields in DebugView and in `/api/analytics` storage.

---

## YT-05 — WhatsApp share buttons on month, guide and vaccine pages

**Goal:** Every useful page can be sent to a family WhatsApp group in one tap.

**Why:** WhatsApp is the main sharing channel for Indian parents, and the share util already exists but isn't surfaced where the value is.

**Look at:** the share util (search `wa.me`, `share-icon-btn--whatsapp`), the month page (`/month/:n`), the guide template (`/guides/:slug`), the vaccination tracker (`/vaccination`), and the milestone cards tool.

**Changes:**
1. Add a `<ShareBar>` (reuse the existing share buttons) to: the top and bottom of each `/month/:n`, the end of each guide, each vaccine "due" row ("Remind family"), and each printable milestone card.
2. Order: **WhatsApp first** (green, labelled "Share on WhatsApp"), then native Share (mobile), then Copy link. Hide X/Facebook behind "More".
3. Prefilled messages (keep under 200 chars; the URL carries UTMs `utm_source=whatsapp&utm_medium=share&utm_campaign=<content_type>`):
   - Month: `Month {n} with our little one 💛 Here's what's typical right now — a range, not a race: {url}`
   - Guide: `Found this calm guide on {topic}: {url}`
   - Vaccine: `{babyName}'s {vaccine} dose is due around {date}. India schedule here: {url}` (only if the user typed a name; never send health data without the user tapping share)
   - Hindi variants (when the UI language is `hi`, from YT-18): `महीना {n}: अभी क्या सामान्य है — हर बच्चा अपनी रफ़्तार से बढ़ता है: {url}`
4. Fire `share_click` (YT-04).

**Acceptance:** On Android Chrome, tapping WhatsApp opens WhatsApp with the text and a link that carries UTMs. Buttons are reachable with one thumb (≥ 44 px targets).

**Verify:** A real Android phone, plus DevTools device mode. Check the URL in the composed message.

---

## YT-06 — Technical SEO hygiene

**Goal:** Remove small crawl and quality problems.

**Why:** Unknown URLs return HTTP 200 (soft 404). Hashed assets are served with `cache-control: max-age=0, must-revalidate`. Only 21 of 83 sitemap URLs have `lastmod`.

**Look at:** `vercel.json` (rewrites/headers; locate), the SPA catch-all route, the sitemap generator (locate; search `changefreq`), and `public/robots.txt`.

**Changes:**
1. **Real 404:** keep the SPA fallback only for known routes. Generate the list from the route constants + the guide/month slugs, and return status 404 with a static `404.html` for everything else (Vercel `rewrites` for known patterns, plus a `404.html` in the output). The React NotFound page should set `<meta name="robots" content="noindex">`.
2. **Caching:** in `vercel.json` headers, `/assets/(.*)` gets `Cache-Control: public, max-age=31536000, immutable`. HTML stays `max-age=0, must-revalidate`.
3. **Sitemap:** add `lastmod` to every URL (from content dates or git commit date). Drop `changefreq`/`priority` (Google ignores them). Split into `sitemap-pages.xml`, `sitemap-guides.xml` and `sitemap-months.xml` under a sitemap index once YT-18 adds `/hi/`.
4. **robots.txt:** keep the current disallows. Also disallow `/dev/` (a `devPageTurnPlayground` route exists in the bundle) and confirm `/dev/*` routes are excluded from production builds.
5. **http to https:** confirm `http://yarntrails.com` 301s to https (Vercel does this by default; just check, since the audit couldn't verify it from its network).

**Acceptance:** `curl -o /dev/null -w '%{http_code}' https://<preview>/this-does-not-exist` gives 404. Assets return `immutable`. Every sitemap URL has `lastmod`.

**Verify:** The curl checks above, and Search Console "Pages" report after a week.

---

# 30 DAYS

## YT-07 — Visible server-rendered/static content for hub and month pages

**Goal:** Google and WhatsApp/Facebook previews should see the real page text in the initial HTML, visibly. No hidden stub.

**Why:** Hub pages ship 11–25 words of HTML (`/baby` 14, `/mom-care` 12, `/vaccination` 14, `/essentials` 11, `/guides` 14, `/premium` 23), month pages about 60–90, and most guides 170–250 (only the 3-month guide is about 1,500). That text is also inside `display:none`, and `#root` stays hidden until React paints. Google renders JS, but slowly and not always. Thin, hidden HTML is a weak signal.

**Look at:** the prerender generator (locate; search `seo-prerender`), the Vite config, the content sources for months/guides (locate; the bundle embeds milestone data, activities and citations), and the `#root:not([data-ready]) { visibility: hidden; }` style in `index.html`.

**Changes (pick the smallest that works):**
- **Option A, recommended first:** build-time static prerender. Use `vite-react-ssg`, `vite-plugin-ssr`/Vike, or a Puppeteer prerender step over the sitemap routes. Render each public route to static HTML **inside `#root`**, and hydrate with `hydrateRoot`.
- **Option B:** keep the SPA but render the full content (not a summary) into a **visible** `<main>` in the static HTML, and let React replace it. Remove `display:none` and the `visibility:hidden` gate for public content routes; use a skeleton instead of hiding.
- Content for each public route must include: H1, intro, all milestone lists (physical, social/emotional, language, cognitive), "Watch for" notes, activities (title + 1-line purpose), FAQs, sources, and internal links (previous/next month, related guide, vaccination, My Care).
- Private/user-data routes (`/account`, `/baby/book`, ...) stay client-only.

**Acceptance:** `curl -s https://<preview>/month/6 | sed 's/<[^>]*>/ /g' | wc -w` returns at least 400 for month pages and at least the full article length for guides. No `display:none` wrapping primary content. Lighthouse SEO ≥ 95. No hydration warnings in the console.

**Verify:** The curl word counts for the 10 core routes; Search Console URL Inspection → "View crawled page" after deploy.

---

## YT-08 — Schema.org upgrade

**Goal:** Correct, complete structured data per page type.

**Look at:** the JSON-LD generator (search `MedicalWebPage`, `BreadcrumbList`, `FAQPage`).

**Changes:**
- **Organization** (site-wide): `name, url, logo, sameAs` (only the real handles: instagram.com/yarntrails, youtube.com/@yarntrails, pinterest.com/yarntrails, tiktok.com/@yarntrails — confirm each exists), `contactPoint` (email from /contact), `areaServed: "IN"`.
- **Guides:** `["Article","MedicalWebPage"]` with `headline, description, image (per-page OG from YT-09), datePublished, dateModified, author (Organization or a real person), reviewedBy (Person, only with real data from YT-01), lastReviewed, citation[] (from the sources list), about (MedicalCondition/Thing e.g. "Infant development"), audience: {"@type":"PeopleAudience","audienceType":"Parents"}, inLanguage: "en-IN"`.
- **Month pages:** `WebPage` + `BreadcrumbList` + a `FAQPage` if the page shows 3 or more Q&As (e.g. "When should I worry at 6 months?").
- **/faq:** keep `FAQPage`. Make sure every Q&A in the markup is visible on the page.
- **/vaccination landing (YT-10):** `MedicalWebPage` + `HowTo` is not appropriate; use `Article` + `Dataset` only if you publish the table as data; otherwise `Article`.
- No `aggregateRating` or `review` markup until real reviews exist.

**Acceptance:** Rich Results Test shows no errors on home, /faq, one month, one guide and /vaccination.

**Verify:** Rich Results Test + validator.schema.org; Search Console Enhancements after recrawl.

---

## YT-09 — Per-page OG images + shareable milestone image cards

**Goal:** Every shared link shows a beautiful, specific preview, and parents can download a "Month N" card to post.

**Why:** All pages use `og-default.png`, so WhatsApp previews look identical. Milestone cards are the most natural organic sharing unit for this product.

**Look at:** the milestone cards tool (`/tools/milestone-cards`, search `milestoneCardsTool`), `public/og-default.png`, and the SEO generator.

**Changes:**
1. **Build-time OG generation** with `satori` + `@resvg/resvg-js` (or `@vercel/og` at the edge): 1200×630 PNGs at `/og/month-<n>.png`, `/og/guide-<slug>.png`, `/og/vaccination.png`. Use the brand palette (`#3F5E52`, `#F3F5F2`), Newsreader/Manrope fonts, the month title (e.g. "Month 6: Half Birthday!"), 3 milestone bullets, and the yarntrails.com wordmark.
2. Set `og:image`, `og:image:alt`, `twitter:image` per page.
3. **Shareable cards for parents:** on each month page, a "Make my card" button renders a 1080×1350 (Instagram portrait) and 1080×1920 (Status/Story) PNG in the browser (canvas or satori-wasm) with optional baby name + photo. The photo stays on the device and is never uploaded. Buttons: "Share on WhatsApp" (Web Share API with files, falling back to download) and "Download". Small `yarntrails.com/month/<n>` footer on the card.
4. Hindi card variant once YT-18 lands.

**Acceptance:** Pasting `/month/6` into WhatsApp shows the Month 6 image. Card download works on Android Chrome and iOS Safari. No photo leaves the device (check the Network tab).

**Verify:** WhatsApp, the Facebook Sharing Debugger and the LinkedIn Post Inspector; a real device test.

---

## YT-10 — India vaccination schedule landing page + PDF/PNG download

**Goal:** Rank for and be shared as "baby vaccination chart India", then funnel into the tracker.

**Why:** The current `/guides/first-year-vaccination-schedule` is 207 words and never names the IAP or UIP. Pages like FirstCry Parenting, Babynama and GyanPark show up for these searches. The tracker already contains an India schedule (BCG, Hep B, OPV, Pentavalent, Rotavirus, PCV, IPV, Influenza, JE, MR, MMR, Varicella, Hep A, boosters).

**Look at:** the vaccination tracker data (search `Pentavalent`, `Japanese Encephalitis`), `/vaccination`, `/guides/first-year-vaccination-schedule`, and `/sources`.

**Changes:**
1. New route `/vaccination-schedule-india` (or upgrade the existing guide URL and 301 the old one). Pick one canonical URL.
2. **Content:**
   - H1: "Baby Vaccination Schedule in India (IAP 2025 & UIP) — Birth to 2 Years"
   - Intro: what IAP vs the government UIP schedule is, and that the paediatrician decides.
   - A table by age (Birth, 6 wk, 10 wk, 14 wk, 6 mo, 7 mo, 6–9 mo, 9 mo, 12 mo, 15 mo, 16–18 mo, 2 yr) with columns: Vaccine · IAP · UIP (free at govt centres) · Notes. **Source every row** from the IAP ACVIP 2025 schedule (Indian Pediatrics, DOI 10.1007/s13312-026-00311-w) and the MoHFW UIP schedule. Have a reviewer sign off (YT-01) before publishing; mark "Last checked <date>".
   - Sections: what to bring to the visit, fever after shots (calm, with when to call the doctor), missed a dose, travel.
   - CTA block: "Get reminders for {baby}'s doses — free" → `/vaccination?utm_source=seo&utm_campaign=vax-landing` (sets the schedule to India).
3. **Downloads:** "Download printable chart" → `/downloads/india-vaccination-chart.pdf` (A4) and `.png` (1080×1920, WhatsApp-friendly). Generate them at build time from the same data (e.g. `@react-pdf/renderer` or Puppeteer `page.pdf`) so the chart and the page never disagree. Optional "Add baby's birth date" to personalise the PDF client-side.
4. Hindi version at `/hi/vaccination-schedule-india` after YT-18.
5. Fire `download_click`.

**Acceptance:** The page is at least 1,200 words of visible HTML, the table matches the tracker data source exactly (single source of truth), PDF and PNG download, and schema validates.

**Verify:** A unit test that diffs the page table against the tracker data; a manual check of the PDF on a phone.

---

## YT-11 — "What's normal this month" free checklist

**Goal:** A free, no-account, highly shareable tool and the main entry point from WhatsApp, creators and QR codes.

**Look at:** month data (search `Lifts head briefly during tummy time`), the Today dashboard, and the milestone cards tool.

**Changes:**
1. Route `/whats-normal` (and `/whats-normal/<n>-months`). Input: the birth date (or a month picker).
2. Output: "Your baby is about {n} months" + 4 domains (Moving, Talking, Feelings & people, Thinking), each with 3–5 "Many babies around now…" items, and "Gently mention to your paediatrician if…" (from the existing Watch For notes). Use calm wording: "a range, not a race".
3. Actions: Download as a 1-page PDF; Share on WhatsApp (YT-05); Save my baby's month (a soft sign-up prompt: "Get next month's checklist on the 1st" with email).
4. Optional email capture → reuse the existing newsletter subscribe (footer "Gentle, occasional notes for your journey") and tag `source=whats-normal`.
5. Link it from the homepage hero (secondary link "Or see what's normal this month →"), every month page, and the QR landing (YT-15).

**Acceptance:** It works with no account and no network after first load (data bundled). PDF ≤ 300 KB. Fires `birth_date_set` with `source=whats-normal`.

**Verify:** Manual test at 1, 6, 12 and 24 months; Lighthouse mobile ≥ 90 performance on this route.

---

## YT-12 — Fix /month/N vs /guides/N cannibalisation + deepen guides

**Goal:** One strong page per "N month old milestones" search, not two weak ones.

**Why:** `/month/3` (about 80 words) and `/guides/3-month-old-milestones` (about 1,500 words) compete for the same query. Guides 1, 2 and 4–12 are only about 170–190 words in HTML. Months 13–36 have no guide.

**Changes:**
1. **Decide** (Mohit): either
   - (a) `/guides/N-month-old-milestones` is the SEO page. `/month/N` becomes the interactive tracker with `<link rel="canonical">` to the guide, or `noindex`, and links to it; or
   - (b) merge everything into `/month/N` and 301 the guides there.
   Recommendation: (a). Keep the trackers app-like and the guides editorial.
2. Expand guides 1–12 to the 3-month guide's structure (about 1,200–1,600 words each): physical, social, language, cognitive, sleep & feeding at this age, play ideas, Watch For, Indian context (e.g. massage traditions, naming ceremonies, solids at 6 months with Indian first foods), FAQ, sources.
3. Add guides for 15, 18, 24, 30 and 36 months next (the main search clusters).
4. Internal links: previous/next month, the tracker, vaccines due at this age, and postpartum week.

**Acceptance:** Each N has exactly one indexable target. Guides have ≥ 1,200 words of visible HTML. No duplicate titles.

**Verify:** `curl` word counts; Search Console "Duplicate without user-selected canonical" stays at zero.

---

## YT-13 — Free family view seat + invite/referral loop

**Goal:** Papa, Nani and Dadi can follow along for free, and every invite brings a new visitor.

**Why:** Viewer seats are Plus-only (`viewerSeats: 2`, "Invite two grandparents or partners to view the flip-book"). In India the family group is the distribution network.

**Look at:** the limits object (search `viewerSeats`), the viewer-seat invite form (search `read-only flip-book access`), the `/book/voice-invite` route, Supabase tables for invites (locate), and gating (search `gate_hit`).

**Changes:**
1. **Basic gets 1 free family viewer seat** (Plus keeps 2+; consider raising Plus to 4). Viewers see a read-only "Family view": the baby's current month, milestones checked, shared photos (within the Basic limit) and upcoming vaccines (only if the parent toggles "Share vaccine dates").
2. **Invite flow:** "Invite family" → choose a role (Papa / Nani / Dadi / Nana / Dada / Other) → generates `https://yarntrails.com/join/<token>?utm_source=invite&utm_medium=whatsapp` → WhatsApp share with the message:
   > "{MomName} has invited you to follow {BabyName}'s first years on Yarn Trails 💛 See this month's milestones: {link}"
   (Hindi: "{MomName} ने आपको {BabyName} के पहले सालों को Yarn Trails पर देखने के लिए बुलाया है 💛 {link}")
3. **Join page** `/join/:token`: shows the baby's name and month, then "Continue with phone/email" (reuse the OTP). Viewer accounts are free and can't edit. Token is single-use with a 14-day expiry and revocable by the parent.
4. **Referral reward:** when an invited viewer **creates their own baby profile** (i.e. they're a new parent), the inviter gets 1 month of Plus (cap 6/year). Track `invite_sent`, `invite_accepted`, `referral_converted`.
5. **Privacy:** the parent controls what is shared, with a per-item toggle. Viewer access is revocable. Update the privacy page (search `Privacy Policy`) to describe viewer access.

**Acceptance:** A Basic user can invite one viewer end to end. The viewer can't see anything the parent didn't share. The revoke link works. Events fire.

**Verify:** Two test accounts (parent + viewer) on a preview; RLS policies in Supabase tested with the viewer's JWT (the viewer can't read other babies).

---

## YT-14 — Checkout: confirm UPI for INR, India pricing test hooks

**Goal:** Indian parents can pay with UPI, and pricing can be tested without a redeploy.

**Why:** `/api/checkout` returns a hosted checkout `url` (provider not identifiable from the client bundle). No Razorpay/UPI strings were found. Most Indian online payments use UPI. ₹2,499/yr competes with free incumbents (Mylo says "All app features are free").

**Look at:** the `/api/checkout` handler (locate `api/checkout.*`), the webhook handler that sets `premium_until` / `status` (search `premium_until`, `trial_ends_at`), and the pricing constants.

**Changes:**
1. **Identify the provider** in `/api/checkout`. Then:
   - If **Stripe:** for INR sessions, enable UPI only where Stripe India supports it for the account (check the current Stripe India docs; recurring UPI may not be available). Otherwise
   - Add **Razorpay** (or Cashfree) for `currency === 'INR'`: one-time payments for the First Year plan, bundle and gift (UPI, cards, netbanking), and Razorpay Subscriptions with UPI Autopay for monthly. Keep the existing provider for USD/GBP.
2. Unify webhook handling so both providers set the same subscription fields and fire `subscribe_success` server-side.
3. **Pricing config:** move prices to a server-readable config (env or DB table `prices(currency, sku, amount, active)`) so a test price (e.g. First Year ₹999 or ₹1,499, or a one-time "First Year Book ₹799") can be switched on without a code change. Show "Prices in ₹, incl. GST" if applicable (TODO: Mohit to confirm GST registration/treatment).
4. Add a "Pay with UPI" badge on `/premium` for INR users.

**Acceptance:** In test mode, an INR checkout shows UPI, completes, and sets Plus. Webhook signature verification is in place. Refund/cancel paths still work.

**Verify:** Razorpay/Stripe test mode with the UPI test VPA `success@razorpay` (Razorpay); check the DB row + `subscribe_success` event.

---

## YT-15 — UTM-tracked QR landing page for hospital/paediatrician pilots

**Goal:** A printable QR card for clinics that lands parents on a fast, trustworthy page, with per-clinic attribution.

**Changes:**
1. Route `/start` (short, easy to type). Accepts `?c=<clinicCode>` and standard UTMs. On load, map `c` to `utm_source=clinic&utm_medium=qr&utm_campaign=<pilot>&utm_content=<clinicCode>` (persist via YT-04).
2. **Content** (one screen, Hindi/English toggle once YT-18 is ready):
   - H1: "Welcome, new parents 💛"
   - "Your baby's month, the vaccine schedule and care for you — free, from {Clinic name if known}."
   - The birth date input → "Show my baby's month".
   - Two secondary buttons: "Vaccination chart (India)" → YT-10, "What's normal this month" → YT-11.
   - Footer: "Educational, not medical advice. Your doctor knows your baby best."
3. **Clinic registry:** a small table `clinics(code, name, city, contact, pilot, created_at)` with an optional co-brand line ("Shared by {Clinic}") shown only with the clinic's written permission.
4. **QR asset generator:** a script `scripts/make-qr.ts <clinicCode>` that outputs a print-ready A6 card PDF (QR to `https://yarntrails.com/start?c=<code>`, plus the short URL printed under it for people who can't scan).
5. Admin view: signups and `birth_date_set` by `utm_content` (extend the existing admin funnel; search `Premium → checkout`).

**Acceptance:** Scanning a generated QR opens `/start` in under 2.5 s on a mid-range Android over 4G (Lighthouse "Slow 4G" LCP < 2.5 s), and events carry the clinic code.

**Verify:** Generate two clinic codes, scan both, and confirm the attribution split in the admin view.

---

## YT-16 — Performance: code-split the bundle, fonts, LCP

**Goal:** A fast first load on mid-range Android over 4G, the typical Indian mass-market device.

**Why:** A single 1.98 MB (536 KB brotli) JS file blocks rendering, and `#root` is hidden until React mounts. Two Google font families load from Google's CDN.

**Changes:**
- Route-level `React.lazy` + `Suspense` for heavy features: the 3D flip-book, AI stories, voice notes, admin, community, story preview, and any charting. Check with `rollup-plugin-visualizer`.
- Self-host Newsreader + Manrope subsets (Latin; add Devanagari fonts only on `/hi/`), `font-display: swap`, preload the one hero font.
- Serve the hero image as AVIF/WebP with `srcset` and `fetchpriority="high"`; lazy-load everything below the fold.
- Remove the `visibility:hidden` gate once YT-07 ships.
- Budget: the initial JS for `/`, `/month/:n` and `/start` ≤ 170 KB brotli.

**Acceptance:** Lighthouse mobile (Moto G Power, Slow 4G) on `/`, `/month/6` and `/start`: Performance ≥ 85, LCP < 2.5 s, CLS < 0.1.

**Verify:** Lighthouse CI in GitHub Actions on the preview URL; PageSpeed Insights after deploy.

---

# 90 DAYS

## YT-17 — PWA install prompt + service worker

**Goal:** "Add to Home screen" as an app-like stepping stone before the Play Store.

**Why:** `manifest.webmanifest` exists (standalone, icons, theme colour), but no service worker was found in the bundle, so there's no offline use and a weaker install story.

**Changes:**
1. Add `vite-plugin-pwa` (Workbox): precache the app shell, month data, guides and the vaccine schedule; network-first for HTML; never cache `/api/*` or private data.
2. Capture `beforeinstallprompt`. Show a gentle prompt **after value**: after `birth_date_set` + a second visit, or after the first milestone is checked. Copy: "Keep Yarn Trails on your home screen — opens instantly, works offline." Buttons "Add" / "Not now" (snooze 14 days).
3. iOS: show a one-time "Share → Add to Home Screen" tip.
4. Add `screenshots` and `id` to the manifest for the richer install UI.
5. Events: `pwa_install_prompted`, `pwa_installed` (`appinstalled`).

**Acceptance:** Lighthouse PWA checks pass, the app opens offline to Today with cached data, and the prompt never shows on the first visit.

**Verify:** DevTools → Application → Service Workers/Manifest; airplane-mode test on Android.

---

## YT-18 — Hindi UI i18n scaffolding

**Goal:** Infrastructure to ship the UI and content in Hindi first, then Tamil, Telugu and Bengali.

**Why:** Leading Indian parenting apps run in Hindi plus 7–8 languages. Yarn Trails already generates stories in hi/ta/te/bn but the UI is English-only.

**Changes:**
1. Add `i18next` + `react-i18next` (or `@lingui`). Extract all UI strings to `src/locales/en-IN/*.json`. Create `hi-IN` with the same keys (start with nav, home, Today, month pages, vaccination, share texts, invite, `/start`).
2. **URL strategy:** a `/hi/` prefix for public, indexable pages (`/hi/month/6`, `/hi/vaccination-schedule-india`). The app routes switch language via a setting without changing URL. Language switcher in the header: "English | हिन्दी".
3. **SEO:** each page emits `hreflang="en-IN"`, `hreflang="hi-IN"` and `x-default`; `<html lang="hi-IN">` on `/hi/`; `og:locale hi_IN`; a separate sitemap.
4. **Content:** the month/guide data model gets per-locale fields (`title: {en, hi}`). A missing translation falls back to English **without** emitting a `/hi/` URL for that page (no thin duplicates).
5. **Fonts:** Noto Sans Devanagari / Tiro Devanagari subset, loaded only on `hi`.
6. **Translation process:** a human-reviewed translation (not raw machine output) for medical content; a reviewer signs off (YT-01). Keep terms parents actually use (e.g. "टीकाकरण", "पेट के बल लेटना (tummy time)").
7. Number/date formatting via `Intl` (`hi-IN`).

**Acceptance:** Switching to Hindi changes all strings on the scaffolded screens with no hard-coded English left on them. `/hi/` pages render server-side (YT-07). hreflang pairs are reciprocal.

**Verify:** A pseudo-locale test (`en-XA`) to find unextracted strings; the Search Console International Targeting/hreflang report.

---

## YT-19 — Android via Trusted Web Activity (Play Store)

**Goal:** A Play Store listing without building a separate native app.

**Changes:**
1. Requires YT-17. Use Bubblewrap (`@bubblewrap/cli`) or PWABuilder to generate the TWA project. Host `/.well-known/assetlinks.json` with the app's SHA-256 signing fingerprint.
2. Play listing (draft for Mohit; submitting it is his action): title "Yarn Trails: Baby Milestones & Vaccines", a short description in en-IN and hi-IN, screenshots from YT-09 card styles, and the content rating + Health apps declaration. Check Google Play's health-app and Families policies; the app is for adults (parents).
3. Update the schema `operatingSystem` to "Web, Android" and add the Play badge on the home page and `/start` only after the listing is live.
4. Payments inside the TWA: check Google Play's billing policy for digital subscriptions sold in-app (Play Billing may be required for in-app digital goods; review the current policy and India user-choice billing rules before launch).

**Acceptance:** An internal-testing track build installs, opens full-screen (no URL bar = asset links verified), and works offline.

**Verify:** Install from the internal testing track on a real Android phone.

---

## Out of scope for Cursor (Mohit's actions, not code)

- Recruiting real reviewers (YT-01), clinic pilots (YT-15), and creator outreach.
- Choosing GA4 vs Plausible, the test price, and the payment provider account setup.
- Submitting to Search Console/Bing and the Play Store.
- Supplying an Indian family hero photo and Hindi translations/review.
