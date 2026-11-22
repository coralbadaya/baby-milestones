# SEO keyword strategy — Yarn Trails

Yarn Trails does **not** use `<meta name="keywords">`. Keywords inform **titles, H1/H2, first paragraph, FAQ questions, guide slugs, prerender copy, and internal links** — aligned with [`navigation-seo.md`](./navigation-seo.md) and `usePageMeta`.

| Artifact | Role |
|----------|------|
| **This doc** | Pillars, URL mapping, copy patterns, YMYL rules |
| [`seo-page-one.md`](./seo-page-one.md) | **#1 program** — ambition, one URL per head term, GSC, scoreboard |
| [`seo-keywords-matrix.md`](./seo-keywords-matrix.md) | **~14.8k** generated phrase rows (`npm run generate:seo-keywords`) |
| [`src/seo/keywordSeeds.js`](../src/seo/keywordSeeds.js) | Source of truth for pillars, ages, intents, templates |
| [`.cursor/skills/seo-keywords/SKILL.md`](../.cursor/skills/seo-keywords/SKILL.md) | Agent workflow when writing SEO copy or new guides |

---

## Fifteen priority pillars (your seeds)

Normalized spelling; misspellings are included in the matrix for **natural** mention in copy (never stuffed).

| # | Pillar | Primary roots | Yarn Trails surface |
|---|--------|---------------|---------------------|
| 1 | Baby photoshoot ideas | baby photoshoot, monthly baby photos | `/tools/milestone-cards`, Plus baby book, DIY month pages |
| 2 | Baby photography | newborn photography, milestone photos | Life firsts (`/baby#moments`), guides hub |
| 3 | Baby stories | baby story, baby book story | Plus `/baby/book`, `/premium` |
| 4 | Rhymes | nursery rhymes, rhymes for babies | Month DIY + mom care tips; future guide |
| 5 | Lullabies | lullabies for babies, sleep songs | Mom care sleep tabs; future guide |
| 6 | Recommended books | best baby books, board books | Community tips; future guide |
| 7 | Baby milestones | developmental milestones, milestone tracker | `/baby`, `/month/:n`, `/guides/:n-month-old-milestones`, `/progress` |
| 8 | Baby foods | first foods, starting solids, weaning | Community `/community/recipes` |
| 9 | Recipes for babies | baby food recipes, finger food | Community recipes data + feed |
| 10 | DIY development activities | sensory activities, tummy time | `diyActivities.js` on each month page |
| 11 | Baby photography | baby portrait, milestone photos | Life firsts, month DIY; distinct from photoshoot *ideas* in matrix |
| 12 | Mother care | postpartum care, mom self care | `/mom-care`, guide `postpartum-recovery-week-by-week` |
| 13 | Baby care | newborn care, daily routine | Month pages, Essentials, FAQ |
| 14 | Vaccination / India | baby vaccination, IAP/UIP tracker | `/vaccination`, guide `first-year-vaccination-schedule` |
| 15 | Recommended products | baby essentials, newborn must haves | `/shopping`, `/essentials` |
| 16 | Dos and don'ts | baby safety, newborn rules | FAQ, month “Watch For”, medical disclaimer |

**Geo spotlight:** `vaccination tracker india`, `baby vaccination india`, `iap schedule`, `uip schedule` → always land on **`/vaccination`** with India schedule selected in UI copy.

---

## Combinatorics (how “all permutations” are built)

Each pillar in `keywordSeeds.js` expands across:

| Dimension | Examples |
|-----------|----------|
| **Roots** | 3–6 synonyms per pillar (e.g. photoshoot / photo shoot / picture ideas) |
| **Ages** | `newborn` … `3 year old`, bands `0-3 months`, `6-12 months`, `toddler` |
| **Intents** | ideas, tracker, schedule, checklist, how to, best, recommended, diy, at home, dos and donts, … |
| **Geo** | india, indian, iap, uip, cdc, us, uk, nhs (pillars flagged `geos: true`) |
| **Audience** | for babies, for newborns, for infants, for toddlers, for moms |
| **Templates** | `{age} {root} {intent}`, `{root} {geo} tracker`, `baby {rootShort}`, … |

