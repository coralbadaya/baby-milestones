/**
 * Idea Studio — book concept metadata, collections, and creation flows.
 * Detection logic lives in `bookIdeaDetection.js`.
 */

/** @typedef {'photo-based' | 'milestone-based' | 'text-based' | 'family-based'} BookIdeaCreationType */

/**
 * @typedef {Object} BookIdeaDefinition
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {string} description
 * @property {string} [emoji]
 * @property {string} emotionalDescription
 * @property {string[]} aiCapabilities
 * @property {string[]} photoSources
 * @property {{ min: number, max?: number }} [suggestedPhotoCount]
 * @property {BookIdeaCreationType} creationType
 * @property {string} cta
 * @property {string} previewClass
 * @property {boolean} [featured]
 */

export const IDEA_COLLECTIONS = [
  {
    id: 'growing-up',
    heading: 'A little bigger every day',
    supporting:
      'Capture the changes, celebrations and milestones that make each month special.',
    ideaIds: ['sameSpotSeries', 'growthChart', 'festivalFirsts'],
  },
  {
    id: 'little-details',
    heading: 'The little things you\'ll miss',
    supporting:
      'The tiny expressions, messy meals and everyday discoveries worth remembering.',
    ideaIds: ['littleHandsFeet', 'firstTastes', 'alphabetOfYou'],
  },
  {
    id: 'family-stories',
    heading: 'All the love around you',
    supporting:
      'Bring generations, family faces and shared memories into one beautiful book.',
    ideaIds: ['thenAndNow', 'familyConstellation'],
  },
  {
    id: 'letters-dreams',
    heading: 'For the memories still unfolding',
    supporting:
      'Preserve the quiet moments and messages your child will treasure years from now.',
    ideaIds: ['sleepGallery', 'letterAt18'],
  },
];

