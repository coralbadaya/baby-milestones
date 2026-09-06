import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { isDomainMerged, markDomainMerged } from '../utils/cloudMerge';

const STORAGE_KEY = 'coral_saved_recipes';

function loadSaved() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return [];
}

export function useSavedRecipes() {
  const { user, loading: authLoading } = useAuth();
  const [savedIds, setSavedIds] = useState(loadSaved);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    if (authLoading || !user?.id) return undefined;
    let cancelled = false;

    async function sync() {
      const { data, error } = await supabase
        .from('user_saved_recipes')
        .select('recipe_id')
        .eq('user_id', user.id);
      if (cancelled || error) return;
      const cloudIds = (data || []).map((r) => r.recipe_id);

      if (!isDomainMerged(user.id, 'recipes')) {
        const merged = [...new Set([...loadSaved(), ...cloudIds])];
        setSavedIds(merged);
        const toInsert = merged.filter((id) => !cloudIds.includes(id));
        if (toInsert.length) {
          await supabase.from('user_saved_recipes').upsert(
            toInsert.map((recipe_id) => ({ user_id: user.id, recipe_id })),
          );
        }
        markDomainMerged(user.id, 'recipes');
      } else {
        setSavedIds(cloudIds);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  const saveRecipe = useCallback((id) => {
    setSavedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    if (user?.id) {
      supabase.from('user_saved_recipes').upsert({ user_id: user.id, recipe_id: id });
    }
  }, [user]);

  const unsaveRecipe = useCallback((id) => {
    setSavedIds((prev) => prev.filter((x) => x !== id));
    if (user?.id) {
      supabase.from('user_saved_recipes').delete().eq('user_id', user.id).eq('recipe_id', id);
    }
  }, [user]);

  const isSaved = useCallback((id) => savedIds.includes(id), [savedIds]);

  return { savedIds, saveRecipe, unsaveRecipe, isSaved };
}
