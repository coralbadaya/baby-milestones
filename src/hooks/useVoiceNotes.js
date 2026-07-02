import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import useEntitlements from './useEntitlements';
import { ENTITLEMENT_LIMITS } from '../constants/premium';

const LOCAL_KEY = 'nestbeanVoiceNotes';

function loadLocal() {
  try {
    const raw = localStorage.getItem(LOCAL_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveLocal(items) {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(items));
}

export function useVoiceNotes() {
  const { user } = useAuth();
  const { state, checkVoiceQuota, refreshUsage } = useEntitlements();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadNotes = useCallback(async () => {
    setLoading(true);
    if (user) {
      const { data } = await supabase
        .from('voice_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setNotes(data || []);
    } else {
      setNotes(loadLocal());
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const saveNote = useCallback(async (blob, { attachType, attachId, durationSeconds }) => {
    if (durationSeconds > ENTITLEMENT_LIMITS.voiceNoteMaxSeconds) {
      throw new Error(`Voice notes are limited to ${ENTITLEMENT_LIMITS.voiceNoteMaxSeconds} seconds on Basic.`);
    }

    if (user) {
      const { data: quota, error: qErr } = await checkVoiceQuota();
      if (qErr) throw qErr;
      if (!quota?.allowed) {
        throw new Error('Voice note limit reached — upgrade to Plus for unlimited notes.');
      }
    } else if (!state.voiceNotes.canRecord) {
      throw new Error('Sign in to sync voice notes, or upgrade to Plus.');
    }

    const dataUrl = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const entry = {
      id: crypto.randomUUID(),
      data_url: dataUrl,
      duration_seconds: durationSeconds,
      attach_type: attachType || null,
      attach_id: attachId || null,
      created_at: new Date().toISOString(),
    };

    if (user) {
      const { data, error: insErr } = await supabase
        .from('voice_notes')
        .insert({ ...entry, user_id: user.id })
        .select()
        .single();
      if (insErr) throw insErr;
      await refreshUsage();
      setNotes((prev) => [data, ...prev]);
      return data;
    }

    const local = [entry, ...loadLocal()];
    saveLocal(local);
    setNotes(local);
    return entry;
  }, [user, state, checkVoiceQuota, refreshUsage]);

  const removeNote = useCallback(async (id) => {
    if (user) {
      await supabase.from('voice_notes').delete().eq('id', id).eq('user_id', user.id);
      await refreshUsage();
    } else {
      saveLocal(loadLocal().filter((n) => n.id !== id));
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, [user, refreshUsage]);

  return {
    notes,
    loading,
    quota: state.voiceNotes,
    isPlus: state.isPlus,
    saveNote,
    removeNote,
    reload: loadNotes,
  };
}

export default useVoiceNotes;
