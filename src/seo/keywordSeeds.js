/**
 * SEO keyword seeds and combinator rules for Yarn Trails.
 * Generator: `npm run generate:seo-keywords` → docs/seo-keywords-matrix.md
 * Strategy: docs/seo-keywords.md · Skill: .cursor/skills/seo-keywords/SKILL.md
 */

/** @typedef {{ id: string, label: string, roots: string[], misspellings?: string[], intents?: string[], ages?: boolean, geos?: boolean, products?: boolean }} KeywordPillar */

/** User-facing search intents (append to root phrases). */
export const KEYWORD_INTENTS = [
  'ideas',
  'tips',
  'guide',
  'checklist',
  'tracker',
  'schedule',
  'chart',
  'list',
  'how to',
  'best',
  'recommended',
  'free',
  'printable',
  'diy',
  'at home',
  'easy',
  'safe',
  'dos and donts',
  "do's and don'ts",
  'activities',
  'examples',
];

/** Age tokens — month guides + bands. */
export const KEYWORD_AGES = [
  'newborn',
  '1 week old',
  '2 week old',
  '1 month old',
  '2 month old',
  '3 month old',
  '4 month old',
  '5 month old',
  '6 month old',
  '7 month old',
  '8 month old',
  '9 month old',
  '10 month old',
  '11 month old',
  '12 month old',
  '1 year old',
  '18 month old',
  '2 year old',
  '3 year old',
  '0-3 months',
  '4-6 months',
  '6-12 months',
  '12-24 months',
  'toddler',
  'infant',
];

/** Geo / schedule variants (health & shopping). */
export const KEYWORD_GEOS = ['india', 'indian', 'iap', 'uip', 'cdc', 'us', 'uk', 'nhs'];

export const KEYWORD_AUDIENCE = ['for babies', 'for newborns', 'for infants', 'for toddlers', 'for moms', 'for mothers'];

export const KEYWORD_BRAND_SUFFIXES = ['yarn trails', 'yarntrails'];

/**
 * Fifteen priority pillars (+ product synonyms). Roots are stem phrases; generator expands.
 * @type {KeywordPillar[]}
 */
