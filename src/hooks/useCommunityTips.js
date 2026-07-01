import { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { rowToTip } from '../utils/community';
import { parentingTips as fallbackTips } from '../data/parentingTips';

export function useCommunityTips() {
  const [tips, setTips] = useState(fallbackTips);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from('community_tips')
        .select('*')
        .eq('published', true)
        .order('sort_order')
        .order('title');

      if (!cancelled) {
        if (!error && data?.length) {
          setTips(data.map(rowToTip));
        }
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return { tips, loading };
}