Regenerate after changing seeds:

```bash
npm run generate:seo-keywords
```

Full phrase list: [`seo-keywords-matrix.md`](./seo-keywords-matrix.md).

---

## URL mapping — where keywords should resolve

Use **one canonical URL** per intent cluster; link siblings in-body.

| Keyword cluster | Canonical URL | Secondary links |
|-----------------|---------------|-----------------|
| `{n} month old milestones` | `/guides/{n}-month-old-milestones` | `/month/{n}`, `/baby`, `/progress` |
| `baby milestones` / `milestone tracker` | `/baby` | `/progress`, month guides |
| `baby monthly milestones` | `/guides/baby-monthly-milestones` | `/baby`, `/month/:n`, month guides |
| `vaccination tracker` / `baby vaccination` | `/vaccination` | `/guides/first-year-vaccination-schedule` |
| `vaccination tracker india` / `iap schedule` | `/guides/vaccination-tracker-india` | `/vaccination`, first-year guide |
| `diy activities` / `sensory play` / `tummy time` | `/guides/diy-baby-activities` | `/month/:n`, `/baby` |
| `baby care` / `newborn care` | `/guides/baby-care-first-year` | dos and don’ts, `/mom-care` |
| `newborn must haves` / `baby essentials` | `/guides/newborn-essentials-checklist` | `/shopping`, `/essentials` |
| `postpartum` / `mother care` | `/mom-care` | `/guides/postpartum-recovery-week-by-week` |
| `travel with baby` | `/travel` | Essentials hub |
| `baby recipes` / `baby food` | `/community/recipes` | Month weaning tips where relevant |
| `baby photoshoot` / `milestone cards` | `/tools/milestone-cards` | `/premium` (book) |
| `baby story` / `baby book` | `/premium` | `/baby/book` (gated) |
| `nursery rhymes` / `lullabies` | `/guides/nursery-rhymes-for-babies`, `/guides/lullabies-for-babies` | Month tips, mom-care sleep |
| `dos and donts` | `/guides/newborn-dos-and-donts` | `/faq`, month Watch For, `/medical-disclaimer` |
| `starting solids` / `baby food guide` | `/guides/starting-solids-guide` | `/guides/indian-baby-food-recipes`, `/community/recipes` |
| `baby photoshoot at home` | `/guides/baby-photoshoot-ideas-at-home` | `/tools/milestone-cards` |
| `best books for babies` | `/guides/best-books-for-babies-by-age` | — |
| Brand navigational | `yarn trails`, `yarntrails` | `/`, `/about` |

Month routes `/month/1` … `/month/36` are indexable via sitemap; milestone **guides** exist for months **1–12** today (`milestoneGuides.js`).

---

## Title and description patterns

Follow `formatPageTitle` → `Topic | Yarn Trails`.

| Pattern | Example title |
|---------|----------------|
| Age + milestone | `3-Month-Old Milestones — What to Expect \| Yarn Trails` |
| Tracker product | `Baby Vaccination Tracker — India, CDC & Custom Schedules \| Yarn Trails` |
| Tool | `Free Printable Milestone Cards for Baby Photos \| Yarn Trails` |
| Hub | `Baby Recipes & First Foods — Community \| Yarn Trails` |
| Mom | `Postpartum Care & Mom Self-Care Timeline \| Yarn Trails` |

**Description:** one calm sentence with **one primary keyword** + trust (“educational, not medical advice” on YMYL).

---

## Content gap guides (shipped)

Canonical long-form URLs in `src/data/contentGapGuides.js`:

