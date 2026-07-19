# Premium UI Skill

Use when elevating Yarn Trails UI for affluent tier-1 new mothers — quiet luxury, editorial layout, journey sequencing.

## Triggers

- New page or section layout
- Home / hub redesign
- Typography or spacing polish
- Premium paywall surfaces

## Before you start

1. Read `docs/design-system-2026.md` (Quiet Luxury section)
2. Read `docs/information-architecture.md` for nav order
3. Read feature doc if exists (`docs/home-redesign.md`, etc.)

## Quiet luxury rules

| Do | Don't |
|----|-------|
| Fraunces for display headlines | All-caps paragraphs |
| Generous `--space-8` / `--space-12` section gaps | Dense feature stacks |
| One primary action per section | 8 nav items |
| PageHero with editorial photo | Gradient-only heroes (except fallback) |
| Left-align body copy | Center long paragraphs |
| Invitation tone for Premium | Aggressive paywalls on health tracking |

## Typography

- **Display:** `'Fraunces', Georgia, serif` — h1, `.page-hero__title`, `.font-display`
- **Body:** `'Switzer', sans-serif` — paragraphs, UI

## Components (reuse)

| Component | Path |
|-----------|------|
| PageHero | `src/components/PageHero.jsx` |
| Select | `src/components/Select.jsx` |
| Footer | `src/components/Footer.jsx` |
| PremiumGate | `src/components/PremiumGate.jsx` |
| CoralLogo | `src/components/CoralLogo.jsx` |

## Icons (required)

- UI chrome: **Phosphor Light** via `Icon.jsx` — never Twemoji in nav, cards, or buttons.
- Map new names in `src/utils/phosphorIconMap.js`.
- Decorative milestone activity icons may still use legacy keys; map to closest Phosphor icon.

## Sound

- Always on — no mute toggle in header.
- Files in `public/sounds/` — regenerate via `npm run generate:sounds`.
- Replace WAV files with your own curated audio anytime (same filenames).


Today · My Baby · My Care · Essentials · Community

## After UI changes

1. Update relevant design doc in same session
2. Test 375px mobile + 1280px desktop
3. Verify touch targets ≥ 56dp

## Audience copy

Write for educated, time-poor mothers in London, NYC, Dubai — confident, calm, never condescending. Avoid "mama" clichés and gamification.
