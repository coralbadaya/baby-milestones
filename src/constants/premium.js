/** Plus tiers and gating — see docs/monetization-strategy.md */

export const PREMIUM_STORAGE_KEY = 'yarntrailsPremium';

/** Free-tier usage caps (Basic). Plus = unlimited unless noted. */
export const ENTITLEMENT_LIMITS = {
  photosPerMonth: 2,
  storiesTotal: 1,
  voiceNotesStored: 3,
  voiceNoteMaxSeconds: 30,
  viewerSeats: 2,
};

/** Display-only regional rates (until Stripe checkout). USD is anchor. */
export const PREMIUM_CURRENCIES = {
  USD: {
    priceMonthly: 7.99,
    priceAnnual: 49.99,
    priceBundle: 79.99,
    priceGift: 59.99,
  },
  GBP: {
    priceMonthly: 6.99,
    priceAnnual: 39.99,
    priceBundle: 64.99,
    priceGift: 49.99,
  },
  INR: {
    priceMonthly: 399,
    priceAnnual: 2499,
    priceBundle: 3999,
    priceGift: 2999,
  },
};

export const PLANS = {
  basic: {
    id: 'basic',
    name: 'Yarn Trails Basic',
    priceMonthly: 0,
    priceAnnual: 0,
    currency: 'USD',
    features: [
      'Unlimited milestone tracking with captions',
      '2 photos per month in your album',
      '1 AI story — full quality with narration (taste test)',
      '3 voice notes (30 seconds each)',
      'Flip-book preview with soft watermark',
    ],
  },
  plus: {
    id: 'plus',
    name: 'Yarn Trails Plus',
    priceMonthly: 7.99,
    priceAnnual: 49.99,
    priceBundle: 79.99,
    priceGift: 59.99,
    currency: 'USD',
    trialDays: 7,
    annualTrialDays: 7,
    features: [
      'Full interactive 3D flip-book — all themes, no watermark',
      'Unlimited AI stories — 4 personas, 2 art styles, narration',
      'Unlimited voice notes and HD photo storage',
      '4K export of album and stories',
      '20% off print orders + free shipping',
      '2 viewer seats for grandparents or partners',
      'Premium editorial, travel, shopping, assistant, vaccination export',
    ],
  },
};

/** Alias for legacy imports (`PLANS.premium`, AuthContext local trial). */
PLANS.premium = PLANS.plus;

/** @deprecated use PLANS.plus */
export const PLANS_LEGACY = { premium: PLANS.plus, free: PLANS.basic };

/** Feature keys for PremiumGate */
export const PREMIUM_FEATURES = {
  aiStory: 'aiStory',
  flipBookFull: 'flipBookFull',
  voiceNotes: 'voiceNotes',
  voiceClone: 'voiceClone',
  hdPhotos: 'hdPhotos',
  export4k: 'export4k',
  printDiscount: 'printDiscount',
  viewerSeats: 'viewerSeats',
  editorialFocus: 'editorialFocus',
  travelLongHaul: 'travelLongHaul',
  shoppingPremiumEdit: 'shoppingPremiumEdit',
  vaccinationExport: 'vaccinationExport',
  assistantAdvanced: 'assistantAdvanced',
};

export const PREMIUM_FEATURE_COPY = {
  [PREMIUM_FEATURES.aiStory]: {
    title: 'AI story',
    teaser: 'Turn this month into a illustrated story with narration — unlimited on Plus.',
  },
  [PREMIUM_FEATURES.flipBookFull]: {
    title: 'Full flip-book',
    teaser: 'Unlock the interactive 3D book, every theme, and no watermark.',
  },
  [PREMIUM_FEATURES.voiceNotes]: {
    title: 'Voice notes',
    teaser: 'Save unlimited 30-second voice memos on Plus.',
  },
  [PREMIUM_FEATURES.voiceClone]: {
    title: 'Your voice narration',
    teaser: 'Record once — AI narrates every story in your voice, in your language.',
  },
  [PREMIUM_FEATURES.hdPhotos]: {
    title: 'HD photos',
    teaser: 'Upload without limits — full resolution on Plus.',
  },
  [PREMIUM_FEATURES.export4k]: {
    title: '4K export',
    teaser: 'Export your album and stories in 4K for sharing and keepsakes.',
  },
  [PREMIUM_FEATURES.printDiscount]: {
    title: 'Print discount',
    teaser: '20% off every print order and free shipping with Plus.',
  },
  [PREMIUM_FEATURES.viewerSeats]: {
    title: 'Viewer seats',
    teaser: 'Invite two grandparents or partners to view the flip-book.',
  },
  [PREMIUM_FEATURES.editorialFocus]: {
    title: 'Premium editorial',
    teaser: 'Unlock curated guides for travel, wellness, and life with your little one.',
  },
  [PREMIUM_FEATURES.travelLongHaul]: {
    title: 'Long-haul travel guide',
    teaser: 'City-specific tips for Dubai, London, New York, and more.',
  },
  [PREMIUM_FEATURES.shoppingPremiumEdit]: {
    title: 'Premium brand edit',
    teaser: 'Our curated shortlist of investment pieces worth buying once.',
  },
  [PREMIUM_FEATURES.vaccinationExport]: {
    title: 'Export & print',
    teaser: 'PDF records for your pediatrician and travel.',
  },
  [PREMIUM_FEATURES.assistantAdvanced]: {
    title: 'Concierge assistant',
    teaser: 'Ask anything, anytime — an assistant that knows your baby\'s age and history.',
  },
};

/** Stripe price lookup keys (configure in Stripe dashboard). */
export const STRIPE_PRICE_KEYS = {
  plusMonthly: 'plus_monthly',
  plusAnnual: 'plus_annual',
  firstYearBundle: 'first_year_bundle',
  giftSubscription: 'gift_subscription',
};
