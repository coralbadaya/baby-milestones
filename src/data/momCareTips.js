export const MOM_CARE_TIMELINE_TAB = 'timeline';

export const MOM_CARE_CATEGORIES = [
  'mentalHealth',
  'recovery',
  'pelvicFloor',
  'cSection',
  'sleep',
  'posture',
  'nippleCare',
  'supplements',
  'boneDensity',
  'nutrition',
  'hydration',
  'exercise',
  'walking',
  'massage',
  'hairLoss',
  'stretchMarks',
];

/** Tab order: timeline first, then topic categories */
export const MOM_CARE_TAB_IDS = [MOM_CARE_TIMELINE_TAB, ...MOM_CARE_CATEGORIES];

export const momCareCategoryConfig = {
  [MOM_CARE_TIMELINE_TAB]: {
    id: MOM_CARE_TIMELINE_TAB,
    label: 'Timeline',
    icon: 'calendar',
    color: '#9B88C0',
    bg: '#E8E0F0',
    description: 'Your postpartum milestones week by week — what to expect and when to check in with your doctor.',
  },
  mentalHealth: {
    id: 'mentalHealth',
    label: 'Mental Health',
    icon: 'brain',
    color: '#9B88C0',
    bg: '#E8E0F0',
    description: 'Baby blues, postpartum depression, anxiety — what\u2019s normal and when to get help.',
  },
  pelvicFloor: {
    id: 'pelvicFloor',
    label: 'Pelvic Floor',
    icon: 'flexed-bicep',
    color: '#D88090',
    bg: '#F8D4D8',
    description: 'Rebuild your core foundation — Kegels, diastasis recti, and incontinence recovery.',
  },
  cSection: {
    id: 'cSection',
    label: 'C-Section Care',
    icon: 'stethoscope',
    color: '#5A9FD8',
    bg: '#D6E9F8',
    description: 'Incision healing, scar care, and a realistic recovery timeline after cesarean birth.',
  },
  sleep: {
    id: 'sleep',
    label: 'Your Sleep',
    icon: 'crescent-moon',
    color: '#9B88C0',
    bg: '#E8E0F0',
    description: 'Protect your rest — practical strategies for the most sleep-deprived time of your life.',
  },
  hairLoss: {
    id: 'hairLoss',
    label: 'Hair Loss',
    icon: 'sparkles',
    color: '#C8A840',
    bg: '#F8ECC0',
    description: 'Why your hair is falling out, when it stops, and what actually helps.',
  },
  posture: {
    id: 'posture',
    label: 'Posture',
    icon: '1f9cd',
    color: '#5A9FD8',
    bg: '#D6E9F8',
    description: 'Correct postpartum posture for feeding, carrying, and everyday life.',
  },
  nippleCare: {
    id: 'nippleCare',
    label: 'Nipple Care',
    icon: '1f931',
    color: '#D88090',
    bg: '#F8D4D8',
    description: 'Prevent and heal soreness, cracks, and discomfort while breastfeeding.',
  },
  supplements: {
    id: 'supplements',
    label: 'Supplements',
    icon: 'medical',
    color: '#9B88C0',
    bg: '#E8E0F0',
    description: 'What to take, when to take it, and what to space apart.',
  },
  boneDensity: {
    id: 'boneDensity',
    label: 'Bone Density',
    icon: 'flexed-bicep',
    color: '#C8A840',
    bg: '#F8ECC0',
    description: 'Protect your bones during and after pregnancy and breastfeeding.',
  },
  stretchMarks: {
    id: 'stretchMarks',
    label: 'Stretch Marks',
    icon: 'lotion',
    color: '#D88090',
    bg: '#F8D4D8',
    description: 'Realistic strategies to fade marks and restore skin texture.',
  },
  hydration: {
    id: 'hydration',
    label: 'Hydration',
    icon: '1f4a7',
    color: '#5A9FD8',
    bg: '#D6E9F8',
    description: 'How much fluid you really need and how to stay on track.',
  },
  nutrition: {
    id: 'nutrition',
    label: 'Food & Nutrition',
    icon: 'plate',
    color: '#5FB878',
    bg: '#D4ECD9',
    description: 'Postpartum food guidance for healing, energy, and milk supply.',
  },
  exercise: {
    id: 'exercise',
    label: 'Exercise',
    icon: '1f3c3',
    color: '#E89060',
    bg: '#FFD5C2',
    description: 'Safe prenatal and postnatal exercises by recovery stage.',
  },
  recovery: {
    id: 'recovery',
    label: 'Recovery',
    icon: 'sparkles',
    color: '#9B88C0',
    bg: '#E8E0F0',
    description: 'Postpartum healing timeline and what to expect at each stage.',
  },
  massage: {
    id: 'massage',
    label: 'Massage',
    icon: 'palms-up',
    color: '#C8A840',
    bg: '#F8ECC0',
    description: 'Postpartum massage benefits, techniques, and when to start.',
  },
  walking: {
    id: 'walking',
    label: 'Brisk Walks',
    icon: '1f6b6',
    color: '#5FB878',
    bg: '#D4ECD9',
    description: 'The easiest, most effective postpartum exercise you can start right away.',
  },
};

