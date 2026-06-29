import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { isPremiumActive } from '../utils/membership';
import { readLocalPremium } from '../utils/localPremium';
import { PREMIUM_STORAGE_KEY, PLANS } from '../constants/premium';

const AuthContext = createContext(null);

async function fetchProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, display_name, role, created_at')
    .eq('id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

async function fetchMembership(userId) {
  const { data, error } = await supabase
    .from('memberships')
    .select('user_id, plan, status, source, trial_ends_at, premium_until, promo_code_id, updated_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [membership, setMembership] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localPremiumTick, setLocalPremiumTick] = useState(0);

  const refreshProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      setMembership(null);
      return;
    }
    const [p, m] = await Promise.all([fetchProfile(userId), fetchMembership(userId)]);
    setProfile(p);
    setMembership(m);
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session: s } }) => {
      if (!mounted) return;
      setSession(s);
      if (s?.user) {
        refreshProfile(s.user.id).finally(() => mounted && setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s);
      if (s?.user) {
        refreshProfile(s.user.id);
      } else {
        setProfile(null);
        setMembership(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [refreshProfile]);

  const signUp = useCallback(async ({ email, password, displayName }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    });
    if (error) throw error;
    return data;
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  }, []);

  const updateDisplayName = useCallback(async (displayName) => {
    if (!session?.user) throw new Error('Not signed in');
    const { error } = await supabase
      .from('profiles')
      .update({ display_name: displayName, updated_at: new Date().toISOString() })
      .eq('id', session.user.id);
    if (error) throw error;
    setProfile((prev) => (prev ? { ...prev, display_name: displayName } : prev));
  }, [session]);

  const redeemPromoCode = useCallback(async (code) => {
    const { data, error } = await supabase.rpc('redeem_promo_code', { p_code: code });
    if (error) throw error;
    if (session?.user) await refreshProfile(session.user.id);
    return data;
  }, [session, refreshProfile]);

  const isAdmin = profile?.role === 'admin';
  const isStaff = profile?.role === 'admin' || profile?.role === 'support';

  const serverPremium = isPremiumActive(membership);
  const localPremium = useMemo(() => {
    if (session?.user) return false;
    return readLocalPremium().active;
  }, [session, localPremiumTick]);

  const isPremium = session?.user ? serverPremium : localPremium;

  const startLocalTrial = useCallback(() => {
    const ends = new Date();
    ends.setDate(ends.getDate() + PLANS.premium.trialDays);
    localStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify({
      tier: 'premium',
      trialEndsAt: ends.toISOString(),
    }));
    setLocalPremiumTick((t) => t + 1);
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    membership,
    loading,
    isPremium,
    isAdmin,
    isStaff,
    signUp,
    signIn,
    signOut,
    updateDisplayName,
    redeemPromoCode,
    refreshProfile,
    startLocalTrial,
  }), [
    session, profile, membership, loading, isPremium, isAdmin, isStaff,
    signUp, signIn, signOut, updateDisplayName, redeemPromoCode, refreshProfile, startLocalTrial,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** Membership-focused alias used by PremiumGate / Premium page */
export function useMembership() {
  const auth = useAuth();
  return {
    isPremium: auth.isPremium,
    membership: auth.membership,
    user: auth.user,
    loading: auth.loading,
    redeemPromoCode: auth.redeemPromoCode,
    startLocalTrial: auth.startLocalTrial,
    refreshProfile: auth.refreshProfile,
  };
}
