/**
 * Filter/search bar with optional refresh and primary action slots.
 * @param {{
 *   left?: import('react').ReactNode,
 *   right?: import('react').ReactNode,
 *   onRefresh?: () => void,
 *   refreshLabel?: string,
 *   primaryAction?: import('react').ReactNode,
 *   children?: import('react').ReactNode,
 * }} props
 */
function AdminToolbar({
  left,
  right,
  onRefresh,
  refreshLabel = 'Refresh',
  primaryAction,
  children,
}) {
  return (
    <div className="admin-toolbar">
      {left ? <div className="admin-toolbar-left">{left}</div> : null}
      {children}
      <div className="admin-toolbar-right">
        {right}
        {onRefresh ? (
          <button type="button" className="admin-btn admin-btn--ghost" onClick={onRefresh}>
            {refreshLabel}
          </button>
        ) : null}
        {primaryAction}
      </div>
    </div>
  );
}

export default AdminToolbar;
