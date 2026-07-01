import { useCallback, useEffect, useState } from 'react';
import { FIRST_MOMENTS_STORAGE_KEY } from '../constants/firstMoments';
import { countCapturedMoments } from '../data/firsts';
import { fileToDataUrl, isImageFile, isVideoFile } from '../utils/firstMomentsStorage';

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

export function useFirstMoments() {
  const [firstMoments, setFirstMoments] = useState(loadFirstMoments);

  useEffect(() => {
    localStorage.setItem(FIRST_MOMENTS_STORAGE_KEY, JSON.stringify(firstMoments));
  }, [firstMoments]);

  const getMoment = useCallback(
    (firstId) => firstMoments[firstId] || null,
    [firstMoments],
  );

  const saveMedia = useCallback(async (firstId, file, note) => {
    if (!isImageFile(file) && !isVideoFile(file)) {
      throw new Error('Please choose a photo or video file.');
    }

    const dataUrl = await fileToDataUrl(file);
    const patch = {
      capturedAt: new Date().toISOString(),
      note: note?.trim() || undefined,
    };

    if (isVideoFile(file)) {
      patch.videoDataUrl = dataUrl;
      patch.photoDataUrl = undefined;
      patch.mediaType = 'video';
    } else {
      patch.photoDataUrl = dataUrl;
      patch.videoDataUrl = undefined;
      patch.mediaType = 'photo';
    }

    setFirstMoments((prev) => ({
      ...prev,
      [firstId]: { ...prev[firstId], ...patch },
    }));
  }, []);

  const updateNote = useCallback((firstId, note) => {
    setFirstMoments((prev) => {
      if (!prev[firstId]) return prev;
      return {
        ...prev,
        [firstId]: { ...prev[firstId], note: note.trim() || undefined },
      };
    });
  }, []);

  const removeMedia = useCallback((firstId) => {
    setFirstMoments((prev) => {
      const next = { ...prev };
      delete next[firstId];
      return next;
    });
  }, []);

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
