# SEO Keywords Skill

Use when expanding guides, page meta, homepage/prerender copy, FAQ, or community descriptions around **baby development, care, food, vaccination, photography, stories, rhymes, lullabies, products, and dos/don'ts**.

## Triggers

- User lists SEO topics or “keywords”
- New `/guides/*` article or month copy
- Vaccination / India schedule messaging
- Community recipes or tips SEO
- Meta title/description updates on product pages

## Before you start

1. Read [`docs/seo-keywords.md`](../../docs/seo-keywords.md) — pillars, URL mapping, YMYL rules.
2. Search phrase inventory: [`docs/seo-keywords-matrix.md`](../../docs/seo-keywords-matrix.md) (generated).
3. Edit seeds only in [`src/seo/keywordSeeds.js`](../../src/seo/keywordSeeds.js).

## Workflow

### 1. Pick a pillar

Match the user request to a pillar id in `keywordSeeds.js` (e.g. `vaccination-india`, `diy-development`, `baby-recipes`).

### 2. Choose canonical URL

**Never** target the same primary keyword on two URLs. Use the mapping table in `docs/seo-keywords.md`:

- Milestones → `/guides/{n}-month-old-milestones` or `/month/{n}`
- Vaccination / India → `/vaccination`
- Mom → `/mom-care`
- Products → `/shopping`
- Recipes/food → `/community/recipes`
- Photoshoot → `/tools/milestone-cards`
- Baby book / stories → `/premium`

### 3. Select phrases

- Open `seo-keywords-matrix.md` and search the pillar heading (`## Baby milestones`, etc.).
- Pick **one head term** (title/H1) + **3–6 long-tail** phrases (H2s or FAQ).
- Include **one misspelling variant** only if it reads naturally in prose (e.g. “recepies” → use correct spelling in title, optional “also searched as” in FAQ).

### 4. Write copy

| Field | Rule |
|-------|------|
| Title | One primary keyword near the front · `Topic \| Yarn Trails` |
| Meta description | One keyword + trust line; ≤ ~155 chars |
| H1 | Matches search intent, not identical to title |
| First paragraph | Plain-language answer (AISO / prerender parity) |
| Internal links | 2–4 links to mapped URLs above |

Do **not** add `<meta name="keywords">`.

### 5. Schema

- Health/milestones/vaccination → `MedicalWebPage` or milestone guides pattern in `structuredData.js`
- Rhymes, lullabies, books, photoshoot ideas → `Article` + `BreadcrumbList`
- FAQ additions → only questions **visible on page** → `FAQPage` on the guide (`guideSeoEnrichment.js`) and/or global `/faq` in `legalContent.js`

### 5b. Links + FAQ (required for pillar guides)

1. **Pillar guides:** `productLinks` + `faqs` in `GUIDE_SEO_EXTRA` (`guideSeoEnrichment.js`).
2. **Month guides (1–12, slug `{n}-month-old-milestones`):** `milestoneGuideSeo.js` via `milestoneSlugSeoExtra` — do not duplicate in `GUIDE_SEO_EXTRA` unless overriding.
3. **Product hubs:** `productPageFaqs.js` + `ProductPageFaq.jsx` on `/vaccination`, `/shopping`; mirror in `prerender-seo.mjs`.
4. **2× competitive copy:** `contentGapGuideExpansions.js` appended in `guides.js`; deepen `milestoneGuides.js` body when month templates change.
5. Merge via `applyGuideSeo` in `guides.js`.
6. UI: `GuideQuickLinks` + `GuideFaqSection` / `ProductPageFaq` + `FAQPage` JSON-LD.
7. Prerender: `scripts/prerender-seo.mjs` mirrors visible FAQ and quick links.
8. Site FAQ: `legalContent.js` with full `SITE_URL` paths for high-volume intents.
9. Footer `FOOTER_SECTIONS` Learn column for pillar guides.

### 6. Regenerate & verify

```bash
npm run generate:seo-keywords   # after seed changes
npm run generate:sitemap        # after new indexable route
npm run audit:seo               # before merge
```

## Combinator maintenance

To add a new theme:

1. Add a `KEYWORD_PILLARS` entry in `keywordSeeds.js` (`roots`, `intents`, `ages`, `geos`, optional `misspellings`).
2. Run `npm run generate:seo-keywords`.
3. Document URL mapping + gap in `docs/seo-keywords.md`.
4. Implement content or meta on the canonical route.

## India vaccination specifics

Always pair:

- `vaccination tracker india`
- `baby vaccination india`
- `iap schedule` / `uip schedule`

…with copy that states schedules are **references**, parents confirm with clinician, and the **in-app tracker** supports India IAP/UIP in `/vaccination`.

## Dos and don'ts

- Milestone **dos and don'ts** → link month “Watch For” cards + `/faq` + disclaimer.
- Separate clusters: sleep, feeding, bath, travel — one H2 each; avoid one vague listicle.

## Anti-patterns

| Don't | Do |
|-------|-----|
| Stuff 20 keywords in one paragraph | One head + natural long-tails in structure |
| Create thin pages per keyword variant | One strong page + age sections |
| Duplicate guide + month meta for same query | Canonical guide; month links to it |
| Medical certainty on vaccines/food | Educational + sources + disclaimer |

## File map

| File | Role |
|------|------|
| `src/seo/keywordSeeds.js` | Pillars, templates, modifiers |
| `docs/seo-keywords-matrix.md` | Generated phrase list |
| `docs/seo-keywords.md` | Strategy + URL map |
| `src/utils/pageMeta.js` | Per-route meta |
| `src/data/guides*.js` | Guide titles/descriptions |
| `src/seo/routes.js` | Sitemap titles/descriptions |
| `scripts/generate-seo-keyword-matrix.mjs` | Generator |
| `src/data/guideSeoEnrichment.js` | Pillar guide FAQs + product links |
| `src/data/milestoneGuideSeo.js` | Month 1–12 milestone guide FAQs + links |
| `src/data/productPageFaqs.js` | Vaccination + shopping FAQs |
| `src/data/contentGapGuideExpansions.js` | Extra body sections (head-term depth) |
| `src/components/ProductPageFaq.jsx` | Product page FAQ + FAQPage JSON-LD |
| `src/components/GuideQuickLinks.jsx` | Internal link row on guides |
| `src/components/GuideFaqSection.jsx` | Visible FAQ accordion |

## Cross-skills

- Meta/OG/JSON-LD assets: [brand-assets/SKILL.md](../brand-assets/SKILL.md)
- Editorial layout for new guides: [premium-ui/SKILL.md](../premium-ui/SKILL.md)