import { useCallback, useEffect, useState } from 'react';
import { buildDiyImageOverrides } from '../data/diyImages';
import { supabase } from '../utils/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';

/**
 * Fetch per-activity DIY image overrides from Supabase.
 * Returns empty overrides when Supabase is unavailable.
 */
export function useDiyImages() {
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(Boolean(supabaseUrl));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!supabaseUrl) {
      setOverrides({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: fetchError } = await supabase
      .from('diy_activity_images')
      .select('activity_id, storage_path, alt_text');

    if (fetchError) {
      setError(fetchError.message);
      setOverrides({});
    } else {
      setOverrides(buildDiyImageOverrides(data || [], supabaseUrl));
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { overrides, loading, error, refetch: load };
}

export default useDiyImages;
