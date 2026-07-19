/** Comparison and commercial SEO guides — weeks 1–8 content layer */

/** @type {import('./guides.js').Guide[]} */
const comparisonGuides = [
  {
    slug: 'yarntrails-vs-qeepsake',
    title: 'Yarn Trails vs Qeepsake: Which Baby Book App Is Right for You?',
    description: 'Compare AI baby books, milestone tracking, and pricing — Yarn Trails vs Qeepsake for modern parents.',
    category: 'Compare',
    icon: 'book-open',
    readMinutes: 7,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-07-02',
    intro: 'Both apps help you capture the first year — but they optimize for different moments. Qeepsake pioneered text-prompt journaling; Yarn Trails focuses on AI stories and an interactive flip-book built from your photos and milestones.',
    body: [
      {
        heading: 'Yarn Trails strengths',
        list: [
          'AI-illustrated stories with narration from your photos',
          'Interactive 3D flip-book on Plus',
          'Free milestone tracking forever on Basic',
          'First Year Plan at $49.99/yr with optional linen bundle',
        ],
      },
      {
        heading: 'Qeepsake strengths',
        list: [
          'Established SMS/email prompt habit loop',
          'Large existing user base and print integrations',
          'Simple text-first journaling',
        ],
      },
      {
        heading: 'Bottom line',
        paragraphs: [
          'Choose Qeepsake if you want daily text prompts above all else. Choose Yarn Trails if the emotional payoff is an AI-rendered story and flip-book you can share with grandparents.',
        ],
      },
    ],
    relatedSlugs: ['best-baby-book-apps-2026', 'tinybeans-vs-qeepsake'],
  },
  {
    slug: 'best-baby-book-apps-2026',
    title: 'Best Baby Book Apps in 2026',
    description: 'Our editorial roundup of the best digital baby book and milestone tracker apps — including AI baby books, photo journals, and keepsake makers.',
    category: 'Compare',
    icon: 'star',
    readMinutes: 8,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-07-02',
    intro: 'The category split in 2026: prompt journals (Qeepsake), private photo sharing (Tinybeans), and AI-rendered storybooks (Yarn Trails). Here is how to pick.',
    body: [
      {
        heading: 'Best AI baby book',
        paragraphs: ['Yarn Trails — milestone tracking free; Plus unlocks unlimited AI stories and a 3D flip-book.'],
      },
      {
        heading: 'Best for family photo sharing',
        paragraphs: ['Tinybeans — private circles for grandparents; less emphasis on AI narrative.'],
      },
      {
        heading: 'Best for text prompts',
        paragraphs: ['Qeepsake — daily questions by text; strong print upsell.'],
      },
    ],
    relatedSlugs: ['yarntrails-vs-qeepsake', 'digital-baby-book-guide'],
  },
  {
    slug: 'tinybeans-vs-qeepsake',
    title: 'Tinybeans vs Qeepsake',
    description: 'Tinybeans vs Qeepsake — photo sharing vs prompt journaling for your baby\'s first year.',
    category: 'Compare',
    icon: 'speech-bubble',
    readMinutes: 6,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-07-02',
    intro: 'Tinybeans centers family photo feeds; Qeepsake centers daily text prompts. Neither focuses on AI story rendering — that is where Yarn Trails differs.',
    body: [
      {
        heading: 'Tinybeans',
        list: ['Private family albums', 'Higher annual price point', 'Strong grandparent UX'],
      },
      {
        heading: 'Qeepsake',
        list: ['SMS/email prompts', 'Print-ready books', 'Lower annual entry price'],
      },
      {
        heading: 'Also consider',
        paragraphs: ['Yarn Trails if you want an AI baby book with a free milestone tracker and one full story on Basic.'],
      },
    ],
    relatedSlugs: ['yarntrails-vs-qeepsake', 'best-baby-book-apps-2026'],
  },
  {
    slug: 'digital-baby-book-guide',
    title: 'Digital Baby Book Guide: AI, Photos, and Milestones',
    description: 'How digital baby books work in 2026 — milestone trackers, AI stories, and print-ready keepsakes.',
    category: 'Baby Book',
    icon: 'book-open',
    readMinutes: 6,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-07-02',
    intro: 'A digital baby book should preserve the recording habit for free and charge for the emotional rendering — stories, flip-books, and print.',
    body: [
      {
        heading: 'What to look for',
        list: [
          'Unlimited milestone tracking without paywall',
          'Clear free tier (photos + one story taste test)',
          'Annual plan aligned to the first 12 months',
          'Grandparent viewer seats or sharing',
        ],
      },
    ],
    relatedSlugs: ['best-baby-book-apps-2026'],
  },
  {
    slug: 'new-grandparent-gifts',
    title: 'New Grandparent Gifts They Will Actually Use',
    description: 'Thoughtful gift ideas for new grandparents — including digital baby books, viewer access, and first-year bundles.',
    category: 'Gifts',
    icon: 'star',
    readMinutes: 5,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-07-02',
    intro: 'Grandparents want connection, not clutter. A gift subscription to an AI baby book with viewer seats beats another onesie set.',
    body: [
      {
        heading: 'Top picks',
        list: [
          'Yarn Trails gift subscription ($59.99) — the full first year',
          'First Year Bundle with linen hardcover for the nursery shelf',
          'Viewer seat invite on Plus — read-only flip-book access',
        ],
      },
    ],
    relatedSlugs: ['best-baby-book-apps-2026'],
  },
  {
    slug: 'baby-memory-book-alternatives',
    title: 'Baby Memory Book Alternatives',
    description: 'Modern alternatives to paper baby memory books — apps, AI stories, and hybrid print options.',
    category: 'Baby Book',
    icon: 'book-open',
    readMinutes: 5,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-07-02',
    intro: 'Paper books gather dust; apps meet you at 3am. The best alternatives combine free tracking with optional print and AI narrative.',
    body: [
      {
        heading: 'Alternatives worth trying',
        list: [
          'Yarn Trails — AI flip-book + free milestones',
          'Printed photo books from camera roll (no milestone context)',
          'Prompt journals — Qeepsake-style text capture',
        ],
      },
    ],
    relatedSlugs: ['digital-baby-book-guide'],
  },
  {
    slug: 'milestone-cards-printable',
    title: 'Milestone Cards & Printable Month Signs',
    description: 'Free printable milestone cards for monthly photos — plus how to turn them into story pages in Yarn Trails.',
    category: 'Tools',
    icon: 'camera',
    readMinutes: 4,
    author: 'Yarn Trails Editorial Team',
    reviewedBy: 'Pending review',
    updated: '2026-07-02',
    intro: 'Monthly milestone cards are a classic photo tradition. Use our free generator or turn the same months into AI story pages.',
    body: [
      {
        heading: 'Free tool',
        paragraphs: ['Use the Yarn Trails milestone card generator at /tools/milestone-cards to download printable cards.'],
      },
    ],
    relatedSlugs: ['digital-baby-book-guide'],
  },
];

export default comparisonGuides;
