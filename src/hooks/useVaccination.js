import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { isDomainMerged, markDomainMerged } from '../utils/cloudMerge';

const SCHEDULE_KEY = 'babyVaccineScheduleType';
const RECORDS_KEY = 'babyVaccineRecords';
const CUSTOM_KEY = 'babyCustomVaccines';
const REMINDER_KEY = 'babyVaccineReminderDays';

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function rowsToRecords(rows) {
  const records = {};
  for (const row of rows || []) {
    if (!records[row.schedule_type]) records[row.schedule_type] = {};
    records[row.schedule_type][row.vaccine_id] = {
      status: row.status,
      date: row.given_on || undefined,
      notes: row.notes || undefined,
    };
  }
  return records;
}

function unionRecords(local, cloud) {
  const next = { ...(local || {}) };
  for (const [schedule, items] of Object.entries(cloud || {})) {
    next[schedule] = { ...(next[schedule] || {}) };
    for (const [id, rec] of Object.entries(items || {})) {
      const existing = next[schedule][id];
      if (!existing || existing.status === 'pending') next[schedule][id] = rec;
      else if (rec.status === 'done' || rec.status === 'skipped') next[schedule][id] = rec;
    }
  }
  return next;
}

export function useVaccination(babyProfileId) {
  const { user, loading: authLoading } = useAuth();
  const [scheduleType, setScheduleTypeState] = useState(
    () => localStorage.getItem(SCHEDULE_KEY) || 'india',
  );
  const [vaccineRecords, setVaccineRecordsState] = useState(() => readJson(RECORDS_KEY, {}));
  const [customVaccines, setCustomVaccinesState] = useState(() => readJson(CUSTOM_KEY, []));
  const [reminderDays, setReminderDaysState] = useState(() => readJson(REMINDER_KEY, 7));

  useEffect(() => {
    localStorage.setItem(SCHEDULE_KEY, scheduleType);
  }, [scheduleType]);
  useEffect(() => {
    localStorage.setItem(RECORDS_KEY, JSON.stringify(vaccineRecords));
  }, [vaccineRecords]);
  useEffect(() => {
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(customVaccines));
  }, [customVaccines]);
  useEffect(() => {
    localStorage.setItem(REMINDER_KEY, JSON.stringify(reminderDays));
  }, [reminderDays]);

  useEffect(() => {
    if (authLoading || !user?.id || !babyProfileId) return undefined;
    let cancelled = false;

    async function sync() {
      const [settingsRes, recordsRes, customRes] = await Promise.all([
        supabase.from('vaccine_settings').select('*').eq('baby_profile_id', babyProfileId).maybeSingle(),
        supabase.from('vaccine_records').select('*').eq('baby_profile_id', babyProfileId),
        supabase.from('custom_vaccines').select('*').eq('baby_profile_id', babyProfileId),
      ]);
      if (cancelled) return;

      const cloudRecords = rowsToRecords(recordsRes.data);
      const cloudCustom = (customRes.data || []).map((r) => r.payload).filter(Boolean);
      const settings = settingsRes.data;

      if (!isDomainMerged(user.id, 'vaccines')) {
        const mergedRecords = unionRecords(readJson(RECORDS_KEY, {}), cloudRecords);
        const mergedCustom = cloudCustom.length ? cloudCustom : readJson(CUSTOM_KEY, []);
        const mergedSchedule = settings?.schedule_type || localStorage.getItem(SCHEDULE_KEY) || 'india';
        const mergedReminder = settings?.reminder_days ?? readJson(REMINDER_KEY, 7);

        setVaccineRecordsState(mergedRecords);
        setCustomVaccinesState(mergedCustom);
        setScheduleTypeState(mergedSchedule);
        setReminderDaysState(mergedReminder);

        await supabase.from('vaccine_settings').upsert({
          baby_profile_id: babyProfileId,
          user_id: user.id,
          schedule_type: mergedSchedule,
          reminder_days: mergedReminder,
          updated_at: new Date().toISOString(),
        });

        const recordRows = [];
        for (const [sched, items] of Object.entries(mergedRecords)) {
          for (const [vaccineId, rec] of Object.entries(items || {})) {
            recordRows.push({
              baby_profile_id: babyProfileId,
              user_id: user.id,
              schedule_type: sched,
              vaccine_id: vaccineId,
              status: rec.status || 'pending',
              given_on: rec.date || null,
              notes: rec.notes || null,
              updated_at: new Date().toISOString(),
            });
          }
        }
        if (recordRows.length) {
          await supabase.from('vaccine_records').upsert(recordRows, {
            onConflict: 'baby_profile_id,schedule_type,vaccine_id',
          });
        }

        if (mergedCustom.length && !cloudCustom.length) {
          await supabase.from('custom_vaccines').insert(
            mergedCustom.map((payload) => ({
              baby_profile_id: babyProfileId,
              user_id: user.id,
              payload,
            })),
          );
        }

        markDomainMerged(user.id, 'vaccines');
      } else {
        if (settings?.schedule_type) setScheduleTypeState(settings.schedule_type);
        if (settings?.reminder_days != null) setReminderDaysState(settings.reminder_days);
        setVaccineRecordsState(cloudRecords);
        if (cloudCustom.length) setCustomVaccinesState(cloudCustom);
      }
    }

    sync();
    return () => {
      cancelled = true;
    };
  }, [user?.id, babyProfileId, authLoading]);

  const persistSettings = useCallback((patch) => {
    if (!user?.id || !babyProfileId) return;
    supabase.from('vaccine_settings').upsert({
      baby_profile_id: babyProfileId,
      user_id: user.id,
      schedule_type: patch.schedule_type ?? scheduleType,
      reminder_days: patch.reminder_days ?? reminderDays,
      updated_at: new Date().toISOString(),
    });
  }, [user, babyProfileId, scheduleType, reminderDays]);

  const setScheduleType = useCallback((value) => {
    setScheduleTypeState(value);
    persistSettings({ schedule_type: value });
  }, [persistSettings]);

  const setReminderDays = useCallback((value) => {
    setReminderDaysState(value);
    persistSettings({ reminder_days: value });
  }, [persistSettings]);

  const setVaccineRecords = useCallback((updater) => {
    setVaccineRecordsState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (user?.id && babyProfileId) {
        const rows = [];
        for (const [sched, items] of Object.entries(next || {})) {
          for (const [vaccineId, rec] of Object.entries(items || {})) {
            rows.push({
              baby_profile_id: babyProfileId,
              user_id: user.id,
              schedule_type: sched,
              vaccine_id: vaccineId,
              status: rec.status || 'pending',
              given_on: rec.date || null,
              notes: rec.notes || null,
              updated_at: new Date().toISOString(),
            });
          }
        }
        if (rows.length) {
          supabase.from('vaccine_records').upsert(rows, {
            onConflict: 'baby_profile_id,schedule_type,vaccine_id',
          });
        }
      }
      return next;
    });
  }, [user, babyProfileId]);

  const setCustomVaccines = useCallback((updater) => {
    setCustomVaccinesState((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      if (user?.id && babyProfileId) {
        (async () => {
          await supabase.from('custom_vaccines').delete().eq('baby_profile_id', babyProfileId);
          if (next.length) {
            await supabase.from('custom_vaccines').insert(
              next.map((payload) => ({
                baby_profile_id: babyProfileId,
                user_id: user.id,
                payload,
              })),
            );
          }
        })();
      }
      return next;
    });
  }, [user, babyProfileId]);

  return {
    scheduleType,
    setScheduleType,
    vaccineRecords,
    setVaccineRecords,
    customVaccines,
    setCustomVaccines,
    reminderDays,
    setReminderDays,
  };
}

export default useVaccination;
