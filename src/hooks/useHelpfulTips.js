import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { isDomainMerged, markDomainMerged } from '../utils/cloudMerge';

const STORAGE_KEY = 'coral_helpful_tips';

function loadHelpful() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* ignore */
  }
  return {};
}

export function useHelpfulTips() {
  const { user, loading: authLoading } = useAuth();
  const [helpful, setHelpful] = useState(loadHelpful);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(helpful));
  }, [helpful]);

  useEffect(() => {
    if (authLoading || !user?.id) return undefined;
    let cancelled = false;

    async function sync() {
      const { data, error } = await supabase
        .from('user_helpful_tips')
        .select('tip_id, count')
        .eq('user_id', user.id);
      if (cancelled || error) return;

      const cloud = {};
      for (const row of data || []) cloud[row.tip_id] = row.count;

      if (!isDomainMerged(user.id, 'tips')) {
        const local = loadHelpful();
        const merged = { ...local };
        for (const [id, count] of Object.entries(cloud)) {
          merged[id] = Math.max(merged[id] || 0, count);
        }
        setHelpful(merged);
        const rows = Object.entries(merged).map(([tip_id, count]) => ({
          user_id: user.id,
          tip_id,
          count,
        }));
        if (rows.length) await supabase.from('user_helpful_tips').upsert(rows);
        markDomainMerged(user.id, 'tips');
      } else {
        setHelpful(cloud);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [user?.id, authLoading]);

  const markHelpful = useCallback((tipId) => {
    setHelpful((prev) => {
      const nextCount = (prev[tipId] || 0) + 1;
      if (user?.id) {
        supabase.from('user_helpful_tips').upsert({
          user_id: user.id,
          tip_id: tipId,
          count: nextCount,
        });
      }
      return { ...prev, [tipId]: nextCount };
    });
  }, [user]);

  const getCount = useCallback((tipId) => helpful[tipId] || 0, [helpful]);

  return { markHelpful, getCount };
}
