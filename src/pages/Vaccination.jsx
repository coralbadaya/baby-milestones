import { useEffect, useMemo, useRef, useState } from 'react';
import PageHero from '../components/PageHero';
import Icon from '../components/Icon';
import DetailModal from '../components/DetailModal';
import VaccineEditorModal from '../components/VaccineEditorModal';
import VaccineScheduleSelect from '../components/VaccineScheduleSelect';
import VaccineStatusDonutChart from '../components/VaccineStatusDonutChart';
import VaccineStatusBarChart from '../components/VaccineStatusBarChart';
import VaccineTimelineChart from '../components/VaccineTimelineChart';
import { VACCINE_SCHEDULES, DEFAULT_CUSTOM_VACCINES } from '../data/vaccines';
import {
  computeVaccineStats,
  downloadTextFile,
  formatDateInputValue,
  getVaccineDueState,
  groupVaccinesByMonth,
  monthToDate,
  toCsv,
} from '../utils/vaccines';
import { usePageMeta } from '../utils/pageMeta';

const FILTERS = ['all', 'due', 'upcoming', 'overdue', 'done', 'skipped'];

function VaccineQuickUpdateModal({
  vaccine,
  record,
  birthDate,
  onClose,
  onStatus,
  onDate,
  onNotes,
  onEditCustom,
  onDeleteCustom,
  isCustomSchedule,
}) {
  if (!vaccine) return null;
  const [trackDate, setTrackDate] = useState(Boolean(record?.date));

  useEffect(() => {
    setTrackDate(Boolean(record?.date));
  }, [vaccine?.id, record?.date]);

  const expectedDueDate = monthToDate(birthDate, vaccine.dueMonth);
  const expectedMinDate = monthToDate(birthDate, vaccine.minMonth ?? vaccine.dueMonth);
  const expectedMaxDate = monthToDate(birthDate, vaccine.maxMonth ?? vaccine.dueMonth);

  const dueDateText = expectedDueDate ? expectedDueDate.toLocaleDateString() : 'Set birth date to compute';
  const dueWindowText = expectedMinDate && expectedMaxDate
    ? `${expectedMinDate.toLocaleDateString()} - ${expectedMaxDate.toLocaleDateString()}`
    : dueDateText;

  return (
    <DetailModal title={vaccine.name} subtitle={`Month ${vaccine.dueMonth}`} onClose={onClose}>
      <div className="vaccine-quick-meta">
        <span className="diy-material-chip">ID: {vaccine.id}</span>
        {vaccine.doseNumber && vaccine.totalDoses && (
          <span className="diy-material-chip">Dose {vaccine.doseNumber}/{vaccine.totalDoses}</span>
        )}
        {vaccine.optional && <span className="diy-material-chip">Optional</span>}
        <span className="diy-material-chip">Expected due: {dueDateText}</span>
        <span className="diy-material-chip">Window: {dueWindowText}</span>
      </div>

      <div className="vaccine-actions-row">
        <button type="button" className="content-card-cta" onClick={() => onStatus(vaccine.id, 'done')}>Mark done</button>
        <button type="button" className="content-card-cta secondary" onClick={() => onStatus(vaccine.id, 'pending')}>Pending</button>
        <button type="button" className="content-card-cta secondary" onClick={() => onStatus(vaccine.id, 'skipped')}>Skip</button>
      </div>

      <label className="vaccine-track-date-toggle">
        <input
          type="checkbox"
          checked={trackDate}
          onChange={(e) => {
            const checked = e.target.checked;
            setTrackDate(checked);
            if (!checked) onDate(vaccine.id, '');
          }}
        />
        <span>Add actual vaccination date for tracking (optional)</span>
      </label>

      <div className="vaccine-input-row">
        {trackDate && (
          <label>
            <span>Date given</span>
            <input
              type="date"
              value={formatDateInputValue(record?.date)}
              onChange={(e) => onDate(vaccine.id, e.target.value)}
            />
          </label>
        )}
        <label>
          <span>Note</span>
          <input
            value={record?.notes ?? ''}
            onChange={(e) => onNotes(vaccine.id, e.target.value)}
            placeholder="Clinic, lot, reminder..."
          />
        </label>
      </div>

      {isCustomSchedule && (
        <div className="vaccine-custom-row">
          <button type="button" className="content-card-cta secondary" onClick={() => onEditCustom(vaccine)}>
            Edit vaccine
          </button>
          <button type="button" className="content-card-cta danger" onClick={() => onDeleteCustom(vaccine.id)}>
            Delete vaccine
          </button>
        </div>
      )}

      {vaccine.notes && <p className="vaccine-modal-note">{vaccine.notes}</p>}
    </DetailModal>
  );
}

