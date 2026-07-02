import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import useEntitlements from './useEntitlements';
import { supabase } from '../utils/supabaseClient';
import { fileToDataUrl } from '../utils/firstMomentsStorage';

const LOCAL_KEY = 'nestbeanAlbumPhotos';

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

export function useMonthlyAlbum(currentMonth = 1) {
  const { user } = useAuth();
  const { state, isPlus, checkPhotoUpload, refreshUsage } = useEntitlements();
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const quota = {
    used: state.photos.used,
    limit: state.photos.limit,
    remaining: state.photos.remaining,
    canUpload: state.photos.canUpload,
  };

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      if (user) {
        const { data, error: fetchErr } = await supabase
          .from('album_photos')
          .select('*')
          .eq('user_id', user.id)
          .order('captured_at', { ascending: false });
        if (fetchErr) throw fetchErr;
        setPhotos(data || []);
      } else {
        setPhotos(loadLocal());
      }
    } catch (err) {
      setPhotos(loadLocal());
      setError(err.message || 'Could not load album photos');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const uploadPhoto = useCallback(async (file, caption = '') => {
    if (!file?.type?.startsWith('image/')) {
      throw new Error('Please choose an image file.');
    }

    setError(null);
    const dataUrl = await fileToDataUrl(file);

    if (user) {
      const { data: quotaResult, error: qErr } = await checkPhotoUpload();
      if (qErr) throw qErr;
      if (!quotaResult?.allowed) {
        throw new Error('Monthly photo limit reached — upgrade to Plus for unlimited HD uploads.');
      }

      const { data, error: insErr } = await supabase
        .from('album_photos')
        .insert({
          user_id: user.id,
          data_url: dataUrl,
          caption: caption.trim() || null,
          photo_month: currentMonth,
          is_hd: isPlus,
        })
        .select()
        .single();

      if (insErr) throw insErr;
      await refreshUsage();
      setPhotos((prev) => [data, ...prev]);
      return data;
    }

    if (!state.photos.canUpload && !isPlus) {
      throw new Error('Sign in to sync your album, or upgrade to Plus.');
    }

    const entry = {
      id: crypto.randomUUID(),
      data_url: dataUrl,
      caption: caption.trim() || null,
      photo_month: currentMonth,
      captured_at: new Date().toISOString(),
    };
    const local = [entry, ...loadLocal()];
    saveLocal(local);
    setPhotos(local);
    return entry;
  }, [user, currentMonth, isPlus, state.photos.canUpload, checkPhotoUpload, refreshUsage]);

  return {
    photos,
    loading,
    refresh,
    quota,
    isPlus,
    uploadPhoto,
    error,
  };
}

export default useMonthlyAlbum;
