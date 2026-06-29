# Shopping UI Design

> **Implementation:** `ShoppingChecklist`, `ShopItemCard`, `ShopProductImage`, `Select`, `src/data/shoppingAndCare.js`, `public/images/shop/`, styles in `global.css`.  
> **Shared UI:** [`docs/ui-design.md`](ui-design.md) — read before changing form controls or layout tokens.

## Goals

- Dense, scannable checklist — use full app width (1100px max)
- Full-width product image on each card, content stacked below
- Real photos stored in repo (`public/images/shop/*.jpg`)
- Clear copy: personal recommendations we have used (not medical or exhaustive)
- Stable layout on mobile and desktop (no collapsed/zero-height images)

---

## Page width and padding

Uses shared [`.page-body`](page-layout-standardization.md) utilities on `.shopping-page`:

| Viewport | Layout |
|----------|--------|
| Mobile (≤768px) | `.page-body--wide` + `.page-body--with-mobile-nav` — horizontal `16px` (12px at ≤360px), bottom clearance for fixed nav |
| Desktop (≥769px) | `max-width: 1100px`, horizontal `20px`, normal bottom spacing |

`<PageHero>` sits **outside** `.shopping-page` (full-bleed). Checklist content is inside the centered body wrapper.

---

## Card anatomy

```
┌────────────────────────────────────┐
│  Image area (4:3)            [✓]   │  ← .shop-product-media
├────────────────────────────────────┤
│  [Category] [Month N] [Optional]     │
│  Product title                     │
│  Why text (max 2 lines)            │
│  [ FirstCry ]  [ Amazon ]          │  ← equal-width chips on wide cards
└────────────────────────────────────┘
```

| Element | Class | Notes |
|---------|-------|-------|
| Card | `.shop-product-card.card-accent-top` | `height: 100%`; 3px top accent via `--cat-color`; no left border |
| Media | `.shop-product-media` | `aspect-ratio: 4/3`; image absolutely fills via `.shop-product-thumb--banner` |
| Checkbox | `.shop-check-overlay` | Top-right on image; white background for contrast |
| Content | `.shop-product-content` | `flex: 1`; links `margin-top: auto` pin to card bottom |
| Why | `.shop-product-why` | 2-line clamp |

### Purchased state

- `.shop-item-checked` — muted/grayscale image, strikethrough title

---

## Grid and spacing

| Breakpoint | Columns | Gap | Typical card width |
|------------|---------|-----|-------------------|
| &lt; 520px | **1** | 14px | ~100% minus page padding (≈336–390px on phones) |
| 520px – 959px | **2** | 16px | ~half container (≈240–520px per card) |
| ≥ 960px | **3** | 18px | ~⅓ of 1100px (≈340px per card) |

Use `minmax(0, 1fr)` so cards do not overflow narrow viewports.

Section spacing: `.shop-product-section` `margin-bottom: 32px`; group label `Essential (N)` above each grid.

### Toolbar

- `.shop-toolbar` — column on mobile; row from **640px** (range controls + progress side by side)
- Month range uses shared **`Select`** (`shop-range-from`, `shop-range-to`) — see [Select in ui-design.md](ui-design.md#select-selectjsx)
- `.shop-range-controls` — flex wrap, cream panel; two selects + summary line

---

## Images

### Storage

- Path: `public/images/shop/{slug}.jpg`
- Referenced in data as `image: '/images/shop/{slug}.jpg'`
- Regenerate: `node scripts/download-shop-images.mjs` (FirstCry `og:image` / Amazon / fallbacks)

### Sources (current)

| Slug | Source |
|------|--------|
| sebamed-*, sterilizer, diaper-bag | FirstCry CDN `cdn.fcglcdn.com/.../products/438x531/{id}a.jpg` |
| pacifier, dry-sheets, bottle-brush | Amazon product images |
| pram, play-gym, breast-pump, carrier, stroller | FirstCry category/listing `og:image` (may be generic; replace with PDP when known) |
| bibs | Babyhug drool bibs pack PDP (`18149757`) |
| newborn-clothes, walking-shoes, nursing-pads, nipple-cream, burp-cloths, clothes-sizeup | Stock photos (picsum / unsplash) — replace with your own photos optional |

### Fallback

If `image` missing or load fails → `ShopProductImage` category tile (emoji + tint).

### Image CSS rules

- Never use `height: auto` on banner without a sized parent — parent `.shop-product-media` owns `aspect-ratio: 4/3`
- Child `.shop-product-thumb--banner` is `position: absolute; inset: 0`
- `object-fit: cover; object-position: center`

---

## Asset checklist

| Product key | File | In data |
|-------------|------|---------|
| sebamedLotion | sebamed-lotion.jpg | ✓ |
| sebamedRashCream | sebamed-rash.jpg | ✓ |
| sebamedShampoo | sebamed-shampoo.jpg | ✓ |
| sebamedWash | sebamed-wash.jpg | ✓ |
| drySheets | dry-sheets.jpg | ✓ |
| sterilizer | sterilizer.jpg | ✓ |
| breastPump | breast-pump.jpg | ✓ |
| carrier | carrier.jpg | ✓ |
| diaperBag | diaper-bag.jpg | ✓ |
| bottleBrush | bottle-brush.jpg | ✓ |
| pram | pram.jpg | ✓ |
| newbornClothes | newborn-clothes.jpg | ✓ |
| playGym | play-gym.jpg | ✓ |
| pacifier | pacifier.jpg | ✓ |
| bibs | bibs.jpg | ✓ |
| stroller | stroller.jpg | ✓ |
| walkingShoes | walking-shoes.jpg | ✓ |
| nursingPads | nursing-pads.jpg | ✓ |
| nippleCream | nipple-cream.jpg | ✓ |
| burpCloths | burp-cloths.jpg | ✓ |
| clothesSizeUp | clothes-sizeup.jpg | ✓ |

---

## Maintenance

1. Add `image: '/images/shop/my-product.jpg'` to `PRODUCTS`.
2. Run `node scripts/download-shop-images.mjs` or save a JPG manually.
3. Prefer WebP/JPG ≤80KB for mobile; keep aspect near 4:3 when cropping.
4. After layout changes, verify at **375px**, **768px**, and **1280px** widths.
