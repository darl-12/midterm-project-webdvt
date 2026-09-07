import { CHART_COLORS } from '../utils/categories';
import { formatCurrency } from '../utils/formatCurrency';

//donut chart and the percentage for each of the category
export default function CategoryBreakdown({ data, emptyLabel = 'No expenses recorded yet.' }) {
  const total = data.reduce((sum, d) => sum + d.value, 0);

  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  let offsetAccumulator = 0;

  if (total === 0) {
    return <div className="empty-state">{emptyLabel}</div>;
  }

  return (
    <div className="breakdown-body">
      <div className="donut-wrap">
        <svg width="150" height="150" viewBox="0 0 150 150">
          {data.map((d, i) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const dashArray = `${dash} ${circumference - dash}`;
            const dashOffset = -offsetAccumulator;
            offsetAccumulator += dash;
            return (
              <circle
                key={d.label}
                cx="75"
                cy="75"
                r={radius}
                fill="none"
                stroke={CHART_COLORS[i % CHART_COLORS.length]}
                strokeWidth="20"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                transform="rotate(-90 75 75)"
              />
            );
          })}
        </svg>
      </div>

      <div className="breakdown-bars">
        {data.map((d, i) => {
          const percent = Math.round((d.value / total) * 100);
          return (
            <div key={d.label}>
              <div className="bar-row-label">
                <span>
                  <span
                    className="legend-dot"
                    style={{ background: CHART_COLORS[i % CHART_COLORS.length] }}
                  />
                  {d.label}
                </span>
                <span>{formatCurrency(d.value)}</span>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${percent}%`,
                    background: CHART_COLORS[i % CHART_COLORS.length],
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
