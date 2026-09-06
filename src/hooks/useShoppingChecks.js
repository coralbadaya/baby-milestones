import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import {
  checksToRpcItems,
  isDomainMerged,
  markDomainMerged,
  migrateLegacyShoppingSplit,
  SHOPPING_CHECKS_KEY,
  unionChecks,
} from '../utils/cloudMerge';

function loadLocal() {
  migrateLegacyShoppingSplit();
  try {
    const raw = localStorage.getItem(SHOPPING_CHECKS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function useShoppingChecks(babyProfileId) {
  const { user, loading: authLoading } = useAuth();
  const [checkedItems, setCheckedItems] = useState(loadLocal);
  const debounceRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(SHOPPING_CHECKS_KEY, JSON.stringify(checkedItems));
  }, [checkedItems]);

  const pushCloud = useCallback((map) => {
    if (!user?.id || !babyProfileId) return;
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      supabase.rpc('upsert_shopping_checks', {
        p_baby_id: babyProfileId,
        p_items: checksToRpcItems(map),
      });
    }, 300);
  }, [user?.id, babyProfileId]);

  useEffect(() => {
    if (authLoading || !user?.id || !babyProfileId) return undefined;
    let cancelled = false;

    async function sync() {
      const { data, error } = await supabase
        .from('shopping_checks')
        .select('item_id, checked')
        .eq('baby_profile_id', babyProfileId);

      if (cancelled || error) return;
      const cloudIds = (data || []).filter((r) => r.checked).map((r) => r.item_id);

      if (!isDomainMerged(user.id, 'shopping')) {
        const local = loadLocal();
        const merged = unionChecks(local, cloudIds);
        setCheckedItems(merged);
        await supabase.rpc('upsert_shopping_checks', {
          p_baby_id: babyProfileId,
          p_items: checksToRpcItems(merged),
        });
        markDomainMerged(user.id, 'shopping');
      } else {
        const next = {};
        for (const id of cloudIds) next[id] = true;
        setCheckedItems(next);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [user?.id, babyProfileId, authLoading]);

  const toggleCheck = useCallback((id) => {
    setCheckedItems((prev) => {
      const next = { ...prev, [id]: !prev[id] };
      pushCloud(next);
      return next;
    });
  }, [pushCloud]);

  return { checkedItems, toggleCheck };
}

export default useShoppingChecks;
