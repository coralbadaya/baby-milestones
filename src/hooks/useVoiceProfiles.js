import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';

export function useVoiceProfiles() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState([]);
  const [blessings, setBlessings] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const [profilesRes, blessingsRes] = await Promise.all([
        supabase.from('voice_profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('voice_blessings').select('*, voice_profiles(display_name, role, language)').order('created_at', { ascending: false }),
      ]);
      setProfiles(profilesRes.data || []);
      setBlessings(blessingsRes.data || []);
    } catch {
      setProfiles([]);
      setBlessings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const createProfile = useCallback(async ({ role, displayName, language }) => {
    if (!user?.id) throw new Error('Sign in required');
    const { data, error } = await supabase
      .from('voice_profiles')
      .insert({
        owner_user_id: user.id,
        role: role || 'parent',
        display_name: displayName,
        language: language || 'en',
        status: 'pending',
      })
      .select()
      .single();
    if (error) throw error;
    setProfiles((prev) => [data, ...prev]);
    return data;
  }, [user?.id]);

  const createGrandparentInvite = useCallback(async (displayName, language) => {
    const profile = await createProfile({
      role: 'grandparent',
      displayName,
      language,
    });
    return profile;
  }, [createProfile]);

  const approveProfile = useCallback(async (profileId) => {
    const { data, error } = await supabase
      .from('voice_profiles')
      .update({ status: 'active' })
      .eq('id', profileId)
      .select()
      .single();
    if (error) throw error;
    setProfiles((prev) => prev.map((p) => (p.id === profileId ? data : p)));
    return data;
  }, []);

  const uploadVoiceSample = useCallback(async (profileId, blob, durationSeconds) => {
    const path = `voice-samples/${profileId}-${Date.now()}.webm`;
    const { error: uploadErr } = await supabase.storage
      .from('voice-notes')
      .upload(path, blob, { contentType: 'audio/webm', upsert: true });
    if (uploadErr) throw uploadErr;

    const { data, error } = await supabase
      .from('voice_profiles')
      .update({
        sample_storage_path: path,
        status: 'pending',
        consent_signed_at: new Date().toISOString(),
      })
      .eq('id', profileId)
      .select()
      .single();
    if (error) throw error;

    try {
      await supabase.functions.invoke('clone-voice-profile', {
        body: { profileId, durationSeconds },
      });
    } catch {
      /* clone runs async; profile saved regardless */
    }

    setProfiles((prev) => prev.map((p) => (p.id === profileId ? data : p)));
    return data;
  }, []);

  const getInviteUrl = useCallback((profile) => {
    if (!profile?.invite_token) return '';
    const base = typeof window !== 'undefined' ? window.location.origin : '';
    return `${base}/book/voice-invite/${profile.invite_token}`;
  }, []);

  return {
    profiles,
    blessings,
    loading,
    refresh,
    createProfile,
    createGrandparentInvite,
    approveProfile,
    uploadVoiceSample,
    getInviteUrl,
  };
}

export default useVoiceProfiles;
