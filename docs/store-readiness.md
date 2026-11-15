# Store readiness

Yarn Trails will list on the App Store and Google Play later. This website is the product those listings describe. Native binaries, store screenshots, and Sign in with Apple wait for that wrapper. The rules below already apply here.

## Already true

- **Account deletion.** Signed-in parents can delete the account from `/account`. The confirm step is a full-width control, not a buried text link. Server function: `delete-my-account`.
- **Data export.** The same screen offers a download of profile, tracking, and vaccine records.
- **Privacy and medical disclaimer** are in the footer, and `/account` links both. My Care and Vaccination link the disclaimer on the page.
- **Not a medical device.** Copy says educational guidance. Emergencies go to a pediatrician, obstetrician, or local emergency number. Do not claim diagnosis, treatment, or dosage.
- **Not a kids app.** The audience is the parent. Do not add child-directed ads, or collect a child’s account. Age rating for a later listing is parenting, not “made for kids.”
- **Installable PWA.** `public/manifest.webmanifest` is standalone, portrait, with 192 and 512 icons including a maskable icon.

## Before a store submission

- **Sign in with Apple** on iOS if any other social sign-in is offered. Email and password alone do not require it.
- **1024 store icon** — `icon-store-1024.png` in the brand pipeline (`docs/brand-identity.md`).
- **Privacy nutrition / Data safety** must match what the app actually collects: account email, baby name and birth date, photos, voice notes, analytics after consent. No sale of personal data.
- **Account deletion in the listing** must point at the in-app control, not only a support email.
- **Screenshots** show the phone layout, including Today’s one-tap jobs. No desktop-only frames as the primary set.
- **Health claims** in the listing stay inside the medical disclaimer. No “doctor-approved” unless a named reviewer is on `/medical-reviewers`.

## When changing a parent feature

Check the phone at 390px first. A control that sits under the bottom bar, or a health page without the disclaimer, is not ready to list.
