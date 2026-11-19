# Yarn Trails — growth baseline audit

Verified against the repository on 19 Nov 2026. The 17 Nov 2026 mass-market audit was an input, not a source of truth. Claims below were checked in code. Nothing here is a traffic, ranking, or revenue number. Those are not in the repo.

## Current product architecture

Yarn Trails is a React 19 + Vite SPA on Vercel, with Supabase for auth, Postgres, and storage, and Stripe Checkout for Plus (`api/checkout.js`, `api/stripe-webhook.js`). Parents use the website. An Expo app lives in `mobile/` and is not a store listing.

| Layer | What exists |
|---|---|
| Routes | `src/routes.js`. Today, My Baby, My Care, Essentials, Community, Guides. Vaccination, month pages `/month/1`–`/month/36`, guides, Plus, account, admin. |
| Identity | Email OTP and OAuth. Baby name and birth date sync to `baby_profiles` when signed in. Anonymous use stores the birth date in `localStorage` (`babyBirthDate`). |
| Health data | Milestone checks, vaccine records, shopping checks. Signed-in rows sync after one merge per domain. |
| Family | Grandparent and partner viewer seats are Plus-only (`viewerSeats` in `src/constants/premium.js`, gated in `PlusExtras.jsx`). Basic includes zero seats. |
| Stories | 12 story languages in `src/constants/storyLanguages.js`, including Hindi, Tamil, Telugu, and Bengali. The interface around them is English. Basic includes 1 story total. |
| Payments | Stripe price IDs per SKU. Display prices in INR, GBP, and USD (`PREMIUM_CURRENCIES`). No Razorpay code. |
| Analytics | Consent-gated first-party events to `POST /api/analytics`. Staff see `/admin/insights`. Google Analytics is optional. |
| SEO | Prerender at build (`scripts/prerender-seo.mjs`), sitemap, robots, canonicals, JSON-LD. `vercel.json` rewrites unknown paths to `/index.html`. |
| Deploy | GitHub `main` → Vercel project `baby-milestones`, domain yarntrails.com. `www` 301s to apex. |

The product already does the jobs a mass-market parent would open the app for: this month’s milestones, an India IAP/UIP-style vaccine schedule (`src/data/vaccines/index.js`), postpartum care, and a keepsake. The front door did not say so.

## What the November audit got right

- Homepage H1 was the tagline “The art of early motherhood.” Three actions competed: create account, “preview” (which silently started a 7-day Plus trial via `startLocalTrial`), and birth date as a tertiary option.
- `/medical-reviewers` rendered the heading “Our review board (placeholder)” and a public note telling staff to replace the placeholders. Editorial policy claimed health guides “are reviewed by qualified clinicians before publication.” `reviewedBy` on guides is still `Pending medical review`, and schema correctly omits pending names.
- `og:locale` was `en_GB`. WebSite `inLanguage` was `en-GB`. WebApplication offered `priceCurrency: GBP` and `operatingSystem: Web, iOS, Android`. The UI is English. There is no App Store or Play listing in the repo.
- WhatsApp share existed only as `wa.me` inside community `ShareButton`. Month pages and the vaccination tracker had no share control.
- Viewer seats are Plus-only. A family loop cannot start on the free tier.
- Unknown URLs are rewritten to `index.html` and return HTTP 200. React then shows `NotFound` with `noindex`. That is a soft 200 for clients that do not run JavaScript, and the shell they receive can look like the homepage.
- Milestone guides and `/month/:n` can target the same “N month milestones” query. Both remain indexable.
- Story languages include Hindi, Tamil, Telugu, and Bengali. They are not on the homepage.
- India vaccine data, FirstCry and Amazon.in shopping links, and INR display prices are real.

## What the November audit got wrong or overstated

