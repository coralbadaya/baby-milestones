/**
 * SEO gap guides — rhymes, lullabies, books, photoshoot, solids, Indian recipes, newborn safety.
 * Canonical URLs per docs/seo-keywords.md.
 * @type {import('./guidesBase.js').Guide[]}
 */
const contentGapGuides = [
  {
    slug: 'nursery-rhymes-for-babies',
    title: 'Nursery Rhymes for Babies — Simple Songs That Build Language',
    description:
      'Short nursery rhymes and action rhymes for babies and newborns — English favorites, how often to sing them, and why rhythm matters before words.',
    category: 'Early Years',
    icon: '1f3b5',
    readMinutes: 6,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-11-19',
    intro:
      'Baby rhymes are one of the oldest baby care tools: a few lines you can repeat while dressing, bathing, or bouncing on a knee. Nursery rhymes carry rhythm, turn-taking, and familiar faces — not a performance. This guide lists gentle rhymes for newborns through the first year and how to weave them into ordinary days.',
    body: [
      {
        heading: 'Why rhymes matter in the first year',
        paragraphs: [
          'Long before a baby says a word, they learn melody, pause, and your expression. Action rhymes — patting, tickling, lifting — add movement that matches what their brain is tracking. You do not need a long repertoire; three songs on rotation are enough.',
        ],
      },
      {
        heading: 'Classic nursery rhymes for newborns and infants',
        list: [
          'Twinkle, Twinkle, Little Star — slow, steady, good for dim light before sleep',
          'Rock-a-Bye Baby — keep the ending gentle; skip the dramatic lines if they startle',
          'Itsy Bitsy Spider — finger play once hands can track',
          'Pat-a-Cake — chest-level clapping from ~4 months',
          'The Wheels on the Bus — verses one at a time when you are fresh',
          'Round and Round the Garden — tummy or palm “round” with a tickle finish',
        ],
      },
      {
        heading: 'Action rhymes for tummy time and lap play',
        list: [
          'This Little Piggy — toes when they can reach their feet',
          'Open, Shut Them — hands opening and closing',
          'Row, Row, Row Your Boat — supported sitting, slow rock',
          'Horsey, Horsey — knee bounce only with firm neck support',
        ],
      },
      {
        heading: 'Hindi and bilingual households',
        paragraphs: [
          'Families often ask for Hindi rhymes for babies alongside English nursery rhymes. Use the languages you speak at home — consistent melody matters more than which language “counts.” Simple counting rhymes, chants, or folk songs grandparents know are ideal. Mixing languages in one verse is fine if it is how your home sounds.',
        ],
        list: [
          'Short counting or clapping rhymes in Hindi (e.g. simple “ek do” games on fingers)',
          'Lullaby-style couplets grandparents already use — pass them down rather than hunting online lists',
          'One English and one heritage-language rhyme per routine keeps both alive',
        ],
      },
      {
        heading: 'Pair rhymes with milestones and DIY play',
        paragraphs: [
          'Month pages on Yarn Trails include DIY development activities — many pair naturally with a rhyme (wheels on the bus with a cardboard car, pat-a-cake during floor play). Open My Baby and the current month for ideas. For printed milestone photos to rhyme beside each month, see the free milestone cards tool under Guides.',
        ],
      },
    ],
    relatedSlugs: ['lullabies-for-babies', 'best-books-for-babies-by-age', '3-month-old-milestones'],
  },
  {
    slug: 'lullabies-for-babies',
    title: 'Lullabies for Babies — Calm Songs for Sleep and Soothing',
    description:
      'Gentle lullabies for babies and newborns: what makes a good sleep song, short lyric ideas, and how to use lullabies without turning bedtime into a concert.',
    category: 'Early Years',
    icon: 'crescent-moon',
    readMinutes: 6,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-11-19',
    intro:
      'Lullabies for babies are less about perfect pitch than about a predictable, low, slow voice. A short lullaby — repeated the same way each night — signals that sleep is coming. This guide covers how to choose baby sleep songs, sample lullaby lyrics you can adapt, and when music helps versus when quiet is better.',
    body: [
      {
        heading: 'What makes a lullaby work',
        list: [
          'Slow tempo — slightly slower than you think you need',
          'Low volume — hum if your voice is tired',
          'Same song most nights so the melody becomes a cue',
          'Short — one or two verses, then stop while they are drowsy',
        ],
      },
      {
        heading: 'Well-known lullabies (English)',
        list: [
          'Rock-a-Bye Baby — soft ending; hold baby secure if the words mention falling',
          'Hush, Little Baby — add your own “mockingbird” lines',
          'Twinkle, Twinkle, Little Star — works as lullaby when sung slowly',
          'Somewhere Over the Rainbow — one quiet verse',
          'Brahms’s Lullaby (Wiegenlied) — hum the tune if you forget words',
        ],
      },
      {
        heading: 'Simple lullaby lyrics you can own',
        paragraphs: [
          'Original lines beat forgotten lyrics at 2 a.m. Name your baby, name the room, name one small thing from the day — then goodnight. Example pattern: “Goodnight, little [name], the day is done / Mama’s here till the morning sun.” Repeat the last two lines until breathing slows.',
        ],
      },
      {
        heading: 'Hindi lullabies and regional songs',
        paragraphs: [
          'Many families use Lori-style Hindi lullabies or regional sleep songs passed down orally. If grandparents sing one phrase on loop, adopt it — familiarity beats a new lyric sheet. Record a short clip (for your ears only) so you remember the tune when you are exhausted.',
        ],
      },
      {
        heading: 'Lullabies vs white noise',
        paragraphs: [
          'Recorded lullabies and white noise can help some babies; others need your voice. Follow safe sleep guidance: no loose cords, no device in the crib, volume low if you use a speaker across the room. If sleep is persistently difficult, talk to your pediatrician — lullabies complement care; they do not replace it.',
        ],
      },
      {
        heading: 'Mother care and rest',
        paragraphs: [
          'Singing when you are depleted is hard. It is okay to hum, delegate a song to a partner, or skip the ritual one night. Postpartum recovery and sleep hygiene for moms matter — see the mom care hub and the postpartum week-by-week guide in Yarn Trails.',
        ],
      },
    ],
    relatedSlugs: ['nursery-rhymes-for-babies', 'postpartum-recovery-week-by-week', 'newborn-dos-and-donts'],
  },
  {
    slug: 'best-books-for-babies-by-age',
    title: 'Best Books for Babies by Age — Board Books and Read-Aloud Picks',
    description:
      'Recommended books for babies and toddlers: board books for newborns, 6-month favorites, and first-year read-aloud routines that fit real parenting.',
    category: 'Early Years',
    icon: 'book-open',
    readMinutes: 7,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-11-19',
    intro:
      'The best baby books are sturdy, short, and welcome at any time of day — not only bedtime. This recommended reading list groups board books for babies by age band so you can build a small shelf instead of a library you never finish.',
    body: [
      {
        heading: 'Newborn to 3 months',
        list: [
          'High-contrast black-and-white board books — face and pattern focus',
          'One-word-per-page books — less for story, more for voice and closeness',
          'Books you enjoy reading aloud — your tone matters more than plot',
        ],
      },
      {
        heading: '4 to 6 months',
        list: [
          'Soft-touch or texture board books — safe mouthing',
          'Peek-a-boo flaps — short sessions',
          'Rhyme-heavy titles that match songs you already sing',
        ],
      },
      {
        heading: '7 to 12 months',
        list: [
          'Name-and-point books (animals, body parts, everyday objects)',
          'Sturdy flaps with simple hide-and-reveal',
          'Repetitive refrains (“again” becomes a game)',
        ],
      },
      {
        heading: '1 to 2 years',
        list: [
          'Short stories with clear pictures per action',
          'Books about routines — sleep, bath, goodbye — for emotional labeling',
          'Diverse faces and families so “book baby” looks like their world',
        ],
      },
      {
        heading: 'How to read with a baby who cannot sit still',
        paragraphs: [
          'Read one page and stop. Read during tummy time. Read while they nurse or bottle-feed. Dog-eared board books beat pristine shelves. Pair one book with one rhyme from our nursery rhymes guide for a two-minute ritual.',
        ],
      },
      {
        heading: 'Stories beyond paper',
        paragraphs: [
          'Yarn Trails Plus turns your photos and milestones into AI baby stories for the family flip-book — separate from board books, but part of the same memory habit. Basic milestone tracking stays free; Plus is optional when you want rendered pages.',
        ],
      },
    ],
    relatedSlugs: ['nursery-rhymes-for-babies', 'lullabies-for-babies', 'digital-baby-book-guide'],
  },
  {
    slug: 'baby-photoshoot-ideas-at-home',
    title: 'Baby Photoshoot Ideas at Home — Poses, Light, and Monthly Photos',
    description:
      'Baby photoshoot and newborn photography ideas at home: natural light, simple poses, monthly milestone photos, and safe DIY props — no studio required.',
    category: 'Memories',
    icon: 'camera',
    readMinutes: 8,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-11-19',
    intro:
      'Baby photography at home does not need gear — it needs soft light, a clean background, and a baby who is fed and briefly awake. These baby picture ideas focus on monthly milestone photos and honest portraits you will want in a baby book later.',
    body: [
      {
        heading: 'Light and backdrop',
        list: [
          'Stand near a large window; turn baby so light falls across the face, not into the eyes',
          'White or cream bedding, muslin, or a plain wall — avoid busy patterns for milestone photos',
          'Mid-morning or late afternoon often beats harsh noon sun',
        ],
      },
      {
        heading: 'Newborn photoshoot ideas (first 2 weeks)',
        list: [
          'Details: hands on chest, feet in your palms, eyelashes — macro from above',
          'Parent hands framing face — scale and safety',
          'Basket or bassinet only with spotters; never leave baby unattended for a setup',
        ],
      },
      {
        heading: 'Monthly baby photos (ideas by theme)',
        list: [
          'Same spot each month — blanket, chair, or crib corner for a growth series',
          'Printed milestone card with month number — free tool at /tools/milestone-cards',
          'Seasonal prop: one flower, one knit hat — one accent only',
          'Tummy-time action shot at 3–6 months',
          'Sitting milestone at ~6–9 months with pillows behind, never loose piles',
        ],
      },
      {
        heading: 'Poses that stay safe',
        paragraphs: [
          'Skip stacked props, fragile containers, or anything that could tip. Support the head always. If you want “curled” newborn poses, use a professional; at home, simple lying-on-back or on-chest shots are enough.',
        ],
      },
      {
        heading: 'Phone settings',
        list: [
          'Clean the lens; use portrait mode only if it does not blur tiny fingers',
          'Burst mode for fleeting smiles',
          'Edit for warmth, not plastic skin — slight crop beats heavy filters',
        ],
      },
      {
        heading: 'From photos to baby stories',
        paragraphs: [
          'The same monthly baby photos feed the Yarn Trails baby book on Plus — AI stories and a flip-book built from images you already take. Track milestones on Basic for free; add Plus when you want rendered pages.',
        ],
      },
    ],
    relatedSlugs: ['milestone-cards-printable', 'best-baby-book-apps-2026', '3-month-old-milestones'],
  },
  {
    slug: 'starting-solids-guide',
    title: 'Starting Solids — Baby Food Guide for the First Year',
    description:
      'When and how to start solids: baby food basics, 6-month first foods, weaning cues, and dos and don’ts — educational guidance, confirm with your pediatrician.',
    category: 'Health & Safety',
    icon: 'plate',
    readMinutes: 9,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending medical review',
    updated: '2026-11-19',
    intro:
      'Baby foods shift from milk-only to family table over months, not days. WHO and IAP commonly point to around six months for starting solids when baby shows readiness signs — but your pediatrician knows your child. This baby food guide explains first foods, textures, and safety without replacing clinical advice.',
    body: [
      {
        heading: 'Readiness signs (typical around 6 months)',
        list: [
          'Sits with minimal support and holds head steady',
          'Shows interest in food — reaching, watching you eat',
          'Lost or reduced tongue-thrust so food can stay on the tongue',
          'Can move food to the back of the mouth — start with smooth purées if unsure',
        ],
      },
      {
        heading: 'First foods to consider',
        list: [
          'Iron-rich options (fortified cereal, well-cooked legumes, soft meats as advised)',
          'Single-ingredient purées — one new food every few days to watch reactions',
          'Soft vegetables and fruits — avocado, sweet potato, banana, pear',
          'Continue breast milk or formula as the main nutrition for much of the first year',
        ],
      },
      {
        heading: 'Baby food textures over time',
        paragraphs: [
          'Move from thin purée to mashed, then soft lumps and finger foods as chewing develops. Gagging is different from choking — learn infant first aid; cut round foods lengthwise; avoid honey before 12 months, whole nuts, and choking hazards.',
        ],
      },
      {
        heading: 'Dos and don’ts for feeding',
        list: [
          'Do: offer at calm times, let baby set the pace, model eating at the table',
          'Do: watch for allergy signs and ask your clinician about common allergens',
          'Don’t: force bites, add salt or sugar to baby food, or replace milk feeds overnight without guidance',
          'Don’t: leave a baby alone with food or use phones instead of supervision',
        ],
      },
      {
        heading: 'Recipes and community',
        paragraphs: [
          'For baby food recipes and parent-tested ideas, browse Community recipes on Yarn Trails. Indian families often start with simple porridges — see our Indian baby food recipes guide for culturally familiar first foods, always adapted to your pediatrician’s plan.',
        ],
      },
    ],
    relatedSlugs: ['indian-baby-food-recipes', '6-month-old-milestones', 'newborn-dos-and-donts'],
  },
  {
    slug: 'indian-baby-food-recipes',
    title: 'Indian Baby Food Recipes — Simple First Foods and Porridges',
    description:
      'Baby food recipes for Indian families: sooji, dal, rice cereal, and vegetable khichdi ideas for 6+ months — plain first, flavors later.',
    category: 'Health & Safety',
    icon: 'plate',
    readMinutes: 8,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending medical review',
    updated: '2026-11-19',
    intro:
      'Recipes for babies in Indian households often start with smooth porridges and mild dal before spice and texture. This guide lists easy Indian baby food recipes — one ingredient at a time when possible — so you can observe how your baby tolerates each food.',
    body: [
      {
        heading: 'Principles before recipes',
        list: [
          'Introduce one new ingredient every few days',
          'Begin plain (no salt, sugar, or honey under 12 months)',
          'Add ghee or mild spice only after the base food is tolerated',
          'Texture should match development — thin porridge early, mashed later',
        ],
      },
      {
        heading: 'Sooji (rava) porridge — starter version',
        paragraphs: [
          'Cook slow: fine sooji whisked into boiling water, stirred until smooth and pourable. Cool to lukewarm. Many parents offer a plain batch first, then add a touch of ghee or mashed fruit once tolerated.',
        ],
        list: [
          '1–1.5 tbsp fine sooji',
          '1.5–2 cups water (adjust for thickness)',
          'Low flame until soft and lump-free',
        ],
      },
      {
        heading: 'Moong dal soup',
        paragraphs: [
          'Yellow moong boiled until very soft, blended with cooking water, strained for the earliest tastes. Protein-forward; discuss timing with your pediatrician.',
        ],
      },
      {
        heading: 'Rice–dal khichdi (later 6–8 months)',
        paragraphs: [
          'Equal parts rice and moong, pressure-cooked very soft, mashed with water or breast milk to thin. Skip whole spices at first; cumin or hing only if your clinician is comfortable.',
        ],
      },
      {
        heading: 'Vegetable purées',
        list: [
          'Steamed carrot, pumpkin, or bottle gourd — blended with water',
          'Mashed banana or stewed apple — no added sugar',
          'Avocado mash — iron pairing with cereal when advised',
        ],
      },
      {
        heading: 'Where to share and save recipes',
        paragraphs: [
          'Yarn Trails Community includes baby recipes from real parents — save favorites and adapt portions. Pair solids tracking with month six milestones and the starting solids guide for readiness and safety.',
        ],
      },
    ],
    relatedSlugs: ['starting-solids-guide', '6-month-old-milestones', 'first-year-vaccination-schedule'],
  },
  {
    slug: 'newborn-dos-and-donts',
    title: "Newborn Dos and Don'ts — Safety, Sleep, and Daily Baby Care",
    description:
      'Practical dos and don’ts for newborns: safe sleep, bathing, feeding, visitors, and when to call the pediatrician — educational, not a substitute for medical advice.',
    category: 'Health & Safety',
    icon: 'shield',
    readMinutes: 8,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending medical review',
    updated: '2026-11-19',
    intro:
      'Baby care in the first weeks is mostly rhythm and safety. These dos and don’ts for babies condense what pediatric authorities emphasize — so you can scan once, then ask your clinician about your situation.',
    body: [
      {
        heading: 'Sleep — dos and don’ts',
        list: [
          'Do: place baby on the back, on a firm flat sleep surface, in your room if you choose room-sharing',
          'Do: use a sleep sack instead of loose blankets',
          'Don’t: bed-share if it is not safe in your setup — follow local guidance',
          'Don’t: use pillows, bumpers, or soft toys in the crib',
        ],
      },
      {
        heading: 'Feeding',
        list: [
          'Do: feed on demand; watch wet nappies and weight with your clinician',
          'Do: support breastfeeding or safe formula prep per instructions',
          'Don’t: give water, honey, or cow’s milk as a drink in the newborn months unless advised',
          'Don’t: prop bottles or leave baby unattended while feeding',
        ],
      },
      {
        heading: 'Bathing and cord care',
        list: [
          'Do: sponge bathe until the cord falls off if that is your clinic’s advice',
          'Do: keep the cord dry and exposed to air when possible',
          'Don’t: submerge the cord early if your provider says wait',
        ],
      },
      {
        heading: 'Visitors and handling',
        list: [
          'Do: insist on hand washing; keep sick visitors away',
          'Do: support the head and neck',
          'Don’t: let anyone kiss the mouth or hands if RSV or illness is circulating',
        ],
      },
      {
        heading: 'Vaccination and checkups',
        paragraphs: [
          'Follow the schedule your pediatrician gives — in India many families use IAP/UIP references alongside clinic records. Log doses in the Yarn Trails vaccination tracker (India, CDC, or custom) and bring the app summary to visits; it does not replace the clinic card.',
        ],
      },
      {
        heading: 'When to call urgently',
        paragraphs: [
          'Same-day or emergency care for fever in a young infant per your clinic’s threshold, breathing difficulty, blue or grey skin, fewer wet nappies, refusal to feed, or extreme lethargy. Yarn Trails is educational only — see our medical disclaimer and sources.',
        ],
      },
    ],
    relatedSlugs: ['3-month-old-milestones', 'first-year-vaccination-schedule', 'postpartum-recovery-week-by-week'],
  },
];

export default contentGapGuides;