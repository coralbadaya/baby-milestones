import { Link } from 'react-router-dom';
import milestones from '../data/milestones';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import Icon from './Icon';

const SAMPLE_MONTH = 1;

function pickPreviewItems(data, limit) {
  const combined = [
    ...data.physical.map((item) => ({ ...item, kind: 'physical' })),
    ...data.emotional.map((item) => ({ ...item, kind: 'emotional' })),
  ];
  const unchecked = combined.filter((item) => !item.checked);
  const pool = unchecked.length > 0 ? unchecked : combined;
  return pool.slice(0, limit);
}

function CurrentMonthPanel({
  currentMonth,
  checkedItems,
  toggleCheck,
  compact = false,
  sampleMode = false,
}) {
  const month = sampleMode ? SAMPLE_MONTH : currentMonth;
  if (!month) return null;

  const data = milestones.find((m) => m.month === month);
  if (!data) return null;

  const allIds = [...data.physical, ...data.emotional].map((i) => i.id);
  const checkedCount = allIds.filter((id) => checkedItems[id]).length;
  const tagged = {
    physical: data.physical.map((i) => ({ ...i, checked: checkedItems[i.id] })),
    emotional: data.emotional.map((i) => ({ ...i, checked: checkedItems[i.id] })),
  };
  const items = compact
    ? [...tagged.physical, ...tagged.emotional]
    : pickPreviewItems(tagged, 4);

  const handleCheck = (id) => {
    interact(checkedItems[id] ? 'uncheck' : 'check', checkedItems[id] ? 'light' : 'success');
    toggleCheck(id);
  };

  return (
    <section
      className={`current-month-panel${compact ? ' current-month-panel--compact' : ''}`}
      aria-labelledby={`current-month-heading-${month}`}
    >
      {sampleMode && (
        <p className="current-month-panel__sample-banner">
          Sample from Month 1 —{' '}
          <Link to={ROUTES.home}>set birth date on Today</Link>
          {' '}to personalize.
        </p>
      )}

      <div className="current-month-panel__header">
        <div>
          <h2 id={`current-month-heading-${month}`} className="current-month-panel__title font-display">
            Month {month}: {data.title}
          </h2>
          {!compact && <p className="current-month-panel__summary">{data.summary}</p>}
        </div>
        {!compact && (
          <Link
            to={ROUTES.month(month)}
            className="current-month-panel__month-link"
            onClick={() => interact('tap', 'light')}
          >
            Open month →
          </Link>
        )}
      </div>

      <div className="current-month-panel__progress">
        <div className="progress-bar-inline">
          <div
            className="progress-fill-inline"
            style={{ width: `${allIds.length ? (checkedCount / allIds.length) * 100 : 0}%` }}
          />
        </div>
        <span className="progress-text-inline">
          {checkedCount}/{allIds.length} milestones
        </span>
      </div>

      <div
        className={compact ? 'current-month-panel__scroll' : undefined}
        role={compact ? 'region' : undefined}
        aria-label={compact ? "This month's milestones" : undefined}
      >
        <ul className="current-month-panel__list">
          {items.map((item) => {
            const isChecked = !!checkedItems[item.id];
            const checkClass = `milestone-preview-check${isChecked ? ' checked' : ''}`;
            const textClass = `milestone-preview-text${isChecked ? ' is-checked' : ''}`;
            const checkMark = isChecked ? <Icon name="check" size={11} /> : null;
            return (
              <li key={item.id} className="milestone-preview-item">
                {compact ? (
                  <button
                    type="button"
                    className="milestone-preview-row"
                    onClick={() => handleCheck(item.id)}
                    aria-pressed={isChecked}
                    aria-label={isChecked ? 'Uncheck milestone' : 'Check milestone'}
                  >
                    <span className={checkClass} aria-hidden="true">{checkMark}</span>
                    <span className={textClass}>{item.text}</span>
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className={checkClass}
                      onClick={() => handleCheck(item.id)}
                      aria-pressed={isChecked}
                      aria-label={isChecked ? 'Uncheck milestone' : 'Check milestone'}
                    >
                      {checkMark}
                    </button>
                    <span className={textClass}>{item.text}</span>
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      <p className="current-month-panel__footer">
        <Link
          to={ROUTES.month(month)}
          className="current-month-panel__cta"
          onClick={() => interact('tap', 'light')}
        >
          View all milestones →
        </Link>
      </p>
    </section>
  );
}

export default CurrentMonthPanel;
