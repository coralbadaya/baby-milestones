import { useCallback, useEffect, useMemo, useState } from 'react';
import { mergeDiyActivitiesByMonth } from '../utils/diyActivitiesMerge';
import { fetchAllDiyContentRows } from '../utils/diyActivityAdmin';
import { supabase } from '../utils/supabaseClient';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';

/**
 * Fetch DIY activity content overrides and merge with bundled static data.
 */
export function useDiyActivities() {
  const [contentById, setContentById] = useState({});
  const [loading, setLoading] = useState(Boolean(supabaseUrl));
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    if (!supabaseUrl) {
      setContentById({});
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const rows = await fetchAllDiyContentRows(supabase);
      setContentById(Object.fromEntries(rows.map((row) => [row.activity_id, row])));
    } catch (fetchError) {
      setError(fetchError.message);
      setContentById({});
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activitiesByMonth = useMemo(
    () => mergeDiyActivitiesByMonth(contentById),
    [contentById],
  );

  return {
    activitiesByMonth,
    contentById,
    loading,
    error,
    refetch: load,
  };
}

export default useDiyActivities;
