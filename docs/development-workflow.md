# Development Workflow

This guide explains how to work on Nestmile as a first-time website developer. Keep it open while you build features.

**New to the project?** Read [`doctrine-summary.md`](doctrine-summary.md) first (one page) — mission, pillars, and non‑negotiables.

## Big Picture

This project is a React website built with Vite.

- **Your laptop** is where you write and test code.
- **Git** tracks every meaningful change you make.
- **GitHub** stores the project online and lets you share changes.
- **Vercel** builds and hosts the website from GitHub.
- **Supabase** is the backend platform for database, auth, storage, and realtime features.

The usual flow is:

```text
edit code locally -> test locally -> commit with Git -> push to GitHub -> Vercel deploys
```

If the change uses Supabase, the flow also includes database or auth setup:

```text
plan data model -> change Supabase safely -> test locally -> commit code and migrations -> deploy
```

## Project Basics

The app uses:

- React for UI
- Vite for local development and production builds
- Vitest for tests
- ESLint for code quality
- Supabase JavaScript client for future backend features
- Vercel for hosting

Important commands:

```bash
npm install
npm run dev
npm test
npm run verify:data
npm run build
```

Use `npm run dev` while developing. It starts the local website and prints a URL like `http://localhost:5173`.

## Daily Workflow

Start each work session by updating your local copy:

```bash
git status
git pull
npm install
npm run dev
```

Then make one small change at a time. After editing, check the app in the browser.

Before you finish:

```bash
npm test
npm run verify:data
npm run build
git status
```

If everything looks good, commit your work:

```bash
git add .
git commit -m "Describe the change clearly"
git push
```

## Git, In Plain English

Git is your project history.

- A **repository** is the project folder tracked by Git.
- A **commit** is a saved checkpoint.
- A **branch** is a separate line of work.
- `git status` shows what changed.
- `git diff` shows the exact code changes.
- `git add` chooses files for the next commit.
- `git commit` saves a checkpoint.
- `git push` uploads your commits to GitHub.
- `git pull` downloads new commits from GitHub.

Use small commits. A good commit usually answers: "What changed and why?"

Good examples:

```bash
git commit -m "Add vaccination reminder empty state"
git commit -m "Fix month detail card spacing on mobile"
git commit -m "Update mom care recovery tips"
```

Avoid vague commits:

```bash
git commit -m "changes"
git commit -m "fix"
git commit -m "update"
```

## Branch Workflow

For small solo changes, you can work on the current branch if that is how the repo is set up.

For safer work, create a branch:

```bash
git checkout -b feature/short-description
```

Examples:

```bash
git checkout -b feature/community-recipes
git checkout -b fix/mobile-header-spacing
```

When done:

```bash
git push -u origin feature/short-description
```

Then open a pull request on GitHub if you want the change reviewed before merging.

## Vercel Workflow

Vercel hosts the live website.

Typical setup:

- GitHub repo is connected to Vercel.
- Every pushed branch can get a preview deployment.
- The main production branch deploys to the live website.

Common Vercel terms:

- **Production deployment**: the live site users see.
- **Preview deployment**: a temporary URL for a branch or pull request.
- **Build command**: usually `npm run build`.
- **Output directory**: for Vite, usually `dist`.
- **Environment variables**: secrets or config values Vercel injects during build/runtime.

Before trusting a deployment, check:

```bash
npm run build
```

If the local build fails, Vercel will usually fail too.

## Supabase Workflow

Supabase is the backend. It can provide:

- Database tables
- User login and authentication
- File storage
- Realtime subscriptions
- Edge functions

This repo includes Supabase auth, membership, contact, and admin — see [`docs/auth-membership-admin.md`](auth-membership-admin.md) and migration `supabase/migrations/20250629120000_membership_and_contact.sql`.

**Signup flow:** email + password → 6-digit OTP at `/verify-email` → session + 7-day Premium trial. Enable **Confirm email** and **OTP** in the Supabase dashboard before testing (documented in auth-membership-admin.md). Seeded test users bypass OTP for integration tests.

### Login details (local dev)

Use these **after** seeding test users into your Supabase project:

```bash
npm run seed:test-users
```

Requires `VITE_SUPABASE_URL` and `SUPABASE_SECRET_KEY` in `.env` (see [auth-membership-admin.md](auth-membership-admin.md)).

