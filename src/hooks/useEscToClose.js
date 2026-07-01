import { useEffect } from 'react';

/**
 * Call onClose when Escape is pressed while active.
 * @param {boolean} active
 * @param {() => void} onClose
 */
export function useEscToClose(active, onClose) {
  useEffect(() => {
    if (!active) return undefined;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [active, onClose]);
}
