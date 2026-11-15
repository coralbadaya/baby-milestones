/**
 * Local-only sample pages for /dev/page-turn-playground.
 * Images live under /public — no remote URLs.
 */
import { assignLayouts } from '../book/pageLayouts.js';

const HERO = '/images/heroes/baby.jpg';
const MOM = '/images/heroes/mom-care.jpg';
const HOME = '/images/heroes/home.jpg';
const COMMUNITY = '/images/heroes/community.jpg';
const DIY = '/images/diy/first_walk.jpg';
const ESSENTIALS = '/images/heroes/essentials.jpg';

const RAW = [
  {
    layout: 'chapter',
    file: HERO,
    src: HERO,
    monthLabel: 'Month 1',
    title: 'QA · Chapter open',
    caption: 'Milestone chapter — left page number, right photograph.',
    when: 'Playground',
    qaTag: 'milestone-chapter',
    qaColor: '#f0e4cc',
  },
  {
    layout: 'photo-story',
    file: DIY,
    src: DIY,
    monthLabel: 'Month 2',
    title: 'Full photograph',
    caption: 'Photo on the left, story on the right — one-page spread.',
    when: 'Playground',
    qaTag: 'full-photo',
  },
  {
    layout: 'facing',
    file: HOME,
    src: HOME,
    monthLabel: 'Month 3A',
    title: 'Facing A',
    caption: 'Two photographs — spread consumes two indices.',
    when: 'Playground',
    qaTag: 'facing-a',
  },
  {
    layout: 'facing',
    file: COMMUNITY,
    src: COMMUNITY,
    monthLabel: 'Month 3B',
    title: 'Facing B',
    caption: 'Partner page for the facing spread.',
    when: 'Playground',
    qaTag: 'facing-b',
  },
  {
    layout: 'pair',
    file: MOM,
    src: MOM,
    monthLabel: 'Month 4A',
    title: 'Two & words',
    caption: 'Pair layout — two photos left, words right.',
    when: 'Playground',
    qaTag: 'pair-a',
  },
  {
    layout: 'pair',
    file: ESSENTIALS,
    src: ESSENTIALS,
    monthLabel: 'Month 4B',
    title: 'Pair partner',
    caption: 'Second photo in the pair stack.',
    when: 'Playground',
    qaTag: 'pair-b',
  },
  {
    layout: 'story-photo',
    file: DIY,
    src: DIY,
    monthLabel: 'Month 5',
    title: 'Story then photo',
    caption: 'Text left, photograph right.',
    when: 'Playground',
    qaTag: 'story-photo',
  },
  {
    layout: 'chapter',
    file: HERO,
    src: HERO,
    monthLabel: 'Month 6',
    title: 'Family milestone',
    caption: 'Family photograph chapter page.',
    when: 'Playground',
    qaTag: 'family',
    qaColor: '#e8dfd0',
  },
  {
    layout: 'photo-story',
    file: '',
    src: '',
    monthLabel: 'Month 7',
    title: 'Minimal solid',
    caption: 'No image file — solid QA background only.',
    when: 'Playground',
    qaTag: 'minimal-solid',
    qaSolid: '#3f5e52',
  },
  {
    ending: true,
    layout: 'chapter',
    file: '',
    src: '',
    monthLabel: 'The close',
    title: 'Last page boundary',
    caption: 'Ending spread for boundary tests.',
    when: 'Playground',
    qaTag: 'ending',
  },
];

export const PAGE_TURN_PLAYGROUND_ALBUM = {
  title: 'Page turn QA',
  babyName: 'Playground',
  dob: '2025-06-01',
  pages: assignLayouts(RAW),
};

export const PROGRESS_SAMPLE_MS = [0, 450, 950, 1450, 1900];