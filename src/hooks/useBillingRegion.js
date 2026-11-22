import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';

const CACHE_KEY = 'yarntrailsBillingRegion';

/**
 * @returns {{
 *   region: 'IN' | 'ROW' | null,
 *   currency: string | null,
 *   provider: string | null,
 *   label: string | null,
 *   country: string | null,
 *   source: string | null,
 *   loading: boolean,
 *   refresh: () => Promise<void>,
 * }}
 */
export function useBillingRegion() {
  const [state, setState] = useState(() => {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) return { ...JSON.parse(raw), loading: true };
    } catch {
      /* ignore */
    }
    return { loading: true, region: null, currency: null, provider: null, label: null, country: null, source: null };
  });

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));
    const { data: { session } } = await supabase.auth.getSession();
    const headers = {};
    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }
    try {
      const res = await fetch('/api/billing-region', { headers, credentials: 'include' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Region lookup failed');
      const next = {
        loading: false,
        region: data.region,
        currency: data.currency,
        provider: data.provider,
        label: data.label,
        country: data.country,
        source: data.source,
      };
      sessionStorage.setItem(CACHE_KEY, JSON.stringify(next));
      setState(next);
    } catch {
      const fallback = {
        loading: false,
        region: 'IN',
        currency: 'INR',
        provider: 'razorpay',
        label: 'India',
        country: null,
        source: 'fallback',
      };
      setState(fallback);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      refresh();
    });
    return () => subscription.unsubscribe();
  }, [refresh]);

  return { ...state, refresh };
}