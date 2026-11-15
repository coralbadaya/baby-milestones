/**
 * Normalize album rows + life firsts into selectable photos for Idea Studio.
 */

/** @param {Array<{ id: string, data_url?: string, caption?: string, captured_at?: string, photo_month?: number }>} albumPhotos */
/** @param {Record<string, { photoDataUrl?: string, videoDataUrl?: string, note?: string, capturedAt?: string }>} firstMoments */
export function buildSelectablePhotos(albumPhotos, firstMoments) {
  const album = (albumPhotos || [])
    .filter((p) => p.data_url)
    .map((p) => ({
      id: p.id,
      dataUrl: p.data_url,
      caption: p.caption,
      capturedAt: p.captured_at,
      month: p.photo_month,
      source: 'album',
    }));

  const moments = Object.entries(firstMoments || {})
    .filter(([, m]) => m?.photoDataUrl || m?.videoDataUrl)
    .map(([id, m]) => ({
      id: `moment-${id}`,
      dataUrl: m.photoDataUrl || m.videoDataUrl,
      caption: m.note,
      capturedAt: m.capturedAt,
      month: null,
      source: 'moment',
    }));

  return [...album, ...moments];
}