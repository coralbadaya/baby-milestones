# Nestmile Community Feature — Phased Implementation Plan

> **Tagline:** Milestones, recipes, and tips shared by parents  
> **Target:** Gen Z & late Millennial parents, especially new moms  
> **Source inspiration:** @avira.ig (Instagram recipes)

---

## Phase 1: Foundation & Bug Fixes ✅
**Goal:** Fix existing issues and set up core infrastructure

### 1.1 Modal Bug Fix
- [x] Fix mobile modal positioning (portal to `document.body` — was trapped in card grid)
- [x] Ensure modal is vertically centered in viewport (flex center on fixed backdrop)
- [x] Add `max-height: min(80dvh, calc(100dvh - 48px))` for mobile
- [x] iOS scroll lock (`body { position: fixed; top: -scrollY }`) so page doesn't shift
- [x] Verify modal scrolls correctly when content overflows (backdrop `overflow-y: auto`)

### 1.2 Core Hooks Setup
- [x] Create `src/hooks/useMemories.js` with localStorage persistence
- [x] Create `src/hooks/useComments.js` for in-memory comments
- [x] Create `src/hooks/useSwipe.js` for swipe gesture detection
- [x] Write unit tests for hooks (optional but recommended)

### 1.3 Data Structure Setup
- [x] Create `src/data/recipes.js` with 3-5 sample recipes from avira.ig
- [x] Create `src/data/parentingTips.js` with "Baby Teething" as first tip
- [x] Define TypeScript-style JSDoc types for Recipe, Memory, Comment, Tip

**Acceptance Criteria:**
- [x] Modal displays correctly on all mobile viewports
- [x] `useMemories` hook persists data across page refreshes
- [x] Sample data files load without errors

---

## Phase 2: Community Page Structure ✅
**Goal:** Create the main Community page with navigation

### 2.1 Community Page Shell
- [x] Create `src/pages/Community.jsx`
- [x] Add tabbed navigation: Feed | Recipes | Tips | + Create
- [x] Integrate with App.jsx routing (`page === 'community'`)
- [x] Add Community icon to mobile nav in Header.jsx
- [x] Apply design system styling (warm colors, General Sans font)

### 2.2 Page Header
- [x] Add "Nestmile Community" title
- [x] Display community tagline (see `COMMUNITY_TAGLINE` in `src/constants/brand.js`)
- [x] Style header per design-system-2026.md

### 2.3 Empty States
- [x] Design empty state for Feed tab ("Be the first to share!")
- [x] Design empty state for Recipes tab (loading placeholder)
- [x] Design empty state for Tips tab

**Acceptance Criteria:**
- [x] Community page accessible from mobile nav
- [x] All 4 tabs render without errors
- [x] Page follows design system (colors, typography, spacing)
- [x] Tagline visible on page header

---

## Phase 3: Memory System ✅
**Goal:** Allow moms to create, view, and interact with memories

### 3.1 Memory Feed
- [x] Create `src/components/community/MemoryFeed.jsx`
- [x] Display list of memories from `useMemories` hook
- [x] Sort by newest first
- [x] Show memory type icon, title, content preview, age, reactions

### 3.2 Memory Card
- [x] Create `src/components/community/MemoryCard.jsx`
- [x] Display: type badge, title, content, baby age, timestamp
- [x] Show reaction counts (heart, celebrate, support)
- [x] Add reaction buttons with haptic feedback
- [x] Add "Comment" button to expand comments
- [x] Add share button

### 3.3 Create Memory Flow
- [x] Create `src/components/community/CreateMemory.jsx`
- [x] Memory type selector (Milestone, Tip, Recipe Win, Moment, Real Talk)
- [x] Title input (required)
- [x] Content textarea (required)
- [x] Baby age input (optional, auto-filled if birthDate set)
- [x] Tags input (comma-separated or chips)
- [ ] Photo upload placeholder (Phase 5)
- [x] Submit button → saves to localStorage via hook

### 3.4 Sample Content
- [x] Add "Baby Teething - What Worked for Us" as seed memory
- [x] Add 2-3 more sample memories for demo purposes

