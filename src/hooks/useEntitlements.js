import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { buildEntitlementState, canUseFeature, entitlementBlockedMessage } from '../utils/entitlements';

async function fetchUsageEntitlements(userId) {
  const { data, error } = await supabase
    .from('usage_entitlements')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error && error.code !== 'PGRST116') throw error;
  return data;
}

export function useEntitlements() {
  const { user, membership, isPremium, refreshProfile } = useAuth();
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(false);

  const refreshUsage = useCallback(async () => {
    if (!user?.id) {
      setUsage(null);
      return null;
    }
    setLoading(true);
    try {
      const row = await fetchUsageEntitlements(user.id);
      setUsage(row);
      return row;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshUsage();
  }, [refreshUsage, membership?.updated_at]);

  const state = useMemo(() => {
    if (!user) {
      return buildEntitlementState(
        isPremium ? { status: 'trial', trial_ends_at: new Date(Date.now() + 86400000).toISOString() } : null,
        usage,
      );
    }
    return buildEntitlementState(membership, usage);
  }, [user, membership, usage, isPremium]);

  return {
    usage,
    loading,
    state,
    isPlus: state.isPlus,
    refreshUsage,
    refreshAll: async () => {
      await refreshProfile(user?.id);
      return refreshUsage();
    },
    canUseFeature: (feature) => canUseFeature(state, feature),
    blockedMessage: (feature) => entitlementBlockedMessage(state, feature),
    checkPhotoUpload: () => supabase.rpc('check_and_increment_photo_usage'),
    recordStoryGeneration: () => supabase.rpc('record_story_generation'),
    checkVoiceQuota: () => supabase.rpc('check_voice_note_quota'),
    offerAnnualTrial: () => supabase.rpc('offer_annual_trial'),
  };
}

export default useEntitlements;