- Core guides are public. `GuideArticle.jsx` has no `PremiumGate`. The Plus comparison row that says “guides: not included” does not match the article pages. Long-haul travel notes, some shopping edits, vaccination export, and the full flip-book are gated. Milestone guides are not.
- “No service worker” and “no app” need a narrower claim. `mobile/` is an Expo app in progress. Schema must not advertise iOS and Android until store listings exist. A PWA manifest does exist.
- Word counts of rendered HTML were not re-measured in this pass. The prerender stub is `display: none` (`index.html`). Homepage, guides, and product FAQs do inject body HTML at build time. Thin hubs (`/vaccination`, `/baby`, `/mom-care`, `/premium`) are still mostly client-rendered. Treat the thin-hub finding as still open, not as a fresh word count.
- Competitor download counts and ratings in the November audit were not re-checked. Do not repeat them as Yarn Trails facts.
- Stripe Checkout exists. The November note that UPI could not be confirmed is still right: checkout sends one price ID per SKU and does not set a currency. Rupee prices on `/premium` can disagree with the amount Stripe charges unless those Price objects are actually INR. Confirm in the Stripe dashboard before any price test.

## Current growth funnel

```
Visit /  →  (was) account, fake preview, or birth date
         →  Today on this device
         →  optional free account (OTP)
         →  1 AI story on Basic
         →  Plus trial / ₹2,499 displayed annual
```

The valuable first action is the birth date. It opens this month with no account. Account creation matters later, when the parent wants the record on a second phone. Demanding an account first throws away the only advantage versus Mylo and Healofy, which are already installed.

There is no measured conversion rate in the repo.

## Current UX weaknesses

- The name Yarn Trails does not say what the product does. The H1 has to.
- Welcome mode talked to “new mothers” and “unhurried readers.” Fathers and grandparents were absent.
- “Preview without an account” on the hero started Plus. The label and the code disagreed. That button is gone from the hero. The editorial band lower on Today still offers an honestly labeled Premium preview.
- Family viewing is buried in the baby book and paywalled.
- Share, where it existed, lived on community posts, not on the emotional objects (a month, a vaccine schedule).

## Current SEO weaknesses

- Locale signals described a UK English product priced in pounds, with mobile apps. The market signal in product code is India (Kolkata → INR, default vaccine schedule India, IAP citations).
- One `og-default.png` for pages that should preview as a milestone card. Unchanged in this pass.
- Soft 200s for unknown URLs. Unchanged.
- `/month/:n` and `/guides/:n-month-old-milestones` can cannibalize. Unchanged. Do not noindex either until one page is actually deeper.
- Hindi search demand has no `/hi/` URLs and no hreflang. Shipping empty locale URLs would be worse than waiting.
- Vaccination tracker HTML is thin. The India schedule content lives in the client. A single sourced IAP plus UIP page, linked to the tracker, is the content bet. Do not generate 36 near-duplicate vaccine pages.

## Current trust and credibility weaknesses

Fixed in this pass, not deployed:

- The public placeholder review board is gone.
- Editorial policy no longer claims a clinician reviewed guides before publication.
- `/medical-reviewers` says there is no named board yet, and points at WHO, CDC, AAP, and IAP citations.

Still true:

- No testimonials, ratings, or user counts. Do not invent them.
- Guide `reviewedBy` remains “Pending medical review” and is omitted from schema. That is correct until a named clinician exists.
- Trust strip now names IAP as well as WHO, CDC, and AAP. That matches citations already in the month pages and the India schedule. It is not a claim that IAP endorsed Yarn Trails.

## Current monetization

| | Basic | Plus (displayed) |
|---|---|---|
| Milestones | Unlimited | Unlimited |
| Album photos | 2 / month | Unlimited HD |
| AI stories | 1 total | Unlimited |
| Voice notes | 3 × 30s | Unlimited, still 30s |
| Flip-book | Watermarked preview | Full |
| Viewer seats | None | 2 |
| India display price | ₹0 | ₹399 / month, ₹2,499 / year, ₹3,999 bundle, ₹2,999 gift |

