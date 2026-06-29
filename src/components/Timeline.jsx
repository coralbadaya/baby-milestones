import milestones from '../data/milestones';
import { interact } from '../utils/haptics';

function Timeline({
  currentMonth,
  checkedItems,
  onSelectMonth,
  collapsed = false,
  rangeStart = 1,
  rangeEnd = 36,
  hideHeading = false,
}) {
  const getProgress = (month) => {
    const data = milestones.find(m => m.month === month);
    if (!data) return 0;
    const allIds = [...data.physical, ...data.emotional].map(i => i.id);
    const checked = allIds.filter(id => checkedItems[id]);
    return allIds.length > 0 ? checked.length / allIds.length : 0;
  };

  const handleSelect = (month) => {
    interact('tap', 'light');
    onSelectMonth(month);
  };

  return (
    <section className="timeline-section">
      {!hideHeading && (
        <>
          <h2>Monthly Milestones</h2>
          <p className="timeline-subtitle">Click any month to explore milestones, activities, and tips</p>
        </>
      )}
      <div className="timeline-grid">
        {milestones.filter((m) => !collapsed || (m.month >= rangeStart && m.month <= rangeEnd)).map((m) => {
          const progress = getProgress(m.month);
          return (
            <div
              key={m.month}
              className={`timeline-card ${m.month === currentMonth ? 'current' : ''} ${progress === 1 ? 'completed' : ''}`}
              onClick={() => handleSelect(m.month)}
            >
              {progress > 0 && progress < 1 && <div className="progress-dot" style={{ background: '#F5A572' }} />}
              {progress === 1 && <div className="progress-dot" />}
              <div className="month-num">{m.month}</div>
              <div className="month-label">Month</div>
              <div className="month-title">{m.title}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Timeline;
