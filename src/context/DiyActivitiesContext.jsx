import { createContext, useContext } from 'react';
import staticDiyActivities from '../data/diyActivities';
import useDiyActivities from '../hooks/useDiyActivities';

/** @type {import('react').Context<ReturnType<typeof useDiyActivities> | null>} */
const DiyActivitiesContext = createContext(null);

export function DiyActivitiesProvider({ children }) {
  const value = useDiyActivities();
  return (
    <DiyActivitiesContext.Provider value={value}>
      {children}
    </DiyActivitiesContext.Provider>
  );
}

export function useDiyActivitiesContext() {
  const ctx = useContext(DiyActivitiesContext);
  if (!ctx) {
    return {
      activitiesByMonth: staticDiyActivities,
      contentById: {},
      loading: false,
      error: null,
      refetch: async () => {},
    };
  }
  return ctx;
}

export default DiyActivitiesContext;
