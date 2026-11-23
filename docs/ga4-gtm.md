# GA4 + GTM (yarntrails.com)

| Item | Value |
|------|--------|
| GTM account | Yarn Trails |
| GTM container | `GTM-MNS7GQ24` (web · yarntrails.com) |
| GA4 measurement ID | `G-7E22FF9EJN` |
| Code | `src/utils/analytics.js` (loads after cookie consent) |

## What the app does

1. After **Accept analytics**, injects GTM and initializes `dataLayer` + `gtag`.
2. Sets Consent Mode **granted** for `analytics_storage` only (ads denied).
3. Calls `gtag('config', 'G-7E22FF9EJN', { send_page_view: false })` so the container picks up the property without duplicate auto page views.
4. Sends SPA **`page_view`** and product events via `dataLayer.push({ event, ... })` and `gtag('event', …)` (signup, premium, checkout, etc.).

## GTM (console)

Account **Yarn Trails** → container **yarntrails.com** → **`GTM-MNS7GQ24`**.

The repo injects `gtm.js` after consent (no manual snippet in `index.html`). You still need **one published tag** in this container (see below). The older public container **`GTM-T7HG74HL`** belonged to another Google account and is **not** used anymore.

**Runtime:** After consent the app loads **`gtag/js?id=G-7E22FF9EJN`** and **`gtm.js?id=GTM-MNS7GQ24`**, so GA4 receives hits **without** a published GTM Google tag. Use an empty GTM container for future marketing tags, or add a **Google tag** in GTM only if you remove the in-app `gtag/js` load (avoid double counting).

Optional tag in [tagmanager.google.com](https://tagmanager.google.com) (not required for GA4 with current code):

1. **Google tag** → measurement ID `G-7E22FF9EJN`, trigger **Initialization / All Pages**.
2. **GA4 Event** tags for conversions — Custom Event triggers matching:
   - `signup_completed`, `login_completed`, `premium_view`, `begin_checkout`, `consent_accepted`
   - Event name = `{{Event}}` (built-in variable).
3. **Publish** the container after changes.

## GA4 (your side)

[analytics.google.com](https://analytics.google.com) → Admin:

1. **Data streams** → Web → `yarntrails.com` → confirm ID `G-7E22FF9EJN`.
2. **Events** → mark as conversions: `signup_completed`, `begin_checkout`, `premium_view` (once they appear in Realtime).
3. **Product links** → **Search Console** → link `yarntrails.com`.

## Verify

1. Incognito → yarntrails.com → Accept analytics.
2. Network: `gtm.js?id=GTM-MNS7GQ24` (200).
3. GTM **Preview** or GA4 **Realtime**: navigate `/premium`, trigger `premium_view`.
4. Staff funnel: `/admin/insights` (first-party, no GA required).

## Vercel env (optional)

| Variable | Purpose |
|----------|---------|
| `VITE_GTM_CONTAINER_ID` | Override container (default `GTM-MNS7GQ24` in build) |
| `VITE_GA_MEASUREMENT_ID` | Load **additional** `gtag/js` — only if you want direct GA without GTM; do not duplicate the same ID in both paths |