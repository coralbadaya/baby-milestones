const SEGMENTS = [
  { key: 'done', label: 'Done', color: '#5FB878' },
  { key: 'due', label: 'Due now', color: '#C8A840' },
  { key: 'upcoming', label: 'Upcoming', color: '#5A9FD8' },
  { key: 'overdue', label: 'Overdue', color: '#D88090' },
  { key: 'skipped', label: 'Skipped', color: '#8A8585' },
];

function VaccineStatusDonutChart({ stats }) {
  const total = Math.max(1, stats.total || 0);
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  let offsetAccumulator = 0;

  return (
    <section className="vaccine-status-chart card-accent-top" style={{ '--cat-color': 'var(--mint-dark)' }}>
      <h3>Status split</h3>
      <div className="vaccine-donut-wrap">
        <svg viewBox="0 0 160 160" className="vaccine-donut" role="img" aria-label="Vaccination status distribution">
          <circle cx="80" cy="80" r={radius} fill="none" stroke="#F5EDE5" strokeWidth="16" />
          {SEGMENTS.map((seg) => {
            const value = stats[seg.key] || 0;
            const dash = (value / total) * circumference;
            const strokeDasharray = `${dash} ${circumference - dash}`;
            const strokeDashoffset = -offsetAccumulator;
            offsetAccumulator += dash;
            return (
              <circle
                key={seg.key}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth="16"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 80 80)"
                strokeLinecap="butt"
              />
            );
          })}
        </svg>
        <div className="vaccine-donut-center">
          <strong>{stats.done}</strong>
          <span>/ {stats.total}</span>
          <small>completed</small>
        </div>
      </div>
      <ul className="vaccine-chart-legend">
        {SEGMENTS.map((seg) => (
          <li key={seg.key}>
            <span className="legend-dot" style={{ background: seg.color }} />
            <span>{seg.label}</span>
            <strong>{stats[seg.key] || 0}</strong>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default VaccineStatusDonutChart;
