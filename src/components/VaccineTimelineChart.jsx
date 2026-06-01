import { useMemo, useState } from 'react';
import { formatMonthLabel, monthToDate } from '../utils/vaccines';

const STATE_COLORS = {
  done: '#5FB878',
  due: '#C8A840',
  upcoming: '#5A9FD8',
  overdue: '#D88090',
  skipped: '#8A8585',
};

function VaccineTimelineChart({ vaccines, birthDate, onPickVaccine }) {
  if (!vaccines.length) return null;
  const [hoveredId, setHoveredId] = useState(null);

  const maxMonth = Math.max(12, ...vaccines.map((v) => Math.ceil(v.dueMonth)));
  const width = 1280;
  const leftPad = 160;
  const rightPad = 210;
  const topPad = 24;
  const rowHeight = 28;
  const trackWidth = width - leftPad - rightPad;
  const toX = (m) => leftPad + (m / maxMonth) * trackWidth;
  const svgHeight = topPad + vaccines.length * rowHeight + 28;
  const rightRailX = width - 12;
  const rightRailHeaderX = width - 14;

  const dueDateTextById = useMemo(
    () => Object.fromEntries(vaccines.map((v) => {
      const dueDate = monthToDate(birthDate, v.dueMonth);
      const text = dueDate
        ? dueDate.toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' })
        : 'Set birth date';
      return [v.id, text];
    })),
    [vaccines, birthDate]
  );

  const monthTicks = [];
  for (let m = 0; m <= maxMonth; m += 3) monthTicks.push(m);

  return (
    <section className="vaccine-timeline-chart card-accent-top" style={{ '--cat-color': 'var(--lavender-dark)' }}>
      <h3>Vaccine timeline</h3>
      <p className="vaccine-timeline-sub">Tap any point to update status/date/notes. Hover rows to inspect expected due dates.</p>
      <div className="vaccine-timeline-scroll">
        <svg viewBox={`0 0 ${width} ${svgHeight}`} className="vaccine-timeline-svg" role="img" aria-label="Vaccination timeline chart">
          {monthTicks.map((m) => (
            <g key={`tick-${m}`}>
              <line x1={toX(m)} x2={toX(m)} y1={12} y2={svgHeight - 12} stroke="#F5EDE5" strokeWidth="1" />
              <text x={toX(m)} y={14} textAnchor="middle" className="vaccine-axis-label">
                {m === 0 ? 'Birth' : `M${m}`}
              </text>
            </g>
          ))}

          <text x={rightRailHeaderX} y={14} textAnchor="end" className="vaccine-axis-label">
            Expected due
          </text>

          {vaccines.map((v, index) => {
            const y = topPad + index * rowHeight;
            const stateColor = STATE_COLORS[v.dueState] || STATE_COLORS.upcoming;
            const dueX = toX(v.dueMonth);
            const minX = toX(v.minMonth ?? v.dueMonth);
            const maxX = toX(v.maxMonth ?? v.dueMonth);
            const isMarked = v.record?.status === 'done' || v.record?.status === 'skipped';
            const isHovered = hoveredId === v.id;
            const dueDateText = dueDateTextById[v.id];
            return (
              <g
                key={v.id}
                className={isHovered ? 'vaccine-row-group is-hovered' : 'vaccine-row-group'}
                onMouseEnter={() => setHoveredId(v.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <text x={leftPad - 8} y={y + 4} textAnchor="end" className="vaccine-row-label">
                  {v.name}
                </text>
                <line x1={minX} x2={maxX} y1={y} y2={y} stroke={stateColor} strokeWidth="6" strokeOpacity="0.35" />
                <circle
                  cx={dueX}
                  cy={y}
                  r="7"
                  fill={stateColor}
                  className="vaccine-point"
                  onClick={() => onPickVaccine(v.id)}
                  onFocus={() => setHoveredId(v.id)}
                  onBlur={() => setHoveredId(null)}
                />
                {v.record?.date && (
                  <circle cx={dueX} cy={y} r="3" fill="#ffffff" />
                )}
                {!isMarked && (
                  <text
                    x={rightRailX}
                    y={y + 4}
                    textAnchor="end"
                    className={`vaccine-due-right-label${isHovered ? ' is-hovered' : ''}`}
                  >
                    {dueDateText}
                  </text>
                )}
              </g>
            );
          })}

          <text x={leftPad} y={svgHeight - 8} className="vaccine-axis-title">
            Due timeline ({formatMonthLabel(0)} to {formatMonthLabel(maxMonth)})
          </text>
        </svg>
      </div>
    </section>
  );
}

export default VaccineTimelineChart;
