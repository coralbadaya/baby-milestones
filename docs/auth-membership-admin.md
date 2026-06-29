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
| `src/context/AuthContext.jsx` | Session, profile, membership, promo redeem |
| `src/utils/membership.js` | `isPremiumActive`, labels, expiry |
| `src/utils/supabaseClient.js` | Supabase client |
| `src/components/auth/RequireAuth.jsx` | Redirect to login |
| `src/components/auth/RequireRole.jsx` | Staff/admin guard |
| `src/pages/admin/*` | Admin center (overview, inbox, users, promos) |

Routes: `/login`, `/signup`, `/account`, `/admin`, `/admin/inbox`, `/admin/users`, `/admin/promos`.

## Membership model (early access)

- **Signup** → 7-day `trial` via `handle_new_user` trigger
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

