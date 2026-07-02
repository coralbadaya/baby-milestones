/** Phase 1 read-aloud via Web Speech API (Storyteller mode). */

const LANG_MAP = {
  en: 'en-US',
  hi: 'hi-IN',
  es: 'es-ES',
  ta: 'ta-IN',
  te: 'te-IN',
  bn: 'bn-IN',
  ar: 'ar-SA',
  zh: 'zh-CN',
  pt: 'pt-BR',
  fr: 'fr-FR',
  de: 'de-DE',
  ja: 'ja-JP',
};

let activeUtterance = null;

export function stopReadAloud() {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
  activeUtterance = null;
}

/**
 * @param {string[]} texts
 * @param {string} [langCode]
 * @returns {Promise<void>}
 */
export function readAloudPages(texts, langCode = 'en') {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    return Promise.reject(new Error('Speech not supported'));
  }

  stopReadAloud();

  const locale = LANG_MAP[langCode] || LANG_MAP.en;
  const combined = texts.filter(Boolean).join(' … ');

  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(combined);
    utterance.lang = locale;
    utterance.rate = 0.92;

    const voices = window.speechSynthesis.getVoices();
    const match = voices.find((v) => v.lang.startsWith(langCode)) || voices.find((v) => v.lang.startsWith('en'));
    if (match) utterance.voice = match;

    utterance.onend = () => {
      activeUtterance = null;
      resolve();
    };
    utterance.onerror = (e) => {
      activeUtterance = null;
      reject(e.error || new Error('Speech failed'));
    };

    activeUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  });
}

export function isReadAloudSupported() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

export default readAloudPages;
