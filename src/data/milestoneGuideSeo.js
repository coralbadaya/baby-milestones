/**
 * FAQs + product links for month milestone guides (1–12).
 * Merged in guideSeoEnrichment.js by slug `{n}-month-old-milestones`.
 */

/** @param {number} month @returns {{ productLinks: {to: string, label: string}[], faqs: {q: string, a: string}[] }} */
export function milestoneGuideSeoExtra(month) {
  const prev = month > 1 ? month - 1 : null;
  const next = month < 12 ? month + (month === 2 ? 2 : 1) : null;
  const productLinks = [
    { to: '/guides/baby-monthly-milestones', label: 'Baby monthly milestones' },
    { to: '/baby', label: 'My Baby — milestone tracker' },
    { to: `/month/${month}`, label: `Month ${month} activities & DIY` },
    { to: '/progress', label: 'Milestone progress' },
    { to: '/vaccination', label: 'Vaccination tracker' },
    { to: '/mom-care', label: 'Mom Care' },
    ...(prev ? [{ to: `/guides/${prev}-month-old-milestones`, label: `${prev}-month milestones guide` }] : []),
    ...(next ? [{ to: `/guides/${next}-month-old-milestones`, label: `${next}-month milestones guide` }] : []),
    { to: '/guides/first-year-vaccination-schedule', label: 'First-year vaccination guide' },
    { to: '/sources', label: 'Sources & citations' },
  ];

  const faqs = MONTH_FAQS[month] ?? genericMonthFaqs(month);
  return { productLinks, faqs };
}

/** @param {string} slug */
export function milestoneSlugSeoExtra(slug) {
  const m = slug.match(/^(\d+)-month-old-milestones$/);
  if (!m) return null;
  return milestoneGuideSeoExtra(Number(m[1]));
}

