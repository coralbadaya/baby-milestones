# Auth, membership & admin

Yarn Trails uses Supabase for accounts, early-access membership, contact submissions, and the admin center.

## Local login (quick reference)

Seed test users first:

```bash
npm run seed:test-users
```

Sign in at **http://localhost:5173/login** (local dev).

| Role | Email | Password |
|------|-------|----------|
| User | `nestbean-test-user@mailinator.com` | `NestbeanTestUser1!` |
| Admin | `nestbean-test-admin@mailinator.com` | `NestbeanTestAdmin1!` |

- Seeded users are pre-verified (no OTP at login).
- Admin console: **http://localhost:5173/admin**
- Promo code for testing: **`FOUNDING30`**
- Requires `VITE_SUPABASE_URL` + `SUPABASE_SECRET_KEY` in `.env` before seeding.
- Override credentials via `SUPABASE_TEST_*` env vars (see [Test credentials](#test-credentials-default) below).

Beginner setup guide: [`docs/development-workflow.md`](development-workflow.md#login-details-local-dev).

## Environment

Copy `.env.example` to `.env` and set:

- `VITE_SUPABASE_URL` — project URL
- `VITE_SUPABASE_ANON_KEY` — anon / publishable key (never commit the service role key)

## Database

Migration: `supabase/migrations/20250629120000_membership_and_contact.sql`

Tables:

| Table | Purpose |
|-------|---------|
| `profiles` | User display name + role (`user`, `support`, `admin`) |
| `memberships` | Plan/status (`free`, `trial`, `active`, `comp`, `expired`) |
| `promo_codes` | Admin-managed access codes |
| `promo_redemptions` | One redemption per user per code |
| `contact_submissions` | Contact form inbox |
| `diy_activity_images` | Per-activity DIY card image metadata (180 rows) |
| `newsletter_subscribers` | Footer signups + manual list; tokenized unsubscribe |
| `newsletter_templates` | Reusable email starting points (3 system seeds) |
| `newsletter_campaigns` | Draft / scheduled / sent campaigns |
| `newsletter_sends` | Per-recipient send audit log |
| `baby_profiles` | Primary baby name + DOB (siblings supported) |
| `milestone_checks` | Per-baby milestone checkbox state |
| `shopping_checks` | Per-baby shopping checklist state |
| `vaccine_settings` / `vaccine_records` / `custom_vaccines` | Vaccination tracker |
| `first_moments` | Life firsts metadata (private bucket `first-moments`) |
| `user_saved_recipes` / `user_helpful_tips` | Community saves |
| `stripe_events` | Webhook idempotency (service role only) |
| `analytics_events` / `analytics_daily` | Staff Insights warehouse (service-role ingest; not in `export_my_data`) |

Apply locally or to remote:

```bash
supabase link --project-ref YOUR_REF
supabase db push
```

Migration `20250629130000_fix_rls_and_contact_insert.sql` fixes **RLS recursion** on `is_staff()` / `is_admin()` (stack depth errors) and reaffirms **anonymous contact form inserts**.

Migration `20250701150000_contact_submit_rpc.sql` adds `submit_contact_form()` RPC — used by `/contact` and `/feedback` so submissions succeed without anon SELECT on `contact_submissions`.

Migration `20260906061741_feedback_subjects.sql` extends the RPC subject allowlist with feedback topics (`love`, `suggestion`, `bug`, `content`, `billing`, `other`). Legacy `feedback` remains valid. Until that migration is applied, `/feedback` retries as subject `feedback` with the topic in the message.

### Bootstrap first admin

After your account exists in Auth, run in the SQL editor:

```sql
update public.profiles set role = 'admin' where id = (
  select id from auth.users where email = 'you@example.com'
);
```

## Frontend

| File | Role |
|------|------|
| `src/context/AuthContext.jsx` | Session, profile, membership, promo redeem, `continueWithPassword`, optional OTP |
| `src/utils/auth.js` | `isEmailVerified`, `isEmailNotConfirmedError`, `isInvalidCredentialsError` |
| `src/utils/membership.js` | `isPremiumActive`, labels, expiry |
| `src/utils/supabaseClient.js` | Supabase client |
| `src/components/auth/RequireAuth.jsx` | Redirect to login when there is no session |
| `src/components/auth/OtpVerifyForm.jsx` | 6-digit OTP entry + resend |
| `src/components/auth/RequireRole.jsx` | Staff/admin guard |
| `src/pages/Login.jsx`, `SignUp.jsx`, `VerifyEmail.jsx` | Auth pages |
| `src/pages/admin/*` | Admin center (overview, insights, inbox, users, promos, newsletter, DIY images) |

Routes: `/login`, `/signup`, `/verify-email`, `/account`, `/admin`, `/admin/insights`, `/admin/inbox`, `/admin/users`, `/admin/users/:userId` (activity drill-down), `/admin/promos`, `/admin/billing`, `/admin/newsletter`, `/admin/diy`, `/newsletter/unsubscribe`.

### Admin UI

- Professional ops portal spec: [`docs/admin-portal-design.md`](admin-portal-design.md) — dark sidebar shell, theme tokens, component patterns.
- Phased implementation plan: [`docs/admin-portal-plan.md`](admin-portal-plan.md) — tasks, acceptance criteria, status by phase.
- Implementation skill + copy-paste prompt: [`.cursor/skills/admin-portal/SKILL.md`](../.cursor/skills/admin-portal/SKILL.md).
- Current shell: full-width layout in `AdminLayout.jsx`; styles in `src/styles/admin-portal.css`.
- Insights: [`docs/product-analytics.md`](product-analytics.md) — first-party events, 30-day IP then hash, staff RPCs.
- Main content panel is elevated white; tables use muted headers and highlight **new** inbox rows.
- Contact subjects display human-readable labels (shared with `/contact` and `/feedback`).

## Email verification (OTP)

Sign in and sign up share **one form** (`/login` and `/signup` render the same page). Email + password **creates the account immediately**. The 6-digit code is **verification**, not a gate: parents can use Yarn Trails and verify later from Account.

### Flow

1. Submit email + password on `/login` (or `/signup`) → `continueWithPassword`
2. Existing account → sign in. New email → `auth.signUp()` (Supabase still emails a code)
3. If Confirm email is on and there is no session yet, `POST /api/auth-confirm-email` (password must already be correct) marks the user confirmed so they can start now
4. Session → `/account`. Code entry at `/verify-email` is optional; **Continue without verifying** is available when signed in
5. `RequireAuth` only requires a session — not a verified inbox

`handle_new_user` still creates profile + **7-day Premium trial** on auth user insert.

### Supabase dashboard (required)

Configure in **Authentication** for your project:

1. **Providers → Email**
   - Enable **Confirm email**
   - Use **OTP** (6-digit code) for signup confirmation
2. **URL configuration**
   - **Site URL**: production origin (e.g. `https://yarntrails.com`)
   - **Redirect URLs**: include `http://localhost:5173/**` for local dev
3. **Email templates**
   - **Confirm sign up** uses the Yarn Trails OTP layout in [`supabase/templates/confirm-signup.html`](../supabase/templates/confirm-signup.html).
   - Subject: `Your Yarn Trails verification code`
   - Paste the file into **Authentication → Emails → Confirm sign up**. Keep `{{ .Token }}`. Do **not** include `{{ .ConfirmationURL }}` (Gmail prefetch verifies the account before the parent types the code).
   - Preview with sample digits: [`supabase/templates/confirm-signup.preview.html`](../supabase/templates/confirm-signup.preview.html).
4. **SMTP** (production)
   - Custom sender via Resend: `Yarn Trails <no-reply@yarntrails.com>`, host `smtp.resend.com`, port `465`, user `resend`, password = `RESEND_API_KEY`.

If **Confirm email** is disabled, signup returns a session immediately. If it is enabled, the confirm API still lets a correct password through so verification can wait. Keep OTP templates so parents who want to verify have a code.

## Membership model (early access)

- **Signup** → account on email + password → Basic (`free`) membership + empty primary `baby_profiles` row via `handle_new_user`. Email code is optional verification.
- **Promo codes** → `redeem_promo_code` RPC (`FOUNDING30` seeded)
- **Anonymous** → optional local preview via `localStorage` (`yarntrailsPremium`)
- **Signed-in** → Supabase membership is source of truth

**Dual billing** (see `docs/monetization-strategy.md`):

| Region | Display | Checkout |
|--------|---------|----------|
| India (`IN`) | INR | `api/razorpay-checkout.js` → Razorpay |
| Rest of world (`ROW`) | USD (INR ÷ 100) | `api/checkout.js` → Stripe |

`GET /api/billing-region` uses `x-vercel-ip-country` and optional `profiles.billing_country` (admin override via `admin_set_billing_country` on `/admin/users/:id`). Dev: `VITE_BILLING_REGION` or `?billing_region=IN|ROW` on the billing-region API.

**Vercel env (never `VITE_` for secrets):**

- Stripe ROW: `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `STRIPE_PRICE_PLUS_MONTHLY_USD`, `STRIPE_PRICE_PLUS_ANNUAL_USD`, `STRIPE_PRICE_FIRST_YEAR_BUNDLE_USD`, `STRIPE_PRICE_GIFT_USD` (or unprefixed fallbacks in `STRIPE_PRICE_ENV`)
- Razorpay IN: `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, plan IDs per subscription SKU (`RAZORPAY_PLAN_PLUS_MONTHLY`, `RAZORPAY_PLAN_PLUS_ANNUAL`, etc.)

Webhooks: `api/stripe-webhook.js` (`stripe_events`) and `api/razorpay-webhook.js` (`razorpay_events`); both upsert `memberships` and touch `billing_webhook_health`. Staff console: `/admin/billing` (`admin_billing_overview` RPC).

## RLS summary

- Users read/update own profile; staff read all; admin updates roles
- Users read own membership; staff read all; admin upsert memberships
- Anyone can insert contact; staff read/update inbox
- Promo CRUD admin-only; redeem via RPC
- DIY activity images: public read; admin CRUD + storage write on `diy-images` bucket
- Newsletter: public subscribe/unsubscribe RPCs; staff read subscribers/campaigns; admin CRUD campaigns/templates/subscribers
- Baby tracking (`baby_profiles`, `milestone_checks`, `shopping_checks`, vaccines, `first_moments`): owner only
- Story preview: no public table select; `get_story_by_preview_token` RPC
- Voice invites: `get_voice_invite` / `accept_voice_invite` RPCs (no open table policies)
- Private buckets `first-moments`, `album-photos`, `voice-notes` (path `{user_id}/...`)

## Newsletter delivery

Migration: `supabase/migrations/20250701140000_newsletter.sql`

Edge functions (deploy after `supabase db push`):

| Function | Purpose |
|----------|---------|
| `newsletter-send-test` | Admin sample send to own inbox (JWT required) |
| `newsletter-process-queue` | Batch send scheduled campaigns (cron / service role) |
| `delete-my-account` | JWT: wipe private storage prefixes then delete Auth user |

Supabase secrets (Dashboard → Edge Functions → Secrets):

- `RESEND_API_KEY` — transactional email
- `NEWSLETTER_FROM` — e.g. `hello@yarntrails.com`
- `NEWSLETTER_REPLY_TO` — optional reply-to
- `SITE_URL` — e.g. `https://yarntrails.com`
- `NEWSLETTER_CRON_SECRET` — shared secret for scheduled invocations

**Cron (production):** invoke `newsletter-process-queue` every minute with header `x-cron-secret: YOUR_SECRET` (Supabase Cron or external scheduler).

Footer signup calls `subscribe_newsletter` RPC. Unsubscribe: `/newsletter/unsubscribe?token=UUID`.

See [`docs/newsletter-admin.md`](newsletter-admin.md) for admin UI tabs and workflow.

## Admin roles

| Role | Access |
|------|--------|
| `user` | Account, redeem codes |
| `support` | Admin inbox (read/update contact), newsletter read-only |
| `admin` | Full admin: users, promos, memberships, newsletter, DIY activity images (`/admin/diy`) |

## Testing

### Unit tests

Pure logic (no network):

```bash
npm test
```

Covers `src/utils/membership.test.js`, `src/utils/localPremium.test.js`, `src/utils/auth.test.js`.

### Manual continue-with-email test

1. Open `/login` or `/signup` with a new inbox (not seeded test users)
2. Submit email + password → `/account` with trial membership (no code required)
3. Optional: from Account, enter the email code at `/verify-email`
4. Sign out; Continue with the same email + password signs in

Seeded test users are already confirmed (`email_confirm: true` in `scripts/seed-test-users.mjs`).

### Integration tests

Requires migration applied + seeded users:

```bash
# 1. Merge .env.test.example into .env (or export vars)
# 2. Seed test users (needs SUPABASE_SECRET_KEY in .env)
npm run seed:test-users

# 3. Run IT suite
npm run test:it
```

Or run everything: `npm run test:all`

### Test credentials (default)

| Role | Email | Password |
|------|-------|----------|
| User | `nestbean-test-user@mailinator.com` | `NestbeanTestUser1!` |
| Admin | `nestbean-test-admin@mailinator.com` | `NestbeanTestAdmin1!` |

Override via `SUPABASE_TEST_*` env vars. Promo code for manual/IT redeem: **`FOUNDING30`**.

App login uses the same emails once seeded — sign in at `/login` or use Account page after auth.