| Role | Email | Password | Where to sign in |
|------|-------|----------|------------------|
| **User** (Premium trial) | `nestbean-test-user@mailinator.com` | `NestbeanTestUser1!` | [http://localhost:5173/login](http://localhost:5173/login) |
| **Admin** (staff console) | `nestbean-test-admin@mailinator.com` | `NestbeanTestAdmin1!` | Same login → then [http://localhost:5173/admin](http://localhost:5173/admin) |

**Notes:**

- Seeded users are **pre-verified** — no OTP step at login.
- Override emails/passwords with `SUPABASE_TEST_USER_EMAIL`, `SUPABASE_TEST_USER_PASSWORD`, `SUPABASE_TEST_ADMIN_EMAIL`, and `SUPABASE_TEST_ADMIN_PASSWORD` in `.env`.
- Manual promo-code testing: **`FOUNDING30`** (see auth doc).
- For a fresh signup + OTP test, use a real inbox at `/signup` — not the seeded accounts above.

Full auth, membership, and admin details: [`docs/auth-membership-admin.md`](auth-membership-admin.md).

### Safe Supabase Rules

Never put secret keys in frontend code.

Frontend code may use:

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_GA_MEASUREMENT_ID
```

`VITE_GA_MEASUREMENT_ID` is optional. When set (e.g. `G-XXXXXXXXXX` from [Google Analytics](https://analytics.google.com/)), the app loads GA4 and sends page views on route changes. Admin routes (`/admin/*`) are excluded. Add the same variable in Vercel for production.

Frontend code must never use:

```text
SUPABASE_SERVICE_ROLE_KEY
secret keys
database passwords
private API keys
```

The service role key bypasses security rules. Only use it in trusted server-side code, never in React browser code.

### Environment Variables

Local environment values usually go in `.env.local`:

```bash
VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
VITE_SUPABASE_ANON_KEY="your-public-anon-or-publishable-key"
VITE_GA_MEASUREMENT_ID="G-XXXXXXXXXX"
```

Do not commit `.env.local`.

Add the same values in Vercel:

```text
Vercel Project -> Settings -> Environment Variables
```

Use separate Supabase projects for production and development when the app starts storing real user data.

### Database Changes

For database work, prefer migrations instead of random dashboard-only changes. A migration is a tracked SQL file that explains how the database changed.

Good database workflow:

```text
design table -> create migration -> apply locally or to dev -> test -> commit migration -> deploy
```

Important Supabase security rule:

- Enable Row Level Security on tables exposed to the frontend.
- Write policies that limit users to only the rows they should access.
- Do not use `TO authenticated` by itself as authorization. Also check ownership, such as `user_id = auth.uid()`.

Before making real Supabase schema changes, check the current Supabase docs or CLI help because commands change over time:

```bash
supabase --help
supabase db --help
supabase migration --help
```

## Design Workflow

Before changing UI, read:

- `docs/design-system-2026.md`
- `docs/ui-design.md`
- the feature-specific design doc, if one exists

Use shared components from `src/components/` when possible. For dropdowns, use `src/components/Select.jsx`.

After a UI change, update the relevant design doc if the design changed.

## Testing Checklist

For most changes:

```bash
npm test
npm run build
```

For data changes:

```bash
npm run verify:data
npm test
```

For UI changes, also check:

- desktop layout
- mobile layout
- keyboard navigation where relevant
- empty states
- loading states
- error states

For Supabase auth changes, also check:

- signup → OTP email → verify → account access
- login before email verified → redirect to `/verify-email`
- resend OTP cooldown and error states
- logged-out behavior
- logged-in behavior
- permissions for another user
- Row Level Security policies
- Vercel environment variables

## Common File Areas

- `src/pages/` - route-level pages
- `src/components/` - reusable UI components
- `src/data/` - milestone, care, shopping, assistant, and static app data
- `src/utils/` - helper functions
- `docs/` - project and design documentation
- `scripts/` - verification or maintenance scripts

## What To Do When Stuck

Use this order:

1. Read the error message carefully.
2. Run `git status` to see what changed.
3. Check the browser console.
4. Check the terminal running `npm run dev`.
5. Search for similar code in the repo.
6. Make the smallest possible fix.
7. Run tests or build again.

If you ask an AI assistant for help, include:

- what you were trying to do
- what command failed
- the exact error message
- what file you changed
- what you expected to happen

## Safe Beginner Rules

- Change one thing at a time.
- Commit when the app works.
- Pull before starting new work.
- Never commit secrets.
- Run `npm run build` before deploying important changes.
- Read the design docs before UI work.
- Use migrations for database changes.
- Enable RLS for Supabase tables used by the frontend.
- Ask for help before deleting files, resetting Git history, or changing production data.