export const KEYWORD_PILLARS = [
  {
    id: 'baby-photoshoot',
    label: 'Baby photoshoot ideas',
    roots: ['baby photoshoot', 'baby photo shoot', 'newborn photoshoot', 'baby picture ideas', 'monthly baby photos'],
    misspellings: ['baby photshoot', 'babby photoshoot'],
    intents: ['ideas', 'themes', 'poses', 'at home', 'diy', 'props', 'outfit ideas'],
    ages: true,
    geos: false,
  },
  {
    id: 'baby-photography',
    label: 'Baby photography',
    roots: ['baby photography', 'newborn photography', 'baby portrait', 'baby photos', 'milestone photos'],
    misspellings: ['baby photgraphy'],
    intents: ['tips', 'at home', 'lighting', 'ideas', 'poses'],
    ages: true,
    geos: false,
  },
  {
    id: 'baby-stories',
    label: 'Baby stories',
    roots: ['baby story', 'baby stories', 'baby memory story', 'baby book story', 'ai baby story'],
    intents: ['ideas', 'examples', 'generator', 'book', 'monthly'],
    ages: true,
    geos: false,
  },
  {
    id: 'rhymes',
    label: 'Rhymes',
    roots: ['baby rhymes', 'nursery rhymes', 'rhymes for babies', 'infant rhymes', 'action rhymes'],
    intents: ['list', 'youtube', 'hindi', 'english', 'short'],
    ages: true,
    geos: true,
  },
  {
    id: 'lullabies',
    label: 'Lullabies',
    roots: ['lullaby', 'lullabies', 'lullabies for babies', 'baby sleep song'],
    misspellings: ['lullabyes', 'lullabys'],
    intents: ['lyrics', 'list', 'hindi', 'english', 'youtube'],
    ages: true,
    geos: true,
  },
  {
    id: 'recommended-books',
    label: 'Recommended books for babies',
    roots: [
      'books for babies',
      'best baby books',
      'board books for babies',
      'read aloud books',
      'baby bookshelf',
    ],
    misspellings: ['recomemended books for babies', 'reccommended baby books'],
    intents: ['best', 'recommended', 'by age', 'list', '0-6 months', '1 year'],
    ages: true,
    geos: false,
  },
  {
    id: 'baby-milestones',
    label: 'Baby milestones',
    roots: [
      'baby milestones',
      'infant milestones',
      'developmental milestones',
      'monthly milestones',
      'milestone tracker',
    ],
    intents: [...KEYWORD_INTENTS],
    ages: true,
    geos: false,
  },
  {
    id: 'baby-foods',
    label: 'Baby foods',
    roots: [
      'baby food',
      'baby foods',
      'first foods',
      'starting solids',
      'weaning',
      'baby porridge',
      'homemade baby food',
    ],
    intents: ['recipes', 'chart', 'schedule', 'ideas', '6 months', 'indian', 'healthy', 'dos and donts'],
    ages: true,
    geos: true,
  },
  {
    id: 'baby-recipes',
    label: 'Recipes for babies',
    roots: [
      'baby recipes',
      'recipes for babies',
      'baby food recipes',
      'solid food recipes',
      'finger food recipes',
    ],
    misspellings: ['recepies for babies', 'recipies for babies'],
    intents: ['easy', '6 months', '8 months', 'indian', 'vegetarian', 'no sugar', 'homemade'],
    ages: true,
    geos: true,
  },
  {
    id: 'diy-development',
    label: 'DIY development activities',
    roots: [
      'diy baby activities',
      'sensory activities for babies',
      'development activities for babies',
      'baby play ideas',
      'tummy time activities',
      'montessori baby activities',
    ],
    intents: ['at home', 'easy', 'no prep', 'by month', 'physical', 'cognitive'],
    ages: true,
    geos: false,
  },
  {
    id: 'mother-care',
    label: 'Mother care',
    roots: [
      'mother care',
      'mom care',
      'postpartum care',
      'new mom care',
      'maternal self care',
    ],
    intents: ['tips', 'guide', 'timeline', 'recovery', 'mental health', 'week by week'],
    ages: false,
    geos: false,
  },
  {
    id: 'baby-care',
    label: 'Baby care',
    roots: ['baby care', 'newborn care', 'infant care', 'daily baby care', 'baby care tips'],
    intents: ['guide', 'checklist', 'routine', 'dos and donts', 'first time moms'],
    ages: true,
    geos: false,
  },
  {
    id: 'vaccination',
    label: 'Vaccination',
    roots: [
      'baby vaccination',
      'infant vaccination',
      'vaccination schedule',
      'immunization schedule',
      'vaccine chart',
    ],
    intents: ['tracker', 'schedule', 'chart', 'list', 'calendar', 'reminder', 'first year'],
    ages: true,
    geos: true,
  },
  {
    id: 'vaccination-india',
    label: 'Vaccination tracker India',
    roots: [
      'vaccination tracker india',
      'baby vaccination india',
      'iap schedule',
      'uip schedule',
      'indian baby vaccine chart',
    ],
    intents: ['tracker', 'app', 'pdf', 'chart', '2026', 'download'],
    ages: true,
    geos: true,
  },
  {
    id: 'recommended-products',
    label: 'Recommended products for babies',
    roots: [
      'baby products',
      'recommended baby products',
      'baby essentials',
      'newborn must haves',
      'baby gear',
    ],
    misspellings: ['recomemended producs for babies'],
    intents: ['list', 'checklist', 'by month', 'india', 'best', 'shopping'],
    ages: true,
    geos: true,
    products: true,
  },
  {
    id: 'dos-donts',
    label: "Dos and don'ts for babies",
    roots: [
      'dos and donts for babies',
      "do's and don'ts for newborns",
      'baby safety tips',
      'newborn rules',
      'parenting mistakes to avoid',
    ],
    intents: ['sleep', 'feeding', 'bath', 'travel', 'vaccination'],
    ages: true,
    geos: false,
  },
];

/** Template patterns — {tokens} filled by generator. */
export const KEYWORD_TEMPLATES = [
  '{root}',
  '{root} {intent}',
  '{age} {root}',
  '{age} {root} {intent}',
  '{root} {geo}',
  '{geo} {root}',
  '{root} {geo} {intent}',
  '{root} {audience}',
  '{intent} {root} {audience}',
  'baby {rootShort}',
  '{age} baby {rootShort}',
];