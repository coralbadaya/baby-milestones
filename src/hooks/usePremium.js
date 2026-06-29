import { useCallback, useState, useEffect } from 'react';
import { PREMIUM_STORAGE_KEY, PLANS } from '../constants/premium';

function readPremiumState() {
  try {
    const raw = localStorage.getItem(PREMIUM_STORAGE_KEY);
    if (!raw) return { tier: 'free', trialEndsAt: null };
    return JSON.parse(raw);
  } catch {
    return { tier: 'free', trialEndsAt: null };
  }
}

function isTrialActive(trialEndsAt) {
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt) > new Date();
}

export function usePremium() {
  const [state, setState] = useState(readPremiumState);

  useEffect(() => {
    localStorage.setItem(PREMIUM_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const isPremium =
    state.tier === 'premium' || isTrialActive(state.trialEndsAt);

  const startTrial = useCallback(() => {
    const ends = new Date();
    ends.setDate(ends.getDate() + PLANS.premium.trialDays);
    setState({ tier: 'premium', trialEndsAt: ends.toISOString() });
  }, []);

  const setPremium = useCallback((active) => {
    setState(active
      ? { tier: 'premium', trialEndsAt: null }
      : { tier: 'free', trialEndsAt: null });
  }, []);

  const clearPremium = useCallback(() => {
    setState({ tier: 'free', trialEndsAt: null });
  }, []);

  return {
    isPremium,
    tier: state.tier,
    trialEndsAt: state.trialEndsAt,
    startTrial,
    setPremium,
    clearPremium,
  };
}
