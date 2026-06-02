# Nestmile — Claude / Cursor project guide

Baby milestone tracker and mom care (React + Vite). See [memory.md](memory.md) for parenting-assistant knowledge base.

## Stack

- React 19, Vite 8, Vitest
- Data: `src/data/milestones.js`, `diyActivities.js`, `assistantResponses.js`, `momMilestones.js`, `momCareTips.js`
- State: `localStorage` keys `babyBirthDate`, `babyMilestoneChecks`

## Parenting Assistant

| File | Role |
|------|------|
| `src/utils/assistantMatch.js` | Keyword routing + month context |
| `src/data/assistantResponses.js` | Static guides (30+ topics) |
| `src/data/growthData.js` | WHO weight/height ranges, sleep needs by month |
| `src/data/travelTips.js` | Age-aware travel tips by type |
| `src/pages/Travel.jsx` | Travel nav page |
| `src/components/AssistantPanel.jsx` | UI on Home + Month Detail |
| `src/components/CoralLogo.jsx` | Nestmile brand mark + lockup (header/footer) |
| `src/constants/brand.js` | Brand name, SEO defaults, share copy |

## Mom Care

| File | Role |
|------|------|
| `src/pages/MomCare.jsx` | Mom Care page wrapper |
| `src/components/MomCareTips.jsx` | Tabs: Timeline + 16 topics |
| `src/components/MomMilestonesPanel.jsx` | Postpartum timeline (`/mom-care#timeline`) |
| `src/data/momMilestones.js` | Curated mom milestone periods + items |
| `src/utils/momMilestones.js` | Postpartum week/month, current period helpers |
| `docs/mom-milestones-ui-design.md` | Timeline UI spec |

## Commands

```bash
npm run dev
npm test
npm run verify:data
npm run build
```

## Conventions

- UI label **Watch For** (not "Take Care") for warning cards
- Assistant: educational only; emergencies → call pediatrician / local emergency number
- Mom milestones: educational only; postpartum emergencies → obstetrician / local emergency number
- Extend KB via `.cursor/skills/parenting-assistant/SKILL.md` and `.cursor/rules/claude.mdc`
