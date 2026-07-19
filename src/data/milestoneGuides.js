/**
 * Milestone-month SEO guides (months 1–12).
 * Merged into guides.js — slug pattern: `{n}-month-old-milestones`
 */

const MONTH_COPY = {
  1: {
    title: '1-Month-Old Milestones',
    summary: 'The first month is about settling in — feeding rhythms, brief eye contact, and growing head control during supervised tummy time.',
    highlights: [
      'Lifts head briefly during tummy time',
      'Focuses on faces 8–12 inches away',
      'Startles at loud sounds; quiets to familiar voices',
    ],
  },
  2: {
    title: '2-Month-Old Milestones',
    summary: 'Social smiles often appear around six to eight weeks — a turning point that makes the exhaustion feel worth it.',
    highlights: [
      'First social smiles in response to you',
      'Coos and gurgles during "conversations"',
      'Follows objects with eyes across midline',
    ],
  },
  4: {
    title: '4-Month-Old Milestones',
    summary: 'Rolling, laughing, and reaching mark a shift from newborn to interactive baby.',
    highlights: [
      'May roll tummy to back',
      'Laughs out loud',
      'Reaches for toys with both hands',
    ],
  },
  5: {
    title: '5-Month-Old Milestones',
    summary: 'Babies become more intentional — batting, mouthing toys, and showing preferences for people.',
    highlights: [
      'Transfers objects between hands',
      'Bears weight on legs when supported',
      'Recognizes familiar faces from a distance',
    ],
  },
  6: {
    title: '6-Month-Old Milestones',
    summary: 'Half a year — sitting with support, babbling consonants, and often the start of solid food exploration.',
    highlights: [
      'Sits with support; may sit momentarily alone',
      'Babbles repetitive syllables (ba-ba, da-da)',
      'Shows interest in food at family meals',
    ],
  },
  7: {
    title: '7-Month-Old Milestones',
    summary: 'Mobility ramps up — rolling both ways, pivoting, and getting ready to crawl.',
    highlights: [
      'Rolls both directions',
      'Responds to own name',
      'Explores objects by shaking, banging, dropping',
    ],
  },
  8: {
    title: '8-Month-Old Milestones',
    summary: 'Many babies master sitting independently and begin scooting or crawling.',
    highlights: [
      'Sits without support',
      'Gets into hands-and-knees position',
      'Stranger awareness may increase',
    ],
  },
  9: {
    title: '9-Month-Old Milestones',
    summary: 'Pincer grasp emerges — tiny fingers picking up peas and pulling to stand at furniture.',
    highlights: [
      'Pincer grasp developing',
      'Pulls to stand',
      'Understands "no" with tone',
    ],
  },
  10: {
    title: '10-Month-Old Milestones',
    summary: 'Cruising along furniture and first words on the horizon for some babies.',
    highlights: [
      'Cruises while holding furniture',
      'Waves bye-bye or claps',
      'May say "mama" or "dada" non-specifically',
    ],
  },
  11: {
    title: '11-Month-Old Milestones',
    summary: 'Standing alone briefly and fine-tuning motor skills before the first birthday.',
    highlights: [
      'Stands alone for a few seconds',
      'Plays simple games like peek-a-boo',
      'Imitates gestures and sounds',
    ],
  },
  12: {
    title: '12-Month-Old Milestones',
    summary: 'The first birthday — many take first steps, say a word or two, and show clear personality.',
    highlights: [
      'May take first independent steps',
      'Uses one or two words with meaning',
      'Follows simple one-step commands',
    ],
  },
};

/** @param {number} month */
export function buildMilestoneGuide(month) {
  const copy = MONTH_COPY[month];
  if (!copy) return null;

  return {
    slug: `${month}-month-old-milestones`,
    title: `${copy.title}: What to Expect`,
    description: `Evidence-informed milestones for ${month}-month-old babies — physical, social, and cognitive development, plus when to call your pediatrician.`,
    category: 'Baby Development',
    icon: 'baby',
    readMinutes: 5 + (month % 3),
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending medical review',
    updated: '2026-07-02',
    milestoneMonth: month,
    intro: `${copy.summary} Development is a range, not a deadline — use this guide as a conversation starter with your pediatrician, not a checklist to rush.`,
    body: [
      {
        heading: 'Typical milestones this month',
        list: copy.highlights,
      },
      {
        heading: 'How to support development',
        list: [
          'Plenty of floor time and supervised tummy time',
          'Talk, sing, and respond to coos — back-and-forth builds language',
          'Offer safe toys at their reach to encourage exploration',
        ],
      },
      {
        heading: 'Turn this month into a story',
        paragraphs: [
          'Yarn Trails Basic lets you track milestones free forever — then turn photos into an AI-illustrated page in their flip-book. One full story is included to taste the magic.',
        ],
      },
      {
        heading: 'When to talk to your pediatrician',
        paragraphs: [
          'Reach out if you notice significant delays in social engagement, movement, feeding, or responsiveness — your instincts matter. This guide is educational only, not a diagnosis.',
        ],
      },
    ],
    relatedSlugs: month > 1 ? [`${month - 1}-month-old-milestones`] : ['3-month-old-milestones'],
  };
}

/** @returns {import('../data/guides.js').Guide[]} */
export function allMilestoneGuides() {
  return [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    .map(buildMilestoneGuide)
    .filter(Boolean);
}
