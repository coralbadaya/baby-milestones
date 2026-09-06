import { useCallback, useEffect, useState } from 'react';
import {
  FIRST_MOMENT_CLOUD_MAX_FILE_BYTES,
  FIRST_MOMENT_MAX_FILE_BYTES,
  FIRST_MOMENTS_STORAGE_KEY,
} from '../constants/firstMoments';
import { countCapturedMoments } from '../data/firsts';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { ensurePrimaryBabyProfile } from '../utils/babyCloud';
import { isDomainMerged, markDomainMerged } from '../utils/cloudMerge';
import { createSignedUrl, uploadPrivateObject } from '../utils/storageUrl';
import { dataUrlToBlob, fileToDataUrl, isImageFile, isVideoFile } from '../utils/firstMomentsStorage';

function loadFirstMoments() {
  try {
    const raw = localStorage.getItem(FIRST_MOMENTS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function cacheForLocal(moments) {
  const next = {};
  for (const [id, moment] of Object.entries(moments || {})) {
    if (!moment) continue;
    const isSigned = typeof moment.photoDataUrl === 'string' && moment.photoDataUrl.startsWith('http');
    const isSignedVideo = typeof moment.videoDataUrl === 'string' && moment.videoDataUrl.startsWith('http');
    next[id] = {
      ...moment,
      photoDataUrl: isSigned ? undefined : moment.photoDataUrl,
      videoDataUrl: isSignedVideo ? undefined : moment.videoDataUrl,
      storagePath: moment.storagePath,
    };
  }
  return next;
}

async function rowToMoment(row) {
  const url = await createSignedUrl(supabase, 'first-moments', row.storage_path);
  return {
    mediaType: row.media_type,
    note: row.note || undefined,
    capturedAt: row.captured_at,
    storagePath: row.storage_path,
    photoDataUrl: row.media_type === 'photo' ? url : undefined,
    videoDataUrl: row.media_type === 'video' ? url : undefined,
  };
}

export function useFirstMoments(babyProfileId) {
  const { user, loading: authLoading } = useAuth();
  const [firstMoments, setFirstMoments] = useState(loadFirstMoments);

  useEffect(() => {
    localStorage.setItem(FIRST_MOMENTS_STORAGE_KEY, JSON.stringify(cacheForLocal(firstMoments)));
  }, [firstMoments]);

  useEffect(() => {
    if (authLoading) return undefined;
    let cancelled = false;

    async function sync() {
      if (!user?.id) return;
      const profileId = babyProfileId || (await ensurePrimaryBabyProfile(user.id))?.id;
      if (!profileId || cancelled) return;

      const { data: rows, error } = await supabase
        .from('first_moments')
        .select('*')
        .eq('baby_profile_id', profileId);
      if (error || cancelled) return;

      const cloud = {};
      for (const row of rows || []) {
        cloud[row.first_id] = await rowToMoment(row);
      }

      if (!isDomainMerged(user.id, 'firsts')) {
        const local = loadFirstMoments();
        const merged = { ...local };
        for (const [id, moment] of Object.entries(cloud)) {
          merged[id] = moment;
        }

        for (const [id, moment] of Object.entries(local)) {
          if (cloud[id]) continue;
          const dataUrl = moment.photoDataUrl || moment.videoDataUrl;
          if (!dataUrl?.startsWith('data:')) continue;
          try {
            const blob = await dataUrlToBlob(dataUrl);
            const ext = moment.mediaType === 'video' ? 'webm' : 'jpg';
            const path = `${user.id}/${profileId}/${id}.${ext}`;
            await uploadPrivateObject(supabase, 'first-moments', path, blob, blob.type);
            await supabase.from('first_moments').upsert({
              user_id: user.id,
              baby_profile_id: profileId,
              first_id: id,
              media_type: moment.mediaType || 'photo',
              storage_path: path,
              note: moment.note || null,
              captured_at: moment.capturedAt || new Date().toISOString(),
              updated_at: new Date().toISOString(),
            });
            merged[id] = await rowToMoment({
              ...moment,
              media_type: moment.mediaType || 'photo',
              storage_path: path,
              captured_at: moment.capturedAt,
            });
          } catch {
            merged[id] = moment;
          }
        }

        if (!cancelled) {
          setFirstMoments(merged);
          markDomainMerged(user.id, 'firsts');
        }
      } else if (!cancelled) {
        setFirstMoments(cloud);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [user?.id, babyProfileId, authLoading]);

  const getMoment = useCallback(
    (firstId) => firstMoments[firstId] || null,
    [firstMoments],
  );

  const saveMedia = useCallback(async (firstId, file, note) => {
    if (!isImageFile(file) && !isVideoFile(file)) {
      throw new Error('Please choose a photo or video file.');
    }

    const mediaType = isVideoFile(file) ? 'video' : 'photo';
    const capturedAt = new Date().toISOString();
    const trimmedNote = note?.trim() || undefined;

    if (user?.id) {
      if (file.size > FIRST_MOMENT_CLOUD_MAX_FILE_BYTES) {
        throw new Error('File must be under 15MB. Try a shorter clip or smaller photo.');
      }
      const profileId = babyProfileId || (await ensurePrimaryBabyProfile(user.id))?.id;
      if (!profileId) throw new Error('Baby profile required');
      const ext = mediaType === 'video' ? 'webm' : 'jpg';
      const path = `${user.id}/${profileId}/${firstId}.${ext}`;
      await uploadPrivateObject(supabase, 'first-moments', path, file, file.type);
      await supabase.from('first_moments').upsert({
        user_id: user.id,
        baby_profile_id: profileId,
        first_id: firstId,
        media_type: mediaType,
        storage_path: path,
        note: trimmedNote || null,
        captured_at: capturedAt,
        updated_at: new Date().toISOString(),
      });
      const url = await createSignedUrl(supabase, 'first-moments', path);
      const patch = {
        capturedAt,
        note: trimmedNote,
        mediaType,
        storagePath: path,
        photoDataUrl: mediaType === 'photo' ? url : undefined,
        videoDataUrl: mediaType === 'video' ? url : undefined,
      };
      setFirstMoments((prev) => ({ ...prev, [firstId]: { ...prev[firstId], ...patch } }));
      return;
    }

    const dataUrl = await fileToDataUrl(file, FIRST_MOMENT_MAX_FILE_BYTES);
    const patch = {
      capturedAt,
      note: trimmedNote,
      mediaType,
      photoDataUrl: mediaType === 'photo' ? dataUrl : undefined,
      videoDataUrl: mediaType === 'video' ? dataUrl : undefined,
    };
    setFirstMoments((prev) => ({ ...prev, [firstId]: { ...prev[firstId], ...patch } }));
  }, [user, babyProfileId]);

  const updateNote = useCallback((firstId, note) => {
    const trimmed = note.trim() || undefined;
    setFirstMoments((prev) => {
      if (!prev[firstId]) return prev;
      return { ...prev, [firstId]: { ...prev[firstId], note: trimmed } };
    });
    if (user?.id && babyProfileId) {
      supabase
        .from('first_moments')
        .update({ note: trimmed || null, updated_at: new Date().toISOString() })
        .eq('baby_profile_id', babyProfileId)
        .eq('first_id', firstId);
    }
  }, [user, babyProfileId]);

  const removeMedia = useCallback((firstId) => {
    const current = firstMoments[firstId];
    setFirstMoments((prev) => {
      const next = { ...prev };
      delete next[firstId];
      return next;
    });
    if (user?.id && babyProfileId) {
      if (current?.storagePath) {
        supabase.storage.from('first-moments').remove([current.storagePath]);
      }
      supabase
        .from('first_moments')
        .delete()
        .eq('baby_profile_id', babyProfileId)
        .eq('first_id', firstId);
    }
  }, [user, babyProfileId, firstMoments]);

  const capturedCount = countCapturedMoments(firstMoments);

  return {
    firstMoments,
    getMoment,
    saveMedia,
    updateNote,
    removeMedia,
    capturedCount,
  };
}
