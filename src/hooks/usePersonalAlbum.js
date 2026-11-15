import { useEffect, useState } from 'react';

/** Local-only album from the private `personal/` folder. Absent in production. */
export function usePersonalAlbum() {
  const [album, setAlbum] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancel = false;
    fetch('/api/personal-album')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancel && data?.pages?.length) setAlbum(data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancel) setReady(true);
      });
    return () => {
      cancel = true;
    };
  }, []);

  return { album, ready };
}
