import { useEffect, useState } from 'react';

/** Local-only album from the private `personal/` folder. Absent in production. */
export function usePersonalAlbum() {
  const [album, setAlbum] = useState(null);

  useEffect(() => {
    let cancel = false;
    fetch('/api/personal-album')
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (!cancel && data?.pages?.length) setAlbum(data);
      })
      .catch(() => {});
    return () => {
      cancel = true;
    };
  }, []);

  return album;
}
