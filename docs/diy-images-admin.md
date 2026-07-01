# DIY activity images — admin configuration

> Per-activity editorial photos for all 180 DIY cards. Admin-managed via Supabase; bundled illustration JPGs as fallback.

---

## Product shape

| Layer | Role |
|-------|------|
| **Supabase `diy_activity_images`** | One row per `activity.id` (180 rows) |
| **Supabase Storage `diy-images`** | Public objects at `activities/{activityId}.jpg` |
| **Bundled fallbacks** | `public/images/diy/{illustration}.jpg` (65 archetype keys) |
| **Admin UI** | `/admin/diy` — upload, URL import, reset, alt text |
| **Public cards** | `getDiyImage({ activityId, illustration, category }, overrides)` |

**Option B (implemented):** each of 180 activities can have its own image, even when they share an `illustration` key.

---

## Fallback chain

```
1. Supabase override (activity_id) → public storage URL
2. Bundled JPG (/images/diy/{illustration}.jpg)
3. Category gradient (sensory / motor / …)
```

Cards never break when Supabase is unavailable — step 1 is skipped and steps 2–3 apply.

---

## Data model

### Table `diy_activity_images`

| Column | Type | Notes |
|--------|------|-------|
| `activity_id` | `text` PK | e.g. `m1-1` |
| `storage_path` | `text` | e.g. `activities/m1-1.jpg` |
| `alt_text` | `text` | Accessibility + SEO |
| `source` | `text` | `upload`, `url_import`, `ai`, `stock`, `seed` |
| `attribution` | `text` nullable | Licensed stock credit |
| `updated_at` | `timestamptz` | |
| `updated_by` | `uuid` | Admin user |

Migration: `supabase/migrations/20250701120000_diy_activity_images.sql`

### RLS

| Operation | Who |
|-----------|-----|
| `SELECT` | `anon`, `authenticated` (public app) |
| `INSERT/UPDATE/DELETE` | `admin` only |

Storage bucket `diy-images`: public read; admin-only write.

---

## Manifests (build-time)

| File | Export | Count |
|------|--------|-------|
| [`src/data/diyImageManifest.js`](../src/data/diyImageManifest.js) | `diyImageManifest`, `diyImageKeys` | 65 illustration keys |
| Same file | `diyActivityImages`, `diyActivityIds` | 180 activities |

Regenerate after `diyActivities.js` changes:

```bash
npm run build:diy-manifest
npm run verify:diy-activity-images
```

Each activity entry includes: `activityId`, `name`, `month`, `illustration`, `category`, `prompt`, `alt`.

---

## Runtime

| File | Role |
|------|------|
| [`src/data/diyImages.js`](../src/data/diyImages.js) | `getDiyImage`, `buildDiyImageOverrides` |
| [`src/hooks/useDiyImages.js`](../src/hooks/useDiyImages.js) | Fetch overrides on mount |
| [`src/context/DiyImagesContext.jsx`](../src/context/DiyImagesContext.jsx) | Provider in `main.jsx` |
| [`src/utils/diyImageAdmin.js`](../src/utils/diyImageAdmin.js) | Upload, URL import, reset helpers |
| [`src/pages/admin/AdminDiyImages.jsx`](../src/pages/admin/AdminDiyImages.jsx) | Admin CRUD UI |

**Card components:** `DIYActivityCard`, `DIYEditorialCard` — pass full `activity` object to image resolver.

---

## Admin flows

Route: **`/admin/diy`** (admin role only; hidden from support staff nav).

| Action | Behavior |
|--------|----------|
| **Upload** | JPEG/WebP/PNG ≤2 MB; client resize to max 800px wide; upsert storage + row |
| **URL import** | Fetch licensed URL (blocks Pinterest); same upload path |
| **Edit alt** | Update row without re-upload |
| **Reset** | Delete storage object + row → bundled fallback |
| **AI prompt** | Read-only helper from manifest for manual regeneration |

Overview stat on `/admin`: “X of 180 DIY images configured”.

---

## Bootstrap / seed

Copy bundled illustration JPGs into per-activity storage paths (same visual initially; admin replaces over time):

```bash
# Preview
node scripts/seed-diy-activity-images.mjs --dry-run

# Requires VITE_SUPABASE_URL + SUPABASE_SECRET_KEY in .env
npm run seed:diy-activity-images

# Alias
npm run sync:diy-images
```

Optional flags: `--limit=10` for partial seed.

---

## Legal sourcing

| Tier | Source | Use |
|------|--------|-----|
| **Primary** | AI-generated (manifest prompts) | Preferred for editorial consistency |
| **Secondary** | Unsplash / Pexels (attribution if required) | Admin URL import |
| **Never** | Pinterest, random Google Images | Blocked in admin URL validator |

See [`imagery-system.md`](imagery-system.md) for art direction.

---

## Verification

```bash
npm run build:diy-manifest
npm run verify:diy-images          # 65 bundled fallbacks
npm run verify:diy-activity-images # 180 manifest entries
npm test
npm run build
supabase db push                   # apply migration
```

**Manual:** Admin upload for `m1-1` → visible on Today DIY strip + month 1 page; reset → `vision_cards.jpg` fallback.

---

## Future (out of v1)

- Edge Function URL proxy for CORS-blocked stock URLs
- Bulk AI generation from admin
- WebP/AVIF pipeline in build
- Premium PDF export of activity gallery
