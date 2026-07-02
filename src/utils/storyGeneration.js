import { STORY_LANGUAGES } from '../constants/storyLanguages';
import { getFolkTaleTemplate } from '../data/folkTaleTemplates';
import { getSceneStoryLines, getStoryScene } from '../data/storyScenes';

/** Persona + art style options for Plus story generation */
export const STORY_PERSONAS = [
  { id: 'gentle', label: 'Gentle narrator', desc: 'Soft lullaby tone' },
  { id: 'adventurous', label: 'Adventurous', desc: 'Bold discoveries' },
  { id: 'whimsical', label: 'Whimsical', desc: 'Playful wonder' },
  { id: 'classic', label: 'Classic lullaby', desc: 'Timeless bedtime' },
];

export const STORY_ART_STYLES = [
  { id: 'watercolor', label: 'Watercolor', desc: 'Soft washes' },
  { id: 'storybook', label: 'Storybook ink', desc: 'Line and wash' },
];

export const PAGE_TYPE_LABELS = {
  opening: 'Opening',
  body: 'Story',
  milestone: 'This month',
  persona: 'Voice',
  closing: 'Closing',
};

/** Human-readable folk beat labels */
export const FOLK_BEAT_LABELS = {
  call_to_adventure: 'Call to adventure',
  gentle_obstacle: 'Gentle obstacle',
  moon_gift: 'Moon gift',
  return_to_nest: 'Return to nest',
  small_fear: 'Small fear',
  kind_helper: 'Kind helper',
  courage_found: 'Courage found',
  celebration: 'Celebration',
  river_call: 'River call',
  stepping_stones: 'Stepping stones',
  friend_on_other_side: 'Friend on the other side',
  warm_return: 'Warm return',
  twilight_arrival: 'Twilight arrival',
  star_whisper: 'Star whisper',
  gift_revealed: 'Gift revealed',
  morning_glow: 'Morning glow',
  forest_lull: 'Forest lull',
  dream_path: 'Dream path',
  gentle_creature: 'Gentle creature',
  morning_light: 'Morning light',
};

/**
 * @param {string[]} beatStructure
 * @returns {string[]}
 */
export function getFolkBeatLabels(beatStructure) {
  if (!beatStructure?.length) return [];
  return beatStructure.map((key) => FOLK_BEAT_LABELS[key] || key.replace(/_/g, ' '));
}

const MONTH_LINES = {
  en: (m, name) => `At ${m} months, ${name} is finding new ways to reach, laugh, and be surprised by the world.`,
  hi: (m, name) => `${m} mahine mein, ${name} naye tareeke se hasna aur khojna seekh raha hai.`,
  es: (m, name) => `A los ${m} meses, ${name} descubre nuevas formas de reír y explorar.`,
};

const PERSONA_CLOSING = {
  gentle: {
    en: 'And so, wrapped in warmth, sleep came softly.',
    watercolor: 'Painted in gentle watercolor, the night held still.',
    storybook: 'Ink lines softened into the quietest page.',
  },
  adventurous: {
    en: 'Tomorrow would bring another small adventure — but tonight, rest.',
    watercolor: 'Watercolor horizons faded into dreams.',
    storybook: 'The last page turned with a satisfied sigh.',
  },
  whimsical: {
    en: 'Even the stars giggled before they dimmed.',
    watercolor: 'Colors danced once more, then drifted to sleep.',
    storybook: 'A tiny doodle moon winked goodnight.',
  },
  classic: {
    en: 'Hush now, little one — the lullaby carries you home.',
    watercolor: 'Classic washes of blue and gold faded gently.',
    storybook: 'The storybook closed with a whisper.',
  },
};

const DEMO_BODIES = {
  en: (name, marker) => `Tonight, under the ${marker}, little ${name} discovered that every twinkle held a secret lullaby. The stars leaned close and whispered: "You are loved beyond measure."`,
  hi: (name, marker) => `Aaj raat, ${marker} ke neeche, chhote ${name} ne dekha ki har chamak mein ek lori chhupi hai. Sitare paas aaye aur fusfusaye: "Tu hamari duniya ka sabse pyara tohfa hai."`,
  es: (name, marker) => `Esta noche, bajo ${marker}, el pequeño ${name} descubrió que cada destello guardaba una nana secreta. Las estrellas se acercaron y susurraron: "Eres nuestro tesoro más preciado."`,
  ta: (name, marker) => `Indha iravu, ${marker} kizhakku, chinna ${name} ovvoru twinkle-ilum oru lullaby irukkunu kandupidicharu.`,
  te: (name, marker) => `Ee rati, ${marker} kindha, chinna ${name} prati merupu lo oka lullaby undani telusukunnadu.`,
  bn: (name, marker) => `Aj raat, ${marker} er niche, chhoto ${name} dekhte pelo proti jhalake ekta lullaby leke ache.`,
  ar: (name, marker) => `Tonight beneath ${marker}, little ${name} found a secret lullaby in every glimmer.`,
  zh: (name, marker) => `今晚，在 ${marker} 下，小 ${name} 发现每一道闪光里都藏着一首摇篮曲。`,
  pt: (name, marker) => `Esta noite, sob ${marker}, o pequeno ${name} descobriu que cada brilho guardava uma canção.`,
  fr: (name, marker) => `Ce soir, sous ${marker}, le petit ${name} découvrit qu\'chaque scintillement cachait une berceuse.`,
  de: (name, marker) => `Heute Nacht, unter ${marker}, entdeckte kleine ${name}, dass jedes Funkeln ein Wiegenlied birgt.`,
  ja: (name, marker) => `Konya wa ${marker} no shita de, chiisana ${name} wa hitori hitori no hikari ni lullaby ga aru koto ni kizuita.`,
};

