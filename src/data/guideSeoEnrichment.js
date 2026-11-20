/**
 * Per-guide SEO extras: in-app product links + FAQ (visible on page + FAQPage JSON-LD).
 * @typedef {{ to: string, label: string }} GuideProductLink
 * @typedef {{ q: string, a: string }} GuideFaq
 */
import { milestoneSlugSeoExtra } from './milestoneGuideSeo.js';

/** @type {Record<string, { productLinks?: GuideProductLink[], faqs?: GuideFaq[] }>} */
export const GUIDE_SEO_EXTRA = {
  'baby-monthly-milestones': {
    productLinks: [
      { to: '/baby', label: 'My Baby — monthly tracker' },
      { to: '/progress', label: 'Milestone progress' },
      { to: '/guides/1-month-old-milestones', label: '1-month-old milestones' },
      { to: '/guides/6-month-old-milestones', label: '6-month-old milestones' },
      { to: '/guides/12-month-old-milestones', label: '12-month-old milestones' },
      { to: '/month/1', label: 'Month 1 activities' },
      { to: '/vaccination', label: 'Vaccination tracker' },
      { to: '/sources', label: 'Sources & citations' },
    ],
    faqs: [
      {
        q: 'What are baby monthly milestones?',
        a: 'They are skills that often appear around each month of age — movement, communication, thinking, and social connection. Lists describe a typical window, not a deadline. Yarn Trails tracks every month from newborn to 36 months; your pediatrician interprets what you see.',
      },
      {
        q: 'When do babies hit monthly milestones?',
        a: 'Most skills arrive across a range of weeks. Social smiles often show around 6–8 weeks, sitting without support later in the first year, first steps near the first birthday for many — and healthy babies sit outside those averages. Compare your baby to themselves over time.',
      },
      {
        q: 'Are monthly milestones the same as CDC 2, 4, 6, 9, and 12 month lists?',
        a: 'Those ages match common well-visits. Monthly tracking adds the months in between and continues through age three. Use both: the visit list with your clinician, the month page at home.',
      },
      {
        q: 'What if my baby misses a monthly milestone?',
        a: 'One late skill with strength elsewhere is common. Losing a skill, or a pattern that worries you, is a reason to call the pediatrician rather than waiting for the next birthday. Yarn Trails is educational only.',
      },
      {
        q: 'How do I track baby monthly milestones on Yarn Trails?',
        a: 'Set a birth date on Today, then open My Baby. Tick skills when you notice them. Month guides explain the window; the tracker stores the record on this phone, and on your account if you create one.',
      },
    ],
  },
  'nursery-rhymes-for-babies': {
    productLinks: [
      { to: '/baby', label: 'My Baby — milestone tracker' },
      { to: '/month/3', label: 'Month 3 — DIY activities' },
      { to: '/guides/lullabies-for-babies', label: 'Lullabies for babies' },
      { to: '/guides/best-books-for-babies-by-age', label: 'Best books by age' },
      { to: '/mom-care', label: 'Mom Care' },
      { to: '/faq', label: 'FAQ' },
    ],
    faqs: [
      {
        q: 'What age should I start nursery rhymes with my baby?',
        a: 'From birth. Newborns benefit from tone and rhythm even before they understand words. Add finger-play rhymes once your baby can track your hands (often around 3–4 months).',
      },
      {
        q: 'How many nursery rhymes does a baby need?',
        a: 'Three to five songs on rotation are enough. Consistency matters more than variety — the same bedtime rhyme can become a sleep cue.',
      },
      {
        q: 'Are Hindi and English rhymes both okay for one baby?',
        a: 'Yes. Use the languages you speak at home. Mixing languages in everyday songs is fine if that is how your household communicates.',
      },
      {
        q: 'Where can I find development activities that pair with rhymes?',
        a: 'Open My Baby and the current month page for DIY ideas, or read the 3-month milestones guide for tummy time and social development.',
      },
    ],
  },
  'lullabies-for-babies': {
    productLinks: [
      { to: '/guides/nursery-rhymes-for-babies', label: 'Nursery rhymes' },
      { to: '/mom-care', label: 'Postpartum & mom care' },
      { to: '/guides/postpartum-recovery-week-by-week', label: 'Postpartum week by week' },
      { to: '/guides/newborn-dos-and-donts', label: 'Newborn dos and don’ts' },
      { to: '/baby', label: 'My Baby' },
      { to: '/sources', label: 'Sources & citations' },
    ],
    faqs: [
      {
        q: 'What is the best lullaby for a newborn?',
        a: 'Any slow, quiet song you can repeat nightly. Familiar melody beats perfect lyrics — humming Brahms or a simple “goodnight” couplet with your baby’s name works well.',
      },
      {
        q: 'Should I play recorded lullabies or sing live?',
        a: 'Your voice often soothes best, but low-volume recorded music across the room is fine for some families. Follow safe sleep rules — no cords or devices in the crib.',
      },
      {
        q: 'Can lullabies help baby sleep regression?',
        a: 'A steady ritual (feed, dim light, same lullaby) can help, but regressions are common. If sleep or feeding is severely disrupted, ask your pediatrician — music is support, not treatment.',
      },
      {
        q: 'Where do I read about mom rest during the fourth trimester?',
        a: 'See Mom Care and the postpartum recovery week-by-week guide for recovery rhythm and when to seek help for mood changes.',
      },
    ],
  },
  'best-books-for-babies-by-age': {
    productLinks: [
      { to: '/guides/nursery-rhymes-for-babies', label: 'Nursery rhymes' },
      { to: '/guides/lullabies-for-babies', label: 'Lullabies' },
      { to: '/premium', label: 'Yarn Trails Plus — baby book' },
      { to: '/guides/digital-baby-book-guide', label: 'Digital baby book guide' },
      { to: '/tools/milestone-cards', label: 'Free milestone photo cards' },
      { to: '/community/tips', label: 'Parenting tips community' },
    ],
    faqs: [
      {
        q: 'What are the best board books for newborns?',
        a: 'High-contrast black-and-white board books and one-word-per-page titles. Newborns respond to your voice and closeness more than plot.',
      },
      {
        q: 'When should I start reading to my baby?',
        a: 'From day one — even a single page during a feed or tummy time counts. Short, daily contact beats occasional long sessions.',
      },
      {
        q: 'How is a digital baby book different from board books?',
        a: 'Board books are for lap reading now. Yarn Trails Plus turns photos and milestones you already track into AI stories and a flip-book — optional, separate from your physical shelf.',
      },
      {
        q: 'What books are best for a 6-month-old?',
        a: 'Texture books, peek-a-boo flaps, and rhythmic text you can pair with nursery rhymes. Match mouthing-safe materials and short pages.',
      },
    ],
  },
  'baby-photoshoot-ideas-at-home': {
    productLinks: [
      { to: '/tools/milestone-cards', label: 'Free printable milestone cards' },
      { to: '/guides/milestone-cards-printable', label: 'Milestone cards guide' },
      { to: '/baby#moments', label: 'Life firsts' },
      { to: '/premium', label: 'Plus baby book & stories' },
      { to: '/guides/best-baby-book-apps-2026', label: 'Best baby book apps' },
      { to: '/month/6', label: 'Month 6 milestone tracker' },
    ],
    faqs: [
      {
        q: 'How do I take monthly baby photos at home?',
        a: 'Use the same blanket or corner each month, soft window light, and a printed month card from the free milestone cards tool. One accent prop beats a full set.',
      },
      {
        q: 'Is flash photography safe for newborns?',
        a: 'Soft natural light is preferable. Occasional phone flash at a distance is generally considered fine, but avoid harsh direct flash in the eyes — diffuse with window light when you can.',
      },
      {
        q: 'What props are safe for newborn photoshoots at home?',
        a: 'A parent’s hands, a plain wrap, or a basket only with a spotter. Never leave baby unattended for a setup or stack unstable props.',
      },
      {
        q: 'How do milestone photos connect to a baby book?',
        a: 'The same monthly images can feed Yarn Trails Plus stories and your flip-book. Basic milestone tracking on My Baby stays free.',
      },
    ],
  },
  'starting-solids-guide': {
    productLinks: [
      { to: '/guides/indian-baby-food-recipes', label: 'Indian baby food recipes' },
      { to: '/community/recipes', label: 'Community baby recipes' },
      { to: '/guides/6-month-old-milestones', label: '6-month milestones' },
      { to: '/guides/newborn-dos-and-donts', label: 'Feeding dos and don’ts' },
      { to: '/vaccination', label: 'Vaccination tracker' },
      { to: '/sources', label: 'Medical sources' },
    ],
    faqs: [
      {
        q: 'When should I start baby food and solids?',
        a: 'Many authorities suggest around six months when baby shows readiness — sitting with support, interest in food, reduced tongue-thrust. Your pediatrician should confirm timing for your child.',
      },
      {
        q: 'What are common first foods for babies?',
        a: 'Iron-rich options and single-ingredient purées (e.g. avocado, sweet potato, fortified cereal) are common starters. Introduce one new food every few days to watch for reactions.',
      },
      {
        q: 'Can I start solids at 4 months?',
        a: 'Some clinics allow earlier starts for specific babies; others wait until six months. Do not start because of calendar age alone — follow readiness signs and your clinician’s advice.',
      },
      {
        q: 'What foods should babies avoid in the first year?',
        a: 'Honey before 12 months, choking hazards (whole grapes, nuts), and added salt or sugar in baby food. Discuss allergenic foods with your pediatrician — guidance has evolved toward early introduction for many families.',
      },
      {
        q: 'Where are baby food recipes on Yarn Trails?',
        a: 'See the Indian baby food recipes guide and the Community recipes tab for parent-tested ideas — always adapt to your clinician’s plan.',
      },
    ],
  },
  'indian-baby-food-recipes': {
    productLinks: [
      { to: '/guides/starting-solids-guide', label: 'Starting solids guide' },
      { to: '/community/recipes', label: 'Community recipes' },
      { to: '/guides/6-month-old-milestones', label: '6-month milestones' },
      { to: '/vaccination', label: 'Vaccination tracker (India IAP/UIP)' },
      { to: '/shopping', label: 'Baby essentials checklist' },
      { to: '/sources', label: 'Sources & citations' },
    ],
    faqs: [
      {
        q: 'What is a good first Indian baby food?',
        a: 'Plain smooth sooji porridge or thin moong dal soup after your pediatrician clears solids — one ingredient at a time, no salt, sugar, or honey under 12 months.',
      },
      {
        q: 'When can I add ghee to baby food?',
        a: 'After the base food is tolerated for several days. Start with a small amount if your clinician agrees — plain first, flavours later.',
      },
      {
        q: 'Is khichdi okay for a 6-month-old?',
        a: 'Very soft, well-mashed khichdi without whole spices can suit some babies from the later part of month six — texture must match your baby’s skills. Ask your pediatrician for timing.',
      },
      {
        q: 'How do I track vaccines while starting solids in India?',
        a: 'Use the vaccination tracker with the India schedule, and bring your clinic card to visits. The app supports IAP/UIP-style tracking but does not replace your provider’s record.',
      },
    ],
  },
  'vaccination-tracker-india': {
    productLinks: [
      { to: '/vaccination', label: 'Vaccination tracker' },
      { to: '/guides/first-year-vaccination-schedule', label: 'First-year schedule, explained' },
      { to: '/guides/newborn-dos-and-donts', label: 'Newborn dos and don’ts' },
      { to: '/baby', label: 'My Baby' },
      { to: '/sources', label: 'Sources & citations' },
      { to: '/medical-disclaimer', label: 'Medical disclaimer' },
    ],
    faqs: [
      {
        q: 'Does Yarn Trails have a vaccination tracker for India?',
        a: 'Yes. Open Vaccination and choose India IAP/UIP. Log doses you already received. The list is a reference grouped like common visits — your pediatrician confirms products and dates.',
      },
      {
        q: 'What is the difference between IAP and UIP?',
        a: 'UIP is the public programme. IAP publishes a recommended schedule many private clinics use, sometimes with extra or optional vaccines. Yarn Trails labels the India list IAP/UIP-style so both conversations fit one log.',
      },
      {
        q: 'Can I download an IAP schedule PDF from Yarn Trails?',
        a: 'The tracker is the living list. For an official PDF, use your pediatrician or the issuing body. Do not treat a screenshot of the app as a legal immunisation certificate.',
      },
      {
        q: 'What if we also need a CDC schedule?',
        a: 'Switch the tracker to CDC, or use Custom if you are splitting time between countries. Keep one clinic as the source of truth.',
      },
    ],
  },
  'diy-baby-activities': {
    productLinks: [
      { to: '/baby', label: 'My Baby — this month’s DIY' },
      { to: '/month/3', label: 'Month 3 activities' },
      { to: '/guides/baby-monthly-milestones', label: 'Baby monthly milestones' },
      { to: '/guides/nursery-rhymes-for-babies', label: 'Nursery rhymes' },
      { to: '/tools/milestone-cards', label: 'Milestone photo cards' },
    ],
    faqs: [
      {
        q: 'What are the best DIY baby activities at home?',
        a: 'Tummy time, talking, and one or two safe objects. Match the month page — sitting games wait until sitting is emerging. No-prep beats a themed craft.',
      },
      {
        q: 'How much tummy time does a baby need?',
        a: 'Short, supervised, awake sessions several times a day, building as they tolerate it. Chest-to-chest counts. Never for sleep.',
      },
      {
        q: 'Are sensory activities safe for newborns?',
        a: 'Your face, voice, and high-contrast cards are enough at first. Skip small parts and loose loops. If in doubt, skip the basket until they sit with help.',
      },
      {
        q: 'Where are month-by-month activity lists on Yarn Trails?',
        a: 'My Baby → the current month. DIY cards sit next to milestones. This guide is the overview; the month page is the list for today.',
      },
    ],
  },
  'baby-care-first-year': {
    productLinks: [
      { to: '/guides/newborn-dos-and-donts', label: 'Newborn dos and don’ts' },
      { to: '/guides/baby-monthly-milestones', label: 'Baby monthly milestones' },
      { to: '/mom-care', label: 'Mom Care' },
      { to: '/guides/starting-solids-guide', label: 'Starting solids' },
      { to: '/baby', label: 'My Baby' },
    ],
    faqs: [
      {
        q: 'What is a good daily baby care routine?',
        a: 'Feed, sleep, hold, clean — on a rhythm that follows the baby, not a strict clock. Newborns cluster feeds; older babies add play and, around six months, solids with your clinician’s advice.',
      },
      {
        q: 'How is newborn care different from later baby care?',
        a: 'The first weeks are almost all feeding and sleep safety. Motor play and a slightly longer awake window arrive gradually. Use the month page rather than a single “newborn routine” all year.',
      },
      {
        q: 'When should I call the pediatrician about daily care?',
        a: 'Fever in a young infant per your clinic, breathing worries, poor wet nappies, or a baby who will not wake to feed. Yarn Trails is educational only.',
      },
      {
        q: 'Where do I track care and milestones together?',
        a: 'My Baby for development, Mom Care for her recovery, Vaccination for doses. This guide explains the ordinary day those tools sit inside.',
      },
    ],
  },
  'newborn-essentials-checklist': {
    productLinks: [
      { to: '/shopping', label: 'Shopping checklist' },
      { to: '/essentials', label: 'Essentials hub' },
      { to: '/travel', label: 'Travel with baby' },
      { to: '/guides/newborn-dos-and-donts', label: 'Newborn dos and don’ts' },
      { to: '/guides/baby-care-first-year', label: 'Baby care first year' },
    ],
    faqs: [
      {
        q: 'What are newborn must-haves?',
        a: 'A safe sleep surface, a feeding plan, nappies, a few layers, and a correctly installed car seat if you drive. Most other “must have” lists can wait.',
      },
      {
        q: 'What baby essentials should I skip?',
        a: 'Gadgets that replace supervision, duplicate strollers, and climate-wrong fabrics. Buy the next size when clothes are tight, not a year of onesies in one order.',
      },
      {
        q: 'Does Yarn Trails have a baby shopping checklist?',
        a: 'Yes — Essentials and Shopping, ticked by what you already own, month by month. This guide is the philosophy; the checklist is the list.',
      },
      {
        q: 'Are the product links medical recommendations?',
        a: 'No. Safety standards and recalls are your country’s job. Yarn Trails does not endorse a brand as clinically required.',
      },
    ],
  },
  'newborn-dos-and-donts': {
    productLinks: [
      { to: '/guides/first-year-vaccination-schedule', label: 'First-year vaccination guide' },
      { to: '/vaccination', label: 'Vaccination tracker' },
      { to: '/guides/3-month-old-milestones', label: '3-month milestones' },
      { to: '/guides/postpartum-recovery-week-by-week', label: 'Postpartum recovery' },
      { to: '/mom-care', label: 'Mom Care' },
      { to: '/medical-disclaimer', label: 'Medical disclaimer' },
    ],
    faqs: [
      {
        q: 'What are the most important newborn sleep dos and don’ts?',
        a: 'Do: back to sleep on a firm flat surface, room-share if you choose, use a sleep sack. Don’t: loose blankets, pillows, or unsafe bed-sharing setups.',
      },
      {
        q: 'When should a newborn see a doctor for vaccination in India?',
        a: 'Follow the schedule your pediatrician gives — often aligned with IAP/UIP references at birth and early weeks. Log doses in the Yarn Trails vaccination tracker.',
      },
      {
        q: 'Can visitors hold my newborn?',
        a: 'With hand washing and when visitors are well. Avoid kisses on the mouth and hands during RSV or illness seasons — your pediatrician can advise for local risk.',
      },
      {
        q: 'When is newborn fever an emergency?',
        a: 'Follow your clinic’s threshold for fever in young infants — many advise same-day assessment. Call emergency services for breathing difficulty or extreme lethargy.',
      },
    ],
  },
};

/** @param {import('./guidesBase.js').Guide} guide */
export function applyGuideSeo(guide) {
  const pillarExtra = GUIDE_SEO_EXTRA[guide.slug];
  const milestoneExtra = milestoneSlugSeoExtra(guide.slug);
  const extra = pillarExtra ?? milestoneExtra;
  if (!extra) return guide;
  return {
    ...guide,
    productLinks: extra.productLinks ?? guide.productLinks,
    faqs: extra.faqs ?? guide.faqs,
  };
}