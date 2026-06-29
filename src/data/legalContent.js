/**
 * Starter copy for legal, trust, and company pages.
 *
 * IMPORTANT: This is drafted placeholder copy intended for review. The legal
 * pages (Privacy, Terms, Cookies) MUST be reviewed by a qualified lawyer for
 * your jurisdiction(s) before launch. Effective dates are placeholders.
 *
 * @typedef {{ heading?: string, paragraphs?: string[], list?: string[] }} ContentBlock
 * @typedef {{ title: string, icon: string, updated?: string, intro?: string, note?: string, body: ContentBlock[] }} ContentPage
 */
import { BRAND_NAME, CONTACT_EMAIL } from '../constants/brand';

const REVIEW_NOTE =
  'This is drafted starter content for review. Please have it reviewed by a qualified professional before relying on it or publishing.';

const EFFECTIVE = 'June 29, 2026';

/** @type {Record<string, ContentPage>} */
export const PAGES = {
  about: {
    title: `About ${BRAND_NAME}`,
    icon: 'info',
    intro: `${BRAND_NAME} is a calm, considered companion for the first years of parenthood — month-by-month baby milestones, postpartum mom care, vaccination tracking, and practical guides, all in one place.`,
    body: [
      {
        heading: 'Why we exist',
        paragraphs: [
          'New parenthood is full of questions, often at 3am. We built ' + BRAND_NAME + ' to answer them with warmth and credibility — turning trusted developmental guidance into something gentle, personal, and easy to act on.',
        ],
      },
      {
        heading: 'What we believe',
        list: [
          'Development is a range, not a race — we celebrate every baby\u2019s pace',
          'Mothers deserve as much care and attention as their babies',
          'Guidance should be evidence-informed, clearly sourced, and never alarmist',
          'Your data is yours — we keep things private and on-device wherever we can',
        ],
      },
      {
        heading: 'Educational, not medical advice',
        paragraphs: [
          BRAND_NAME + ' provides educational information only and is not a substitute for professional medical advice. Always consult your pediatrician or obstetric provider for health decisions.',
        ],
      },
    ],
  },

  contact: {
    title: 'Contact Us',
    icon: 'envelope',
    intro: 'We would love to hear from you — feedback, questions, partnership ideas, or just a hello.',
    body: [
      {
        heading: 'Email',
        paragraphs: [`The fastest way to reach us is by email at ${CONTACT_EMAIL}. We aim to reply within a few business days.`],
      },
      {
        heading: 'Press & partnerships',
        paragraphs: [`For media or partnership enquiries, email ${CONTACT_EMAIL} with "Press" or "Partnership" in the subject line.`],
      },
      {
        heading: 'A note on medical questions',
        paragraphs: [
          'We cannot provide medical advice or respond to individual health concerns. For anything urgent, please contact your pediatrician, your obstetric provider, or your local emergency number.',
        ],
      },
    ],
  },

  editorialPolicy: {
    title: 'How We Research',
    icon: 'microscope',
    intro: 'Our editorial process exists to keep ' + BRAND_NAME + ' accurate, current, and trustworthy.',
    body: [
      {
        heading: 'Evidence-first',
        paragraphs: [
          'Our developmental and health content is built on guidance from recognized authorities such as the WHO, the CDC, the AAP, and national pediatric bodies. We summarize and link to primary sources on our Sources & Citations page.',
        ],
      },
      {
        heading: 'Review & updates',
        list: [
          'Content is drafted by our editorial team and reviewed against current guidelines',
          'Health-related guides are reviewed by qualified clinicians before publication',
          'We date each guide and revisit it as guidance evolves',
          'Corrections are welcome — email us and we will investigate promptly',
        ],
      },
      {
        heading: 'What we will never do',
        list: [
          'Present opinion as medical fact',
          'Use fear to drive engagement',
          'Recommend products purely for commercial reasons',
        ],
      },
    ],
  },

  reviewers: {
    title: 'Medical Reviewers',
    icon: 'stethoscope',
    intro: 'Health-related content is reviewed by qualified professionals to help ensure it is accurate and responsible.',
    note: 'Reviewer profiles are being finalized. Replace the placeholders below with named clinicians, their credentials, and the content areas they review before launch.',
    body: [
      {
        heading: 'Our review board (placeholder)',
        list: [
          'Pediatrician — reviews infant development and vaccination content',
          'Obstetrician / Midwife — reviews postpartum and maternal health content',
          'Registered Dietitian — reviews infant feeding and nutrition content',
        ],
      },
      {
        heading: 'How review works',
        paragraphs: [
          'Reviewers check content for clinical accuracy and alignment with current guidelines. A medical review does not constitute personal medical advice for any individual reader.',
        ],
      },
    ],
  },

  privacy: {
    title: 'Privacy Policy',
    icon: 'shield',
    updated: EFFECTIVE,
    note: REVIEW_NOTE,
    intro: `Your privacy matters to us. This policy explains what information ${BRAND_NAME} handles and how.`,
    body: [
      {
        heading: 'Information we handle',
        list: [
          'Baby and care data you enter (e.g. birth date, milestone checks, vaccine records) — stored in your browser\u2019s local storage by default',
          'Optional contact details you provide (e.g. newsletter email)',
          'Basic, aggregated usage analytics, where enabled',
        ],
      },
      {
        heading: 'How we use it',
        list: [
          'To provide and personalize the milestone and care experience',
          'To respond to your enquiries',
          'To improve the product in aggregate',
        ],
      },
      {
        heading: 'Your choices',
        list: [
          'Clear locally stored data anytime from your browser settings',
          'Unsubscribe from emails using the link in any message',
          'Contact us to ask about the data we hold',
        ],
      },
      {
        heading: 'Contact',
        paragraphs: [`Questions about privacy? Email ${CONTACT_EMAIL}.`],
      },
    ],
  },

  terms: {
    title: 'Terms of Service',
    icon: 'scales',
    updated: EFFECTIVE,
    note: REVIEW_NOTE,
    intro: `By using ${BRAND_NAME}, you agree to these terms.`,
    body: [
      {
        heading: 'Use of the service',
        paragraphs: [
          BRAND_NAME + ' is provided for your personal, non-commercial use. You agree to use it lawfully and not to misuse or attempt to disrupt the service.',
        ],
      },
      {
        heading: 'No medical advice',
        paragraphs: [
          'Content is educational only and is not medical advice. You are responsible for decisions about your and your child\u2019s health, and should consult qualified professionals.',
        ],
      },
      {
        heading: 'Disclaimers & liability',
        paragraphs: [
          'The service is provided "as is" without warranties of any kind. To the maximum extent permitted by law, we are not liable for damages arising from your use of the service.',
        ],
      },
      {
        heading: 'Changes',
        paragraphs: ['We may update these terms; continued use after changes constitutes acceptance.'],
      },
    ],
  },

  cookies: {
    title: 'Cookie Policy',
    icon: 'cookie',
    updated: EFFECTIVE,
    note: REVIEW_NOTE,
    intro: `This policy explains how ${BRAND_NAME} uses cookies and similar technologies.`,
    body: [
      {
        heading: 'What we use',
        list: [
          'Essential storage required for the app to function (e.g. saving your entries locally)',
          'Optional analytics cookies to understand aggregate usage, where enabled',
        ],
      },
      {
        heading: 'Managing cookies',
        paragraphs: [
          'You can control or delete cookies through your browser settings. Disabling some storage may affect functionality such as saving your data between visits.',
        ],
      },
    ],
  },

  medicalDisclaimer: {
    title: 'Medical Disclaimer',
    icon: 'medical',
    updated: EFFECTIVE,
    intro: `Please read this disclaimer carefully before relying on any content from ${BRAND_NAME}.`,
    body: [
      {
        heading: 'Educational information only',
        paragraphs: [
          'All content on ' + BRAND_NAME + ', including milestones, care guides, and articles, is provided for general educational and informational purposes only. It is not medical advice and is not a substitute for professional diagnosis, treatment, or the guidance of your pediatrician or obstetric provider.',
        ],
      },
      {
        heading: 'No professional relationship',
        paragraphs: [
          'Using this service does not create a doctor\u2013patient or any professional relationship. Developmental ranges describe what is typical, not a deadline or diagnosis.',
        ],
      },
      {
        heading: 'In an emergency',
        paragraphs: [
          'If you believe your child or you may be experiencing a medical emergency, call your pediatrician, your obstetric provider, or your local emergency number immediately.',
        ],
      },
    ],
  },

  accessibility: {
    title: 'Accessibility Statement',
    icon: 'accessibility',
    updated: EFFECTIVE,
    intro: `${BRAND_NAME} is committed to being usable by as many people as possible, regardless of ability.`,
    body: [
      {
        heading: 'Our commitment',
        paragraphs: [
          'We aim to meet widely recognized accessibility standards (WCAG 2.1 AA as a target) and continually improve the experience for users of assistive technologies.',
        ],
      },
      {
        heading: 'What we do',
        list: [
          'Semantic, keyboard-navigable markup',
          'Sufficient color contrast and readable typography',
          'Descriptive labels for interactive controls',
        ],
      },
      {
        heading: 'Feedback',
        paragraphs: [
          `Found an accessibility barrier? Please email ${CONTACT_EMAIL} so we can fix it. We welcome your feedback.`,
        ],
      },
    ],
  },
};

