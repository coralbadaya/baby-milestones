/** @type {import('../types/community').ParentingTip[]} */
export const parentingTips = [
  {
    id: 'baby-teething',
    title: 'Baby Teething Guide',
    tagline: 'Practical tips for new parents',
    preview: 'Signs, gentle remedies, and what to expect when those first teeth arrive.',
    content: `**When it usually starts:** 4–7 months, though every baby is different.

**Signs to watch for:**
- Drooling more than usual
- Chewing on fists or toys
- Fussier sleep and feeds
- Mild gum swelling (check with a clean finger)

**What helped us:**
- Cold teething rings (not frozen solid — just chilled)
- Clean damp washcloth in the fridge
- Extra cuddles during wake windows
- Chamomile tea dabbed on gums (ask your pediatrician first)

**When to call the doctor:**
- Fever above 100.4°F / 38°C
- Diarrhea or rash that worries you
- Refusing all feeds for more than a day

You're not doing anything wrong — teething is hard on everyone. This phase passes.`,
    ageRange: '4–7 months',
    ageMinMonths: 4,
    ageMaxMonths: 7,
    category: 'health',
    tags: ['teething', 'health', 'remedies'],
  },
  {
    id: 'diaper-rash',
    title: 'Diaper Rash Remedies',
    tagline: 'Practical tips for new parents',
    preview: 'Quick relief when bum rash shows up — and how to prevent the next one.',
    content: `**Common causes:** Wet diapers left too long, teething, new foods, sensitive skin, or yeast.

**What helped us:**
- Air time — 5–10 minutes diaper-free on a towel after changes
- Thick zinc oxide cream at every change (not just when rash appears)
- Pat dry gently — never rub irritated skin
- Switch to water wipes or plain water + soft cloth if fragrance irritates

**When to call the doctor:**
- Rash spreads beyond the diaper area
- Blisters, open sores, or bleeding
- Fever with rash
- Rash doesn't improve after 3 days of home care

**Prevention:** Change frequently, use a barrier cream proactively, and go up a diaper size if elastic is rubbing.`,
    ageRange: 'All ages',
    ageMinMonths: 0,
    ageMaxMonths: 36,
    category: 'health',
    tags: ['diaper-rash', 'health', 'skin-care'],
  },
  {
    id: 'sleep-regression-4m',
    title: '4-Month Sleep Regression',
    tagline: 'Practical tips for new parents',
    preview: 'Why sleep suddenly falls apart — and how to ride it out.',
    content: `Around 4 months, baby sleep cycles mature. That "sleeping through the night" streak may vanish overnight.

**What's happening:** Lighter sleep phases mean more wake-ups. It's developmental, not a step backward.

**Tips:**
- Keep bedtime routine consistent (bath, feed, dim lights)
- Offer extra contact naps if needed — survival mode is OK
- Avoid introducing new sleep props you'll have to undo later

This usually lasts 2–6 weeks. You're exhausted — that's valid.`,
    ageRange: '3–5 months',
    ageMinMonths: 3,
    ageMaxMonths: 5,
    category: 'sleep',
    tags: ['sleep', 'regression', 'night-waking'],
  },
  {
    id: 'starting-solids',
    title: 'Starting Solids at 6 Months',
    tagline: 'Practical tips for new parents',
    preview: 'A gentle guide to first foods — puree, mash, or baby-led weaning.',
    content: `**Readiness signs:** Sits with support, shows interest in food, lost tongue-thrust reflex.

**First foods:** Iron-rich options like ragi, dal, or mashed banana. One new food every 3 days to watch for reactions.

**Texture:** Start smooth, move to mashed, then soft pieces as baby grows.

**Remember:** Milk/formula stays primary until 12 months. Solids are for learning, not replacing feeds.`,
    ageRange: '6 months',
    ageMinMonths: 6,
    ageMaxMonths: 7,
    category: 'feeding',
    tags: ['solids', 'weaning', 'first-foods', 'feeding'],
  },
  {
    id: 'tummy-time-tips',
    title: 'Tummy Time That Actually Works',
    tagline: 'Practical tips for new parents',
    preview: 'Short, fun sessions beat long crying spells every time.',
    content: `**Start early:** Even 1–2 minutes after a diaper change counts.

**Make it fun:** Mirror play, high-contrast cards, lying chest-to-chest with you.

**If baby hates it:** Try inclined tummy time on your chest first. Build up slowly — 30 seconds is a win.

**Goal:** Strengthen neck and shoulders for rolling and sitting. No pressure for marathon sessions.`,
    ageRange: '0–3 months',
    ageMinMonths: 0,
    ageMaxMonths: 3,
    category: 'play',
    tags: ['tummy-time', 'development', 'play'],
  },
];

export default parentingTips;
