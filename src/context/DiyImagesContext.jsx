import { createContext, useContext } from 'react';
import useDiyImages from '../hooks/useDiyImages';

/** @type {import('react').Context<ReturnType<typeof useDiyImages> | null>} */
const DiyImagesContext = createContext(null);

export function DiyImagesProvider({ children }) {
  const value = useDiyImages();
  return (
    <DiyImagesContext.Provider value={value}>
      {children}
    </DiyImagesContext.Provider>
  );
}

export function useDiyImagesContext() {
  const ctx = useContext(DiyImagesContext);
  if (!ctx) {
    return { overrides: {}, loading: false, error: null, refetch: async () => {} };
  }
  return ctx;
}

export default DiyImagesContext;