| Slug | Target queries |
|------|----------------|
| `nursery-rhymes-for-babies` | rhymes, action rhymes, hindi/english |
| `lullabies-for-babies` | lullaby lyrics, sleep songs |
| `best-books-for-babies-by-age` | recommended books, board books |
| `baby-photoshoot-ideas-at-home` | photoshoot, photography, poses |
| `starting-solids-guide` | baby foods, 6 months, weaning |
| `indian-baby-food-recipes` | recipes, indian, vegetarian |
| `newborn-dos-and-donts` | dos and donts, safety |
| `baby-monthly-milestones` | baby monthly milestones, month by month milestones |
| `vaccination-tracker-india` | vaccination tracker india, IAP, UIP |
| `diy-baby-activities` | DIY baby activities, tummy time, sensory play |
| `baby-care-first-year` | baby care, newborn care, daily routine |
| `newborn-essentials-checklist` | newborn must haves, baby essentials |

When adding another guide: extend `contentGapGuides.js` or `guidesBase.js`, run `npm run generate:sitemap` + `npm run audit:seo`, update this table.

---

## YMYL / E-E-A-T rules for these keywords

- Vaccination, baby food, and milestones copy is **educational** — link [`/medical-disclaimer`](./navigation-seo.md), cite [`/sources`](./navigation-seo.md).
- Do not promise cures, exact vaccine dates without “confirm with your pediatrician”, or unsafe feeding advice.
- India schedule copy names **IAP/UIP** as references; app supports India + CDC + custom.
- Rhymes/lullabies/books: no medical claims; optional `Article` schema, not `MedicalWebPage`.

---

## Operational checklist

1. Edit pillars or templates in `src/seo/keywordSeeds.js`.
2. `npm run generate:seo-keywords` → refresh matrix.
3. Map new phrases to a **single URL** (table above).
4. Update on-page copy + `usePageMeta` / guide `title` + `description`.
5. `npm run audit:seo` before deploy.
6. In Search Console: inspect URL after publish; request indexing for new guides only.

---

## Best-in-class SEO (implemented on Yarn Trails)

| Layer | Implementation |
|-------|----------------|
| **Crawl** | `sitemap.xml`, `robots.txt`, prerendered `dist/*/index.html`, apex canonical |
| **On-page** | Unique title/description, H1, intro, H2 body; parent breadcrumbs on guides (`Home › Guides`); full `BreadcrumbList` in JSON-LD |
| **FAQ** | `guideSeoEnrichment.js` + `milestoneGuideSeo.js` (months 1–12) + `productPageFaqs.js` (`/vaccination`, `/shopping`) + `/faq` |
| **JSON-LD** | `Article` / `MedicalWebPage`, `BreadcrumbList`, `FAQPage` (guide + global FAQ) |
| **Internal links** | `GuideQuickLinks` product row, `relatedSlugs`, footer Learn column, tagged `/guides` hub (`?tag=`) |
| **Keywords** | `keywordSeeds.js` + matrix; no `<meta keywords>` |
| **Trust** | Medical disclaimer on guides, Sources, pending reviewer attribution in schema |

### After deploy (Search Console & Bing)

1. Submit sitemap if not already: `https://yarntrails.com/sitemap.xml`.
2. **URL inspection** → Request indexing for each new guide slug (7 gap guides).
3. Add **Bing Webmaster Tools** with the same sitemap; optionally import from GSC.
4. Link **GA4** to GSC when `VITE_GA_MEASUREMENT_ID` is live (consent-gated).
5. Monitor **Coverage** and **Enhancements → FAQ** for rich-result eligibility (FAQ must stay visible on page).
6. Refresh prerender: `npm run build` so crawler HTML matches React (FAQs + quick links).

### When adding a guide

1. `contentGapGuides.js` or `guidesBase.js` + `GUIDE_SEO_EXTRA` (links + faqs).
2. `npm run generate:sitemap` · `npm run audit:seo` · `npm run build`.
3. Footer or FAQ entry if the guide is a pillar landing page.
4. One row in the URL map table in this doc.

---

## Related docs

- [`navigation-seo.md`](./navigation-seo.md) — sitemap, prerender, GSC
- [`brand-identity.md`](./brand-identity.md) — `BRAND_ALTERNATE_NAMES`, domain
- [`community-feature-plan.md`](./community-feature-plan.md) — recipes UGC SEO

*Last updated: November 2026*