/**
 * Frequently asked questions. Doubles as the source for FAQPage structured data.
 * @type {{ q: string, a: string }[]}
 */
export const FAQS = [
  {
    q: `Is ${BRAND_NAME} a substitute for my pediatrician?`,
    a: 'No. ' + BRAND_NAME + ' is educational only and is not medical advice. Always consult your pediatrician or obstetric provider for health decisions.',
  },
  {
    q: 'My baby hasn\u2019t hit a milestone yet — should I worry?',
    a: 'Development is a range, not a race. Milestone windows describe what is typical, not a deadline. If you have concerns, your pediatrician is the right person to ask.',
  },
  {
    q: 'Where does your milestone information come from?',
    a: 'Our content is based on guidance from recognized authorities such as the WHO, CDC, and AAP. See our Sources & Citations page for details.',
  },
  {
    q: 'Is my data private?',
    a: 'By default, the baby and care data you enter is stored locally in your browser. See our Privacy Policy for full details.',
  },
  {
    q: `Does ${BRAND_NAME} support different vaccination schedules?`,
    a: 'Yes. You can choose between India, CDC, or a custom schedule, and track doses with reminders. Always follow the schedule your pediatrician recommends.',
  },
  {
    q: `Is ${BRAND_NAME} free?`,
    a: 'Core features are free. A Premium tier offers additional tools — see the Premium page for what is included.',
  },
];