**Acceptance Criteria:**
- [x] Can create a new memory and see it in feed
- [x] Memories persist after page refresh (localStorage)
- [x] Reactions increment on tap
- [x] Memory cards follow card-accent-top design pattern
- [x] Form validates required fields before submit

---

## Phase 4: Recipe Swipe Feed (partial → mostly done)
**Goal:** Tinder-style swipeable recipe cards with video

### 4.1 Recipe Card
- [x] Create recipe card UI (in `RecipeFeed.jsx`)
- [x] Display: thumbnail/video placeholder, title, prep time, age range
- [x] Video toggle: Original ↔ AI Summary (UI ready; no video URLs yet)
- [x] Swipe right = Like/Save, Swipe left = Skip
- [x] Visual feedback during swipe (rotation, opacity)
- [x] Show ingredients preview on card

### 4.2 Recipe Feed (Swipe Stack)
- [x] Create `src/components/community/RecipeFeed.jsx`
- [x] Stack of recipe cards (current + next preview)
- [x] Track liked/skipped recipes in state
- [x] "No more recipes" end state
- [x] Integrate `useSwipe` hook
- [x] Filter by meal type, recipe type, baby age, and prep time
- [x] Clear filters + "Show skipped again" when stack is empty

### 4.3 Recipe Detail Modal
- [x] Expand recipe card to full modal on tap
- [x] Show full ingredients list
- [x] Show step-by-step instructions
- [x] Show nutrition tip
- [x] Link back to original avira.ig post
- [x] Share button

### 4.4 Sample Recipes
- [x] Add 30 curated baby recipes (Instagram API blocked; hand-curated Indian weaning set)
- [x] Scrape @avira.ig captions via `scripts/scrape-instagram-recipes.mjs` (curl); 6 new solids-journey recipes added (36 total)
- [x] Raw scrape output saved to `src/data/instagram-recipes-raw.json` for re-curation
- [ ] Add placeholder video URLs (or actual if available)
- [ ] Add AI video placeholder URLs

**Acceptance Criteria:**
- [x] Swipe gestures work on mobile (touch) and desktop (drag)
- [x] Swiped recipes don't reappear in stack
- [ ] Video plays inline on card
- [x] Recipe modal shows all details
- [x] Liked recipes can be accessed later (saved list + localStorage)

---

## Phase 5: Comments & Social (partial)
**Goal:** Enable comments on memories and social sharing

### 5.1 Comment Section
- [x] Create `src/components/community/CommentSection.jsx`
- [x] Display comments list under memory card
- [x] Comment input with submit button
- [x] Comments stored in memory object (localStorage)
- [x] Show comment count on memory card
- [x] Timestamp display ("2h ago", "yesterday")

### 5.2 Share Button
- [x] Create `src/components/community/ShareButton.jsx`
- [x] Use Web Share API on mobile (`navigator.share`)
- [x] Fallback: copy link to clipboard
- [x] Share text includes tagline + memory preview
- [x] Share options: WhatsApp, Twitter/X, Facebook, Copy Link
- [x] **Icon-first row** (Phosphor brand logos + Link/Check); 44px circular buttons; optional section label
- [x] Used on recipe modal, memory cards, and expanded tip cards

### 5.2b Recipe modal header (editorial)
- [x] `RecipeMetaChips` — prep time + age shown **once** in modal header (not duplicated in body)
- [x] `DetailModal` supports `meta`, `lead`, `displayTitle` for Fraunces title + lead description
- [x] Share section label: "Share this recipe"

### 5.3 Open Graph Meta
- [x] Add dynamic OG tags for shared memories (tab-level via `pageMeta.js`)
- [x] OG image: placeholder URL in index.html
- [x] OG title: Memory/title per tab
- [x] OG description: Content preview + tagline

**Acceptance Criteria:**
- [x] Can add comment to any memory
- [x] Comments persist in localStorage
- [x] Share button opens native share sheet on mobile
- [x] Shared links include preview text

---

## Phase 6: Parenting Tips Section (partial)
**Goal:** Curated parenting tips with community additions

