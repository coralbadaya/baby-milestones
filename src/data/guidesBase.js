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
      'What most 3-month-old babies do — physical, social, and communication milestones, plus sleep, feeding, tummy time, and when to talk to a pediatrician.',
    category: 'Baby Development',
    icon: 'baby',
    readMinutes: 11,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending medical review',
    updated: '2026-09-04',
    milestoneMonth: 3,
    intro:
      'Most 3-month-old babies are becoming more social and physically capable: steadier head control, longer face-to-face stretches, cooing, and reaching toward toys. These 3-month-old milestones describe a typical window, not a deadline. Development is a range — if something feels off, your pediatrician is the right next call.',
    body: [
      {
        heading: 'Physical & motor',
        paragraphs: [
          'By three months, many babies have noticeably more head control. The newborn “wobble” eases as neck and upper-back muscles strengthen, especially during supervised tummy time. You may see your baby push up onto the forearms, lift the chest briefly, and look around the room from that new vantage point.',
          'Hands are opening more often. Fists that stayed clenched in the first weeks begin to unfurl; many babies bring hands to the mouth and swipe or bat at dangling toys. Grasping is still early — they may close on an object placed in the palm more readily than they reach out and pick it up. Supported sitting (with your hands or a pillow nest) gives a new view of the world and works the core, but independent sitting is still months away.',
          'When held upright with support under the arms, some babies will bear a little weight on their legs. That bounce is a reflex and a workout, not a sign they are ready to stand. Keep sessions brief and stop if they fuss.',
        ],
        list: [
          'Holds head steadier when upright and during supported sitting',
          'Pushes up onto forearms during tummy time; may lift the chest',
          'Opens and closes hands, and may bring hands to the mouth',
          'Begins to swipe at or reach toward dangling toys',
          'May bear some weight on the legs when held standing with support',
        ],
      },
      {
        heading: 'Social & emotional',
        paragraphs: [
          'This is often the age of the first reliable social smile — a response to your face or voice, not only a sleep grin. For exhausted parents it can feel like the first real conversation. Many babies now enjoy a stretch of face-to-face time: they brighten, kick, and talk back with coos.',
          'Recognition is growing. Familiar people may draw a bigger reaction than strangers, even from across the room. Some babies begin to self-soothe for a few moments — hands to mouth, staring at a light, settling briefly in your arms — though they still need you for most soothing. Personality starts to show: one baby is a watcher, another a wriggler. Both are typical.',
        ],
        list: [
          'Smiles responsively when you smile or talk to them',
          'Enjoys face-to-face interaction and may coo back',
          'Recognizes familiar people, sometimes at a distance',
          'Begins to self-soothe briefly (for example, bringing hands to mouth)',
          'Shows excitement with the whole body — kicking, waving, squealing',
        ],
      },
      {
        heading: 'Communication & senses',
        paragraphs: [
          'Cooing and gurgling are the main words at three months — vowels more than consonants. Turning toward a familiar voice, quieting to your speech, and tracking a moving toy or face across the midline are the sensory skills most families notice first. Vision is still short-range compared with an adult’s, but high-contrast shapes and faces hold attention longer than they did as a newborn.',
          'Hearing is working hard. Many babies still startle at a sudden loud sound, then settle to a known voice. If your household is multilingual, keep talking in the languages you actually use. Early language is about turn-taking and melody, not a single vocabulary list.',
        ],
        list: [
          'Turns head toward sounds and familiar voices',
          'Makes cooing and gurgling sounds',
          'Follows moving objects with the eyes (visual tracking)',
          'Quiets or brightens when you speak, sing, or narrate',
        ],
      },
      {
        heading: 'Sleep at 3 months',
        paragraphs: [
          'Sleep at three months is still a moving target. Many babies take several naps and still wake to feed at night. Some night stretches lengthen; others stay short. A stretch of longer sleep is welcome when it comes — it is not a test you have failed if it has not arrived yet.',
          'Total sleep across day and night varies widely. What matters more than a number is that your baby has chances to rest, that night wakings are met without panic, and that you rest when you can. A simple bedtime rhythm — dim light, a feed, a short book or song, then sleep — can start now even if nights are still broken. Consistency helps more than a perfect clock.',
          'A “sleep regression” around this age is talked about often. Growth, more awareness of the room, and shifting nap needs can all fragment sleep for a stretch. Treat it as a season, not a diagnosis. Safe sleep stays the same: baby on their back, on a firm flat surface, with no loose bedding, in a smoke-free space. If breathing, color, or feeding worries you, call your pediatrician rather than waiting it out.',
        ],
      },
      {
        heading: 'Feeding at 3 months',
        paragraphs: [
          'At three months, milk is still the whole diet. The World Health Organization and the Indian Academy of Pediatrics recommend exclusive milk feeding — breast milk, infant formula, or a combination — until around six months, unless your pediatrician advises otherwise. Water, juice, and solids are not needed at this age for a healthy term baby.',
          'Feeds may look more rhythmic than in the newborn weeks: some babies go longer between daytime feeds; cluster feeding in the evening can still happen. Wet nappies, alert periods, and following their growth curve matter more than ounces on a given day. If you are breastfeeding, supply often feels more settled by now; if you are formula feeding, follow the preparation on the tin and your pediatrician’s guidance — do not dilute to “make it last.”',
          'Drooling often increases around three months. It is usually not first teeth; it is more saliva and more hands in the mouth. Offer a clean cloth and extra shirt changes. If feeding is painful, baby is not gaining, or you see fewer wet nappies, talk to your pediatrician or lactation specialist rather than waiting for the next scheduled visit.',
        ],
      },
      {
        heading: 'Well-baby visits and vaccines around 3 months',
        paragraphs: [
          'Three months often sits between routine well-baby visits rather than on a single “month 3” appointment. In India, IAP/UIP-style schedules commonly include doses around 10 weeks and 14 weeks — including OPV, pentavalent, rotavirus, and, at 14 weeks, IPV, with some extra vaccines marked optional on the private schedule. Other countries group visits at two and four months. The exact list is your pediatrician’s, not a webpage’s.',
          'Use those visits to ask about head control, smiles, feeding, and sleep — not only injections. Bring a note of what you have noticed. Yarn Trails can help you see what is typically due next; it does not replace the record in your clinic book. For a tracker with India IAP/UIP, CDC, or a custom schedule, open the vaccination page in this app.',
        ],
      },
      {
        heading: 'How to gently encourage development',
        paragraphs: [
          'You do not need a curriculum. Short, repeated, supervised play is enough. Tummy time is the main exercise: several brief sessions while the baby is awake and watched, building up as they tolerate it. If they protest, try tummy-to-chest on your body, a rolled towel under the arms, or a face they already love at floor level. Stop before they are exhausted.',
          'Talk more than you think you need to. Narrate the nappy, the kettle, the walk to the window. Pause so they can coo back. Songs and simple rhymes carry rhythm even when you are tired of your own voice. High-contrast cards or a simple dangling toy give something to track and swipe at — one or two objects, not a pile.',
        ],
        list: [
          'Daily supervised tummy time, in short, frequent sessions',
          'Talk, sing, and narrate — back-and-forth conversation fuels language',
          'Offer one high-contrast or easy-to-bat toy at a time',
          'Supported sitting and lap standing in brief, held sessions',
          'Peek-a-boo and funny faces once social smiling is underway',
        ],
      },
      {
        heading: 'When to talk to your pediatrician',
        paragraphs: [
          'Every baby develops on their own timeline. Mention it to your pediatrician if, around three to four months, your baby does not smile at people, does not watch things as they move, does not respond to loud sounds, cannot support their head well, or does not grasp or hold objects. These match common Watch For notes at this age — they are conversation starters, not diagnoses.',
          'Seek care the same day for breathing difficulty, a colour change that worries you, a fever in a young infant as your clinic has defined it, fewer wet nappies, or a baby who is unusually floppy, inconsolable, or hard to wake. For any emergency, call your local emergency number. Yarn Trails is educational only.',
        ],
      },
      {
        heading: 'Where this guidance comes from',
        paragraphs: [
          'Milestone windows on Yarn Trails are written from recognized authorities such as the WHO, CDC, AAP, and IAP — and from how those bodies describe ranges, not races. Country schedules and screening tools differ; your pediatrician applies them to your child. See our Sources & citations page for the publications we reference, and the medical disclaimer for the limits of this guide.',
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
    author: 'Yarn Trails Editorial Team',
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
    author: 'Yarn Trails Editorial Team',
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
