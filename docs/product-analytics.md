# Product analytics (staff Insights)

First-party operational analytics for Yarn Trails staff. **Parents never see this.** Events fire only after cookie consent. Raw IP is a 30-day fraud/debug field, then hashed. Analytics rows are **not** included in `export_my_data`.

**Console:** [`/admin/insights`](../src/pages/admin/AdminInsights.jsx) (staff). IP lookup is **admin** only.  
**Ingest:** `POST /api/analytics` (Vercel, service role insert). Clients cannot `SELECT` `analytics_events`.  
**Rollup/scrub:** `GET/POST /api/analytics-rollup` (cron `15 1 * * *`) calls `analytics_rollup_and_scrub()`.

Related: [`admin-portal-design.md`](admin-portal-design.md) · [`auth-membership-admin.md`](auth-membership-admin.md) · Privacy/Cookie copy in [`src/data/legalContent.js`](../src/data/legalContent.js)

---

## Who can see what

| Surface | `support` | `admin` |
|---------|-----------|---------|
| Overview 7-day KPI row | Yes | Yes |
| Insights tabs (traffic, acquisition, conversion, habit, content) | Yes | Yes |
| Country / device / `ip_hash` aggregates | Yes | Yes |
| Raw `ip` via **IP lookup** | No | Yes (last 30 days) |
| `/admin/*` page views as product traffic | Never ingested | Never ingested |

Staff `user_id`s (`profiles.role` in `admin`, `support`) are excluded from public funnel RPCs.

---

## Retention

| Data | Policy |
|------|--------|
| `analytics_events.ip` | Null after **30 days** |
| `analytics_events.ip_hash` | Kept while the row exists (HMAC of IP + day + `ANALYTICS_IP_SALT`) |
| Raw event rows | Deleted after **90 days** |
| `analytics_daily` | Kept (aggregates only) |

Salt: `ANALYTICS_IP_SALT` (Vercel/Supabase secrets — never `VITE_`). Cron auth: `CRON_SECRET`.

---

## Event allowlist

Traffic: `page_view`, `session_start`, `consent_accepted`, `consent_rejected`

Auth/revenue: `signup_view`, `signup_completed`, `login_completed`, `premium_view`, `begin_checkout`, `subscribe_success` (Stripe webhook, not the browser), `trial_started`, `gate_hit`

Habit: `birth_date_set`, `milestone_checked` (`month` only), `first_saved` (`media_type` only)

Content: `guide_view` (`guide_slug`), `community_tab` (`tab`)

**Allowed `props` keys:** `month`, `guide_slug`, `sku`, `feature`, `media_type`, `tab`. Unknown keys are dropped. Do not send baby names, notes, photos, vaccine IDs, or birth dates.

Unknown `event_name` → `400`. `/admin` paths → skipped (`204`).

---

## Client

- Consent banner always shows (first-party Insights does not require a GA ID).
- After accept: `trackPageView` / `trackEvent` dual-write to GA (if `VITE_GA_MEASUREMENT_ID` is set) and `POST /api/analytics`.
- Session id in `sessionStorage` (`yarntrailsAnalyticsSession`), 30-minute idle timeout.
- Implementation: [`src/utils/analytics.js`](../src/utils/analytics.js), [`src/utils/analyticsIngest.js`](../src/utils/analyticsIngest.js), [`src/utils/analyticsEvents.js`](../src/utils/analyticsEvents.js).
- **Local dev:** Vite serves `POST /api/analytics` via [`scripts/vite-dev-api.mjs`](../scripts/vite-dev-api.mjs) (needs `SUPABASE_SECRET_KEY` in `.env`). Production uses the Vercel function after deploy.

---

## Schema

Migration: `supabase/migrations/20260906090000_analytics.sql`

- `analytics_events` — hot log (service-role insert only)
- `analytics_daily` — staff-selectable rollups
- RPCs: `analytics_overview`, `analytics_top_routes`, `analytics_geo`, `analytics_devices`, `analytics_funnel`, `analytics_utm`, `analytics_entry_pages`, `analytics_gates`, `analytics_habit`, `analytics_content`, `analytics_lookup_ip` (admin), `analytics_rollup_and_scrub` (cron / service role)
