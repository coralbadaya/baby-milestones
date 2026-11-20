# Page-one program — Yarn Trails

> **Ambition:** be the best early-motherhood product in this market, and the **best honest answer** Google (and AI search) can rank for every job we claim.  
> **Not:** 14,000 thin URLs, fake medical authority, or a promise that a title tweak beats the CDC next week.

Constitution: [`doctrine.md`](doctrine.md) · Keywords: [`seo-keywords.md`](seo-keywords.md) · Infra: [`navigation-seo.md`](navigation-seo.md) · Skill: [`.cursor/skills/seo-keywords/SKILL.md`](../.cursor/skills/seo-keywords/SKILL.md)

---

## What “#1” means here

Google’s first result for **“baby monthly milestones”** is Cleveland Clinic / AAP / CDC. Those are national health bodies. Yarn Trails will **not** pretend to replace them.

We **will** be #1 where a parent product can win:

| We can win (aim page 1, then #1) | We earn trust beside, not instead of |
|----------------------------------|--------------------------------------|
| `vaccination tracker india`, IAP/UIP **tracker** | CDC / AAP **clinical** milestone lists |
| `baby monthly milestones` **tracker** + month-by-month guide | WHO growth standards |
| Indian baby food, rhymes, at-home photoshoot, newborn must-haves | Hospital discharge packs |
| Yarn Trails vs Qeepsake / baby book apps | Generic “what is a milestone?” |

**Rule:** one **head term** → one **canonical URL** → the best page a tired parent can read at 3am. The ~14.8k matrix phrases are **variants** of those heads, not 14.8k pages.

YMYL still applies: educational copy, sources, pediatrician for decisions. Rankings never outrank safety.

---

## Operating system (every cluster)

Copy the **baby monthly milestones** pattern. Do not invent a new template.

1. **Pick the head term** (one per pillar / intent). Example: `baby monthly milestones`.
2. **One URL.** Never two pages fighting the same query. Map it in [`seo-keywords.md`](seo-keywords.md).
3. **Title + H1** put the phrase near the front. Description ≤ ~155 characters, one keyword + trust line.
4. **First paragraph answers the query.** Same sentence in the UI and in prerender (AISO — no cloaking).
5. **Body:** what it is, how it differs from well-visit lists, month or step list, how to do it in Yarn Trails, when to call a clinician.
6. **FAQ** (visible + `FAQPage` JSON-LD) — 4–6 questions people actually search.
7. **Internal links:** `GuideQuickLinks` to the tracker + 2–4 sibling guides + `/sources`. Footer Learn column for pillar landings.
8. **Ship:** `npm run audit:seo` · `npm run build` (sitemap + prerender) · Search Console **URL inspection → Request indexing**.
9. **Measure:** GSC queries + clicks on that URL. Do not guess rankings from the repo.

Thin hubs (`/vaccination`, `/shopping`, `/baby`) stay product pages. The **article** that deserves the head term lives under `/guides/...` unless the hub is already the best answer (rare).

---

## Head-term scoreboard

Status is **coverage**, not Google rank. Rank only from Search Console after indexation.

| Head term (target) | Canonical URL | Coverage |
|--------------------|---------------|----------|
| baby monthly milestones | `/guides/baby-monthly-milestones` | Guide + FAQ |
| N-month-old milestones (1–12) | `/guides/{n}-month-old-milestones` | Guides + FAQ |
| milestone tracker / My Baby | `/baby` | Product hub |
| vaccination tracker india / IAP / UIP | `/guides/vaccination-tracker-india` | Guide + FAQ → `/vaccination` |
| first-year vaccination schedule | `/guides/first-year-vaccination-schedule` | Guide (global, thinner) |
| postpartum / mom care | `/guides/postpartum-recovery-week-by-week` | Guide → `/mom-care` |
| starting solids / first foods | `/guides/starting-solids-guide` | Guide |
| indian baby food recipes | `/guides/indian-baby-food-recipes` | Guide → `/community/recipes` |
| nursery rhymes | `/guides/nursery-rhymes-for-babies` | Guide |
| lullabies for babies | `/guides/lullabies-for-babies` | Guide |
| best baby books | `/guides/best-books-for-babies-by-age` | Guide |
| baby photoshoot at home | `/guides/baby-photoshoot-ideas-at-home` | Guide → `/tools/milestone-cards` |
| newborn dos and don’ts | `/guides/newborn-dos-and-donts` | Guide |
| DIY / sensory / tummy time activities | `/guides/diy-baby-activities` | Guide → `/month/:n` |
| baby care / newborn care | `/guides/baby-care-first-year` | Guide |
| newborn must haves / baby essentials | `/guides/newborn-essentials-checklist` | Guide → `/shopping` |
| AI baby story / baby book | `/guides/digital-baby-book-guide` | Guide → `/premium` (`/baby/book` is **noindex**) |
| yarn trails / yarntrails | `/` · `/about` | Brand |

**Months 13–36** have tracker pages (`/month/13`–`36`) but not long-form guides yet. Do not mass-generate 24 thin articles. Deepen a year-two and year-three band page when GSC shows demand.

---

## What must happen outside the repo (or rankings stay at zero)

Google had **no useful Yarn Trails result** for “baby monthly milestones” or even the brand + milestones. Content without crawl is invisible.

| # | Action | Owner |
|---|--------|--------|
| 1 | Verify Search Console **domain** property `yarntrails.com` | Human |
| 2 | Submit `https://yarntrails.com/sitemap.xml` | Human |
| 3 | Request indexing on every new pillar URL after deploy | Human |
| 4 | Bing Webmaster + same sitemap | Human |
| 5 | Named clinician for `reviewedBy` (written agreement) before we claim medical review | Human |
| 6 | 5–10 real citations / mentions (pediatric blogs, Reddit only if honest, parent newsletters) | Human |
| 7 | Deploy `main` after each cluster ships (`git push`; no `cleanUrls`) | Human / agent on request |
| 8 | Weekly: GSC queries → pick the next head term that has impressions but a weak page | Human + agent |

Without 1–3, page-one work is unpublished homework.

---

## Cadence (how we become #1 without becoming a mill)

- **One cluster per session** unless asked for a batch. Quality of the 3am page beats ten stubs.
- **Long-tails first** (`7 month old milestones`, `iap schedule tracker`) fund authority for the head term.
- **India first** for health-adjacent product queries. Locale is `en-IN`.
- **Refresh** a ranking URL when GSC shows it, before writing a 17th pillar.
- Never add `<meta name="keywords">`. Never duplicate a head term on two URLs.

---

## Agent checklist (ship a cluster)

1. Read this file + [`seo-keywords.md`](seo-keywords.md).
2. Confirm the canonical URL is unique.
3. Guide in `contentGapGuides.js` (or deepen the existing slug) + `GUIDE_SEO_EXTRA` + optional `contentGapGuideExpansions.js`.
4. Footer and `/faq` if it is a pillar landing.
5. Tests in `src/seo/seo.test.js` slug list.
6. `npm test` (seo) · `npm run audit:seo` before merge.
7. Update the scoreboard row in this file.

---

*Yarn Trails · November 2026 · Trust before growth; then the best page in the market for each job we claim.*
