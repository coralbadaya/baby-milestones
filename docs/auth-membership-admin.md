# Auth, membership & admin

Nestbean uses Supabase for accounts, early-access membership, contact submissions, and the admin center.

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

Apply locally or to remote:

```bash
supabase link --project-ref YOUR_REF
supabase db push
```

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
| `src/pages/admin/*` | Admin center (overview, inbox, users, promos) |

Routes: `/login`, `/signup`, `/verify-email`, `/account`, `/admin`, `/admin/inbox`, `/admin/users`, `/admin/promos`.

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

## Admin roles

| Role | Access |
|------|--------|
| `user` | Account, redeem codes |
| `support` | Admin inbox (read/update contact) |
| `admin` | Full admin: users, promos, memberships |

## Testing

### Unit tests

Pure logic (no network):

```bash
npm test
```

Covers `src/utils/membership.test.js`, `src/utils/localPremium.test.js`.

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