### 6.1 Tips Feed
- [x] Create `src/components/community/TipsFeed.jsx`
- [x] Display tips from `parentingTips.js`
- [x] Filter by category (health, sleep, feeding, play)
- [x] Filter by age range

### 6.2 Tip Card
- [x] Create `src/components/community/TipCard.jsx`
- [x] Display: category icon, title, preview, age range
- [x] Expand to full content on tap
- [x] "Helpful" reaction button
- [x] Share button

### 6.3 Seed Content
- [x] Baby Teething (4-7 months) - signs, remedies, what to expect
- [x] Sleep Regression Survival (4 months, 8 months)
- [x] Starting Solids Guide (6 months)
- [x] Tummy Time Tips (0-3 months)
- [x] Diaper Rash Remedies (all ages)

**Acceptance Criteria:**
- [x] Tips display in grid/list format
- [x] Filters work correctly
- [x] Tip cards follow design system
- [x] "Baby Teething" tip is prominently featured

---

## Phase 7: Polish & Enhancement
**Goal:** Refine UX, add animations, prepare for launch

### 7.1 Animations
- [ ] Add Framer Motion to recipe swipe cards
- [ ] Add fade-in for memory cards
- [ ] Add micro-interactions on reactions (bounce, confetti)
- [ ] Respect `prefers-reduced-motion`

### 7.2 Liked/Saved Section
- [x] Create "Saved Recipes" view (list under swipe feed)
- [ ] Create "My Memories" filter
- [ ] Add bookmark icon to recipe cards

### 7.3 Onboarding
- [ ] First-time community visit tooltip
- [ ] Prompt to create first memory
- [ ] Explain swipe gestures on recipes

### 7.4 Performance
- [ ] Lazy load recipe videos
- [ ] Virtualize long memory feeds
- [ ] Optimize images (WebP, srcset)

**Acceptance Criteria:**
- [ ] Animations feel smooth at 60fps
- [ ] Saved recipes accessible from profile/settings
- [ ] First-time users understand how to use features
- [ ] Page load time < 2s on 3G

---

## Phase 8: Instagram Integration (Future)
**Goal:** Connect to actual Instagram presence

### 8.0 Scrape pipeline (dev)
- [x] `npm run scrape:recipes` — fetches public profile captions to `instagram-recipes-raw.json`
- [ ] Pagination for older posts (GraphQL cursor blocked; manual curation for now)

### 8.1 Content Strategy
- [ ] Define posting schedule for @coral Instagram
- [ ] Create content pillars (tips, recipes, mom stories)
- [ ] Design Instagram post templates matching app design

### 8.2 API Integration (Requires Meta approval)
- [ ] Apply for Instagram Basic Display API
- [ ] Fetch latest posts from avira.ig
- [ ] Auto-sync new recipes to app

### 8.3 User-Generated Content
- [ ] Allow moms to submit recipes
- [ ] Moderation queue for submissions
- [ ] Featured community recipes

**Acceptance Criteria:**
- [ ] Instagram page live with 10+ posts
- [ ] API fetches posts successfully (if approved)
- [ ] Community submissions workflow defined

---

## Technical Debt & Maintenance

- [ ] Add error boundaries around community components
- [ ] Add loading skeletons for async content
- [ ] Set up analytics for community engagement
- [ ] Document component APIs in Storybook (optional)
- [ ] Plan backend migration for memories (Firebase/Supabase)

---

## Success Metrics

| Metric | Target |
|--------|--------|
| Memories created (first month) | 50+ |
| Recipe swipes per session | 5+ |
| Comments per memory (avg) | 2+ |
| Social shares per week | 20+ |
| Return visitors (7-day) | 40% |

---

## Dependencies

- **Design system:** `docs/design-system-2026.md` must be followed
- **Fonts:** General Sans from Fontshare
- **Icons:** Existing icon system or add Lucide/Heroicons
- **Video hosting:** Self-hosted or YouTube embeds
- **AI video service:** TBD (Runway/Pictory/HeyGen)

---

*Last updated: May 31, 2026*
