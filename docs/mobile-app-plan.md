# Yarn Trails for iPhone and Android

**Status:** Shell started in [`mobile/`](../mobile/)  
**Last updated:** November 2026

The website stays the editorial home. The phone app is how a parent opens Yarn Trails with one thumb, signs in with the same email code, and pays for Plus through the store. Desktop can share this shell later. It is not this release.

Read with [`store-readiness.md`](store-readiness.md), [`doctrine-summary.md`](doctrine-summary.md), and [`monetization-strategy.md`](monetization-strategy.md).

---

## Why a native app now

Parents already meet Yarn Trails in a browser. Three things the browser cannot do well enough are the reason to ship iOS and Android:

1. **Charging for Plus.** Digital membership on a phone must be billed by Apple and Google. A wallet, a coin pack, or a “recharge” balance fights both the stores and the brand. Plus is a membership. The App Store and Play Billing renew it. The website can keep its own checkout for people who subscribe in a browser. One account, two ways to pay, no double charge for the same period.
2. **OTP.** The website creates the account on email + password; the code is optional verification. The app uses the same Supabase account, so a parent who joined on the web is the same parent on the phone. Sign in with Apple is added before any other social button, because Apple requires it. Phone-number OTP can wait until a store review or a country actually needs it.
3. **A daily open.** Push, a home-screen icon, and a lock on the birth date are what make Tomorrow’s month feel like a place to return. The website remains for reading. The app is for the minute at 3am.

This is not a second product and not a freelance marketplace. We charge for Yarn Trails Plus. We do not charge parents to message each other, and we do not add a services board.

---

## What the app is

The same journey as the website, in the same order:

**My Baby → My Care → Book → Community → Guides**

Book is the paid center circle (twilight blue of the book page). Today is the logo, not a tab. Essentials, the Vaccination tracker, and Progress stay one tap from Today. Essentials opens Shopping and Travel. Community opens Mom Feed, Baby Recipes, and Parenting Tips. Those names match the website.

The phone uses the same Wool & Trail colors as the site. Pages are wool mist, actions and the selected tab are trail moss, and the type is ink. Buttons, rows, and the selected tab are square except the Book control, which is a raised twilight circle. Other selected tabs carry a trail line on the top edge. Yarn gold stays a hairline on the book, not a text color.

| Surface | On the phone | Free or Plus |
|---------|----------------|--------------|
| Today | The month you are in, and the six jobs | Free |
| My Baby | Milestones for that month | Free |
| My Care | Postpartum care, with the medical note | Free |
| Vaccination | Schedule and log, with the medical note | Free |
| Essentials | Shopping and travel | Free |
| Guides | Read by month | Free |
| Community | Recipes and tips | Free to read |
| Baby book | **`/book/home`** — same five tabs as the web baby book: **Home · Stories · Ideas · 3D Book · Family** (twilight shell inside the stack). **3D Book** keeps local spreads on the device; Stories/Ideas/Family explain web/Plus flows until account sync ships | Plus, once the store is connected. The 3D tab already keeps pages locally |
| Plus | The membership list: HD photos, stories, the full book, voice, export, print, two viewers | The offer. Nothing is charged from the phone yet |

Core tracking and emergency guidance stay free. Plus is an invitation, not a lock on the milestone list.

Copy stays educational. Emergencies go to a pediatrician, an obstetrician, or the local emergency number. The app is for the parent, not the child. No kids-category listing, no child account, no ads.

---

## Daily use, without a game

Yarn Trails does not use streaks, points, badges, or “you missed a day.” The reason to open the app is that the month changed, or something is due, or there is one calm thing to do.

**The daily card on Today**

- No birth date yet: one line asking for it. That date is the product.
- With a birth date: the month number, counted the same way as the website (the birthday is the boundary, not the first of the calendar month). Under it, two short lines: one for the baby, one for the mother. Those lines come from the milestone and mom-care data already in the repo. They are not generated fresh each morning.

**The only notification worth sending**

At most one a day, and only after the parent agrees.

