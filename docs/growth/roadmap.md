# Yarn Trails — growth roadmap

Status reflects the working tree on 19 Nov 2026. Nothing in Horizon 1 is deployed. Do not deploy without an explicit request.

Impact and effort are judgments. Success metrics have no baseline in the repo. “Up” means a direction to watch after release, not a target invented from nothing.

## Horizon 1 — this week

### H1. Homepage says what it does, and the birth date is the first action

- **Problem.** The H1 was “The art of early motherhood.” Create account, a mislabeled Plus trial (“Preview without an account”), and birth date competed. Parents could not tell the product was free, or that a birth date was enough.
- **Solution.** H1: “See this month with your baby.” Subtitle names milestones, vaccines, memories, and free. The date field is the primary control. Account is a quiet link: “Create a free account to keep it.” The hero no longer calls `startLocalTrial`. The lower editorial band still offers a labeled Premium preview. Title and description match the visible promise: `Baby milestones and vaccines | Yarn Trails`. Prerender uses the same H1.
- **Expected outcome.** More first sessions set a birth date. Fewer people bounce because the page sounds like a magazine.
- **Priority.** P0.
- **Effort.** Low.
- **Dependencies.** None.
- **Success metric.** `birth_date_set` per `session_start` on `/`, after consent. Compare the 14 days after deploy with the 14 days before. Also watch `signup_completed` so the quieter account link does not collapse signups to zero.
- **Status.** Implemented. Not deployed.

### H2. Stop claiming a medical review board

- **Problem.** `/medical-reviewers` showed “Our review board (placeholder)” to the public. Editorial policy said clinicians review guides before publication. Neither is true. `reviewedBy` is still “Pending medical review.”
- **Solution.** The reviewers page states that no named clinician has been appointed, cites WHO, CDC, AAP, and IAP as sources rather than endorsements, and describes what a future named review will mean. Editorial policy no longer claims a pre-publication clinician review. Trust strip names IAP alongside the other cited bodies. Schema still omits pending reviewer names.
- **Expected outcome.** The page can be shown to a pediatrician without embarrassment. No fake endorsement enters search snippets.
- **Priority.** P0.
- **Effort.** Low.
- **Dependencies.** A real reviewer is a later, human step. Do not add a name until they have agreed in writing.
- **Success metric.** Zero public occurrences of “placeholder” on `/medical-reviewers`. A named reviewer is a separate project, not a copy tweak.
- **Status.** Implemented. Not deployed.

### H3. WhatsApp share on a month and on the vaccination schedule

- **Problem.** `wa.me` existed for community posts. The objects families forward — “month 6” and “the vaccine chart” — had no share control.
- **Solution.** `ShareButton` on `/month/:n` (“Send this month”) and on `/vaccination` (“Share the schedule”). URL is the production canonical. Copy does not include the baby’s name, checked milestones, or which doses are due for this child. India schedule copy names IAP/UIP and tells the parent to confirm doses with their pediatrician. Channels: system share, WhatsApp, X, Facebook, copy. Buttons are 56px. `content_shared` records the click only (`feature` = channel, `tab` = surface, `month` when relevant).
- **Expected outcome.** Some families send a public page into a WhatsApp group. That is the first measurable viral action.
- **Priority.** P0.
- **Effort.** Low.
- **Dependencies.** Consent for the event. Sharing itself does not require an account or consent.
- **Success metric.** `content_shared` where `tab` is `month` or `vaccination`, divided by sessions that viewed those routes. A useful first read is whether WhatsApp (`feature=whatsapp`) is the majority channel. Do not treat clicks as sends.
- **Status.** Implemented. Not deployed.

### H4. Locale signals match India

