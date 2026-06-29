import { Link } from 'react-router-dom';
import milestones from '../data/milestones';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';
import Icon from './Icon';

const SAMPLE_MONTH = 1;

function pickPreviewItems(data, limit) {
  const physical = data.physical.map((item) => ({ ...item, kind: 'physical' }));
  const emotional = data.emotional.map((item) => ({ ...item, kind: 'emotional' }));
  const combined = [...physical, ...emotional];

  const unchecked = combined.filter((item) => !item.checked);
  const pool = unchecked.length > 0 ? unchecked : combined;

  if (limit <= 3) {
    const picks = [];
    const phys = pool.filter((i) => i.kind === 'physical');
    const emo = pool.filter((i) => i.kind === 'emotional');
    if (phys[0]) picks.push(phys[0]);
    if (emo[0]) picks.push(emo[0]);
    if (phys[1]) picks.push(phys[1]);
    return picks.slice(0, limit);
  }

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
  const limit = compact ? 3 : 4;

  const items = pickPreviewItems(
    {
      physical: data.physical.map((i) => ({ ...i, checked: checkedItems[i.id] })),
      emotional: data.emotional.map((i) => ({ ...i, checked: checkedItems[i.id] })),
    },
    limit,
  );

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
        <Link
          to={ROUTES.month(month)}
          className="current-month-panel__month-link"
          onClick={() => interact('tap', 'light')}
        >
          Open month →
        </Link>
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

      <ul className="current-month-panel__list">
        {items.map((item) => (
          <li key={item.id} className="milestone-preview-item">
            <button
              type="button"
              className={`milestone-preview-check${checkedItems[item.id] ? ' checked' : ''}`}
              onClick={() => handleCheck(item.id)}
              aria-pressed={!!checkedItems[item.id]}
              aria-label={checkedItems[item.id] ? 'Uncheck milestone' : 'Check milestone'}
            >
              {checkedItems[item.id] && <Icon name="check" size={14} />}
            </button>
            <span className={`milestone-preview-text${checkedItems[item.id] ? ' is-checked' : ''}`}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>

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
