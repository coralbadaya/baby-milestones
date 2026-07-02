/**
 * Parse a YouTube URL into an embeddable watch URL, or null if not embeddable.
 * Search result URLs cannot be embedded.
 * @param {string} url
 * @returns {{ embedUrl: string, videoId: string } | null}
 */
export function parseYouTubeEmbedUrl(url) {
  if (!url || typeof url !== 'string') return null;

  let parsed;
  try {
    parsed = new URL(url.trim());
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, '');

  if (host === 'youtube.com' || host === 'm.youtube.com') {
    if (parsed.pathname === '/results' || parsed.pathname.startsWith('/results')) {
      return null;
    }

    if (parsed.pathname === '/watch') {
      const videoId = parsed.searchParams.get('v');
      if (videoId) {
        return { videoId, embedUrl: `https://www.youtube.com/embed/${videoId}` };
      }
    }

    const embedMatch = parsed.pathname.match(/^\/embed\/([^/?]+)/);
    if (embedMatch) {
      return { videoId: embedMatch[1], embedUrl: `https://www.youtube.com/embed/${embedMatch[1]}` };
    }

    const shortsMatch = parsed.pathname.match(/^\/shorts\/([^/?]+)/);
    if (shortsMatch) {
      return { videoId: shortsMatch[1], embedUrl: `https://www.youtube.com/embed/${shortsMatch[1]}` };
    }
  }

  if (host === 'youtu.be') {
    const videoId = parsed.pathname.slice(1).split('/')[0];
    if (videoId) {
      return { videoId, embedUrl: `https://www.youtube.com/embed/${videoId}` };
    }
  }

  return null;
}

/** @param {string} url */
export function isYouTubeSearchUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url.trim());
    const host = parsed.hostname.replace(/^www\./, '');
    return (host === 'youtube.com' || host === 'm.youtube.com') && parsed.pathname.startsWith('/results');
  } catch {
    return false;
  }
}