| Moment | What it says |
|--------|----------------|
| The day before the birthday each month | “Month 5 begins tomorrow.” |
| A vaccine window opening this week | “A vaccination window opens this week.” The app does not name a dose. |
| Nothing due | Silence |

No evening nag. No “come back” after three quiet days. The parent who wants silence gets silence.

**Marketing to people who already know us**

- The newsletter tells existing readers when the app is in the stores, with one link each for Apple and Google.
- The website’s install note points at the stores once the listings exist. Until then it stays a website.
- Store screenshots are the phone Today screen: the month, then the six jobs. No desktop frames as the hero set. Listing words stay inside [`store-readiness.md`](store-readiness.md).
- Search terms are the ones the site already earns: baby milestones, postpartum, vaccination schedule, first year. The brand name is Yarn Trails.
- Instagram and the other profiles in `src/constants/brand.js` carry the same Today image. They do not carry a different tone.

Retention is measured later in Staff Insights: share of accounts that open Today on two different days in a week, and share that set a birth date. Not a streak count.

---

## Sign-in and payment

**Account.** Email, then the code. Same Supabase project as yarntrails.com. The app stores the session on the device. Account deletion and data export, already required for the stores, stay available from the account screen before submission. See [`store-readiness.md`](store-readiness.md).

**Plus on a phone.** StoreKit on iOS, Play Billing on Android. The app asks the store, then marks the same membership the website already understands. A parent who paid on the web is Plus on the phone, and the reverse, once the store receipt is tied to the account. Restoring a purchase is a visible control, not a support email.

**What we will not bill inside the app.** A prepaid wallet, a recharge pack, tips, or a freelance booking. If a parent should pay outside the stores (a printed book, for example), that purchase stays on the website. Apple’s rules treat shipping physical goods differently from digital Plus. The printed book does not go through the Plus subscription.

---

## Desktop, later

The app is Expo, so iOS and Android are one project. Screens, the month calculation, and the copy live in plain modules under `mobile/`. A desktop shell can mount those screens later. We do not add a Mac or Windows target until the phone app is the one parents open. The website is the desktop product until then.

---

## Build order

| Phase | What ships | Done when |
|-------|------------|-----------|
| 0. Shell | `mobile/` boots. Today, five tabs, birth date on the device, sign-in and Plus screens | This phase |
| 1. Account | Email code against the live Supabase project. One account with the website | A parent can sign in on the phone with the code from their email |
| 2. Today for real | Birth date drives the month. Milestone and care lines for that month, offline | Today names the month after a relaunch |
| 3. The free tools | My Baby checklists, My Care, vaccination log, essentials | The same records the website would show for that account |
| 4. The daily note | Opt-in push for the month boundary and a vaccine window | A denied permission leaves the app quiet |
| 5. Plus | Store subscription, restore, and the baby book behind it | A sandbox purchase unlocks the book and is the same Plus flag as the web |
| 6. Listing | Icons from the brand pipeline, screenshots, privacy labels, account deletion | [`store-readiness.md`](store-readiness.md) checklist is true inside the app |

Phase 0 does not pretend the code is sent or the card is charged. Those buttons say what they will do, and they wait for phase 1 and phase 5.

---

## Where the code lives

```
mobile/
  app/                 screens and the tab bar
  components/          screen shell, jobs, disclaimer
  constants/           Wool & Trail colors, brand
  content/             Today jobs and the two daily lines
  lib/                 month age, birth date on device
```

Run it from `mobile/` on Node 22 or newer (`npm start`, then the iOS simulator or an Android device). Expo SDK 58. The website’s Node version can stay as it is. The app does not import `src/`, so a phone build cannot pull the website into the bundle.

The birth date key on the device is `babyBirthDate`, the same name the website uses in local storage, so a later sync has one field to match.

The phone uses the Wool & Trail anchors in `mobile/constants/theme.ts`: wool mist pages, trail moss for actions, the selected tab, and the book cover, wool paper for the pages, yarn gold only as a hairline. Controls are square. Gray borders and a brown cover are not part of the theme.
