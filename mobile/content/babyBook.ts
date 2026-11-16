/** Keep tab ids aligned with web `/baby/book/:tab` — mobile uses `/book/<tab>`. */

export const BABY_BOOK_TABS = [
  { id: 'home', label: 'Home', icon: { ios: 'house', android: 'home', web: 'home' } },
  { id: 'stories', label: 'Stories', icon: { ios: 'book', android: 'menu_book', web: 'menu_book' } },
  { id: 'ideas', label: 'Ideas', icon: { ios: 'sparkles', android: 'auto_awesome', web: 'auto_awesome' } },
  { id: 'album', label: '3D Book', icon: { ios: 'book.closed', android: 'book', web: 'book' } },
  { id: 'family', label: 'Family', icon: { ios: 'heart', android: 'favorite', web: 'favorite' } },
] as const;

export type BabyBookTabId = (typeof BABY_BOOK_TABS)[number]['id'];

export const FEATURE_CAROUSEL = [
  { title: 'Live language stories', tab: 'stories' as const, desc: 'Turn this month into a chapter in your language.' },
  { title: '10 AI book ideas', tab: 'ideas' as const, desc: 'Keepsake layouts from photos you already have.' },
  { title: '3D flip-book', tab: 'album' as const, desc: 'Spreads and page turns on this phone.' },
  { title: 'Family Circle', tab: 'family' as const, desc: 'Voice blessings and grandparent invites.' },
  { title: 'Time Capsule', tab: 'family' as const, desc: 'A letter sealed until age 18.' },
];

export const IDEA_COLLECTIONS = [
  {
    id: 'growing-up',
    heading: 'A little bigger every day',
    supporting: 'Same-spot series, growth rocket, festival firsts.',
    ideas: ['Same-spot series', 'Growth rocket', 'Festival firsts'],
  },
  {
    id: 'little-details',
    heading: 'The little things you\'ll miss',
    supporting: 'Hands, feet, first tastes, alphabet of you.',
    ideas: ['Little hands, little feet', 'First tastes', 'Alphabet of you'],
  },
  {
    id: 'family-stories',
    heading: 'All the love around you',
    supporting: 'Then & now, family constellation.',
    ideas: ['Then & Now mirror', 'Family constellation'],
  },
  {
    id: 'letters-dreams',
    heading: 'For the memories still unfolding',
    supporting: 'Twelve dreams, letter at 18.',
    ideas: ['Twelve dreams', 'Letter to you at 18'],
  },
];