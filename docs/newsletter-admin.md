# Newsletter admin

Admin route: `/admin/newsletter` (staff read; admin write).

## Tabs

| Tab | Access | Purpose |
|-----|--------|---------|
| Campaigns | Staff read, admin write | List drafts, scheduled, and sent campaigns |
| Compose | Admin | Edit subject/body, preview, save draft, sample send, schedule |
| Templates | Admin | System + custom templates; duplicate to campaign |
| Subscribers | Staff read, admin write | Active count, manual add, CSV export |

## Workflow

1. **New campaign** → pick a template or start blank.
2. **Save draft** — explicit save + auto-save every 30s when dirty.
3. **Send sample to me** — invokes `newsletter-send-test` edge function with `[Sample]` subject prefix.
4. **Schedule send** — datetime picker confirms active subscriber count; sets `status = scheduled`.
5. **Send now** — sets `scheduled_at = now()`; queue processor sends in batches of 50.

Merge tags: `{{site_url}}`, `{{unsubscribe_url}}`, `{{subscriber_email}}`, `{{year}}`, `{{baby_month}}`, `{{feature_name}}`.

## Files

| File | Role |
|------|------|
| `src/pages/admin/AdminNewsletter.jsx` | Admin UI |
| `src/utils/newsletter.js` | Merge tags, HTML wrapper, preview |
| `src/utils/newsletterAdmin.js` | Supabase CRUD + edge invoke |
| `src/pages/NewsletterUnsubscribe.jsx` | Public unsubscribe page |
| `src/components/Footer.jsx` | Footer signup → `subscribe_newsletter` RPC |
| `supabase/migrations/20250701140000_newsletter.sql` | Schema + seeds |
| `supabase/functions/newsletter-send-test/` | Sample send |
| `supabase/functions/newsletter-process-queue/` | Scheduled batch send |

## Footer signup

Public RPC `subscribe_newsletter(email)` — handles duplicates and reactivation after unsubscribe.

## Unsubscribe

Every outbound email includes `{{unsubscribe_url}}` → `/newsletter/unsubscribe?token={unsubscribe_token}`.

Public RPC `unsubscribe_newsletter(token)` — no auth required.
