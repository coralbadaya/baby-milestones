# Page turn QA playground

Engineering QA surface for the shared page-turn engine (`src/book/engine`). Not linked from production navigation.

## Routes

| Surface | URL / command |
|---------|----------------|
| Web (Vite dev only) | http://localhost:5173/dev/page-turn-playground |
| Mobile (Expo dev) | Open `/dev/page-turn-playground` in the Yarn Trails app |
| Automated logic | `npm test -- src/components/dev/page-turn/playground.qa.test.js` |

Production builds omit the web route (`import.meta.env.DEV` gate in `App.jsx`).

## What it covers

- **Open book** — `createTurnController`, `getSheetPose`, `applyWebPose`, gestures (`armDirection`, `releaseAction`, `dragSample`, RTL `pointerAngle`).
- **Reel** — `getReelPose` with forward/backward signs; toggle Reel mode on the control panel.
- **Mobile** — stop table + dedicated Expo screen with real `OpenBook` (native driver). Browser cannot validate native FPS.
- **Standalone** — `buildAlbumHtml` iframe + **Download QA HTML** (offline-capable when copied beside `public/images` assets).
- **Reporting** — per-scenario rows; **Run all logic tests**; JSON/CSV export.

Scenario list: `src/components/dev/page-turn/scenarioCatalog.js`.

## Scenario types

| Kind | Automation |
|------|------------|
| `logic` | Vitest + in-browser **Run all logic tests** |
| `stage` | Runs on the live stage; some assert (boundaries, spam); others **manual** visual |
| `manual` | Documented only — screenshots, audio, device FPS |

A scenario **passes** only when its expected final state or assertion holds. Visual checks are marked **manual**.

## Manual screenshot procedure

Use a fixed viewport (390×844 or the playground default stage width).

1. Reset book → index 0.
2. For each ms in `0, 450, 950, 1450, 1900`, tap the ms chip (scrubs progress without committing index).
3. Capture the stage and the pose JSON readout.
4. Repeat for forward turn mid-animation (Next, then scrub) if checking face preparation.
5. Store captures with filenames: `sheet-{ms}-{index}.png`.

**Limitation:** No automated screenshot harness in CI yet.

## Mobile device testing

```bash
cd mobile
npm start
# iOS simulator or Android emulator → navigate to /dev/page-turn-playground
```

Verify: 1900 ms turn, cubic in-out, no React re-render per frame, forward/back boundaries.

**Limitation:** Physical iOS/Android devices were not run in the environment that built this doc unless noted in the session report.

## Standalone offline check

1. Download QA HTML from the playground.
2. Copy referenced images from `public/images/heroes` and `public/images/diy` next to the file (same relative paths as in the album JSON).
3. Disable network → open file → turn pages, drag, arrow keys, reduced motion.

Parity: `foldPlayerScript` is tested in `src/book/engine/engine.test.js` and `playground.qa.test.js` (`standalone-parity` scenario).

## Performance panel

Counts animation updates during turns, completed/cancelled turns, gaps >24 ms between updates, and a rough FPS estimate. Not comparable to native device metrics.

## Known gaps

- Strip curl (`runCurl`) — not wired; unchanged.
- Reel video export (18-frame wipe) — not exercised here.
- Haptics/rustle — only in standalone iframe; not auto-fired on the playground page.
- `baby-book-flap` CSS keyframes — unused in React; album script is the live web turn.

## Bugs

Log failures in the results table during QA sessions. File engine defects separately from playground UI issues.