/** @type {Record<number, { q: string, a: string }[]>} */
const MONTH_FAQS = {
  1: [
    {
      q: 'What should a 1-month-old be able to do?',
      a: 'Many babies briefly lift their head on tummy time, focus on faces about **8–12 inches** away, startle at loud sounds, and quiet to familiar voices. Ranges are wide in week four — compare your baby to themselves over time, not to a neighbour’s baby.',
    },
    {
      q: 'How much tummy time does a 1-month-old need?',
      a: 'Short, supervised sessions several times a day — often **1–3 minutes** when awake and calm, building as they tolerate it. Tummy-to-chest on you counts.',
    },
    {
      q: 'Is my 1-month-old smiling yet?',
      a: 'Reflex smiles can appear early; social smiles in response to you often come closer to **6–8 weeks**. If you are worried about social connection, mention it at your next well-baby visit.',
    },
    {
      q: 'Where do I track 1-month milestones in Yarn Trails?',
      a: 'Open My Baby or the Month 1 page for checklists and DIY play. This guide is educational — your pediatrician answers whether development is on track for your child.',
    },
  ],
  2: [
    {
      q: 'When do babies start smiling at parents?',
      a: 'Social smiles often emerge between **6 and 8 weeks** — a response to your face and voice, not only a sleep grin. Development is a range; mention concerns to your pediatrician.',
    },
    {
      q: 'What sounds should a 2-month-old make?',
      a: 'Cooing, gurgling, and vowel-like sounds during “conversations” are typical. Turn-taking — you talk, pause, they vocalise — feeds early language.',
    },
    {
      q: 'How long should a 2-month-old sleep?',
      a: 'Total sleep varies widely. Focus on safe sleep (back, firm surface, no loose bedding) and responsive feeds rather than a fixed hour target.',
    },
    {
      q: 'What vaccines happen around 2 months?',
      a: 'Schedules differ by country — many clinics use **~6–8 weeks** for early series doses. Log what your pediatrician gives in the Vaccination tracker (**India**, **CDC**, or custom).',
    },
  ],
  3: [
    {
      q: 'What are normal 3-month-old milestones?',
      a: 'Steadier head control, pushing up on forearms, reaching toward toys, social smiling, and cooing are common. See the full 3-month guide for sleep, feeding, and when to call your pediatrician.',
    },
    {
      q: 'Should my 3-month-old roll over yet?',
      a: 'Some babies roll at three months; many roll later. Side-to-back often comes before back-to-tummy. Ask your clinician if your baby has no head control or no social engagement.',
    },
    {
      q: 'When do 3-month-olds start sleeping longer at night?',
      a: 'Some parents see longer stretches; many still wake to feed. Treat longer sleep as welcome when it happens, not a deadline you have missed.',
    },
    {
      q: 'Can I give water or solids at 3 months?',
      a: 'For most healthy term babies, milk alone is recommended until around **six months** unless your pediatrician advises otherwise.',
    },
  ],
  4: [
    {
      q: 'When do babies laugh out loud?',
      a: 'Many babies laugh around **three to four months** during play. If your baby is engaged but not laughing yet, keep offering face-to-face games — ranges vary.',
    },
    {
      q: 'Is rolling at 4 months expected?',
      a: 'Tummy-to-back rolling is common in this window; back-to-tummy often follows. Always supervise on elevated surfaces once rolling starts.',
    },
    {
      q: 'How do I encourage reaching and grabbing?',
      a: 'Place one easy-to-bat toy within reach during tummy time or supported sitting. Mouthing toys is normal — choose safe size and material.',
    },
    {
      q: 'What is the 4-month sleep regression?',
      a: 'More awareness can fragment sleep for a stretch. Keep a simple bedtime rhythm and safe sleep rules; ask your pediatrician if feeding or breathing worries you.',
    },
  ],
  5: [
    {
      q: 'What should a 5-month-old be doing?',
      a: 'Transferring objects hand to hand, bearing weight on legs when held, and clear preferences for familiar people are typical. Intentional batting and mouthing increase.',
    },
    {
      q: 'Can a 5-month-old sit up?',
      a: 'Supported sitting with a pillow nest or your hands is common; independent sitting usually comes later. Never leave a propped baby unattended.',
    },
    {
      q: 'When do babies recognize their name?',
      a: 'Many respond to their name between **five and seven months**, though hearing and attention develop gradually.',
    },
    {
      q: 'How often should I do tummy time at 5 months?',
      a: 'Aim for multiple short awake sessions daily on the floor. If they dislike the floor, tummy on your chest still builds strength.',
    },
  ],
  6: [
    {
      q: 'What milestones should a 6-month-old have?',
      a: 'Sitting with support, repetitive babbling (ba-ba), and interest in family food are common. Readiness signs for solids often appear now — confirm timing with your pediatrician.',
    },
    {
      q: 'When should I start baby food?',
      a: 'Many authorities suggest around **six months** when baby shows readiness. See the Starting solids guide on Yarn Trails — always follow your clinician’s plan.',
    },
    {
      q: 'Is it normal for a 6-month-old to not sit alone?',
      a: 'Yes. Supported sitting is typical; unassisted sitting often emerges in the next one to two months for many babies.',
    },
    {
      q: 'What vaccines are due around 6 months?',
      a: 'Depends on your schedule — India and CDC paths diverge. Use the in-app tracker with your baby’s birth date set on Home.',
    },
  ],
  7: [
    {
      q: 'Is rolling both ways normal at 7 months?',
      a: 'Yes. Rolling, pivoting on the floor, and responding to their name are typical mobility and social steps this month.',
    },
    {
      q: 'How do I help my 7-month-old explore safely?',
      a: 'Offer safe objects to shake, bang, and drop; baby-proof cords and small items. Supervised floor time beats confining gear all day.',
    },
    {
      q: 'When should I worry about not crawling?',
      a: 'Many babies crawl later or scoot instead. Talk to your pediatrician if there is no progress toward mobility or weight-bearing on legs with support.',
    },
    {
      q: 'Can 7-month-olds have finger foods?',
      a: 'Some babies take soft finger foods if already on solids and your clinician agrees. Match texture to skills and watch closely.',
    },
  ],
  8: [
    {
      q: 'When do babies sit without support?',
      a: 'Many sit independently around eight to nine months for short periods. Place soft landing space and stay nearby — topples are common.',
    },
    {
      q: 'What is stranger anxiety at 8 months?',
      a: 'Preferring familiar faces and fussing with strangers is a normal social milestone. Give baby time to warm up; do not force cuddles.',
    },
    {
      q: 'Should an 8-month-old be crawling?',
      a: 'Hands-and-knees crawling, army crawling, or scooting may all appear. Absence of any mobility toward the next month is worth mentioning at a visit.',
    },
    {
      q: 'How much sleep does an 8-month-old need?',
      a: 'Totals vary; two naps plus night sleep is common. Sleep training is a family choice — discuss persistent disruption with your pediatrician.',
    },
  ],
  9: [
    {
      q: 'What is the pincer grasp?',
      a: 'Using thumb and finger to pick small pieces (e.g. soft peas) — emerging around nine months. Offer safe sizes to practise under supervision.',
    },
    {
      q: 'When do babies pull to stand?',
      a: 'Many pull up on furniture this month. Lower the mattress, pad sharp corners, and supervise — they may not yet know how to sit back down.',
    },
    {
      q: 'Do 9-month-olds understand “no”?',
      a: 'They often respond to tone before words. Redirection works better than long explanations.',
    },
    {
      q: 'What food textures at 9 months?',
      a: 'Mashed, soft lumps, and some finger foods if already on solids. Avoid choking hazards; learn infant first aid.',
    },
  ],
  10: [
    {
      q: 'When do babies cruise along furniture?',
      a: 'Side-stepping while holding couches or tables is typical. Stay within arm’s reach — balance is still new.',
    },
    {
      q: 'Should my 10-month-old say mama or dada?',
      a: 'Some babble syllables without attaching meaning yet. True words with intention often come later — ranges are wide.',
    },
    {
      q: 'When do babies wave bye-bye?',
      a: 'Imitation of wave or clap often appears around ten months with repeated modelling.',
    },
    {
      q: 'How do I baby-proof for a cruising baby?',
      a: 'Secure furniture to walls, cover outlets, gate stairs, and keep small objects off the floor. See newborn dos and don’ts for broader safety.',
    },
  ],
  11: [
    {
      q: 'Can an 11-month-old stand alone?',
      a: 'Brief independent stands for a few seconds are common before the first birthday. They may plop often — normal practice.',
    },
    {
      q: 'What games help 11-month-old development?',
      a: 'Peek-a-boo, rolling a ball back and forth, and copying simple gestures build social and motor skills.',
    },
    {
      q: 'Is pointing important at 11 months?',
      a: 'Pointing to show or request is a key communication milestone. Mention it if your baby is not using gestures to share interest.',
    },
    {
      q: 'When to transition to one nap?',
      a: 'Many stay on two naps until after 12–15 months. Follow cues rather than a calendar.',
    },
  ],
  12: [
    {
      q: 'When do babies take their first steps?',
      a: 'Some walk independently near the first birthday; many walk in the second year. Cruising and standing are productive pre-steps.',
    },
    {
      q: 'How many words should a 1-year-old say?',
      a: '**One or two words** with meaning is typical for some twelve-month-olds; others understand more than they say. Discuss hearing and speech concerns with your pediatrician.',
    },
    {
      q: 'Can I give cow’s milk at 12 months?',
      a: 'Many pediatricians introduce whole **cow’s milk** as a drink after **one year** if there is no allergy — confirm timing and volume with your clinician.',
    },
    {
      q: 'What vaccines happen at 12 months?',
      a: 'Schedules vary (e.g. **MMR/MR** timing differs by country). Log doses in the Vaccination tracker and bring records to the birthday check-up.',
    },
  ],
};

/** @param {number} month */
function genericMonthFaqs(month) {
  return [
    {
      q: `How do I know if my ${month}-month-old is on track?`,
      a: 'Compare patterns over weeks, not single skills in one day. Use this guide and Month pages as prompts for your pediatrician — not as a diagnosis.',
    },
    {
      q: `Where can I log ${month}-month milestones?`,
      a: 'My Baby and Progress in Yarn Trails track checks across months. Basic tracking is free.',
    },
    {
      q: `What if my baby skips a typical ${month}-month milestone?`,
      a: 'Ranges overlap between months. Book a conversation with your pediatrician if you see persistent gaps in movement, vision, hearing, or social engagement.',
    },
    {
      q: 'Is Yarn Trails medical advice?',
      a: 'No. Educational only. See the medical disclaimer and Sources pages.',
    },
  ];
}