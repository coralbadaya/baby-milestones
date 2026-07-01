import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { rowToRecipe } from '../utils/community';
import { recipes as fallbackRecipes } from '../data/recipes';

export function useCommunityRecipes() {
  const [recipes, setRecipes] = useState(fallbackRecipes);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from('community_recipes')
        .select('*')
        .eq('published', true)
        .order('sort_order')
        .order('title');

      if (!cancelled) {
        if (!error && data?.length) {
          setRecipes(data.map(rowToRecipe));
        }
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { recipes, loading };
}
