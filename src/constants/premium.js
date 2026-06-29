/** Premium tiers and gating — see docs/monetization-strategy.md */

export const PREMIUM_STORAGE_KEY = 'nestmilePremium';

export const PLANS = {
  free: {
    id: 'free',
    name: 'Free',
    priceMonthly: 0,
    priceAnnual: 0,
    currency: 'GBP',
  },
  premium: {
    id: 'premium',
    name: 'Nestbean Premium',
    priceMonthly: 14.99,
    priceAnnual: 119,
    currency: 'GBP',
    trialDays: 7,
    features: [
      'Weekly editorial guides tailored to your baby\'s age',
      'Premium travel and shopping edits',
      'Full concierge assistant depth',
      'Vaccination export and print bundles',
    ],
  },
};

/** Feature keys for PremiumGate */
export const PREMIUM_FEATURES = {
  editorialFocus: 'editorialFocus',
  travelLongHaul: 'travelLongHaul',
  shoppingPremiumEdit: 'shoppingPremiumEdit',
  vaccinationExport: 'vaccinationExport',
  assistantAdvanced: 'assistantAdvanced',
};

export const PREMIUM_FEATURE_COPY = {
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
    teaser: 'Deeper, age-aware guidance when you need it.',
  },
};
