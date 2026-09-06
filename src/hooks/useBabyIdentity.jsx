import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { ensurePrimaryBabyProfile } from '../utils/babyCloud';
import {
  isDomainMerged,
  markDomainMerged,
  mergeBabyIdentity,
} from '../utils/cloudMerge';
import { loadStoredBabyName, saveStoredBabyName } from '../utils/babyName';

const BabyIdentityContext = createContext(null);

function useBabyIdentityState() {
  const { user, loading: authLoading } = useAuth();
  const [birthDate, setBirthDateState] = useState(() => localStorage.getItem('babyBirthDate') || '');
  const [babyName, setBabyNameState] = useState(() => loadStoredBabyName());
  const [babyProfileId, setBabyProfileId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (birthDate) localStorage.setItem('babyBirthDate', birthDate);
    else localStorage.removeItem('babyBirthDate');
  }, [birthDate]);

  useEffect(() => {
    saveStoredBabyName(babyName);
  }, [babyName]);

  useEffect(() => {
    if (authLoading) return undefined;
    let cancelled = false;

    async function sync() {
      if (!user?.id) {
        setBabyProfileId(null);
        setLoading(false);
        return;
      }

      try {
        const profile = await ensurePrimaryBabyProfile(user.id, {
          name: babyName,
          birthDate,
        });
        if (cancelled || !profile) return;
        setBabyProfileId(profile.id);

        if (!isDomainMerged(user.id, 'identity')) {
          const merged = mergeBabyIdentity(babyName, birthDate, profile);
          if (merged.source === 'local' && (merged.birthDate || merged.name)) {
            await supabase
              .from('baby_profiles')
              .update({
                name: merged.name || profile.name || 'Baby',
                birth_date: merged.birthDate || null,
                updated_at: new Date().toISOString(),
              })
              .eq('id', profile.id);
          }
          setBirthDateState(merged.birthDate || '');
          if (merged.name && merged.name !== 'Baby') setBabyNameState(merged.name);
          markDomainMerged(user.id, 'identity');
        } else {
          if (profile.birth_date) setBirthDateState(profile.birth_date);
          if (profile.name && profile.name !== 'Baby') setBabyNameState(profile.name);
        }
      } catch {
        /* keep local */
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
    // Intentionally run when auth settles / user changes, not on every name keystroke.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, authLoading]);

  const persistProfile = useCallback(async (patch) => {
    if (!user?.id || !babyProfileId) return;
    await supabase
      .from('baby_profiles')
      .update({ ...patch, updated_at: new Date().toISOString() })
      .eq('id', babyProfileId);
  }, [user?.id, babyProfileId]);

  const setBirthDate = useCallback((value) => {
    const next = typeof value === 'function' ? value(birthDate) : value;
    setBirthDateState(next);
    persistProfile({ birth_date: next || null });
  }, [birthDate, persistProfile]);

  const setBabyName = useCallback((value) => {
    const next = typeof value === 'function' ? value(babyName) : value;
    setBabyNameState(next);
    persistProfile({ name: (next || '').trim() || 'Baby' });
  }, [babyName, persistProfile]);

  return {
    birthDate,
    setBirthDate,
    babyName,
    setBabyName,
    babyProfileId,
    loading,
  };
}

export function BabyIdentityProvider({ children }) {
  const value = useBabyIdentityState();
  return (
    <BabyIdentityContext.Provider value={value}>
      {children}
    </BabyIdentityContext.Provider>
  );
}

export function useBabyIdentity() {
  const ctx = useContext(BabyIdentityContext);
  if (!ctx) {
    throw new Error('useBabyIdentity must be used within BabyIdentityProvider');
  }
  return ctx;
}

export default useBabyIdentity;
