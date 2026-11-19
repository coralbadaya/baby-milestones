# Yarn Trails — growth metrics

There is no baseline in this repository. Do not fill the gaps with estimates. Staff Insights (`/admin/insights`) and the Stripe dashboard are the systems of record after deploy. Search Console is not connected from this repo.

Events fire only after cookie consent. They must not contain baby names, birth dates, vaccine ids, notes, or photos. See `docs/product-analytics.md`.

## What we can already count

| Question | Event or source | Notes |
|---|---|---|
| Sessions and page views | `session_start`, `page_view` | Path and `route_key`. UTM source, medium, campaign. Referrer host. |
| Account intent | `signup_view`, `signup_completed`, `login_completed` | OTP completion is the signup event. |
| Activation | `birth_date_set` | Fires when a birth date is saved. Best activation event we have. |
| Habit | `milestone_checked` (`month` only), `first_saved` (`media_type` only) | |
| Content | `guide_view` (`guide_slug`) | |
| Share clicks | `content_shared` | Added 19 Nov 2026. `feature` is the channel (`whatsapp`, `native`, `x`, `facebook`, `copy`). `tab` is `month` or `vaccination`. `month` is set on month pages. A click, not a confirmed WhatsApp send. |
| Paywall | `gate_hit`, `premium_view`, `trial_started`, `begin_checkout` | |
| Revenue | `subscribe_success` | Written by the Stripe webhook, not the browser. |
| Staff rollups | `analytics_daily`, `analytics_overview`, `analytics_funnel`, `analytics_habit`, `analytics_utm` | Aggregates. Raw events drop after 90 days. |

`content_shared` is allowlisted and will be stored. Insights charts that hard-code older event names will not graph it until someone adds it to the rollup RPC. The raw event is still the measurement.

## Definitions to use once data exists

Do not compute these by hand from memory.

### Acquisition

- Organic: `page_view` with referrer host of a search engine, or no referrer and no UTM. This undercounts. Search Console is the real organic number.
- Social and creator: `utm_source` / `utm_medium`.
- WhatsApp: referrer host `wa.me` or `web.whatsapp.com` when the browser sends it (often it does not), plus `utm_medium=share` if we add it later. Until then, `content_shared` with `feature=whatsapp` is the outbound click, not the inbound visit.
- Clinic or partner: a dedicated `utm_source` we control.

### Activation

A session is activated when any of these happens:

1. `birth_date_set` (primary).
2. `milestone_checked`.
3. A vaccination `page_view` after a birth date exists. We cannot see “schedule viewed” as its own event today. Add one only if birth-date activation is too rare to learn from.
4. First story. There is no `story_generated` event. `baby_book_idea` is the idea studio, not a finished story. Gap.
5. `content_shared`.

The north-star activation for the next release is **birth date set in the first session**.

### Retention

D1, D7, and D30 are not computed. `analytics_daily` can show returning session volume, not a cohort. A cohort needs `session_start` joined to a stable anonymous id. The current session id rotates. Signed-in `user_id` on events is the only honest retention key, and it misses people who never create an account.

Until a cohort query exists, watch:

- Weekly count of distinct signed-in users with `milestone_checked` or `page_view` on `month`.
- Do not call that “D7 retention.”

### Virality

- Share rate: `content_shared` sessions / sessions with a `month` or `vaccination` view.
- Invitation rate: not instrumented. Add `viewer_invited` and `viewer_accepted` when the free seat exists. Props: none that identify the invitee. `feature` can hold `basic` or `plus`.
- Shares per active family: impossible while most families are anonymous.

### Revenue

- Free to paid: `subscribe_success` / `signup_completed` in the same window. Imperfect (people pay later).
- Checkout start: `begin_checkout` by `sku`.
- Price shown versus price charged: a manual Stripe check (see roadmap H6), not an event.
- Churn, renewal, gift redemption: Stripe and `redeem_promo_code`. Not in Insights today.

## Gaps to instrument next, in order

1. Confirm `content_shared` appears in `analytics_events` after deploy and consent. No schema migration required. The allowlist is in `src/utils/analyticsEvents.js`.
2. Add `content_shared` to the habit or content rollup so it survives the 90-day raw delete.
3. `story_generated` with `feature` = language code only, when the first Basic story is spent. That is the bridge from free tracking to Plus.
4. `viewer_invited` / `viewer_accepted` with the free-seat project. No email addresses in props.
5. A signed-in cohort for D1/D7/D30. Do not build this before there are enough accounts to read it.
6. Search Console, linked to the same person who can read Insights.

## What we will not track

- Baby names, dates of birth, vaccine names, clinic notes, or photo metadata in analytics.
- Share text.
- Contacts from the phone’s address book.
- Anything on `/admin`.