function getMonthLine(langCode, month, babyName) {
  const fn = MONTH_LINES[langCode] || MONTH_LINES.en;
  return fn(month, babyName);
}

function getClosing(langCode, persona, artStyle) {
  const pack = PERSONA_CLOSING[persona] || PERSONA_CLOSING.gentle;
  const artLine = pack[artStyle] || pack.watercolor;
  const textLine = langCode === 'en' ? pack.en : `${pack.en.slice(0, 40)}…`;
  return `${textLine} ${artLine}`;
}

function buildScenePages(lang, opts) {
  const { babyName, sceneId } = opts;
  const marker = lang.culturalMarkers[0];
  const lines = getSceneStoryLines(sceneId, lang.code, babyName);

  return [
    { text: lines.opening, type: 'opening' },
    { text: lines.body, type: 'body', culturalCaption: marker },
    { text: lines.closing, type: 'closing' },
  ];
}

function buildPagesForLanguage(lang, opts) {
  const { babyName, babyAgeMonths, folkTemplate, sceneId, persona, artStyle } = opts;
  const marker = lang.culturalMarkers[0];
  const bodyFn = DEMO_BODIES[lang.code] || DEMO_BODIES.en;

  if (folkTemplate) {
    const opening = folkTemplate.openingByLanguage[lang.code]
      ?? folkTemplate.openingByLanguage.en
      ?? '';
    const pages = [];
    if (opening) pages.push({ text: opening, type: 'opening' });
    pages.push({ text: bodyFn(babyName, marker), type: 'body', culturalCaption: marker });
    pages.push({
      text: lang.code === 'en'
        ? `Every quiet moment this month became part of ${babyName}'s growing story.`
        : `${bodyFn(babyName, marker).slice(0, 80)}…`,
      type: 'body',
    });
    pages.push({ text: getClosing(lang.code, persona, artStyle), type: 'closing' });
    return pages;
  }

  if (sceneId) {
    return buildScenePages(lang, opts);
  }

  const pages = [];

  pages.push({
    text: getMonthLine(lang.code, babyAgeMonths, babyName),
    type: 'milestone',
  });

  pages.push({ text: bodyFn(babyName, marker), type: 'body', culturalCaption: marker });

  pages.push({
    text: getMonthLine('en', babyAgeMonths, babyName),
    type: 'milestone',
  });

  pages.push({
    text: lang.code === 'en'
      ? `Every giggle, every grasp, every quiet moment this month became part of ${babyName}'s growing story.`
      : `${bodyFn(babyName, marker).slice(0, 80)}…`,
    type: 'body',
  });

  pages.push({
    text: getClosing(lang.code, persona, artStyle),
    type: 'closing',
  });

  return pages;
}

/**
 * Generate story pages for all languages (client-side fallback when Edge Function unavailable).
 * @param {{ babyName?: string, babyAgeMonths?: number, sceneId?: string, folkTemplateId?: string|null, persona?: string, artStyle?: string }} opts
 */
export function generateDemoStory(opts = {}) {
  const babyName = opts.babyName || 'little one';
  const babyAgeMonths = opts.babyAgeMonths ?? 6;
  const sceneId = opts.sceneId ?? null;
  const persona = opts.persona || 'gentle';
  const artStyle = opts.artStyle || 'watercolor';
  const folkTemplate = opts.folkTemplateId ? getFolkTaleTemplate(opts.folkTemplateId) : null;
  const scene = getStoryScene(sceneId);

  const defaultTitle = folkTemplate
    ? folkTemplate.title
    : scene
      ? `${scene.title} — A story for ${babyName}`
      : `Month ${babyAgeMonths} — A story for ${babyName}`;

  const languageVariants = {};

  STORY_LANGUAGES.forEach((lang) => {
    languageVariants[lang.code] = {
      language: lang.code,
      title: defaultTitle,
      pages: buildPagesForLanguage(lang, {
        babyName,
        babyAgeMonths,
        folkTemplate,
        sceneId: folkTemplate ? null : sceneId,
        persona,
        artStyle,
      }),
    };
  });

  return {
    title: defaultTitle,
    sceneId: folkTemplate ? null : sceneId,
    persona,
    artStyle,
    language: 'en',
    languageVariants,
    pages: languageVariants.en.pages,
  };
}

export default generateDemoStory;