- **Problem.** `lang`, `og:locale`, and schema said `en-GB` / GBP and listed iOS and Android. The product’s market signal is India, and there is no store app.
- **Solution.** `en-IN` / `en_IN`. Free offer `priceCurrency: INR`, `price: 0`. `operatingSystem: Web`. Checkout currency is unchanged and still must be verified (see H6).
- **Expected outcome.** Rich results and shares stop describing a British app.
- **Priority.** P1. Shipped with the homepage because it is the same front door.
- **Effort.** Low.
- **Dependencies.** None.
- **Success metric.** View source on `/` shows `en-IN`, `en_IN`, `INR`, and `operatingSystem` of `Web`.
- **Status.** Implemented. Not deployed.

## Horizon 2 — next 30 days

### H5. One India vaccination page that deserves to rank

- **Problem.** The tracker is useful and the prerendered vaccination hub is thin. Search for an India chart lands on FirstCry, Babynama, and similar pages. The guide that exists does not carry the IAP/UIP detail the tracker already uses.
- **Solution.** One URL, not thirty-six. State the schedule Yarn Trails actually implements, link primary IAP and UIP sources, say what the tracker does and does not do, and link to `/vaccination`. Visible FAQ only. No “doctor recommended” language.
- **Expected outcome.** A page a parent can use without the app, which then leads into the tracker.
- **Priority.** P0 for organic acquisition.
- **Effort.** Medium. Writing and medical caution, not a new framework.
- **Dependencies.** H2 stays honest. A clinician reviewer is ideal and not required to publish a sourced summary.
- **Success metric.** Indexation of that URL, and assisted visits onward to `/vaccination` (`page_view` route). Rankings only via Search Console.
- **Status.** Guide shipped: `/guides/vaccination-tracker-india`. Still needs deploy + Search Console indexing.

### H6. Charged price equals the sticker

- **Problem.** `detectPremiumCurrency` shows ₹399 / ₹2,499 for `Asia/Kolkata`. `api/checkout.js` sends a single Stripe price ID per SKU and does not pass a currency. If those prices are USD, Indian parents see rupees and pay dollars.
- **Solution.** Create INR (and GBP, USD) Stripe prices, or stop showing non-USD amounts until they exist. Pass the price ID that matches the displayed currency.
- **Expected outcome.** Checkout trust. A fair test of whether anyone will pay.
- **Priority.** P0 before any pricing experiment.
- **Effort.** Low in code, blocked on Stripe dashboard access.
- **Dependencies.** `STRIPE_SECRET_KEY` and price IDs. Do not guess them.
- **Success metric.** A test checkout in India charges the amount shown on `/premium`.
- **Status.** Not started. Needs Stripe access.

### H7. One free viewer seat

- **Problem.** The person most likely to open a link every week is a grandparent. They cannot be invited on Basic.
- **Solution.** Allow one read-only seat on Basic, two on Plus. The free seat sees the flip-book or a month summary the parent explicitly shares, not vaccine notes or the full medical log. Cap invites. Expire unused invites.
- **Expected outcome.** A second adult in the household has a reason to install or open Yarn Trails.
- **Priority.** P0 for retention and virality, after H3 shows that anyone shares at all.
- **Effort.** Medium. Schema, RLS, and email or link invites already partly exist for Plus.
- **Dependencies.** Privacy decision on viewer scope. Do not grant vaccine records by default.
- **Success metric.** Invites sent, invites accepted, and the invited adult’s D7 return. No reward points until this works without them.
- **Status.** Not started.

### H8. Share cards as the Open Graph image

- **Problem.** Every shared month uses `og-default.png`. WhatsApp previews will look like a generic brand card.
- **Solution.** A static card per month (title plus “range, not a race”), generated at build, referenced from `usePageMeta` on `/month/:n`. No baby photo in the default card.
- **Expected outcome.** Higher tap-through on the links H3 creates.
- **Priority.** P1.
- **Effort.** Low–medium.
- **Dependencies.** H3.
- **Success metric.** Spot-check WhatsApp preview. Later, compare `content_shared` to landing `page_view` with `utm_medium=share` if we add that parameter to the shared URL.
- **Status.** Not started. Shared URLs do not yet add UTMs, on purpose, so the canonical stays clean. Add UTMs only as a separate query that canonicals strip (they already strip queries).

