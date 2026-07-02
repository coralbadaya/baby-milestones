/**
 * Core evergreen guides (non-generated).
 * @typedef {{ heading?: string, paragraphs?: string[], list?: string[] }} GuideBlock
 * @typedef {{
 *   slug: string,
 *   title: string,
 *   description: string,
 *   category: string,
 *   icon: string,
 *   readMinutes: number,
 *   author: string,
 *   reviewedBy: string,
 *   updated: string,
 *   intro: string,
 *   body: GuideBlock[],
 *   relatedSlugs?: string[],
 *   milestoneMonth?: number,
 * }} Guide
 */

/** @type {Guide[]} */
const guidesBase = [
  {
    slug: '3-month-old-milestones',
    title: '3-Month-Old Milestones: What to Expect',
    description:
      'A clear, evidence-informed look at the physical, social, and cognitive milestones most babies reach around three months — plus gentle ways to encourage them.',
    category: 'Baby Development',
    icon: 'baby',
    readMinutes: 6,
    author: 'Nestbean Editorial Team',
    reviewedBy: 'Pending medical review',
    updated: '2026-06-29',
    milestoneMonth: 3,
    intro:
      'Around the three-month mark, your baby is becoming a more social, expressive little person. Development is a range, not a race — the windows below describe what is typical, not a deadline. If something feels off, your pediatrician is always the right next call.',
    body: [
      {
        heading: 'Physical & motor',
        paragraphs: [
          'By three months, many babies have noticeably more head control and are pushing up during tummy time.',
        ],
        list: [
          'Holds head steadier when upright and during supported sitting',
          'Pushes up onto forearms during tummy time',
          'Opens and closes hands, and may bring hands to the mouth',
          'Begins to swipe at or reach toward dangling toys',
        ],
      },
      {
        heading: 'Social & emotional',
        paragraphs: [
          'This is the age of the first real social smiles — a hugely rewarding milestone for exhausted parents.',
        ],
        list: [
          'Smiles responsively when you smile or talk to them',
          'Enjoys face-to-face interaction and may "coo" back',
          'Begins to self-soothe briefly (e.g. bringing hands to mouth)',
        ],
      },
      {
        heading: 'Communication & senses',
        list: [
          'Turns head toward sounds and familiar voices',
          'Makes cooing and gurgling sounds',
          'Follows moving objects with the eyes (visual tracking)',
        ],
      },
      {
        heading: 'How to gently encourage development',
        list: [
          'Daily supervised tummy time, building up in short, frequent sessions',
          'Talk, sing, and narrate your day — back-and-forth "conversation" fuels language',
          'Offer high-contrast toys and let baby reach and bat at them',
        ],
      },
      {
        heading: 'When to talk to your pediatrician',
        paragraphs: [
          'Every baby develops on their own timeline, but mention it to your pediatrician if your baby does not respond to loud sounds, does not watch things as they move, does not smile at people, or cannot hold their head up by around three to four months. These are conversation starters, not diagnoses.',
        ],
      },
    ],
    relatedSlugs: ['first-year-vaccination-schedule'],
  },
  {
    slug: 'postpartum-recovery-week-by-week',
    title: 'Postpartum Recovery, Week by Week',
    description:
      'What physical and emotional recovery can look like in the weeks after birth — from the early days through the fourth-trimester transition.',
    category: 'Mom Care',
    icon: 'heart',
    readMinutes: 7,
    author: 'Nestbean Editorial Team',
    reviewedBy: 'Pending medical review',
    updated: '2026-06-29',
    intro:
      'The "fourth trimester" is a season of profound change for your body and mind. Recovery is not linear, and comparison is rarely helpful. This guide describes common experiences week by week — your own path may differ, and that is normal.',
    body: [
      {
        heading: 'Week 1: The early days',
        list: [
          'Bleeding (lochia) is typically heaviest now and gradually lightens',
          'Afterpains and cramping as the uterus contracts',
          'Rest is medicine — accept help and keep recovery essentials within reach',
        ],
      },
      {
        heading: 'Weeks 2–3: Settling in',
        list: [
          'Bleeding usually tapers; incision or perineal soreness eases for many',
          'Emotional ups and downs ("baby blues") are common in the first two weeks',
          'Hydration, gentle movement, and sleep when you can remain priorities',
        ],
      },
      {
        heading: 'Weeks 4–6: Finding a rhythm',
        list: [
          'Many people attend a postpartum check-up around six weeks',
          'Energy often begins to return, though fatigue can linger',
          'Discuss activity, exercise, and intimacy timelines with your provider',
        ],
      },
      {
        heading: 'Caring for your mental health',
        paragraphs: [
          'Baby blues typically fade within two weeks. Symptoms that are more intense, last longer, or interfere with daily life may signal postpartum depression or anxiety — both common and treatable. Reaching out is a sign of strength, not failure.',
        ],
      },
      {
        heading: 'When to seek urgent care',
        paragraphs: [
          'Contact your obstetric provider promptly for heavy bleeding (soaking a pad an hour), fever, severe pain, foul-smelling discharge, signs of a blood clot, or thoughts of harming yourself or your baby. For any emergency, call your local emergency number.',
        ],
      },
    ],
    relatedSlugs: ['3-month-old-milestones'],
  },
  {
    slug: 'first-year-vaccination-schedule',
    title: 'The First-Year Vaccination Schedule, Explained',
    description:
      'A plain-language overview of how routine childhood immunization schedules are structured in the first year, and how to keep track without the stress.',
    category: 'Health & Safety',
    icon: 'medical',
    readMinutes: 5,
    author: 'Nestbean Editorial Team',
    reviewedBy: 'Pending medical review',
    updated: '2026-06-29',
    intro:
      'Vaccination schedules can look intimidating on paper. This guide explains how they are organized and why timing matters. Schedules differ by country — always follow the schedule your pediatrician recommends for your family.',
    body: [
      {
        heading: 'Why the timing matters',
        paragraphs: [
          'Vaccines are scheduled to protect babies as early as it is safe and effective, often before they are likely to be exposed to a disease. Multiple doses build and reinforce immunity over time.',
        ],
      },
      {
        heading: 'How schedules are organized',
        list: [
          'By age: doses are grouped at common visit ages (e.g. birth, 6 weeks, and so on)',
          'By series: some vaccines require several doses spaced weeks or months apart',
          'By region: national bodies publish their own recommended schedules',
        ],
      },
      {
        heading: 'Staying on track without the stress',
        list: [
          'Use a tracker (like the one in this app) to log doses and see what is next',
          'Set reminders ahead of due dates so visits are easy to plan',
          'Keep a copy of the record handy for daycare, travel, and provider visits',
        ],
      },
      {
        heading: 'A note on sources',
        paragraphs: [
          'This overview is educational. For the schedule that applies to your child, rely on your pediatrician and your national immunization guidance. See our Sources page for the bodies we reference.',
        ],
      },
    ],
    relatedSlugs: ['3-month-old-milestones'],
  },
];

export default guidesBase;
