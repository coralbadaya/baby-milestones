# Yarn Trails verification results

Last run: automated checks via `npm run verify:data`, `npm test`, and `npm run build`.

## Automated

| Check | Command | Status |
|-------|---------|--------|
| 36 months, unique ids, DIY coverage | `npm run verify:data` | Pass |
| Month 4/5 timeline content spot-checks | `npm run verify:data` | Pass |
| Assistant keyword routing | `npm test` | Pass (13 tests incl. feeding, teething, development) |
| Milestone persistence round-trip | `npm test` | Pass |
| Production build | `npm run build` | Pass |

## Manual browser (recommended)

1. `npm run dev` → Home → Month 4: confirm Explorer title, checklist, activities, Watch For, pros/cons.
2. Navigate Next/Previous, arrow keys; confirm Month 5 content differs.
3. Check 3 milestones in Month 4 → hard reload → confirm 3/8 bar and checks remain.
4. Dashboard: Month 4 mini-bar ~37.5%.
5. Assistant: `4 month not taking feed`, `flying with 4 month old`, `road trip 9 month`, `travel tips`.
6. Travel page: nav → type tabs → Month N banner; gear footer → Shopping.
6. DevTools device widths: 360px, 480px, 768px, 1280px — no horizontal scroll, FAB clears mobile nav.

## Terminology

| Spec | UI label |
|------|----------|
| Take Care warnings | **Watch For** |
| Core activities | **Activities to Try** |
