# DIY activities — admin configuration

> Per-activity editorial content and photos for all 180 DIY cards. Admin-managed via Supabase; bundled `diyActivities.js` as fallback.

---

## Product shape

| Layer | Role |
|-------|------|
| **Supabase `diy_activity_content`** | Full activity snapshot override (name, steps, materials, …) |
| **Supabase `diy_activity_images`** | One row per `activity.id` (optional custom photo) |
| **Supabase `diy_image_defaults`** | Singleton site-wide default card image |
| **Supabase Storage `diy-images`** | Public objects at `activities/{activityId}.jpg` and `defaults/card.jpg` |
| **Bundled cream lockup** | `public/images/placeholders/yarntrails-watermark.jpg` — card face when no custom/default |
| **Illustration keys** | `public/images/diy/{illustration}.jpg` — AI prompt helpers only (not card faces) |
| **Admin UI** | `/admin/diy` — default image + browse; `/admin/diy/:activityId` — full-page edit (image + content) |
| **Public cards** | `useDiyActivities` merges DB overrides; `getDiyImage` for photos |

**Option B (implemented):** each of 180 activities can have its own image, even when they share an `illustration` key.

---

## Fallback chain

```
1. Per-activity Supabase override (activity_id) → public storage URL
2. Admin site-wide default (diy_image_defaults / defaults/card.jpg)
3. Cream Yarn Trails lockup (/images/placeholders/yarntrails-watermark.jpg)
4. Category gradient (sensory / motor / …) — only if the lockup also fails
```

Illustration JPGs in `public/images/diy/` are kept for AI prompts and `verify:diy-images`; they are **not** used as card faces. Bootstrap seed rows (`source = seed`) are also ignored so the cream lockup / admin default can show until a real upload replaces them.

Cards never break when Supabase is unavailable — steps 1–2 are skipped and the cream lockup shows.

**Lockup asset:** source SVG `public/brand/yarntrails-watermark.svg` (full-opacity mark + wordmark + tagline on cream); regenerate JPG via `npm run generate:brand`.

---

## Data model

### Table `diy_activity_content`

| Column | Type | Notes |
|--------|------|-------|
| `activity_id` | `text` PK | e.g. `m1-1` |
| `name` | `text` | Activity title |
| `category` | `text` | sensory / motor / cognitive / emotional / bonding |
| `duration` | `text` | e.g. `5–10 min` |
| `difficulty` | `text` | Easy / Medium / Hard |
| `materials` | `text[]` | One item per array entry |
| `steps` | `text[]` | Step-by-step instructions |
| `benefits` | `text[]` | Benefit bullets |
| `why_it_works` | `text` | Science / rationale copy |
| `video_search` | `text` | YouTube **watch** URL preferred (`watch?v=` / `youtu.be/` — embeds in modal). Search URLs (`/results?search_query=`) show disclosure + outbound link only |
| `illustration` | `text` | Illustration key for AI prompts (not the card photo) |
| `updated_at` | `timestamptz` | |
| `updated_by` | `uuid` | Admin user |

Migration: `supabase/migrations/20250701170000_diy_activity_content.sql`

Row exists only after admin saves — bundled `diyActivities.js` is used until then.

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

### Table `diy_image_defaults`

Singleton (`id = 'global'` only). Optional; when absent, cards use the cream lockup.

| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` PK | Always `global` |
| `storage_path` | `text` | e.g. `defaults/card.jpg` |
| `alt_text` | `text` | Default: `Hands-on play` |
| `source` | `text` | `upload`, `url_import`, `ai`, `stock` |
| `updated_at` | `timestamptz` | |
| `updated_by` | `uuid` | Admin user |

Migration: `supabase/migrations/20260906140000_diy_image_defaults.sql`

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
| [`src/data/diyImages.js`](../src/data/diyImages.js) | `getDiyImage`, `buildDiyImageOverrides`, `buildDiyGlobalDefault` |
| [`src/hooks/useDiyImages.js`](../src/hooks/useDiyImages.js) | Fetch per-activity overrides + site-wide default |
| [`src/hooks/useDiyActivities.js`](../src/hooks/useDiyActivities.js) | Fetch content overrides + merge with static |
| [`src/context/DiyActivitiesContext.jsx`](../src/context/DiyActivitiesContext.jsx) | Provider in `main.jsx` |
| [`src/utils/diyActivitiesMerge.js`](../src/utils/diyActivitiesMerge.js) | Merge bundled + DB content |
| [`src/utils/diyActivityAdmin.js`](../src/utils/diyActivityAdmin.js) | Admin content CRUD |
| [`src/utils/diyImageAdmin.js`](../src/utils/diyImageAdmin.js) | Per-activity + default upload/reset helpers |
| [`src/pages/admin/AdminDiyImages.jsx`](../src/pages/admin/AdminDiyImages.jsx) | List + default card image panel |
| [`src/components/admin/AdminDiyDefaultImage.jsx`](../src/components/admin/AdminDiyDefaultImage.jsx) | Site-wide default upload |
| [`src/pages/admin/AdminDiyImageEdit.jsx`](../src/pages/admin/AdminDiyImageEdit.jsx) | Full-page activity editor |

**Card components:** `DIYActivityCard`, `DIYEditorialCard` — pass full `activity` object to image resolver. **Open guide** opens `DiyActivityModalBody`; no card-face YouTube button.

### Video in guide modal

| URL type | Public behavior |
|----------|-----------------|
| Watch (`watch?v=`, `youtu.be/`, `/embed/`) | Responsive iframe embed in modal (`src/utils/youtube.js`) |
| Search (`/results?search_query=`) | Disclosure + secondary outbound link (legacy bundled data) |

Prefer curated watch URLs in admin `video_search` over search links.

---

## Admin flows

Route: **`/admin/diy`** (admin role only; hidden from support staff nav).

| Action | Behavior |
|--------|----------|
| **Upload default** | Replaces the site-wide card image (`diy_image_defaults` + `defaults/card.jpg`) |
| **Reset default** | Deletes default row + storage object → cream lockup |
| **Save content** | Upsert full activity snapshot to `diy_activity_content` |
| **Reset content** | Delete content row → bundled `diyActivities.js` copy |
| **Upload** | JPEG/WebP/PNG ≤2 MB; client resize to max 800px wide; upsert storage + row for that activity |
| **URL import** | Fetch licensed URL (blocks Pinterest); same upload path |
| **Edit alt** | Update image row without re-upload |
| **Reset image** | Delete storage object + image row → site default (or cream lockup) |
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
npm run verify:diy-images          # 65 illustration JPGs still present (prompt helpers)
npm run verify:diy-activity-images # 180 manifest entries
npm test
npm run build
supabase db push                   # apply migration
```

**Manual:** `/admin/diy` → upload default → all uncustomized cards update. Open `m1-1` → upload a unique photo → Today DIY strip + month 1 show that photo; reset → site default.

---

## Future (out of v1)

- Edge Function URL proxy for CORS-blocked stock URLs
- Bulk AI generation from admin
- WebP/AVIF pipeline in build
- Premium PDF export of activity gallery
