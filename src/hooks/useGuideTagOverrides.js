import { useCallback, useEffect, useState } from 'react';
import { fetchGuideTagOverrides } from '../utils/guideTagAdmin';
import { supabase } from '../utils/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';

/**
 * Staff-edited tag lists from `guide_tag_overrides`. Empty map when the table is missing.
 */
export function useGuideTagOverrides() {
  const [overrides, setOverrides] = useState({});
  const [loading, setLoading] = useState(Boolean(supabaseUrl));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!supabaseUrl) {
      setOverrides({});
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    try {
      const map = await fetchGuideTagOverrides(supabase);
      setOverrides(map);
      setError(null);
    } catch (err) {
      setOverrides({});
      setError(err.message || 'Could not load guide tags');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { overrides, loading, error, reload: load };
}
