import { useEffect, useState } from 'react';

/**
 * @param {number} maxWidthPx Viewport matches when width is at most this value (inclusive).
 */
export function useMaxWidth(maxWidthPx) {
  const query = `(max-width: ${maxWidthPx}px)`;

  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    setMatches(mql.matches);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}