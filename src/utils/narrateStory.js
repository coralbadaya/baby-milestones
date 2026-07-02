import { supabase } from './supabaseClient';

/**
 * Play story pages using ElevenLabs clone when available; falls back to speechSynthesis.
 * @param {{ texts: string[], languageCode: string, voiceId?: string|null, useClone?: boolean }} opts
 */
export async function narrateStoryPages(opts) {
  const { texts, languageCode, voiceId, useClone } = opts;
  const combined = texts.filter(Boolean).join(' … ');

  if (useClone && voiceId) {
    try {
      const { data, error } = await supabase.functions.invoke('narrate-story-page', {
        body: { text: combined, voiceId, languageCode },
      });
      if (error) throw error;

      if (data instanceof Blob) {
        const url = URL.createObjectURL(data);
        const audio = new Audio(url);
        await audio.play();
        return { mode: 'clone' };
      }

      if (data?.arrayBuffer) {
        const blob = new Blob([data], { type: 'audio/mpeg' });
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);
        await audio.play();
        return { mode: 'clone' };
      }
    } catch {
      /* fall through to browser TTS */
    }
  }

  const { readAloudPages } = await import('./storyNarration');
  await readAloudPages(texts, languageCode);
  return { mode: 'storyteller' };
}

export default narrateStoryPages;
