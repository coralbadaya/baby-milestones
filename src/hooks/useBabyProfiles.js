import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';

export function useBabyProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [capsules, setCapsules] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [profilesRes, capsulesRes] = await Promise.all([
        supabase.from('baby_profiles').select('*').order('is_primary', { ascending: false }),
        supabase.from('time_capsules').select('*').order('created_at', { ascending: false }),
      ]);
      setProfiles(profilesRes.data || []);
      setCapsules(capsulesRes.data || []);
    } catch {
      setProfiles([]);
      setCapsules([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const ensurePrimaryProfile = useCallback(async (name, birthDate) => {
    const existing = profiles.find((p) => p.is_primary);
    if (existing) return existing;
    if (!user?.id) throw new Error('Sign in required');

    const { data, error } = await supabase
      .from('baby_profiles')
      .insert({
        user_id: user.id,
        name: name || 'Baby',
        birth_date: birthDate || null,
        is_primary: true,
      })
      .select()
      .single();
    if (error) throw error;
    setProfiles((prev) => [data, ...prev]);
    return data;
  }, [profiles, user?.id]);

  const createTimeCapsule = useCallback(async ({ babyProfileId, contentText, unlockAt, sealedForPrint = true }) => {
    if (!user?.id) throw new Error('Sign in required');
    const { data, error } = await supabase
      .from('time_capsules')
      .insert({
        user_id: user.id,
        baby_profile_id: babyProfileId,
        content_text: contentText,
        unlock_at: unlockAt,
        sealed_for_print: sealedForPrint,
      })
      .select()
      .single();
    if (error) throw error;
    setCapsules((prev) => [data, ...prev]);
    return data;
  }, []);

  const primaryProfile = profiles.find((p) => p.is_primary) || profiles[0] || null;

  return {
    profiles,
    primaryProfile,
    capsules,
    loading,
    refresh,
    ensurePrimaryProfile,
    createTimeCapsule,
  };
}

export default useBabyProfiles;
