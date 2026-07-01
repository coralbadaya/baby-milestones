/**
 * Centered empty state for admin lists and tables.
 * @param {{ message: string, action?: import('react').ReactNode }} props
 */
function AdminEmpty({ message, action }) {
  return (
    <div className="admin-empty-state">
      <p className="admin-empty">{message}</p>
      {action ? <div className="admin-empty-action">{action}</div> : null}
    </div>
  );
}

export default AdminEmpty;