/** @type {Record<string, BookIdeaDefinition>} */
export const BOOK_IDEA_DEFINITIONS = {
  sameSpotSeries: {
    id: 'sameSpotSeries',
    emoji: '🪑',
    title: 'Same-spot series',
    category: 'Monthly growth',
    description: 'Baby in the same chair or blanket each month — AI aligns growth.',
    emotionalDescription: 'One little chair. Twelve months of growing up.',
    aiCapabilities: [
      'Identify baby in monthly photos',
      'Align the subject',
      'Standardize composition',
      'Create a monthly comparison layout',
    ],
    photoSources: ['monthly_album', 'uploads', 'life_firsts'],
    suggestedPhotoCount: { min: 6, max: 12 },
    creationType: 'photo-based',
    cta: 'Choose photos',
    previewClass: 'idea-preview--same-spot',
  },
  littleHandsFeet: {
    id: 'littleHandsFeet',
    emoji: '🤲',
    title: 'Little hands, little feet',
    category: 'Crop & arrange',
    description: 'AI crops and arranges a hands-and-feet-only spread.',
    emotionalDescription: 'Those tiny fingers and toes deserve a story of their own.',
    aiCapabilities: [
      'Detect hands and feet',
      'Crop relevant regions',
      'Create coordinated layouts',
    ],
    photoSources: ['monthly_album', 'uploads'],
    suggestedPhotoCount: { min: 4, max: 16 },
    creationType: 'photo-based',
    cta: 'Find little details',
    previewClass: 'idea-preview--hands-feet',
  },
  thenAndNow: {
    id: 'thenAndNow',
    emoji: '🪞',
    title: 'Then & Now mirror',
    category: 'Grandparent gift',
    description: 'Your baby photo beside your own — a grandparent gift.',
    emotionalDescription: 'Two generations. One beautiful resemblance.',
    aiCapabilities: [
      'Pair parent and baby portraits',
      'Balance tone and framing',
      'Suggest gift-ready layout',
    ],
    photoSources: ['monthly_album', 'uploads'],
    suggestedPhotoCount: { min: 2, max: 2 },
    creationType: 'photo-based',
    cta: 'Create a family comparison',
    previewClass: 'idea-preview--then-now',
    featured: true,
  },
  sleepGallery: {
    id: 'sleepGallery',
    emoji: '🌙',
    title: 'Twelve dreams',
    category: 'Sleep gallery',
    description: 'Sleeping photos clustered into a "12 dreams" spread.',
    emotionalDescription: 'Twelve peaceful moments from the sweetest little dreamer.',
    aiCapabilities: [
      'Detect sleeping photographs',
      'Group suitable memories',
      'Generate a cohesive photo spread',
    ],
    photoSources: ['monthly_album', 'life_firsts'],
    suggestedPhotoCount: { min: 6, max: 12 },
    creationType: 'photo-based',
    cta: 'Explore sleeping photos',
    previewClass: 'idea-preview--sleep',
  },
  firstTastes: {
    id: 'firstTastes',
    emoji: '🥑',
    title: 'First tastes',
    category: 'Solids era',
    description: 'Solids-era mess montage with AI-cleaned backgrounds.',
    emotionalDescription: 'Every first bite, every funny face, every delicious little mess.',
    aiCapabilities: [
      'Detect mealtime images',
      'Clean backgrounds where appropriate',
      'Organize photos chronologically',
    ],
    photoSources: ['monthly_album', 'uploads'],
    suggestedPhotoCount: { min: 4, max: 20 },
    creationType: 'photo-based',
    cta: 'Build first tastes',
    previewClass: 'idea-preview--first-tastes',
  },
  letterAt18: {
    id: 'letterAt18',
    emoji: '✉️',
    title: 'Letter to you at 18',
    category: 'Time capsule',
    description: 'Write or record now; sealed page in the printed book.',
    emotionalDescription: 'A little message from today, waiting for tomorrow.',
    aiCapabilities: [],
    photoSources: [],
    creationType: 'text-based',
    cta: 'Write your letter',
    previewClass: 'idea-preview--letter',
  },
  familyConstellation: {
    id: 'familyConstellation',
    emoji: '✨',
    title: 'Family constellation',
    category: 'From Family Circle',
    description: 'Family faces stylized as a star map.',
    emotionalDescription: 'All the people who make your little world shine.',
    aiCapabilities: [
      'Arrange family portraits',
      'Stylize as a gentle star map',
      'Balance faces across the spread',
    ],
    photoSources: ['monthly_album', 'family_circle'],
    suggestedPhotoCount: { min: 3, max: 8 },
    creationType: 'family-based',
    cta: 'Explore family memories',
    previewClass: 'idea-preview--constellation',
  },
  festivalFirsts: {
    id: 'festivalFirsts',
    emoji: '🪔',
    title: 'Festival firsts',
    category: 'Celebration memories',
    description: 'First Diwali, Christmas, or Eid — you confirm each celebration.',
    emotionalDescription: 'The first Diwali lights, Christmas magic and Eid celebrations.',
    aiCapabilities: [
      'Use photo dates as hints only',
      'Let you confirm each celebration',
      'Never label faith without your OK',
    ],
    photoSources: ['monthly_album', 'life_firsts'],
    suggestedPhotoCount: { min: 1, max: 12 },
    creationType: 'photo-based',
    cta: 'Find celebration memories',
    previewClass: 'idea-preview--festival',
  },
  growthChart: {
    id: 'growthChart',
    emoji: '🚀',
    title: 'Growth rocket',
    category: 'From milestones',
    description: 'Weight and height plotted as a climbing vine or rocket trail.',
    emotionalDescription: 'Every little milestone is another reason to celebrate.',
    aiCapabilities: [
      'Plot measurements over time',
      'Illustrate a growth timeline',
      'Pair with milestone photos when you add them',
    ],
    photoSources: ['milestones', 'monthly_album'],
    suggestedPhotoCount: { min: 0, max: 4 },
    creationType: 'milestone-based',
    cta: 'Add milestones',
    previewClass: 'idea-preview--growth',
  },
  alphabetOfYou: {
    id: 'alphabetOfYou',
    emoji: '🔤',
    title: 'Alphabet of you',
    category: 'One tap',
    description: 'A is for Avocado face, B is for Bath time — AI picks photos.',
    emotionalDescription:
      'A is for Avocado face. B is for Bath time. Every letter is a little memory.',
    aiCapabilities: [
      'Suggest photo-to-letter associations',
      'Generate caption suggestions',
      'Let you replace photos and captions',
    ],
    photoSources: ['monthly_album', 'uploads'],
    suggestedPhotoCount: { min: 8, max: 26 },
    creationType: 'photo-based',
    cta: 'Create your alphabet',
    previewClass: 'idea-preview--alphabet',
  },
};

/** @returns {BookIdeaDefinition[]} */
export function getBookIdeaConceptList() {
  return Object.values(BOOK_IDEA_DEFINITIONS);
}

/** @param {string} id */
export function getBookIdeaDefinition(id) {
  return BOOK_IDEA_DEFINITIONS[id] || null;
}