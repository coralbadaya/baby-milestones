/**
 * Second-pass body sections for competitive head-term guides (~2× depth).
 * @type {Record<string, import('./guidesBase.js').GuideBlock[]>}
 */
export const CONTENT_GAP_EXTRA_SECTIONS = {
  'nursery-rhymes-for-babies': [
    {
      heading: 'Rhymes for bedtime vs playtime',
      paragraphs: [
        'Bedtime rhymes stay slow and predictable — the same two lines every night. Playtime rhymes can be faster: pat-a-cake, horsey bounce, itsy bitsy spider with big gestures. Splitting roles helps a tired parent at 7 p.m. without losing richness during the day.',
        'If your baby startles at loud verses, hum the melody or drop the last verse. Consistency beats drama.',
      ],
    },
    {
      heading: 'Building language without flashcards',
      paragraphs: [
        'Nursery rhymes are not vocabulary drills. Pair a song with real objects — a real bus on a walk after “wheels on the bus,” or socks during “this little piggy.” Narrate what you already do; rhymes are punctuation on ordinary care.',
      ],
    },
  ],
  'lullabies-for-babies': [
    {
      heading: 'Partner and caregiver routines',
      paragraphs: [
        'Any consistent caregiver can carry the lullaby — partner, grandparent, or night nurse. Use one shared song across shifts so the cue stays reliable even when the voice changes.',
      ],
    },
    {
      heading: 'When to skip the song',
      paragraphs: [
        'Overstimulated babies may need dim light and stillness instead of another verse. A hand on the chest and slow breathing sometimes works faster than music. You are not failing the routine — you are reading the room.',
      ],
    },
  ],
  'best-books-for-babies-by-age': [
    {
      heading: 'Library habits that stick',
      paragraphs: [
        'Keep three books visible where you already sit — nursing chair, change table, car door pocket. Rotate weekly; do not buy shelves full at once. Babies prefer worn corners and familiar pages.',
      ],
    },
    {
      heading: 'Multilingual and heritage-language books',
      paragraphs: [
        'If you speak more than one language at home, board books in each language reinforce rhythm and family identity. Alternating a page in Hindi and English on the same cushion is fine when that mirrors how you speak day to day.',
      ],
    },
  ],
  'baby-photoshoot-ideas-at-home': [
    {
      heading: 'Editing and sharing safely',
      paragraphs: [
        'Crop for intimacy — tight on hands, eyelashes, or a yawn — rather than heavy skin smoothing. Avoid posting location or hospital details publicly if you prefer privacy; milestone cards in-frame are enough context for grandparents.',
      ],
    },
    {
      heading: 'Seasonal series without clutter',
      paragraphs: [
        'One seasonal accent per month (a leaf, a knit hat, a festival colour) keeps a year gallery coherent. Store props in one small box so setup stays under five minutes — sustainability beats a new Etsy theme every four weeks.',
      ],
    },
  ],
  'starting-solids-guide': [
    {
      heading: 'Allergenic foods — how guidance evolved',
      paragraphs: [
        'Many paediatric groups now introduce common allergens during infancy under clinical guidance, rather than delaying for years. Discuss peanuts, egg, and dairy with your pediatrician for timing and form (puree vs finger). Watch for hives, vomiting, or breathing changes; seek care for emergencies.',
      ],
    },
    {
      heading: 'Baby-led weaning vs spoon feeding',
      paragraphs: [
        'Some families spoon-feed purées; others offer soft strips for self-feeding. Hybrids are common — purées at daycare, fingers at home. Match texture to gagging skills and never leave a baby alone with food.',
      ],
      list: [
        'Start with low-stakes foods you can mash with a fork',
        'Sit baby upright with hips at 90°',
        'Offer iron-rich foods early as your clinician advises',
        'Keep milk feeds primary for much of the first year',
      ],
    },
    {
      heading: 'India-specific starting solids notes',
      paragraphs: [
        'Families often begin with rice cereal, moong dal, or smooth sooji before spices. Plain first, flavours later — see the Indian baby food recipes guide for culturally familiar starters.',
      ],
    },
  ],
  'indian-baby-food-recipes': [
    {
      heading: 'Portions and frequency',
      paragraphs: [
        'Early solids are tasting sessions — a few teaspoons once or twice a day after a milk feed, not replacing bottles abruptly. Increase slowly as your pediatrician and baby’s appetite allow.',
      ],
    },
    {
      heading: 'Allergy watch for common Indian staples',
      paragraphs: [
        'Dal, wheat sooji, and dairy ghee are frequent staples. Introduce one at a time; note rash, diarrhoea, or fussiness. Emergency care for breathing difficulty or swelling.',
      ],
    },
    {
      heading: 'Freezer and meal-prep safety',
      paragraphs: [
        'Freeze small portions in ice trays; thaw one cube fully and reheat to steaming hot, then cool to lukewarm. Discard leftovers from the baby’s bowl — saliva breaks food faster.',
      ],
    },
  ],
  'newborn-dos-and-donts': [
    {
      heading: 'Travel and outings in the first weeks',
      paragraphs: [
        'Short walks and car trips are fine when baby is buckled correctly and weather allows. Avoid crowded indoor spaces when RSV or flu circulate; dress in layers rather than thick blankets in the car seat.',
      ],
    },
    {
      heading: 'Screen time and overstimulation',
      paragraphs: [
        'Background TV is still sensory load for newborns. Face-to-face talking and high-contrast books beat passive video in the first year. There is no educational app that replaces contact.',
      ],
    },
    {
      heading: 'When instincts beat the internet',
      paragraphs: [
        'Persistent worry about feeding, breathing, colour, or responsiveness warrants a call — even if checklist blogs say “wait.” Yarn Trails educates; your pediatrician triages.',
      ],
    },
  ],
};

/** @param {import('./guidesBase.js').Guide} guide */
export function applyContentGapExpansion(guide) {
  const extra = CONTENT_GAP_EXTRA_SECTIONS[guide.slug];
  if (!extra?.length) return guide;
  return {
    ...guide,
    readMinutes: Math.min(guide.readMinutes + 4, 18),
    body: [...(guide.body || []), ...extra],
  };
}