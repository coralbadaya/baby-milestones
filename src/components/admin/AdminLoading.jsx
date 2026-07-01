/**
 * Loading state — text copy or skeleton placeholders.
 * @param {{
 *   message?: string,
 *   variant?: 'text' | 'stat-grid' | 'table',
 *   rows?: number,
 *   cols?: number,
 * }} props
 */
function AdminLoading({
  message = 'Loading…',
  variant = 'text',
  rows = 5,
  cols = 4,
}) {
  if (variant === 'stat-grid') {
    return (
      <div className="admin-stat-grid" aria-busy="true" aria-label={message}>
        {Array.from({ length: cols }, (_, i) => (
          <div key={i} className="admin-stat-card admin-skeleton-stat">
            <span className="admin-skeleton admin-skeleton--value" />
            <span className="admin-skeleton admin-skeleton--label" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === 'table') {
    return (
      <div className="admin-table-wrap admin-skeleton-table" aria-busy="true" aria-label={message}>
        <div className="admin-skeleton admin-skeleton--thead" />
        {Array.from({ length: rows }, (_, i) => (
          <div key={i} className="admin-skeleton admin-skeleton--row" />
        ))}
      </div>
    );
  }

  return <p className="admin-loading">{message}</p>;
}

export default AdminLoading;
