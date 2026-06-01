const STATE_ORDER = [
  { key: 'done', label: 'Done', color: '#5FB878' },
  { key: 'due', label: 'Due', color: '#C8A840' },
  { key: 'upcoming', label: 'Upcoming', color: '#5A9FD8' },
  { key: 'overdue', label: 'Overdue', color: '#D88090' },
  { key: 'skipped', label: 'Skipped', color: '#8A8585' },
];

function VaccineStatusBarChart({ stats }) {
  const max = Math.max(1, ...STATE_ORDER.map((s) => stats[s.key] || 0));
  return (
    <section className="vaccine-status-chart card-accent-top" style={{ '--cat-color': 'var(--baby-blue-dark)' }}>
      <h3>Status counts</h3>
      <div className="vaccine-bar-chart">
        {STATE_ORDER.map((s) => {
          const value = stats[s.key] || 0;
          const widthPct = (value / max) * 100;
          return (
            <div key={s.key} className="vaccine-bar-row">
              <span className="vaccine-bar-label">{s.label}</span>
              <div className="vaccine-bar-track">
                <div className="vaccine-bar-fill" style={{ width: `${widthPct}%`, background: s.color }} />
              </div>
              <strong className="vaccine-bar-value">{value}</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default VaccineStatusBarChart;
