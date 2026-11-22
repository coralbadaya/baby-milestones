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
      'Focuses on faces **8–12 inches** away',
      'Startles at loud sounds; quiets to familiar voices',
    ],
  },
  2: {
    title: '2-Month-Old Milestones',
    summary: 'Social smiles often appear around **six to eight weeks** — a turning point that makes the exhaustion feel worth it.',
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
      'Stands alone for **a few seconds**',
      'Plays simple games like peek-a-boo',
      'Imitates gestures and sounds',
    ],
  },
  12: {
    title: '12-Month-Old Milestones',
    summary: 'The first birthday — many take first steps, say a word or two, and show clear personality.',
    highlights: [
      'May take first independent steps',
      'Uses **one or two words** with meaning',
      'Follows simple one-step commands',
    ],
  },
};

/** Extra editorial sections per month (~2× guide depth). */
const MONTH_BODY_EXTRA = {
  1: {
    sleepFeeding:
      'Feeding still dominates the first month — cluster nursing or formula pacing on demand is typical. Total sleep is fragmented; safe back sleeping on a firm surface applies even when naps are only **twenty minutes**.',
    social:
      'Brief eye contact during care routines builds connection. Narrate nappy changes and walks to the window — it sounds one-sided now; it is setting up back-and-forth later.',
  },
  2: {
    sleepFeeding:
      'Some families notice slightly longer night stretches; others still feed hourly. Track wet nappies and weight at visits instead of chasing a schedule screenshot from an app.',
    social:
      'Social smiling changes the emotional load — celebrate it without comparing timing to a cousin’s baby. Respond to coos with pauses so baby learns turn-taking.',
  },
  4: {
    sleepFeeding:
      'Rolling may wake babies when they practice at night. Keep the crib clear and return them to back sleep if they settle. Milk remains the core diet.',
    social:
      'Laughing, reaching, and batting turn tummy time into play. One toy at a time beats a busy gym.',
  },
  5: {
    sleepFeeding:
      'Teething discomfort can appear as drool and fuss without a tooth in sight. Offer a clean ring; avoid unproven gels unless your clinician recommends them.',
    social:
      'Preference for familiar faces is healthy — introduce new people slowly and let baby warm up.',
  },
  6: {
    sleepFeeding:
      'Interest in your plate often coincides with readiness conversations for solids. Milk feeds still anchor nutrition; solids start as small tastes.',
    social:
      'Repetitive babbling deserves your copy — repeat “ba-ba” back and vary vowels. Reading a short board book daily still helps.',
  },
  7: {
    sleepFeeding:
      'Movement burns calories — feeds may stay frequent. Offer extra contact during nap regressions tied to rolling practice.',
    social:
      'Responding to their name with a smile reinforces listening. Hide-and-reveal games reward object permanence emerging.',
  },
  8: {
    sleepFeeding:
      'Sitting practice can tire backs quickly — alternate supported sitting with floor time. Choking hazards matter more once mouthing is intentional.',
    social:
      'Stranger wariness is not bad behaviour — hold baby close and model calm hellos.',
  },
  9: {
    sleepFeeding:
      'Pulling to stand can shorten naps. Lower the crib mattress; remove bumpers and loose bedding.',
    social:
      'Gestures like reaching up when they want held are early communication — honour them when safe.',
  },
  10: {
    sleepFeeding:
      'Cruisers explore every corner — advance child-proofing before speed picks up. Snacks on the go only when already on solids and supervised.',
    social:
      'Imitate claps and waves; praise attempts, not perfection.',
  },
  11: {
    sleepFeeding:
      'Standing drops can bungle sleep schedules — stay nearby at bedtime. Iron-rich foods matter as solids expand (per clinician).',
    social:
      'Simple instructions (“give the ball”) may work with gesture support. Name emotions in plain words.',
  },
  12: {
    sleepFeeding:
      'First birthday meals are festive; still avoid choking hazards like whole grapes or hard sweets. **Cow’s milk** as a drink may be discussed at the check-up.',
    social:
      'Parallel play with adults remains the norm — toddlers learn by copying and short cooperative games.',
  },
};

const MILESTONE_GUIDE_MONTHS = new Set([1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12]);

/** @param {number} month */
function milestoneRelatedSlugs(month) {
  const slugs = [];
  if (month === 1) {
    slugs.push('2-month-old-milestones', 'newborn-dos-and-donts');
  } else if (month === 2) {
    slugs.push('1-month-old-milestones', '3-month-old-milestones');
  } else {
    const prev = month === 4 ? 2 : month - 1;
    if (MILESTONE_GUIDE_MONTHS.has(prev)) slugs.push(`${prev}-month-old-milestones`);
    if (month < 12) slugs.push(`${month + 1}-month-old-milestones`);
  }
  return slugs;
}

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
    readMinutes: 8 + (month % 3),
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending medical review',
    updated: '2026-07-02',
    milestoneMonth: month,
    intro: `${copy.summary} Development is a range, not a deadline — use this guide as a conversation starter with your pediatrician, not a checklist to rush.`,
    body: [
      {
        heading: 'Typical milestones this month',
        list: copy.highlights,
        paragraphs: [
          `${copy.summary} If your baby has not done every item on this list, compare trends over the next **two to four weeks** rather than a single afternoon.`,
        ],
      },
      {
        heading: 'Physical and motor development',
        paragraphs: [
          `${copy.highlights[0]} Supervised floor time links most motor skills this month — avoid long stretches in seats or swings that limit wriggling.`,
          'If your baby was born preterm, your pediatrician may use an adjusted age for milestones — ask which window applies.',
        ],
      },
      ...(MONTH_BODY_EXTRA[month]
        ? [
            {
              heading: 'Sleep and feeding this month',
              paragraphs: [MONTH_BODY_EXTRA[month].sleepFeeding],
            },
            {
              heading: 'Social connection and early language',
              paragraphs: [MONTH_BODY_EXTRA[month].social],
            },
          ]
        : []),
      {
        heading: 'How to support development',
        list: [
          'Plenty of floor time and supervised tummy time',
          'Talk, sing, and respond to coos — back-and-forth builds language',
          'Offer safe toys at their reach to encourage exploration',
          'Open Month ' + month + ' in My Baby for DIY ideas tied to this stage',
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
    relatedSlugs: milestoneRelatedSlugs(month),
  };
}

/** @returns {import('../data/guides.js').Guide[]} */
export function allMilestoneGuides() {
  return [1, 2, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    .map(buildMilestoneGuide)
    .filter(Boolean);
}
