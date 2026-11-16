import Select from '../Select';
import { METRIC_DEFS, sliceSeriesForDays, seriesDelta } from '../../utils/analyticsInsights';

const RANGE_OPTIONS = [
  { value: '7', label: '7 days' },
  { value: '14', label: '14 days' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
];

/**
 * @param {{
 *   metricId: keyof typeof METRIC_DEFS,
 *   seriesRows: import('../../utils/analyticsInsights').TimeseriesRow[],
 *   rangeDays: string,
 *   onRangeChange: (days: string) => void,
 *   maxRangeDays: number,
 * }} props
 */
function AdminMetricChart({
  metricId,
  seriesRows,
  rangeDays,
  onRangeChange,
  maxRangeDays = 90,
}) {
  const def = METRIC_DEFS[metricId];
  const allowedOptions = RANGE_OPTIONS.filter((o) => Number(o.value) <= maxRangeDays);
  const points = sliceSeriesForDays(seriesRows, def.key, rangeDays);
  const { current, label: deltaLabel } = seriesDelta(seriesRows, def.key, rangeDays);
  const max = Math.max(...points.map((p) => p.value), 1);

  return (
    <article className="admin-metric-chart">
      <header className="admin-metric-chart__head">
        <div>
          <h3 className="admin-metric-chart__title">{def.label}</h3>
          <p className="admin-metric-chart__value">{current.toLocaleString()}</p>
          <p className="admin-metric-chart__delta">{deltaLabel}</p>
        </div>
        <Select
          id={`metric-range-${metricId}`}
          label="Range"
          value={rangeDays}
          onChange={onRangeChange}
          options={allowedOptions}
        />
      </header>

      <div
        className="admin-metric-chart__plot"
        role="img"
        aria-label={`${def.label} daily trend`}
      >
        {points.length === 0 ? (
          <p className="admin-metric-chart__empty">No data in range</p>
        ) : (
          <svg
            className="admin-metric-chart__svg"
            viewBox={`0 0 ${points.length * 10} 48`}
            preserveAspectRatio="none"
          >
            {points.map((p, i) => {
              const h = (p.value / max) * 40;
              return (
                <rect
                  key={p.day}
                  x={i * 10 + 1}
                  y={44 - h}
                  width={8}
                  height={Math.max(h, p.value > 0 ? 2 : 0)}
                  className="admin-metric-chart__bar"
                  rx="1"
                >
                  <title>{`${p.day}: ${p.value}`}</title>
                </rect>
              );
            })}
          </svg>
        )}
      </div>

      <p className="admin-metric-chart__insight">{def.insight}</p>
    </article>
  );
}

export default AdminMetricChart;