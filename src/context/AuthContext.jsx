import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { isPremiumActive } from '../utils/membership';
import { readLocalPremium } from '../utils/localPremium';
import { PREMIUM_STORAGE_KEY, PLANS } from '../constants/premium';
import { isEmailNotConfirmedError, isEmailVerified, isInvalidCredentialsError } from '../utils/auth';
import { trackEvent } from '../utils/analytics';

const AuthContext = createContext(null);

export { isEmailVerified };

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
  const [profileLoading, setProfileLoading] = useState(false);
  const [localPremiumTick, setLocalPremiumTick] = useState(0);

  const refreshProfile = useCallback(async (userId) => {
    if (!userId) {
      setProfile(null);
      setMembership(null);
      setProfileLoading(false);
      return;
    }
    setProfileLoading(true);
    try {
      const [p, m] = await Promise.all([fetchProfile(userId), fetchMembership(userId)]);
      setProfile(p);
      setMembership(m);
    } finally {
      setProfileLoading(false);
    }
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
        setProfileLoading(false);
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

  const confirmEmailForLogin = useCallback(async (email, password) => {
    const res = await fetch('/api/auth-confirm-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(payload.error || 'Could not open this account yet.');
    }
  }, []);

  const continueWithPassword = useCallback(async ({ email, password, displayName }) => {
    const trimmed = email.trim();
    const first = await supabase.auth.signInWithPassword({ email: trimmed, password });
    if (!first.error) {
      return { action: 'signin', ...first.data };
    }

    if (isEmailNotConfirmedError(first.error)) {
      await confirmEmailForLogin(trimmed, password);
      const retry = await supabase.auth.signInWithPassword({ email: trimmed, password });
      if (retry.error) throw retry.error;
      return { action: 'signin', ...retry.data };
    }

    if (!isInvalidCredentialsError(first.error)) {
      throw first.error;
    }

    const { data: signedUp, error: signUpError } = await supabase.auth.signUp({
      email: trimmed,
      password,
      options: { data: { display_name: displayName || undefined } },
    });
    if (signUpError) throw signUpError;
    if (signedUp.session) {
      return { action: 'signup', ...signedUp };
    }
    const created = (signedUp.user?.identities?.length ?? 0) > 0;
    if (!created) {
      throw new Error('Invalid email or password.');
    }

    try {
      await confirmEmailForLogin(trimmed, password);
    } catch {
      return { action: 'signup', ...signedUp };
    }
    const after = await supabase.auth.signInWithPassword({ email: trimmed, password });
    if (after.error) throw after.error;
    return { action: 'signup', ...after.data };
  }, [confirmEmailForLogin]);

  const verifyEmailOtp = useCallback(async ({ email, token }) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    });
    if (error) throw error;
    return data;
  }, []);

  const resendSignupOtp = useCallback(async (email) => {
    const { data, error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });
    if (error) throw error;
    return data;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await trackEvent('logout_completed');
    } catch {
      /* still sign out */
    }
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
  const isPlus = isPremium;

  const startLocalTrial = useCallback(() => {
    const ends = new Date();
    ends.setDate(ends.getDate() + PLANS.plus.trialDays);
    localStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify({
      tier: 'plus',
      trialEndsAt: ends.toISOString(),
    }));
    setLocalPremiumTick((t) => t + 1);
    trackEvent('trial_started');
  }, []);

  const value = useMemo(() => ({
    session,
    user: session?.user ?? null,
    profile,
    membership,
    loading,
    profileLoading,
    isPremium,
    isPlus,
    isAdmin,
    isStaff,
    signUp,
    signIn,
    continueWithPassword,
    verifyEmailOtp,
    resendSignupOtp,
    signOut,
    updateDisplayName,
    redeemPromoCode,
    refreshProfile,
    startLocalTrial,
  }), [
    session, profile, membership, loading, profileLoading, isPremium, isPlus, isAdmin, isStaff,
    signUp, signIn, continueWithPassword, verifyEmailOtp, resendSignupOtp, signOut,
    updateDisplayName, redeemPromoCode, refreshProfile, startLocalTrial,
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
