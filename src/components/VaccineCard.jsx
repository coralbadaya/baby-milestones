import { useMemo } from 'react';
import { interact } from '../utils/haptics';
import Icon from './Icon';
import { formatDateInputValue, formatMonthLabel, monthToDate } from '../utils/vaccines';

const STATE_META = {
  done: { label: 'Done', className: 'state-done', icon: 'check' },
  due: { label: 'Due now', className: 'state-due', icon: 'warning' },
  upcoming: { label: 'Upcoming', className: 'state-upcoming', icon: 'calendar' },
  overdue: { label: 'Overdue', className: 'state-overdue', icon: 'warning' },
  skipped: { label: 'Skipped', className: 'state-skipped', icon: 'close' },
};

function VaccineCard({
  vaccine,
  record,
  state,
  birthDate,
  onStatusChange,
  onDateChange,
  onNotesChange,
  onEditCustom,
  onDeleteCustom,
  isCustomSchedule,
}) {
  const meta = STATE_META[state] || STATE_META.upcoming;
  const dueDate = useMemo(() => monthToDate(birthDate, vaccine.dueMonth), [birthDate, vaccine.dueMonth]);
  const dueLabel = dueDate ? dueDate.toLocaleDateString() : 'Set birth date to compute';

  return (
    <article className={`vaccine-card content-card card-accent-top ${meta.className}`}>
      <div className="content-card-body">
        <div className="vaccine-card-top">
          <div>
            <h4 className="content-card-title">{vaccine.name}</h4>
            <p className="content-card-meta-line">
              {formatMonthLabel(vaccine.dueMonth)} · approx {dueLabel}
            </p>
          </div>
          <span className={`vaccine-state-chip ${meta.className}`}>
            <Icon name={meta.icon} size={14} /> {meta.label}
          </span>
        </div>

        <div className="vaccine-meta-line">
          {vaccine.doseNumber && vaccine.totalDoses && (
            <span className="diy-material-chip">Dose {vaccine.doseNumber}/{vaccine.totalDoses}</span>
          )}
          {vaccine.optional && <span className="diy-material-chip">Optional</span>}
          <span className="diy-material-chip">{vaccine.id}</span>
        </div>

        {vaccine.notes && <p className="content-card-preview">{vaccine.notes}</p>}

        <div className="vaccine-actions-row">
          <button type="button" className="content-card-cta" onClick={() => { onStatusChange(vaccine.id, 'done'); interact('tap', 'success'); }}>
            Mark done
          </button>
          <button type="button" className="content-card-cta secondary" onClick={() => onStatusChange(vaccine.id, 'pending')}>
            Pending
          </button>
          <button type="button" className="content-card-cta secondary" onClick={() => onStatusChange(vaccine.id, 'skipped')}>
            Skip
          </button>
        </div>

        <div className="vaccine-input-row">
          <label>
            <span>Date given</span>
            <input
              type="date"
              value={formatDateInputValue(record?.date)}
              onChange={(e) => onDateChange(vaccine.id, e.target.value)}
            />
          </label>
          <label>
            <span>Note</span>
            <input
              value={record?.notes ?? ''}
              onChange={(e) => onNotesChange(vaccine.id, e.target.value)}
              placeholder="Clinic, lot, reminder..."
            />
          </label>
        </div>

        {isCustomSchedule && (
          <div className="vaccine-custom-row">
            <button type="button" className="content-card-cta secondary" onClick={() => onEditCustom(vaccine)}>
              Edit
            </button>
            <button type="button" className="content-card-cta danger" onClick={() => onDeleteCustom(vaccine.id)}>
              Delete
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

export default VaccineCard;
