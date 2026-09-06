import { useCallback, useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';
import useEntitlements from './useEntitlements';
import { ENTITLEMENT_LIMITS } from '../constants/premium';
import { ensurePrimaryBabyProfile } from '../utils/babyCloud';
import { createSignedUrl, uploadPrivateObject } from '../utils/storageUrl';

const LOCAL_KEY = 'yarntrailsVoiceNotes';

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

async function hydrateNote(row) {
  if (row?.data_url) return row;
  if (!row?.storage_path) return row;
  const url = await createSignedUrl(supabase, 'voice-notes', row.storage_path);
  return { ...row, data_url: url };
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
      const hydrated = await Promise.all((data || []).map(hydrateNote));
      setNotes(hydrated);
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

      const profile = await ensurePrimaryBabyProfile(user.id);
      const id = crypto.randomUUID();
      const path = `${user.id}/${id}.webm`;
      await uploadPrivateObject(supabase, 'voice-notes', path, blob, blob.type || 'audio/webm');

      const { data, error: insErr } = await supabase
        .from('voice_notes')
        .insert({
          id,
          user_id: user.id,
          baby_profile_id: profile?.id || null,
          storage_path: path,
          duration_seconds: durationSeconds,
          attach_type: attachType || null,
          attach_id: attachId || null,
        })
        .select()
        .single();
      if (insErr) throw insErr;
      await refreshUsage();
      const hydrated = await hydrateNote(data);
      setNotes((prev) => [hydrated, ...prev]);
      return hydrated;
    }

    if (!state.voiceNotes.canRecord) {
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

    const local = [entry, ...loadLocal()];
    saveLocal(local);
    setNotes(local);
    return entry;
  }, [user, state, checkVoiceQuota, refreshUsage]);

  const removeNote = useCallback(async (id) => {
    if (user) {
      const existing = notes.find((n) => n.id === id);
      if (existing?.storage_path) {
        await supabase.storage.from('voice-notes').remove([existing.storage_path]);
      }
      await supabase.from('voice_notes').delete().eq('id', id).eq('user_id', user.id);
      await refreshUsage();
    } else {
      saveLocal(loadLocal().filter((n) => n.id !== id));
    }
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }, [user, refreshUsage, notes]);

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