export const momCareTips = {
  mentalHealth: {
    title: 'Mental Health',
    subtitle: 'Your emotional recovery is just as real as the physical one',
    sections: [
      {
        heading: 'Baby blues vs. postpartum depression',
        items: [
          'Baby blues affect 50\u201380% of new parents — mood swings, tearfulness, irritability, and anxiety in the first 1\u20132 weeks. This is normal and resolves on its own.',
          'Postpartum depression (PPD) is more intense, lasts longer than 2 weeks, and does not improve without support. It affects roughly 1 in 7 new parents.',
          'PPD is not a character flaw or weakness \u2014 it\u2019s a medical condition caused by hormonal shifts, sleep deprivation, and the massive life change of new parenthood.',
        ],
      },
      {
        heading: 'Signs to watch for',
        items: [
          'Persistent sadness, emptiness, or hopelessness most of the day, nearly every day, for more than 2 weeks.',
          'Difficulty bonding with your baby, or feeling detached or numb toward them.',
          'Severe anxiety, racing thoughts, or panic attacks.',
          'Loss of interest in things you used to enjoy. Withdrawing from loved ones.',
          'Difficulty sleeping even when baby is asleep, or sleeping excessively.',
          'Thoughts of harming yourself or your baby \u2014 seek immediate help.',
        ],
      },
      {
        heading: 'Postpartum anxiety',
        items: [
          'Equally or more common than PPD but gets less attention.',
          'Constant worry about the baby\u2019s safety, health, or your own adequacy as a parent.',
          'Physical symptoms: racing heart, tight chest, difficulty breathing, nausea, insomnia.',
          'Can occur alongside PPD or independently. Both are treatable.',
        ],
      },
      {
        heading: 'What helps',
        items: [
          'Talk therapy (CBT or interpersonal therapy) is the first-line treatment with strong evidence.',
          'Medication: SSRIs like sertraline are safe during breastfeeding and highly effective.',
          'Sleep protection: Arranging 4\u20136 consecutive hours of uninterrupted sleep can improve symptoms within days.',
          'Peer support groups reduce isolation \u2014 connecting with other parents going through the same thing.',
          'Partner involvement: Educating your partner about PPD and increasing practical support improves outcomes.',
          'Daily sunlight, gentle movement, and social connection all have measurable impact on mood.',
        ],
      },
      {
        heading: 'When to reach out',
        items: [
          'If symptoms last more than 2 weeks or are getting worse, not better.',
          'If you\u2019re unable to care for yourself or your baby.',
          'If you experience confusion, hallucinations, or unusual beliefs \u2014 this may be postpartum psychosis, a medical emergency.',
          'Postpartum Support International helpline: 1-800-944-4773 (US) or text "HELP" to 988.',
          'iCall (India): 9152987821. Vandrevala Foundation: 1860-2662-345.',
        ],
      },
    ],
  },

  pelvicFloor: {
    title: 'Pelvic Floor Recovery',
    subtitle: 'The invisible muscles that support everything \u2014 here\u2019s how to rebuild them',
    sections: [
      {
        heading: 'What happened to your pelvic floor',
        items: [
          'Pregnancy and birth (vaginal and cesarean) place tremendous stress on the pelvic floor muscles that support your bladder, uterus, and bowel.',
          'Diastasis recti (abdominal separation) affects 60\u2013100% of women immediately after birth. The gap usually narrows over time with proper exercises.',
          'Significant pelvic floor recovery happens in the first 3\u20136 months, but some women need up to 12 months.',
        ],
      },
      {
        heading: 'Starting with breath',
        items: [
          '360-degree diaphragmatic breathing is step one \u2014 it naturally coordinates your diaphragm and pelvic floor.',
          'Breathe fully into your belly, sides, and back ribs. On exhale, feel a gentle lift in the pelvic floor.',
          'This breath-pelvic floor connection is the foundation before any strengthening exercise.',
        ],
      },
      {
        heading: 'Pelvic floor activations (Kegels done right)',
        items: [
          'The "stop-the-flow" cue only targets the front of the pelvic floor. A full activation involves all four attachment points.',
          'Visualize lifting from the coccyx to pubic bone, drawing inward and upward along the midline.',
          'The release phase is equally important as the squeeze \u2014 your pelvic floor needs full range of motion.',
          'Early postpartum: Gentle 1-second holds, 5 reps, 5 times daily. Gradually build to longer holds.',
        ],
      },
      {
        heading: 'Diastasis recti exercises',
        items: [
          'Avoid crunches, sit-ups, and full planks early on \u2014 they increase abdominal pressure and can worsen the gap.',
          'Start with: posterior pelvic tilts, heel slides, toe taps, and glute bridges.',
          'Progress to: cat-cow, modified side planks, bird-dogs, then wall mountain climbers.',
          'Train the transverse abdominis first, obliques second, rectus abdominis last.',
          'Most women see significant improvement in 8 weeks to 6 months with consistent work.',
        ],
      },
      {
        heading: 'When to see a pelvic floor physio',
        items: [
          'Urinary or fecal leaking (even small amounts) that persists beyond 6 weeks.',
          'Pelvic pain during movement, exercise, or intimacy.',
          'Feeling of heaviness or pressure suggesting prolapse.',
          'Inability to identify or activate your pelvic floor muscles.',
          'A pelvic floor PT assessment benefits all postpartum mothers, not just those with symptoms.',
        ],
      },
    ],
  },

  cSection: {
    title: 'C-Section Recovery',
    subtitle: 'A major surgery that deserves major care \u2014 your healing timeline',
    sections: [
      {
        heading: 'What to expect',
        items: [
          'A C-section cuts through multiple layers: skin, fat, fascia, and the uterine wall. The incision is typically 4\u20136 inches above the pubic bone.',
          'Hospital stay: 2\u20134 days after surgery.',
          'Skin closure at 2\u20133 weeks. Full internal healing: 6\u201312 weeks. Scar maturation: up to 12\u201318 months.',
        ],
      },
      {
        heading: 'Weeks 1\u20132: Acute recovery',
        items: [
          'Pain, swelling, bruising, and fatigue are normal. You may need help standing, sitting, and getting out of bed.',
          'Take prescribed pain medication on schedule \u2014 don\u2019t wait for pain to build.',
          'Avoid lifting anything heavier than your baby for 6 weeks.',
          'Gentle walking around the house prevents blood clots and aids circulation. Move slowly.',
          'Keep the incision clean and dry. Pat dry after showering \u2014 don\u2019t rub.',
        ],
      },
      {
        heading: 'Weeks 3\u20136: Gradual healing',
        items: [
          'Pain decreases significantly. Itching around the incision is a sign of healing \u2014 don\u2019t scratch.',
          'Stitches/staples typically dissolve or are removed by week 2\u20133.',
          'Light walking can increase. Avoid stairs if painful.',
          'No driving until you can emergency-brake without pain (usually 2\u20133 weeks, check with your provider).',
          'Internal healing continues even when the outside looks closed.',
        ],
      },
      {
        heading: 'Scar care (after provider clearance)',
        items: [
          'Begin gentle scar massage only after your provider confirms the incision is fully closed (usually 6 weeks).',
          'Use vitamin E oil, almond oil, or silicone gel. Small circles directly over and around the scar, 5\u201310 minutes, a few times weekly.',
          'Massage breaks down adhesions (internal scar tissue that can stick together and cause pulling or tightness).',
          'The scar will gradually flatten and fade from red/purple to silver/white over 12\u201318 months.',
          'Silicone scar sheets can help with raised or keloid scarring.',
        ],
      },
      {
        heading: 'Warning signs \u2014 call your provider',
        items: [
          'Fever above 100.4\u00b0F (38\u00b0C).',
          'Foul-smelling discharge from the incision.',
          'Increasing redness, swelling, or warmth around the wound.',
          'Separation of the wound edges.',
          'Heavy vaginal bleeding (soaking a pad in an hour) or large clots.',
        ],
      },
    ],
  },

  sleep: {
    title: 'Your Sleep',
    subtitle: 'You\u2019re not failing at sleep \u2014 here\u2019s how to protect the rest you can get',
    sections: [
      {
        heading: 'Why this is so hard',
        items: [
          'Postpartum exhaustion isn\u2019t just sleep deprivation \u2014 it\u2019s healing + hormones + constant vigilance + responsibility, all at once.',
          'Your nervous system may be stuck in "high alert" mode, making it hard to fall asleep even when baby is sleeping.',
          'Sleep fragmentation (being woken repeatedly) is actually more harmful than fewer total hours of sleep.',
        ],
      },
      {
        heading: 'The #1 strategy: Protect one solid block',
        items: [
          'One uninterrupted 4\u20135 hour stretch matters more than total hours. This can improve mood symptoms within 2\u20133 days.',
          'Split overnight duties: You sleep 9pm\u20132am while your partner handles feeds with pumped milk or formula. Then swap.',
          'This isn\u2019t selfish \u2014 research shows this single change significantly reduces postpartum depression risk.',
          'Supplementing with formula for 1\u20132 night feeds to enable a sleep block is a completely valid, evidence-supported choice.',
        ],
      },
      {
        heading: 'Sleep hygiene for new parents',
        items: [
          'Cool, dark, quiet room. Use blackout curtains, white noise, and earplugs when someone else is on baby duty.',
          'Morning sunlight exposure helps reset your circadian rhythm \u2014 even 10 minutes outdoors matters.',
          'Limit caffeine to before noon.',
          'Create a 15\u201320 minute wind-down buffer: dim lights, gentle stretching, write down anxious thoughts.',
          'Keep water, snacks, breast pads, and everything you need within reach to minimize getting up.',
        ],
      },
      {
        heading: 'Napping and resting',
        items: [
          'Keep naps to 20\u201330 minutes earlier in the day to avoid disrupting nighttime sleep.',
          'If you can\u2019t sleep during a nap window, still lie down. Rest without sleep counts \u2014 it helps your nervous system.',
          'Replace "I must sleep" with "I\u2019m allowed to rest." Removing pressure actually makes sleep easier.',
          'Yoga Nidra (guided rest meditation) can reach a deeply restorative state even without full sleep.',
        ],
      },
      {
        heading: 'When it might be insomnia',
        items: [
          'If you consistently cannot fall or stay asleep even when you have the opportunity, you may have postpartum insomnia.',
          'CBT-I (Cognitive Behavioral Therapy for Insomnia) is the gold-standard non-medication treatment. It works.',
          'Magnesium in the evening may support relaxation (with provider guidance).',
          'If exhaustion is significantly affecting your mood, daily function, or bonding with baby \u2014 talk to your doctor.',
        ],
      },
    ],
  },

  hairLoss: {
    title: 'Hair Loss',
    subtitle: 'It\u2019s alarming but temporary \u2014 your hair is coming back',
    sections: [
      {
        heading: 'What\u2019s happening',
        items: [
          'During pregnancy, high estrogen keeps hair in its growth phase \u2014 your hair looks thicker than ever.',
          'After delivery, estrogen drops sharply. All those "held" hairs shift into the shedding phase at once. This is called telogen effluvium.',
          'It\u2019s not hair loss from damage or deficiency \u2014 it\u2019s a normal hormonal reset that pregnancy paused.',
        ],
      },
      {
        heading: 'Timeline',
        items: [
          'Shedding typically begins 2\u20134 months after delivery.',
          'Peaks between months 4 and 6 \u2014 this is when it feels most alarming.',
          'Gradually slows by 6\u20139 months postpartum.',
          'Hair growth normalizes by 12 months for most women. Full thickness may take a bit longer to return.',
        ],
      },
      {
        heading: 'What actually helps',
        items: [
          'Continue your prenatal vitamin through the first 6\u201312 months of breastfeeding.',
          'Eat protein-rich foods \u2014 hair is made of protein. Eggs, lean meat, lentils, fish, nuts.',
          'Iron-rich foods: spinach, red meat, lentils, dates. Low iron worsens shedding.',
          'Be gentle with your hair: avoid tight hairstyles, excessive heat styling, and harsh chemical treatments.',
          'A weekly oil massage can feel therapeutic even if it doesn\u2019t speed regrowth.',
        ],
      },
      {
        heading: 'What doesn\u2019t help (despite marketing)',
        items: [
          'Biotin supplements: No clinical evidence they shorten postpartum hair loss unless you have a rare deficiency.',
          'Important: High-dose biotin interferes with thyroid and cardiac blood tests \u2014 always inform your doctor if you\u2019re taking it.',
          'Generic "hair growth" supplements: Correcting a specific deficiency (iron, D, B12) is more effective than broad supplements.',
          'Minoxidil: Not safe during breastfeeding. Even after weaning, it may temporarily worsen shedding before helping.',
        ],
      },
      {
        heading: 'When to see a doctor',
        items: [
          'Heavy shedding that persists beyond 12 months.',
          'Bald patches or thinning that doesn\u2019t improve.',
          'Ask for bloodwork: ferritin (iron stores), thyroid function (TSH/T4), vitamin D, and B12.',
          'Postpartum thyroiditis affects 5\u201310% of women and can cause hair loss independently of telogen effluvium.',
        ],
      },
    ],
  },

  posture: {
    title: 'Posture Correction',
    subtitle: 'Undo the "breastfeeding hunch" and protect your spine',
    sections: [
      {
        heading: 'Why posture changes postpartum',
        items: [
          'Nursing, bottle-feeding, and carrying baby create a forward-rounded position that strains the upper back, neck, and shoulders.',
          '8–12 daily feeds in a hunched position adds up fast — "breastfeeding back" is one of the most common postpartum complaints.',
          'Pregnancy itself shifts your center of gravity and weakens core muscles, leaving your spine less supported.',
        ],
      },
      {
        heading: 'The golden rule',
        items: [
          'Bring baby to your body — never lean your body down to baby. Use nursing pillows to bring baby up to breast level.',
          'Sit in chairs with good back support. Place a pillow behind your lower back if needed.',
          'Alternate the hip you carry baby on — favoring one side creates muscle imbalances.',
        ],
      },
      {
        heading: 'Exercises that help',
        items: [
          'Chin tucks: Gently draw your head straight back, aligning ears over shoulders. Hold 5 seconds, repeat 10 times.',
          'Doorway chest stretch: Arms on the doorframe at 90 degrees, step forward to open tight chest muscles. Hold 30 seconds.',
          'Shoulder blade squeezes: Pinch shoulder blades together, hold 5 seconds. Build to 15 reps, 2–3 times daily.',
          'Thoracic extensions: Use a foam roller or rolled towel under your upper back and gently arch backward.',
          'Diaphragmatic breathing: Breathe fully into belly and lower ribs — this activates the deep core and releases upper-body tension.',
        ],
      },
      {
        heading: 'When to see a specialist',
        items: [
          'If pain persists beyond 8 weeks, includes numbness, radiating pain, or headaches — see a pelvic floor physical therapist.',
          'Diastasis recti (abdominal separation) should be checked before starting any core program.',
        ],
      },
    ],
  },

  nippleCare: {
    title: 'Nipple Care',
    subtitle: 'Prevent and heal soreness for comfortable breastfeeding',
    sections: [
      {
        heading: 'Root causes of soreness',
        items: [
          'Shallow latch is the #1 cause — baby should take a wide mouthful of breast, not just the nipple.',
          'Body tension in baby (tight jaw, torticollis) can prevent a deep latch.',
          'Engorgement makes it harder for baby to latch deeply — try hand expression first to soften.',
          'Pump flange that\u2019s too small or suction set too high causes mechanical trauma.',
        ],
      },
      {
        heading: 'Prevention',
        items: [
          'Get latch assessed by a lactation consultant (IBCLC) in the first week — early correction prevents chronic damage.',
          'Break suction properly before unlatching — insert a clean finger into the corner of baby\u2019s mouth.',
          'Vary feeding positions (cradle, cross-cradle, football, side-lying) to distribute pressure.',
          'Apply a few drops of expressed breast milk on nipples after feeds and let air dry.',
        ],
      },
      {
        heading: 'Healing existing cracks',
        items: [
          'Keep wounds covered with hydrogel pads (for dry, superficial cracks) — they cool and maintain moisture balance.',
          'Medical-grade lanolin creates a moisture barrier and prevents wounds from sticking to breast pads.',
          'Olive oil and coconut oil are evidence-supported natural alternatives.',
          'Allow air exposure when possible between feeds — over-hydration can delay healing too.',
          'Avoid APNO (all-purpose nipple ointment) unless prescribed by a provider who has assessed you.',
        ],
      },
      {
        heading: 'When to seek help',
        items: [
          'Pain that worsens over time, not improving after 7–10 days of correct care.',
          'Fever or spreading redness around the nipple — may indicate infection (mastitis).',
          'Persistent pain despite latch correction — ask about tongue tie evaluation for baby.',
        ],
      },
    ],
  },

  supplements: {
    title: 'Supplement Timing',
    subtitle: 'What to take, when, and what to keep apart',
    sections: [
      {
        heading: 'The big three postpartum',
        items: [
          'Iron: Rebuilds blood lost during delivery. The fatigue you feel is partly low hemoglobin, not just sleep deprivation.',
          'Vitamin D3: Drops significantly during pregnancy. Most urban women need supplementation regardless of season.',
          'Omega-3 DHA: Baby draws heavily from maternal stores during the third trimester and breastfeeding — linked to mood stability and brain fog.',
        ],
      },
      {
        heading: 'Optimal timing',
        items: [
          'Morning, empty stomach: Iron + Vitamin C (orange juice or amla) — doubles absorption. Delay coffee/tea by 1 hour.',
          'With a fat-containing meal: Vitamin D3 and Omega-3 DHA — fat-soluble, absorbed best with food.',
          'Evening: Magnesium (if taking) — supports relaxation and sleep quality.',
          'Divided through the day: Calcium in smaller doses (500 mg or less) — absorbed better this way.',
        ],
      },
      {
        heading: 'What to keep apart (2-hour gap)',
        items: [
          'Iron + Calcium: Compete for absorption in the gut.',
          'Iron + Zinc: Same transport competition.',
          'Iron + Coffee/Tea: Tannins significantly inhibit iron absorption.',
          'Thyroid medication + Iron or Calcium: Reduces thyroid med absorption by up to 40%.',
        ],
      },
      {
        heading: 'Good combinations',
        items: [
          'Vitamin C + Iron: C enhances non-heme iron absorption significantly.',
          'Vitamin D + Vitamin K2: Work together to optimize calcium delivery to bones.',
          'Vitamin A + Iron: Especially powerful for addressing anemia.',
        ],
      },
      {
        heading: 'Important notes',
        items: [
          'Iron should only be taken if blood tests confirm a deficiency — don\u2019t self-prescribe.',
          'If iron causes nausea, try alternate-day dosing — research shows equal absorption with fewer side effects.',
          'Vegetarian/vegan mothers: B12 supplementation is critical — breast milk B12 directly reflects maternal levels.',
          'Start supplements from day 1 postpartum if tolerated. Gummy format works if tablets cause nausea.',
        ],
      },
    ],
  },

  boneDensity: {
    title: 'Bone Density',
    subtitle: 'Your skeleton is a temporary mineral bank for baby — here\'s how to rebuild',
    sections: [
      {
        heading: 'What happens to your bones',
        items: [
          'During pregnancy and breastfeeding, your body borrows calcium from your bones to supply baby — your skeleton acts as a "mineral bank."',
          'Research shows 5–10% bone density loss from the spine in the first 6 months postpartum.',
          'The good news: bone density typically rebounds fully within 12 months after weaning, provided adequate nutrition.',
        ],
      },
      {
        heading: 'How to protect and rebuild',
        items: [
          'Calcium: Aim for 1,000–1,300 mg daily from diet + supplements. Dairy, fortified plant milk, leafy greens, sesame seeds.',
          'Vitamin D3: Essential for calcium absorption. Get tested — most postpartum women are deficient.',
          'Vitamin K2: Directs calcium to bones rather than arteries. Found in fermented foods or as a supplement.',
          'Weight-bearing exercise: Walking, gentle strength training, and stair climbing actively stimulate bone formation.',
        ],
      },
      {
        heading: 'Foods for bone health',
        items: [
          'Ragi (finger millet): Excellent calcium source, traditional Indian superfood for postpartum.',
          'Sesame seeds (til): High in calcium and zinc — add to laddoos, chutneys, or sprinkle on food.',
          'Dairy: Milk, paneer, curd/yogurt — most bioavailable calcium source.',
          'Leafy greens: Moringa, spinach, amaranth leaves — pair with vitamin C for better absorption.',
          'Small fish with bones: Sardines, anchovies — if you eat fish.',
        ],
      },
      {
        heading: 'When to get tested',
        items: [
          'If you have risk factors (small frame, family history, vitamin D deficiency, extended breastfeeding beyond 12 months), consider a DEXA scan.',
          'Routine screening isn\u2019t typically needed — recovery is natural for most women with adequate nutrition.',
        ],
      },
    ],
  },

  stretchMarks: {
    title: 'Stretch Marks',
    subtitle: 'Realistic expectations and evidence-based strategies',
    sections: [
      {
        heading: 'Understanding stretch marks',
        items: [
          'Stretch marks (striae) are dermal scars caused by rapid stretching during pregnancy — they\u2019re extremely common and not harmful.',
          'Fresh marks are red-purple and still have active tissue remodeling — this is the window where treatment is most effective.',
          'Over time they naturally fade to silvery-white lines that become much less noticeable.',
        ],
      },
      {
        heading: 'Early postpartum care (best window)',
        items: [
          'Start moisturizing immediately after delivery — the skin is dry and sensitive.',
          'Vitamin E-rich creams and natural oils (rosehip, almond, coconut) support collagen protection in fresh marks.',
          'Gentle circular massage when applying products increases blood flow and enhances absorption.',
          'Consistency matters more than the product — apply twice daily for at least 90 days.',
        ],
      },
      {
        heading: 'What works and what doesn\u2019t',
        items: [
          'No cream fully erases stretch marks — improvement of 20–40% visibility reduction is a realistic goal for fresh marks.',
          'Cocoa butter, vitamin E, and glycolic acid are not harmful but evidence for significant fading is limited.',
          'Avoid retinoids (retinol, tretinoin) while pregnant or breastfeeding — not safe for baby.',
          'Stay hydrated and eat protein-rich foods — your body needs collagen-building materials.',
        ],
      },
      {
        heading: 'Professional options (after weaning)',
        items: [
          'Microneedling: Stimulates collagen regrowth with minimal pigment change risk — good for darker skin tones.',
          'Fractional laser (Fraxel): Most effective for texture improvement. Results are gradual over months.',
          'Radiofrequency: Tightens skin and promotes collagen remodeling.',
          'Combined approaches (laser + microneedling) typically yield the best results.',
          'Consult a dermatologist — treatment depends on mark color, depth, and your skin type.',
        ],
      },
    ],
  },

  hydration: {
    title: 'Stay Hydrated',
    subtitle: 'Your body needs more water than you think, especially while nursing',
    sections: [
      {
        heading: 'Why hydration is critical postpartum',
        items: [
          'Every bodily function — cell repair, nutrient transport, milk production — depends on adequate water.',
          'Dehydration worsens fatigue, headaches, brain fog, and can reduce milk supply.',
          'Breastfeeding mothers need significantly more fluid — your body uses water to produce milk.',
        ],
      },
      {
        heading: 'How much to drink',
        items: [
          'Aim for 2.5–3 liters (10–12 glasses) daily if breastfeeding.',
          'Non-breastfeeding mothers: 2–2.5 liters (8–10 glasses) daily.',
          'Increase by 500 ml on hot days or if exercising.',
          'Your urine color is the best guide — pale yellow means well-hydrated, dark yellow means drink more.',
        ],
      },
      {
        heading: 'Practical tips',
        items: [
          'Keep a water bottle at every nursing station — drink a glass each time you sit down to feed.',
          'Set 3-hourly reminders on your phone if you tend to forget.',
          'Herbal teas, coconut water, buttermilk (chaas), and diluted fruit juices all count toward intake.',
          'Bone broth and soups are excellent — they hydrate and provide collagen for tissue repair.',
          'Add electrolytes or a pinch of salt + lemon to water if plain water feels unsatisfying.',
        ],
      },
      {
        heading: 'Signs of dehydration',
        items: [
          'Dark urine, dry lips, persistent headache, dizziness, or extreme fatigue.',
          'Reduced milk output or baby seeming hungrier than usual.',
          'If symptoms persist despite increased water intake, talk to your doctor — it could indicate an underlying issue.',
        ],
      },
    ],
  },

  nutrition: {
    title: 'Food & Nutrition',
    subtitle: 'Eat to heal, not to "bounce back" — your body needs deep nourishment',
    sections: [
      {
        heading: 'Core principles',
        items: [
          'Focus on tissue repair and stable energy — not weight loss. Your body is healing from a major physical event.',
          'Protein is critical: Aim for 1.7–1.9 g per kg bodyweight daily if breastfeeding. Eggs, dal, paneer, chicken, fish, tofu.',
          'Eat frequently — 5\u20136 smaller meals beat 3 large ones when you\u2019re exhausted and your blood sugar dips.',
          'Warm, cooked foods are easier to digest and traditionally recommended across cultures for recovery.',
        ],
      },
      {
        heading: 'Healing foods to prioritize',
        items: [
          'Bone broth and slow-simmered soups: Collagen-rich, supports tissue repair.',
          'Healthy fats: Ghee, coconut oil, olive oil, nuts, avocado — critical for hormone recovery and brain health.',
          'Iron-rich foods: Jaggery, dates, beetroot, spinach, pomegranate, organ meats — combat postpartum anemia.',
          'Calcium sources: Ragi, sesame seeds, dairy, fortified milks — rebuild bone stores.',
          'Omega-3 fatty acids: Fatty fish, walnuts, flax seeds — support mood and baby\u2019s brain via breast milk.',
        ],
      },
      {
        heading: 'Traditional postpartum foods (Indian context)',
        items: [
          'Panjiri/Gond laddoo: Loaded with healthy fats, dink (edible gum), and nuts — traditional energy food.',
          'Ajwain (carom) water: Aids digestion and traditionally believed to help with gas and bloating.',
          'Methi (fenugreek): Commonly used as a galactagogue — may support milk supply.',
          'Haldi doodh (turmeric milk): Anti-inflammatory, supports immune function.',
          'Dry fruit mixtures: Almonds, cashews, walnuts soaked or roasted — easy, nutrient-dense snacks.',
        ],
      },
      {
        heading: 'Smart snacking for exhausted parents',
        items: [
          'Hard-boiled eggs, nut butter on toast, trail mix, cheese and crackers, fruit with yogurt.',
          'Prep ahead: Batch cook soups, freeze portions, keep energy bites ready.',
          'Keep snacks at your nursing station — you\u2019ll eat more consistently when it\u2019s within reach.',
        ],
      },
    ],
  },

  exercise: {
    title: 'Prenatal & Postnatal Exercise',
    subtitle: 'Follow tissue healing, not calendar dates — progress gradually',
    sections: [
      {
        heading: 'Days 1–14: Breathing and walking only',
        items: [
          'Diaphragmatic breathing: Breathe fully into belly and lower ribs, activating the deep core and pelvic floor.',
          'Ankle pumps while lying down: Prevents blood clots and reduces stiffness.',
          'Short walks (5–10 minutes): Start within the house, gradually extend as you feel ready.',
          'Kegel exercises: Begin gently, working toward 10–15 reps, 2–3 times daily.',
        ],
      },
      {
        heading: 'Weeks 2–6: Gentle mobility',
        items: [
          'Extend walks to 15–20 minutes. Walking with the stroller absolutely counts as exercise.',
          'Pelvic tilts: Strengthen lower abdominals safely while lying on your back.',
          'Cat-cow stretches: Gentle spinal mobility on hands and knees.',
          'Coordinated breathing + pelvic floor activation — more useful than any ab exercise at this stage.',
          'C-section: Wait for medical clearance, typically 6–8 weeks, before anything beyond walking.',
        ],
      },
      {
        heading: 'Weeks 6–12: Rebuilding strength',
        items: [
          'With doctor clearance: Reintroduce bodyweight exercises — squats, modified push-ups, bird-dogs.',
          'Postnatal yoga or Pilates: Excellent for core, flexibility, and mental wellbeing.',
          'Avoid crunches, sit-ups, and planks until checked for diastasis recti.',
          'Bodyweight strength during nap times — even 10–15 minutes is meaningful.',
        ],
      },
      {
        heading: 'Months 3–12: Gradual return',
        items: [
          'Low-impact cardio: Swimming (after bleeding stops), stationary cycling, elliptical.',
          'Running readiness: Wait until at least 12 weeks. Test: 30-min brisk walk without pain or leaking, single-leg balance 10 seconds each side.',
          'Strength training: Gradually increase resistance. Focus on functional strength for lifting and carrying.',
          'High-impact exercise: Realistic return at 6–12 months with gradual progression.',
        ],
      },
      {
        heading: 'Warning signs to stop',
        items: [
          'Increased bleeding, leaking urine, pelvic pressure or heaviness.',
          'Pain that persists after exercise or worsens over days.',
          'These are signals to decrease intensity and see a pelvic floor physical therapist — they\u2019re not "normal" to push through.',
        ],
      },
    ],
  },

  recovery: {
    title: 'Postpartum Recovery',
    subtitle: 'Recovery is a 12-month process, not a 6-week checkbox',
    sections: [
      {
        heading: 'What research shows',
        items: [
          'Analysis of 44 million test results shows it takes at least 12 months for physiological markers, hormones, and bone density to stabilize.',
          'The 6-week checkup is a checkpoint, not an "all-clear" signal. Many body systems are still actively healing.',
          'Biomarker recovery is long and gradual — lab markers typically calm by 6–9 months, but some take a full year.',
        ],
      },
      {
        heading: 'Timeline overview',
        items: [
          'Weeks 1–2: Uterine contraction, lochia (bleeding), breast milk coming in, hormonal crash.',
          'Weeks 2–6: Bleeding tapers, skin and tissue repair begins, hormones start stabilizing.',
          'Months 2–6: Core strength returning, pelvic floor rebuilding, hair changes (shedding peaks around month 3–4).',
          'Months 6–12: Bone density rebounds, hormones normalize, energy gradually improves.',
        ],
      },
      {
        heading: 'Rest is recovery',
        items: [
          'Sleep when you can — daytime naps count. This isn\u2019t laziness, it\u2019s physiological necessity.',
          'Accept help with household tasks, cooking, and older children. You are recovering from a major physical event.',
          'The "5-5-5 rule": 5 days in bed, 5 days on the bed, 5 days near the bed — a useful framework for the first 2 weeks.',
        ],
      },
      {
        heading: 'Key labs to recheck',
        items: [
          'Iron and hemoglobin: At 6 weeks, 3 months, and 6 months — especially if fatigued.',
          'Vitamin D: Most postpartum women are deficient. Test at 3 months.',
          'Thyroid: Postpartum thyroiditis affects 5–10% of women. Recheck at 3 and 6 months if symptomatic.',
          'Moms who started supplements early had calmer inflammation and steadier recovery across all markers.',
        ],
      },
    ],
  },

  massage: {
    title: 'Postpartum Massage',
    subtitle: 'Therapeutic touch for physical and emotional recovery',
    sections: [
      {
        heading: 'Benefits',
        items: [
          'Reduces muscle tension from pregnancy posture changes and the physical demands of newborn care.',
          'Improves circulation and lymphatic drainage — helps reduce swelling and edema.',
          'Lowers cortisol and increases oxytocin and serotonin — supporting mood and reducing anxiety.',
          'Can help with sleep quality, which has cascading benefits for recovery.',
          'Traditional postpartum massage (malish) has been practiced across Indian cultures for centuries.',
        ],
      },
      {
        heading: 'When to start',
        items: [
          'Vaginal delivery: Generally safe within the first week, once you feel comfortable.',
          'C-section: Avoid the incision area until fully healed (usually 6–8 weeks). Gentle massage on other areas can begin earlier.',
          'Always inform the massage therapist about your delivery type and any complications.',
        ],
      },
      {
        heading: 'What to focus on',
        items: [
          'Back and shoulders: Counteracts forward-hunched nursing posture.',
          'Legs and feet: Reduces swelling and improves circulation.',
          'Abdomen (after clearance): Gentle massage may help with uterine involution and comfort.',
          'Scalp and head: Relieves tension headaches common in sleep-deprived new parents.',
        ],
      },
      {
        heading: 'DIY techniques',
        items: [
          'Self-massage with warm oil (coconut, sesame, almond) — traditionally used in Indian postpartum care.',
          'Tennis ball against a wall for upper back knots — lean and roll.',
          'Foot roller while sitting and feeding — multi-task self-care.',
          'Ask your partner for a 5-minute shoulder massage before bed — small acts add up.',
        ],
      },
    ],
  },

  walking: {
    title: 'Brisk Walking',
    subtitle: 'The easiest, most evidence-backed postpartum exercise',
    sections: [
      {
        heading: 'Why walking is the best starting point',
        items: [
          'Low impact — safe for pelvic floor and healing tissues from the first days postpartum.',
          'Stimulates circulation, reduces swelling, and promotes healing.',
          'Proven mood booster: Even a 10-minute walk reduces symptoms of postpartum depression and anxiety.',
          'Gets you outdoors — sunlight helps with vitamin D, circadian rhythm, and emotional wellbeing.',
          'You can do it with baby in a stroller or carrier — no childcare needed.',
        ],
      },
      {
        heading: 'Progression plan',
        items: [
          'Week 1: 5–10 minute gentle walks around the house or nearby.',
          'Weeks 2–4: Extend to 10–15 minutes, one or two short walks daily.',
          'Weeks 4–6: Build to 20–30 minutes at a comfortable pace.',
          'Weeks 6–8: Target 30 minutes of brisk walking, 5 days a week.',
          'A simple trick: Set a timer for 15 minutes, walk until it rings, then head back.',
        ],
      },
      {
        heading: 'Making it work with a newborn',
        items: [
          'Schedule walks around baby\u2019s nap time — motion often helps baby sleep.',
          'Morning walks are ideal: better sleep at night, vitamin D exposure, and a calmer start to the day.',
          'Don\u2019t wait for perfect conditions — a short walk in pajamas still counts.',
          'Buddy up with another new parent if possible — social support and accountability.',
        ],
      },
      {
        heading: 'When you\u2019re ready for more',
        items: [
          'Once you can brisk walk for 30 minutes without pain, leaking, or pelvic heaviness, you\u2019re ready to explore other exercise.',
          'This is a functional benchmark, not a calendar date — listen to your body.',
          'Walking remains excellent exercise throughout the postpartum year and beyond — it doesn\u2019t become "not enough."',
        ],
      },
    ],
  },
};

export const MOM_CARE_DISCLAIMER =
  'This information is for educational purposes only and does not replace advice from your healthcare provider. Always consult your doctor or midwife for personalized medical guidance.';