### H9. Real 404 and cache headers

- **Problem.** Unknown paths return 200 and the SPA shell. Hashed assets were reported with `max-age=0` in the November crawl. Not re-measured here.
- **Solution.** A Vercel rule that returns 404 for paths that are not app routes, without enabling `cleanUrls`. Long cache on `/assets/*` only.
- **Expected outcome.** Cleaner index, less duplicate homepage HTML.
- **Priority.** P1.
- **Effort.** Low, high regression risk for `/admin`, `/login`, `/account`.
- **Dependencies.** A route list generated from `src/routes.js` and the sitemap.
- **Success metric.** A nonsense path returns HTTP 404. `/login` and `/admin` still return the app.
- **Status.** Not started.

## Horizon 3 — next 90 days

### H10. Hindi for the jobs, not a translated brand site

- **Problem.** Stories can be Hindi. The tracker, vaccine page, and nav cannot. Mass-market India will not live in an English-only chrome.
- **Solution.** Hindi strings for Today, the month page, and vaccination first. `hreflang` only when the Hindi URL has real body copy. Do not machine-translate medical pages unsupervised.
- **Expected outcome.** A parent can show the vaccine list to a grandparent who does not read English.
- **Priority.** P0 for reach, P2 until H5 and H7 exist. Translating a thin page does not rank.
- **Effort.** High.
- **Dependencies.** H5 copy locked. A human editor for Hindi health wording.
- **Success metric.** Share of `content_shared` and `birth_date_set` from a Hindi entry URL, once it exists.
- **Status.** Not started.

### H11. Android only after a week-2 reason to return

- **Problem.** Discovery in India happens on the Play Store. An app that does not bring anyone back wastes the listing.
- **Solution.** Finish the Expo app or a Trusted Web Activity after D7 on the web is visible in Insights. Play listing copy must match the medical-disclaimer rules in `docs/store-readiness.md`. No “doctor-approved.”
- **Expected outcome.** A second acquisition channel that does not depend on SEO.
- **Priority.** P1 after retention is measurable.
- **Effort.** High.
- **Dependencies.** H1–H3 deployed. Play Console. The same birth-date key (`babyBirthDate`) already matches the website.
- **Success metric.** Store listing live, and install → birth date in the app. Not download count as a vanity goal.
- **Status.** Not started. `mobile/` exists.

### H12. Distribution that a small team can actually run

Pick one, not all:

- Ten micro-creators with a unique `utm_campaign`, paid in Plus months (promo codes already exist), not cash the company does not have.
- One pediatric clinic QR on a discharge card that opens `/vaccination` with `utm_source=clinic`. The page must be honest (H2, H5).
- Gift Plus (`gift_subscription` is already a Stripe SKU) as a grandparent present, after H6.

Hospital chains, YouTube series, and a referral-points economy wait until one of these produces accepted invites or return visits.

- **Status.** Not started.

### H13. Monetization experiment, not a price cut by default

- **Problem.** ₹2,499 per year against free commerce apps will not win tracker users. The thing they cannot get from Mylo is the keepsake in the family’s language.
- **Solution.** Keep tracking free. Test which paid object converts: extra stories, the printed book, or the gift. Do not discount the tracker. Do not add a countdown.
- **Expected outcome.** A paid SKU that matches the reason people stay.
- **Priority.** P1 after H6.
- **Effort.** Medium.
- **Dependencies.** Stripe prices. `begin_checkout` and `subscribe_success` already exist.
- **Success metric.** Checkout starts and paid subscriptions by SKU. Churn needs Stripe. There is no in-repo churn baseline.
- **Status.** Not started.

## Explicitly not on this roadmap

- Fabricated testimonials, user counts, or pediatrician quotes.
- A points program for sharing.
- Auto-posting into WhatsApp groups.
- AI diagnosis or “what is wrong with my baby” features.
- Generating dozens of near-duplicate month pages to chase keywords.
