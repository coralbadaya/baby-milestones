import milestones from '../data/milestones';
import ProgressRing from '../components/ProgressRing';
import { usePageMeta } from '../utils/pageMeta';

function Dashboard({ checkedItems, onSelectMonth }) {
  usePageMeta({
    title: 'Progress',
    description: 'Track your baby\u2019s milestone progress across physical and emotional development.',
  });
  const getStats = () => {
    let totalPhysical = 0, checkedPhysical = 0;
    let totalEmotional = 0, checkedEmotional = 0;

    milestones.forEach(m => {
      m.physical.forEach(item => {
        totalPhysical++;
        if (checkedItems[item.id]) checkedPhysical++;
      });
      m.emotional.forEach(item => {
        totalEmotional++;
        if (checkedItems[item.id]) checkedEmotional++;
      });
    });

    const total = totalPhysical + totalEmotional;
    const checked = checkedPhysical + checkedEmotional;

    return {
      totalPercent: total > 0 ? (checked / total) * 100 : 0,
      physicalPercent: totalPhysical > 0 ? (checkedPhysical / totalPhysical) * 100 : 0,
      emotionalPercent: totalEmotional > 0 ? (checkedEmotional / totalEmotional) * 100 : 0,
      checked,
      total
    };
  };

  const getMonthProgress = (m) => {
    const allIds = [...m.physical, ...m.emotional].map(i => i.id);
    const checked = allIds.filter(id => checkedItems[id]).length;
    return { checked, total: allIds.length, percent: allIds.length > 0 ? (checked / allIds.length) * 100 : 0 };
  };

  const stats = getStats();

  return (
    <div className="dashboard fade-in">
      <h1>Progress Dashboard</h1>
      <p className="dashboard-subtitle">Track your baby's milestone achievements across all 36 months</p>

      <div className="overall-progress">
        <div className="progress-ring-container">
          <ProgressRing percent={stats.totalPercent} className="total" label="Overall" />
          <ProgressRing percent={stats.physicalPercent} className="physical" label="Physical" />
          <ProgressRing percent={stats.emotionalPercent} className="emotional" label="Emotional" />
        </div>
        <p style={{ marginTop: 16, color: 'var(--text-secondary)', fontSize: 14 }}>
          {stats.checked} of {stats.total} milestones achieved
        </p>
      </div>

      <h2 style={{ marginBottom: 16 }}>By Month</h2>
      <div className="month-progress-list">
        {milestones.map(m => {
          const progress = getMonthProgress(m);
          return (
            <div key={m.month} className="month-progress-card" onClick={() => onSelectMonth(m.month)}>
              <h4>Month {m.month}: {m.title}</h4>
              <div className="mini-progress-bar">
                <div className="mini-progress-fill" style={{ width: `${progress.percent}%` }} />
              </div>
              <div className="mini-progress-text">
                {progress.checked}/{progress.total} milestones
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Dashboard;
