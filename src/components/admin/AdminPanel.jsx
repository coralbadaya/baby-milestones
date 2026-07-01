/**
 * White elevated content surface for admin pages.
 * @param {{ children: import('react').ReactNode, className?: string, padding?: boolean }} props
 */
function AdminPanel({ children, className = '', padding = true }) {
  return (
    <div className={`admin-panel${padding ? '' : ' admin-panel--flush'}${className ? ` ${className}` : ''}`}>
      {children}
    </div>
  );
}

export default AdminPanel;
