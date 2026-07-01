import { Link } from 'react-router-dom';

/**
 * Metric card for admin overview grids.
 * @param {{ value: string | number, label: string, to?: string }} props
 */
function AdminStatCard({ value, label, to }) {
  const content = (
    <>
      <span className="admin-stat-value">{value}</span>
      <span className="admin-stat-label">{label}</span>
    </>
  );

  if (to) {
    return (
      <Link to={to} className="admin-stat-card">
        {content}
      </Link>
    );
  }

  return <div className="admin-stat-card">{content}</div>;
}

export default AdminStatCard;