function Vaccination({
  birthDate,
  currentMonth,
  scheduleType,
  onScheduleTypeChange,
  vaccineRecords,
  setVaccineRecords,
  customVaccines,
  setCustomVaccines,
  reminderDays,
  setReminderDays,
}) {
  usePageMeta({
    title: 'Vaccination Tracker',
    description: 'Track your baby\u2019s immunizations with India, CDC, or custom schedules, reminders, and exports.',
  });
  const [filter, setFilter] = useState('all');
  const [editingVaccine, setEditingVaccine] = useState(null);
  const [selectedVaccineId, setSelectedVaccineId] = useState(null);
  const importRef = useRef(null);

  const baseSchedule = VACCINE_SCHEDULES[scheduleType]?.items ?? [];
  const vaccines = scheduleType === 'custom'
    ? (customVaccines.length > 0 ? customVaccines : DEFAULT_CUSTOM_VACCINES)
    : baseSchedule;

  const recordsForSchedule = vaccineRecords[scheduleType] ?? {};
  const stats = useMemo(
    () => computeVaccineStats(vaccines, recordsForSchedule, currentMonth),
    [vaccines, recordsForSchedule, currentMonth]
  );

  const processed = useMemo(
    () => vaccines.map((v) => ({
      ...v,
      dueState: getVaccineDueState(v, currentMonth, recordsForSchedule[v.id]),
      record: recordsForSchedule[v.id],
    })),
    [vaccines, currentMonth, recordsForSchedule]
  );

  const filtered = filter === 'all' ? processed : processed.filter((v) => v.dueState === filter);
  const groups = groupVaccinesByMonth(filtered);
  const timelineItems = groups.flatMap((g) => g.items.map((i) => ({ ...i, monthGroup: g.month })));

  const selectedVaccine = selectedVaccineId ? processed.find((v) => v.id === selectedVaccineId) : null;

  const updateRecord = (id, patch) => {
    setVaccineRecords((prev) => ({
      ...prev,
      [scheduleType]: {
        ...(prev[scheduleType] ?? {}),
        [id]: {
          status: 'pending',
          ...(prev[scheduleType]?.[id] ?? {}),
          ...patch,
        },
      },
    }));
  };

  const setStatus = (id, status) => {
    updateRecord(id, { status });
  };

  const saveCustomVaccine = (vaccine) => {
    setCustomVaccines((prev) => {
      const exists = prev.some((v) => v.id === vaccine.id);
      if (exists) return prev.map((v) => (v.id === vaccine.id ? vaccine : v));
      return [...prev, vaccine];
    });
    setEditingVaccine(null);
  };

  const deleteCustomVaccine = (id) => {
    setCustomVaccines((prev) => prev.filter((v) => v.id !== id));
    setVaccineRecords((prev) => {
      const next = { ...(prev[scheduleType] ?? {}) };
      delete next[id];
      return { ...prev, [scheduleType]: next };
    });
    if (selectedVaccineId === id) setSelectedVaccineId(null);
  };

  const reminderText = useMemo(() => {
    const dueSoon = processed.filter(
      (v) => v.dueState === 'upcoming' && (v.dueMonth - (currentMonth ?? 0)) <= (reminderDays / 30.4375)
    );
    if (!birthDate) return 'Set baby birth date on Home to calculate vaccine due windows.';
    if (dueSoon.length === 0) return `No vaccines due in the next ${reminderDays} day(s).`;
    return `${dueSoon.length} vaccine(s) due in next ${reminderDays} day(s): ${dueSoon.slice(0, 3).map((d) => d.name).join(', ')}${dueSoon.length > 3 ? '…' : ''}`;
  }, [processed, currentMonth, reminderDays, birthDate]);

  const exportCsv = () => {
    const rows = [
      ['schedule', 'id', 'name', 'dueMonth', 'state', 'status', 'date', 'notes'],
      ...processed.map((v) => [
        scheduleType,
        v.id,
        v.name,
        v.dueMonth,
        v.dueState,
        v.record?.status ?? 'pending',
        v.record?.date ?? '',
        v.record?.notes ?? '',
      ]),
    ];
    downloadTextFile(`vaccination-${scheduleType}.csv`, 'text/csv;charset=utf-8', toCsv(rows));
  };

  const exportJson = () => {
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      scheduleType,
      records: vaccineRecords,
      customVaccines,
      reminderDays,
    };
    downloadTextFile('vaccination-backup.json', 'application/json', JSON.stringify(payload, null, 2));
  };

  const importJson = async (file) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      if (parsed.records && typeof parsed.records === 'object') setVaccineRecords(parsed.records);
      if (Array.isArray(parsed.customVaccines)) setCustomVaccines(parsed.customVaccines);
      if (typeof parsed.scheduleType === 'string' && VACCINE_SCHEDULES[parsed.scheduleType]) {
        onScheduleTypeChange(parsed.scheduleType);
      }
      if (typeof parsed.reminderDays === 'number') {
        setReminderDays(Math.max(1, Math.min(60, parsed.reminderDays)));
      }
    } catch (_err) {
      // ignore malformed backup file
    }
  };

  return (
    <>
      <PageHero
        imageKey="vaccination"
        eyebrow="Health records"
        title="Vaccination tracker"
        subtitle="Track schedules and reminders. Educational organizer only — always follow your pediatrician."
        size="md"
      />

      <div className="vaccination-page page-body page-body--wide page-body--with-mobile-nav">
      <section className="vaccination-toolbar vaccination-print-hide">
        <div className="vaccination-toolbar-left">
          <VaccineScheduleSelect value={scheduleType} onChange={onScheduleTypeChange} />
          <label className="vaccination-reminder coral-select">
            <span className="coral-select-label">Reminder window (days)</span>
            <span className="coral-select-wrap">
              <input
                type="number"
                min="1"
                max="60"
                className="coral-select-native"
                value={reminderDays}
                onChange={(e) => setReminderDays(Math.max(1, Math.min(60, parseInt(e.target.value || '7', 10))))}
              />
            </span>
          </label>
          {scheduleType === 'custom' && (
            <button type="button" className="content-card-cta" onClick={() => setEditingVaccine({})}>
              + Add custom vaccine
            </button>
          )}
        </div>
        <div className="vaccination-tools-right">
          <button type="button" className="content-card-cta secondary" onClick={exportCsv}>Export CSV</button>
          <button type="button" className="content-card-cta secondary" onClick={exportJson}>Export JSON</button>
          <button type="button" className="content-card-cta secondary" onClick={() => importRef.current?.click()}>Import JSON</button>
          <button type="button" className="content-card-cta secondary" onClick={() => window.print()}>Print</button>
          <input
            ref={importRef}
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) importJson(file);
              e.target.value = '';
            }}
          />
        </div>
      </section>

      <p className="vaccination-reminder-banner">{reminderText}</p>

      <section className="vaccination-chart-layout">
        <VaccineStatusDonutChart stats={stats} />
        <VaccineStatusBarChart stats={stats} />
      </section>

      <section className="vaccination-actions vaccination-print-hide">
        <div className="vaccination-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`diy-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </section>

      {timelineItems.length === 0 ? (
        <p className="month-section-empty">No vaccines match this filter.</p>
      ) : (
        <VaccineTimelineChart
          vaccines={timelineItems}
          birthDate={birthDate}
          onPickVaccine={setSelectedVaccineId}
        />
      )}

      <VaccineQuickUpdateModal
        vaccine={selectedVaccine}
        record={selectedVaccine?.record}
        birthDate={birthDate}
        onClose={() => setSelectedVaccineId(null)}
        onStatus={setStatus}
        onDate={(id, date) => updateRecord(id, { date })}
        onNotes={(id, notes) => updateRecord(id, { notes })}
        isCustomSchedule={scheduleType === 'custom'}
        onEditCustom={(v) => {
          setSelectedVaccineId(null);
          setEditingVaccine(v);
        }}
        onDeleteCustom={deleteCustomVaccine}
      />

      {editingVaccine && (
        <VaccineEditorModal
          initialVaccine={editingVaccine.id ? editingVaccine : null}
          onSave={saveCustomVaccine}
          onClose={() => setEditingVaccine(null)}
        />
      )}
      </div>
    </>
  );
}

export default Vaccination;
