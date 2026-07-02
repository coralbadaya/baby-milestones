/** 12 launch languages for native storytelling — see docs/ai-baby-book-plan.md */

export const STORY_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English', culturalMarkers: ['the full moon', 'little star', 'cozy nest'] },
  { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', culturalMarkers: ['chanda mama', 'twinkle little star', 'gudiya'] },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español', culturalMarkers: ['la luna llena', 'estrellita', 'mi tesoro'] },
  { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்', culturalMarkers: ['chandiran', 'kutty', 'thangam'] },
  { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు', culturalMarkers: ['chandamama', 'bujjigadu', 'bangaram'] },
  { code: 'bn', label: 'Bengali', nativeLabel: 'বাংলা', culturalMarkers: ['chander alo', 'khoka', 'sona'] },
  { code: 'ar', label: 'Arabic', nativeLabel: 'العربية', culturalMarkers: ['qamar', 'habibi', 'najm'] },
  { code: 'zh', label: 'Mandarin', nativeLabel: '中文', culturalMarkers: ['yueliang', 'baobei', 'xingxing'] },
  { code: 'pt', label: 'Portuguese', nativeLabel: 'Português', culturalMarkers: ['lua cheia', 'estrelinha', 'meu amor'] },
  { code: 'fr', label: 'French', nativeLabel: 'Français', culturalMarkers: ['la pleine lune', 'petite étoile', 'mon trésor'] },
  { code: 'de', label: 'German', nativeLabel: 'Deutsch', culturalMarkers: ['der Vollmond', 'Sternchen', 'Schatz'] },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語', culturalMarkers: ['mangetsu', 'hoshi', 'akachan'] },
];

export function getStoryLanguage(code) {
  return STORY_LANGUAGES.find((l) => l.code === code) ?? STORY_LANGUAGES[0];
}

export default STORY_LANGUAGES;