₹2,499 a year is a keepsake price, not a tracker price. Mylo and Healofy are free and make money on commerce. Yarn Trails should not lead with the annual price. Lead with the free month. Charge for the book, the extra stories, and print. The gift SKU already exists in Stripe’s price map and is unused as a growth loop.

Promo redemption exists (`redeem_promo_code`). That is the early-access path when Stripe is not configured (`503` from `api/checkout.js`).

## Current viral mechanisms

Before this pass: community share buttons, story share inside the book, no referral code, no family invite on the free tier.

After this pass (not deployed): month pages and the vaccination tracker can open WhatsApp, the system share sheet, X, Facebook, or a copy, with the public canonical URL only. The message does not include the baby’s name, which milestones were checked, or which doses are due. `content_shared` records the click (`feature` = channel, `tab` = `month` or `vaccination`). A click is not a confirmed send.

## Current distribution capabilities

- Website and PWA manifest. No store links.
- Social URLs in `brand.js` point at `@yarntrails` on Instagram, TikTok, Pinterest, and YouTube. The code does not prove those accounts are active.
- Contact form accepts partnership topics via `submit_contact_form`.
- No referral program, no hospital QR, no creator links with `utm` capture beyond the analytics UTM fields that already exist (`utm_source`, `utm_medium`, `utm_campaign`).

## Technical blockers

- Stripe price currency may not match the INR display. External dashboard check.
- Real HTTP 404s fight the SPA rewrite. Needs a careful Vercel status rule, not `cleanUrls` (that 404s `/admin`, `/login`, `/account`).
- Hindi UI is a product surface, not a string file that already exists.
- Family seats need a free tier change and abuse limits (invite spam, data access). Do not flip the gate without a privacy review of what a viewer can see.
- Search Console, Play Console, and a Razorpay or Stripe India account are outside the repo.

## Quick wins already made

See the roadmap. Shipped in the working tree, not on production:

1. Homepage H1 and the single primary action (birth date).
2. Honest medical-review and editorial-policy copy.
3. WhatsApp and other share actions on month pages and the vaccination tracker, without private health details.
4. Locale and schema corrected to `en-IN`, INR, and Web. Same front-door change.

## Top 10 opportunities

Ranked by impact for a small team selling to Indian families, not by novelty.

| # | Opportunity | Why it is this high | Effort |
|---|---|---|---|
| 1 | Birth date as the first action, with a concrete H1 | Activation. The product’s value is “this month,” and it works before an account. | Done in this pass |
| 2 | Remove the fake review board | A health site that says “placeholder” will lose the parents and the pediatricians it later needs. | Done in this pass |
| 3 | Share a month or the India schedule on WhatsApp | The channel families already use. Public URLs only. | Done in this pass |
| 4 | One sourced India vaccination page (IAP and UIP) that links to the tracker | Search demand is real and competitors already rank. The tracker data exists. The HTML page does not. | Medium. Must not be thin or medically sloppy |
| 5 | One free viewer seat | Grandparents are the distribution. Paywalling the first seat means the loop never starts. | Medium. Privacy and abuse |
| 6 | Make the displayed INR price the charged price | Trust and conversion. A rupee sticker that checks out in dollars is a broken promise. | Low once Stripe prices exist |
| 7 | Hindi for the tracker and the vaccine page, not the whole brand site | Mass-market reach. Stories already have Hindi. The chrome does not. | High |
| 8 | Month-card Open Graph images | Share CTR on WhatsApp once sharing exists. | Low–medium |
| 9 | True 404 status and long-cache hashed assets | Crawl quality and speed. | Low, easy to break routing |
| 10 | Android listing (TWA or the Expo app) only after the web loop retains | Stores are where Mylo and Healofy are found. An empty listing will not retain. | High |

Deprioritize: a referral-rewards program before anyone is sharing, 36 new thin milestone URLs, a Hindi site with no hreflang content, and leading the homepage with Plus pricing.
