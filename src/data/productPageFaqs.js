/**
 * Visible FAQs + FAQPage JSON-LD for high-traffic product routes.
 * Keys match ROUTES paths.
 */

/** @type {Record<string, { title: string, faqs: { q: string, a: string }[] }>} */
export const PRODUCT_PAGE_FAQS = {
  '/vaccination': {
    title: 'Baby vaccination tracker — common questions',
    faqs: [
      {
        q: 'Does Yarn Trails replace my baby’s vaccination card?',
        a: 'No. The tracker is an educational organizer so you can see what is typically due next and log doses you received. Your pediatrician’s clinic record remains the official document for school, travel, and medical care.',
      },
      {
        q: 'What is the vaccination tracker for India (IAP/UIP)?',
        a: 'Choose the India schedule in the app to align reminders with commonly used IAP/UIP-style visit ages. Optional and private vaccines may differ — always follow the list your pediatrician gives you.',
      },
      {
        q: 'Can I use the CDC schedule instead of India?',
        a: 'Yes. Switch between India, CDC, or a custom list. Families abroad or with dual-country care often pick the schedule their clinician uses.',
      },
      {
        q: 'How do vaccine reminders work?',
        a: 'Set your baby’s birth date on Today/Home so due windows calculate correctly. Adjust the reminder window (days) in the toolbar; the banner shows vaccines coming due — not push notifications unless you add those later on mobile.',
      },
      {
        q: 'Can I export or print vaccination records?',
        a: 'Plus unlocks CSV, JSON, and print-friendly views from the toolbar. You can back up JSON and re-import on another device. Keep a copy for daycare and travel.',
      },
      {
        q: 'Is vaccination content on Yarn Trails medical advice?',
        a: 'No. We summarise schedules for convenience; we do not diagnose or prescribe. Read the first-year vaccination guide and medical disclaimer; confirm every dose with your pediatrician.',
      },
    ],
  },
  '/shopping': {
    title: 'Baby essentials checklist — common questions',
    faqs: [
      {
        q: 'What is the Yarn Trails shopping checklist?',
        a: 'A month-aware list of curated baby essentials — gear, feeding, sleep, and care items filtered by your baby’s age range. Check items off as you buy; progress syncs when you are signed in.',
      },
      {
        q: 'How is this different from a generic newborn must-have list?',
        a: 'Items surface by month band so you are not buying a full nursery at once. The goal is investment pieces and fewer duplicates — not every trending gadget.',
      },
      {
        q: 'Recommended baby products for India vs US — does the list change?',
        a: 'The checklist focuses on categories (carrier, sleep, feeding) that apply across regions. Brands and voltage differ — use your pediatrician and local safety standards when choosing specific products.',
      },
      {
        q: 'Can I track shopping and milestones together?',
        a: 'Yes. My Baby holds milestones; Essentials includes this Shopping page and Travel. Progress shows how many milestone checks you have completed.',
      },
      {
        q: 'What is the Premium brand edit on Shopping?',
        a: 'Plus includes an editorial shortlist of higher-end nursery and sleep pieces we revisit each season. Basic checklist access stays free.',
      },
      {
        q: 'Where do I read about starting solids and feeding gear?',
        a: 'See the Starting solids guide and Indian baby food recipes under Guides. Add feeding items as your clinician clears solids — often around six months.',
      },
    ],
  },
};

/** @param {string} pathname */
export function getProductPageFaqs(pathname) {
  return PRODUCT_PAGE_FAQS[pathname] ?? null;
}