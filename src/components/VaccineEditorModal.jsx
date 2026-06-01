import { useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { interact } from '../utils/haptics';

function slugifyName(name = '') {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function VaccineEditorModal({ initialVaccine, onSave, onClose }) {
  const isEdit = Boolean(initialVaccine);
  const [name, setName] = useState(initialVaccine?.name ?? '');
  const [dueMonth, setDueMonth] = useState(
    initialVaccine?.dueMonth != null ? String(initialVaccine.dueMonth) : '0'
  );
  const [doseNumber, setDoseNumber] = useState(initialVaccine?.doseNumber ? String(initialVaccine.doseNumber) : '');
  const [totalDoses, setTotalDoses] = useState(initialVaccine?.totalDoses ? String(initialVaccine.totalDoses) : '');
  const [notes, setNotes] = useState(initialVaccine?.notes ?? '');
  const [optional, setOptional] = useState(Boolean(initialVaccine?.optional));
  const [error, setError] = useState('');

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const generatedId = useMemo(() => {
    const base = slugifyName(name) || 'custom-vaccine';
    const monthKey = String(dueMonth || '0').replace('.', '_');
    return `custom-${base}-${monthKey}`;
  }, [name, dueMonth]);

  const submit = (e) => {
    e.preventDefault();
    const monthNum = parseFloat(dueMonth);
    if (!name.trim()) {
      setError('Name is required.');
      return;
    }
    if (Number.isNaN(monthNum) || monthNum < 0 || monthNum > 36) {
      setError('Due month must be between 0 and 36.');
      return;
    }
    const doseNum = doseNumber ? parseInt(doseNumber, 10) : undefined;
    const totalNum = totalDoses ? parseInt(totalDoses, 10) : undefined;
    if ((doseNum && totalNum) && doseNum > totalNum) {
      setError('Dose number cannot be greater than total doses.');
      return;
    }
    setError('');

    onSave({
      id: initialVaccine?.id ?? generatedId,
      name: name.trim(),
      dueMonth: monthNum,
      doseNumber: doseNum,
      totalDoses: totalNum,
      notes: notes.trim(),
      optional,
      custom: true,
    });
    interact('tap', 'success');
  };

  return createPortal(
    <div className="detail-modal-backdrop" role="presentation" onClick={onClose}>
      <div className="detail-modal vaccine-editor-modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <header className="detail-modal-header">
          <div className="detail-modal-heading">
            <h2>{isEdit ? 'Edit custom vaccine' : 'Add custom vaccine'}</h2>
            <p className="detail-modal-sub">Create your own schedule entry</p>
          </div>
          <button type="button" className="detail-modal-close" onClick={onClose} aria-label="Close">×</button>
        </header>
        <form className="detail-modal-body vaccine-editor-form" onSubmit={submit}>
          <label>
            <span>Name</span>
            <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Typhoid conjugate vaccine" />
          </label>
          <label>
            <span>Due month (0–36)</span>
            <input type="number" min="0" max="36" step="0.5" value={dueMonth} onChange={(e) => setDueMonth(e.target.value)} />
          </label>
          <div className="vaccine-editor-row">
            <label>
              <span>Dose #</span>
              <input type="number" min="1" value={doseNumber} onChange={(e) => setDoseNumber(e.target.value)} />
            </label>
            <label>
              <span>Total doses</span>
              <input type="number" min="1" value={totalDoses} onChange={(e) => setTotalDoses(e.target.value)} />
            </label>
          </div>
          <label>
            <span>Notes</span>
            <textarea rows="3" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Optional notes" />
          </label>
          <label className="vaccine-editor-check">
            <input type="checkbox" checked={optional} onChange={(e) => setOptional(e.target.checked)} />
            <span>Optional / doctor-dependent</span>
          </label>
          {error && <p className="vaccine-editor-error">{error}</p>}
          <p className="vaccine-editor-id">ID: {generatedId}</p>
          <div className="vaccine-editor-actions">
            <button type="button" className="content-card-cta secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="content-card-cta">Save vaccine</button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}

export default VaccineEditorModal;
