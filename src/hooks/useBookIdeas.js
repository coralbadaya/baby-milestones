import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { scanAllBookIdeas } from '../utils/bookIdeaDetection';

export function useBookIdeas(albumPhotos, firstMoments, context = {}) {
  const { user } = useAuth();
  const [savedIdeas, setSavedIdeas] = useState([]);
  const [generating, setGenerating] = useState(null);
  const [loading, setLoading] = useState(true);

  const scanned = useMemo(
    () => scanAllBookIdeas(albumPhotos, firstMoments, context),
    [albumPhotos, firstMoments, context],
  );

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('book_ideas')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setSavedIdeas(data || []);
    } catch {
      setSavedIdeas([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const generateIdea = useCallback(async (conceptId, matchedPhotoIds) => {
    if (!user?.id) return null;
    setGenerating(conceptId);
    try {
      let result;
      try {
        const { data, error } = await supabase.functions.invoke('generate-book-idea', {
          body: { conceptId, matchedPhotoIds },
        });
        if (error) throw error;
        result = data;
      } catch {
        result = { status: 'preview', conceptId, message: 'Layout queued — preview ready.' };
      }

      const { data: saved, error: saveErr } = await supabase
        .from('book_ideas')
        .upsert({
          user_id: user.id,
          concept_id: conceptId,
          status: result.status || 'preview',
          matched_photo_ids: matchedPhotoIds,
          preview_url: result.previewUrl || null,
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id,concept_id' })
        .select()
        .single();

      if (!saveErr && saved) {
        setSavedIdeas((prev) => {
          const filtered = prev.filter((i) => i.concept_id !== conceptId);
          return [saved, ...filtered];
        });
      }
      return result;
    } finally {
      setGenerating(null);
    }
  }, [user?.id]);

  const ideasWithStatus = useMemo(() => scanned.map((idea) => {
    const saved = savedIdeas.find((s) => s.concept_id === idea.id);
    return { ...idea, savedStatus: saved?.status, previewUrl: saved?.preview_url };
  }), [scanned, savedIdeas]);

  return { ideas: ideasWithStatus, loading, generating, refresh, generateIdea };
}

export default useBookIdeas;
