import { useCallback, useEffect, useState } from 'react';
import { buildDiyGlobalDefault, buildDiyImageOverrides } from '../data/diyImages';
import { supabase } from '../utils/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';

/**
 * Fetch per-activity DIY image overrides and the site-wide default from Supabase.
 * Returns empty overrides / null default when Supabase is unavailable.
 */
export function useDiyImages() {
  const [overrides, setOverrides] = useState({});
  const [globalDefault, setGlobalDefault] = useState(null);
  const [loading, setLoading] = useState(Boolean(supabaseUrl));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!supabaseUrl) {
      setOverrides({});
      setGlobalDefault(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const [imagesResult, defaultResult] = await Promise.all([
      supabase
        .from('diy_activity_images')
        .select('activity_id, storage_path, alt_text, source'),
      supabase
        .from('diy_image_defaults')
        .select('storage_path, alt_text')
        .eq('id', 'global')
        .maybeSingle(),
    ]);

    if (imagesResult.error) {
      setError(imagesResult.error.message);
      setOverrides({});
    } else {
      setOverrides(buildDiyImageOverrides(imagesResult.data || [], supabaseUrl));
    }

    if (defaultResult.error) {
      setGlobalDefault(null);
    } else {
      setGlobalDefault(buildDiyGlobalDefault(defaultResult.data, supabaseUrl));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { overrides, globalDefault, loading, error, refetch: load };
}

export default useDiyImages;
