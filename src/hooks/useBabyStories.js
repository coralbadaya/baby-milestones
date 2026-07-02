import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { generateDemoStory } from '../utils/storyGeneration';

export function useBabyStories() {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('baby_stories')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setStories(data || []);
    } catch {
      setStories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const generateStory = useCallback(async (opts, recordGeneration) => {
    setGenerating(true);
    try {
      let storyPayload;
      let quotaResult = null;
      if (recordGeneration) {
        const { data: quota, error: quotaErr } = await recordGeneration();
        if (quotaErr) throw quotaErr;
        quotaResult = quota;
        if (!quota?.allowed) {
          return { ok: false, blocked: true, quota };
        }
      }

      try {
        const { data, error } = await supabase.functions.invoke('generate-baby-story', {
          body: opts,
        });
        if (error) throw error;
        storyPayload = data;
      } catch {
        storyPayload = generateDemoStory({
          ...opts,
          sceneId: opts.sceneId || 'astronaut',
        });
      }

      try {
        const { data: saved, error: saveErr } = await supabase
          .from('baby_stories')
          .insert({
            title: storyPayload.title,
            pages: storyPayload.pages,
            language: opts.language || 'en',
            language_variants: storyPayload.languageVariants,
            folk_template_id: opts.folkTemplateId || null,
            persona: opts.persona || 'gentle',
            art_style: opts.artStyle || 'watercolor',
          })
          .select()
          .single();

        if (!saveErr && saved) {
          setStories((prev) => [saved, ...prev]);
          return { ok: true, story: saved, quota: quotaResult };
        }
      } catch {
        /* persist optional when offline / unsigned */
      }

      return { ok: true, story: storyPayload, quota: quotaResult };
    } finally {
      setGenerating(false);
    }
  }, []);

  return { stories, loading, generating, refresh, generateStory };
}

export default useBabyStories;
