# Auth, membership & admin

Nestbean uses Supabase for accounts, early-access membership, contact submissions, and the admin center.

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

Apply locally or to remote:

```bash
supabase link --project-ref YOUR_REF
supabase db push
```

Migration `20250629130000_fix_rls_and_contact_insert.sql` fixes **RLS recursion** on `is_staff()` / `is_admin()` (stack depth errors) and reaffirms **anonymous contact form inserts**.

Migration `20250701150000_contact_submit_rpc.sql` adds `submit_contact_form()` RPC — used by `/contact` so submissions succeed without anon SELECT on `contact_submissions`.

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
| `src/context/AuthContext.jsx` | Session, profile, membership, promo redeem, OTP verify/resend |
| `src/utils/auth.js` | `isEmailVerified`, `isEmailNotConfirmedError` |
| `src/utils/membership.js` | `isPremiumActive`, labels, expiry |
| `src/utils/supabaseClient.js` | Supabase client |
| `src/components/auth/RequireAuth.jsx` | Redirect to login; unverified → verify email |
| `src/components/auth/OtpVerifyForm.jsx` | 6-digit OTP entry + resend |
| `src/components/auth/RequireRole.jsx` | Staff/admin guard |
| `src/pages/Login.jsx`, `SignUp.jsx`, `VerifyEmail.jsx` | Auth pages |
| `src/pages/admin/*` | Admin center (overview, inbox, users, promos, newsletter, DIY images) |

Routes: `/login`, `/signup`, `/verify-email`, `/account`, `/admin`, `/admin/inbox`, `/admin/users`, `/admin/promos`, `/admin/newsletter`, `/admin/diy`, `/newsletter/unsubscribe`.

### Admin UI

- Professional ops portal spec: [`docs/admin-portal-design.md`](admin-portal-design.md) — dark sidebar shell, theme tokens, component patterns.
- Phased implementation plan: [`docs/admin-portal-plan.md`](admin-portal-plan.md) — tasks, acceptance criteria, status by phase.
- Implementation skill + copy-paste prompt: [`.cursor/skills/admin-portal/SKILL.md`](../.cursor/skills/admin-portal/SKILL.md).
- Current shell: full-width layout in `AdminLayout.jsx`; styles migrating to `src/styles/admin-portal.css`.
- Main content panel is elevated white; tables use muted headers and highlight **new** inbox rows.
- Contact subjects display human-readable labels (shared with `/contact` form).

## Email verification (OTP)

Signup uses **email + password** with mandatory **6-digit OTP** before the user receives a session.

### Flow

1. User submits `/signup` → `auth.signUp()` → Supabase sends OTP email
2. If no session (confirm email enabled) → redirect to `/verify-email` with email in route state
3. User enters OTP → `auth.verifyOtp({ type: 'signup' })` → session established → `/account`
4. Login before verify → error → redirect to `/verify-email` with resend option
5. `RequireAuth` redirects unverified users to `/verify-email`

After verification, `handle_new_user` has already created profile + **7-day Premium trial** (trigger runs on auth user insert at signup).

### Supabase dashboard (required)

Configure in **Authentication** for your project:

1. **Providers → Email**
   - Enable **Confirm email**
   - Use **OTP** (6-digit code) for signup confirmation
2. **URL configuration**
   - **Site URL**: production origin (e.g. `https://nestbean.com`)
   - **Redirect URLs**: include `http://localhost:5173/**` for local dev
3. **Email templates**
   - Customize **Confirm signup** copy for Nestbean brand
4. **SMTP** (production)
   - Configure a custom sender; Supabase default mail is fine for dev only

If **Confirm email** is disabled locally, signup may return a session immediately and skip `/verify-email` — enable confirm email in the linked project to test the full flow.

## Membership model (early access)

- **Signup** → email OTP required → then 7-day `trial` via `handle_new_user` trigger
- **Promo codes** → `redeem_promo_code` RPC (`FOUNDING30` seeded)
- **Anonymous** → optional local preview via `localStorage` (`nestmilePremium`)
- **Signed-in** → Supabase membership is source of truth

No Stripe yet — Premium page frames **Early Access Membership**, not a broken paywall.

## RLS summary

- Users read/update own profile; staff read all; admin updates roles
- Users read own membership; staff read all; admin upsert memberships
- Anyone can insert contact; staff read/update inbox
- Promo CRUD admin-only; redeem via RPC
- DIY activity images: public read; admin CRUD + storage write on `diy-images` bucket
- Newsletter: public subscribe/unsubscribe RPCs; staff read subscribers/campaigns; admin CRUD campaigns/templates/subscribers

## Newsletter delivery

Migration: `supabase/migrations/20250701140000_newsletter.sql`

Edge functions (deploy after `supabase db push`):

| Function | Purpose |
|----------|---------|
| `newsletter-send-test` | Admin sample send to own inbox (JWT required) |
| `newsletter-process-queue` | Batch send scheduled campaigns (cron / service role) |

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

### Manual OTP signup test

Requires **Confirm email** + **OTP** enabled in Supabase (see above):

1. Open `/signup` with a real inbox (not seeded test users)
2. Submit email + password → redirect to `/verify-email`
3. Enter the 6-digit code from email → `/account` with trial membership
4. Sign out; try `/login` before verifying a new account → redirect to `/verify-email`

Seeded test users skip OTP (`email_confirm: true` in `scripts/seed-test-users.mjs`).

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

