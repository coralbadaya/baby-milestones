/** Postpartum mom milestones — curated, educational only. See docs/mom-milestones-ui-design.md */

export const MOM_MILESTONES_DISCLAIMER =
  'Educational organizer only. Postpartum recovery varies widely. Always follow your obstetrician, midwife, or primary care provider. Seek urgent care for heavy bleeding, fever, severe pain, breathing difficulty, or thoughts of harming yourself or your baby.';

/** @typedef {{ id: string, text: string, tip?: string }} MomMilestoneItem */
/** @typedef {'week' | 'month'} PeriodType */
/**
 * @typedef {{
 *   id: string,
 *   label: string,
 *   periodType: PeriodType,
 *   periodStart: number,
 *   periodEnd: number,
 *   title: string,
 *   summary: string,
 *   items: MomMilestoneItem[],
 *   relatedTopic: string | null,
 *   watchFor: string[],
 *   sources: string[],
 * }} MomMilestonePeriod
 */

/** @type {MomMilestonePeriod[]} */
export const momMilestonePeriods = [
  {
    id: 'pp-weeks-0-2',
    label: 'Weeks 0–2',
    periodType: 'week',
    periodStart: 0,
    periodEnd: 2,
    title: 'The fourth trimester',
    summary: 'Rest, heal, and bond. Your body is recovering from birth while learning to care for a newborn.',
    relatedTopic: 'recovery',
    sources: ['icmr', 'iap'],
    watchFor: [
      'Soaking more than one pad per hour, or clots larger than a lemon',
      'Fever above 38°C (100.4°F), foul-smelling discharge, or severe abdominal pain',
      'Difficulty breathing, chest pain, or one leg much more swollen than the other',
    ],
    items: [
      { id: 'pp-w02-1', text: 'Prioritize rest and sleep when baby sleeps', tip: 'Accept help with meals and chores — recovery is your job too.' },
      { id: 'pp-w02-2', text: 'Track bleeding (lochia) — it should lighten, not suddenly worsen', tip: 'Light activity only; no heavy lifting until your provider clears you.' },
      { id: 'pp-w02-3', text: 'Establish feeding rhythm (breast or bottle) without skipping your own meals', tip: 'Keep water and easy snacks within reach of your feeding spot.' },
      { id: 'pp-w02-4', text: 'Do gentle pelvic floor awareness (breathing, not straining)', tip: 'Ask your doctor when to start formal Kegels.' },
      { id: 'pp-w02-5', text: 'Check in on mood daily — baby blues are common in the first two weeks', tip: 'Persistent sadness or anxiety past 2 weeks deserves a conversation with your doctor.' },
    ],
  },
  {
    id: 'pp-weeks-3-6',
    label: 'Weeks 3–6',
    periodType: 'week',
    periodStart: 3,
    periodEnd: 6,
    title: 'Healing and the six-week checkpoint',
    summary: 'Bleeding usually eases. Book your postpartum visit and begin gentle movement if cleared.',
    relatedTopic: 'recovery',
    sources: ['iap', 'icmr'],
    watchFor: [
      'Bleeding that gets heavier again after it had slowed',
      'Incision redness, pus, or opening (C-section or tear)',
      'Overwhelming anxiety, panic, or inability to sleep even when baby sleeps',
    ],
    items: [
      { id: 'pp-w36-1', text: 'Schedule your postpartum checkup (often around 6 weeks / 42 days)', tip: 'Bring a list of questions: pain, mood, feeding, contraception.' },
      { id: 'pp-w36-2', text: 'Start short gentle walks if your provider approves', tip: '10–15 minutes flat ground is enough to begin.' },
      { id: 'pp-w36-3', text: 'Practice feeding posture — bring baby to you, not you to baby', tip: 'See Mom Care → Posture for positioning tips.' },
      { id: 'pp-w36-4', text: 'Continue iron-rich foods if you had anemia or heavy blood loss', tip: 'Dal, ragi, green leafy vegetables, eggs if you eat them.' },
      { id: 'pp-w36-5', text: 'Discuss contraception and spacing with your provider at the visit', tip: 'Options vary while breastfeeding — ask what fits your plan.' },
    ],
  },
  {
    id: 'pp-weeks-7-12',
    label: 'Weeks 7–12',
    periodType: 'week',
    periodStart: 7,
    periodEnd: 12,
    title: 'Finding a new rhythm',
    summary: 'Energy may slowly return. Hair shedding and sleep debt are normal; protect your mental health.',
    relatedTopic: 'sleep',
    sources: ['icmr', 'iap'],
    watchFor: [
      'Mood that stays low, irritable, or numb most of the day for more than two weeks',
      'Thoughts of harming yourself or the baby — seek help immediately',
      'Persistent pelvic or back pain that limits daily function',
    ],
    items: [
      { id: 'pp-w712-1', text: 'Follow your provider’s guidance on exercise progression', tip: 'Walking, gentle core, and pelvic floor work are common next steps.' },
      { id: 'pp-w712-2', text: 'Expect postpartum hair shedding — it is usually temporary', tip: 'Protein-rich meals and patience; discuss severe loss with your doctor.' },
      { id: 'pp-w712-3', text: 'Protect sleep in shifts with a partner or support person when possible', tip: 'One uninterrupted 4-hour block can help mood and recovery.' },
      { id: 'pp-w712-4', text: 'Screen yourself for ongoing anxiety or low mood', tip: 'Mom Care → Mental Health has signs and when to seek help.' },
      { id: 'pp-w712-5', text: 'C-section or tear scars: keep clean, avoid sun on new scars', tip: 'Ask when scar massage or physiotherapy is appropriate.' },
    ],
  },
  {
    id: 'pp-months-3-4',
    label: 'Months 3–4',
    periodType: 'month',
    periodStart: 3,
    periodEnd: 4,
    title: 'Body and identity shifts',
    summary: 'You may still feel tired. Gentle core and pelvic work can support long-term recovery.',
    relatedTopic: 'pelvicFloor',
    sources: ['icmr', 'iap'],
    watchFor: [
      'Urinary leakage that does not improve with gentle pelvic floor practice',
      'Bulging or doming at the midline of your abdomen with exertion',
      'Ongoing pain during intercourse after provider clearance',
    ],
    items: [
      { id: 'pp-m34-1', text: 'Continue pelvic floor exercises if cleared by your provider', tip: 'Quality over quantity — 8–10 slow contractions.' },
      { id: 'pp-m34-2', text: 'Reassess posture during baby care (lifting, carriers, feeding)', tip: 'Micro-breaks for shoulders and neck every hour.' },
      { id: 'pp-m34-3', text: 'Stay hydrated — especially if breastfeeding', tip: 'Drink to thirst; pale urine is a simple guide.' },
      { id: 'pp-m34-4', text: 'Stretch marks and skin changes fade slowly — moisturize if comfortable', tip: 'No product reverses stretch marks; time helps most.' },
      { id: 'pp-m34-5', text: 'Reconnect with one small activity you enjoyed pre-baby', tip: 'Even 15 minutes supports identity and mood.' },
    ],
  },
  {
    id: 'pp-months-5-6',
    label: 'Months 5–6',
    periodType: 'month',
    periodStart: 5,
    periodEnd: 6,
    title: 'Strength and nutrition for the long haul',
    summary: 'Bone and nutrient stores matter during lactation. Review supplements with your doctor.',
    relatedTopic: 'boneDensity',
    sources: ['icmr', 'iap'],
    watchFor: [
      'Persistent fatigue despite adequate sleep — consider iron and thyroid check',
      'Wrist or thumb pain (mother’s thumb) that worsens with lifting',
    ],
    items: [
      { id: 'pp-m56-1', text: 'Discuss calcium, vitamin D, and continuing prenatal vitamins', tip: 'ICMR-NIN guidance supports maternal nutrition during lactation.' },
      { id: 'pp-m56-2', text: 'Build brisk walks or approved exercise into your week', tip: 'Mom Care → Brisk Walks for pacing tips.' },
      { id: 'pp-m56-3', text: 'Schedule dental checkup — pregnancy can affect gums and teeth', tip: 'Local anesthesia is usually safe while breastfeeding; tell your dentist.' },
      { id: 'pp-m56-4', text: 'Try a short self-massage or relaxation ritual weekly', tip: 'Shoulders, feet, or guided breathing — not a luxury.' },
      { id: 'pp-m56-5', text: 'If returning to work, plan pumping or feeding transitions', tip: 'Practice one week before start date if possible.' },
    ],
  },
  {
    id: 'pp-months-7-9',
    label: 'Months 7–9',
    periodType: 'month',
    periodStart: 7,
    periodEnd: 9,
    title: 'Sustaining energy and mental health',
    summary: 'Baby is more interactive; your bandwidth may still be limited. Protect boundaries and support.',
    relatedTopic: 'mentalHealth',
    sources: ['iap', 'icmr'],
    watchFor: [
      'Anxiety that limits leaving home or constant intrusive worries about baby’s safety',
      'Burnout: rage, resentment, or emotional numbness toward partner or baby',
    ],
    items: [
      { id: 'pp-m79-1', text: 'Maintain a realistic exercise habit (even 20 minutes counts)', tip: 'Consistency beats intensity for mood and strength.' },
      { id: 'pp-m79-2', text: 'Check in with your support network — ask for specific help', tip: '"Can you bring dinner Tuesday?" works better than "I need help."' },
      { id: 'pp-m79-3', text: 'Review weaning or continued breastfeeding goals with your pediatrician', tip: 'No single timeline — family and medical context matter.' },
      { id: 'pp-m79-4', text: 'Sleep: adjust expectations as baby’s pattern changes', tip: 'Early bedtime for you when baby sleeps longer stretches.' },
      { id: 'pp-m79-5', text: 'Celebrate small wins in recovery — note what feels stronger than month 1', tip: 'Progress is non-linear; compare to your own baseline.' },
    ],
  },
  {
    id: 'pp-months-10-12',
    label: 'Months 10–12',
    periodType: 'month',
    periodStart: 10,
    periodEnd: 12,
    title: 'Approaching the first birthday',
    summary: 'You have carried your family through a huge year. Focus on maintenance and joy.',
    relatedTopic: 'exercise',
    sources: ['icmr', 'iap'],
    watchFor: [
      'Chronic pelvic pain or prolapse symptoms with daily activities',
      'Depression that returns or worsens — treatable at any stage postpartum',
    ],
    items: [
      { id: 'pp-m1012-1', text: 'Keep pelvic floor and core maintenance in your routine', tip: 'Like brushing teeth — brief daily habit.' },
      { id: 'pp-m1012-2', text: 'Plan a postpartum or annual health visit if you skipped the 6-week check', tip: 'Blood pressure, mood, and contraception still matter.' },
      { id: 'pp-m1012-3', text: 'Reflect on nutrition — less about perfection, more about regular meals', tip: 'Mom Care → Food & Nutrition for postpartum ideas.' },
      { id: 'pp-m1012-4', text: 'Prepare emotionally for baby’s first birthday (can feel bittersweet)', tip: 'Grief for the newborn stage is normal alongside pride.' },
      { id: 'pp-m1012-5', text: 'Acknowledge your recovery journey — you completed a year of postpartum life', tip: 'Share gratitude with one person who supported you.' },
    ],
  },
];

export function getAllMomMilestoneItemIds() {
  return momMilestonePeriods.flatMap((p) => p.items.map((i) => i.id));
}
