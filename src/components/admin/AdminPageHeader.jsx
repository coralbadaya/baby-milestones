import { Link } from 'react-router-dom';

/**
 * Admin page title block — breadcrumb, heading, description, optional action slot.
 * @param {{
 *   title: string,
 *   description?: string | import('react').ReactNode,
 *   breadcrumb?: string | { label: string, to?: string }[],
 *   action?: import('react').ReactNode,
 * }} props
 */
function AdminPageHeader({ title, description, breadcrumb, action }) {
  const crumbs = breadcrumb
    ? (Array.isArray(breadcrumb) ? breadcrumb : [{ label: breadcrumb }])
    : null;

  return (
    <header className="admin-page-header">
      {crumbs && crumbs.length > 0 && (
        <nav className="admin-breadcrumb" aria-label="Breadcrumb">
          {crumbs.map((crumb, index) => {
            const label = typeof crumb === 'string' ? crumb : crumb.label;
            const to = typeof crumb === 'string' ? undefined : crumb.to;
            const isLast = index === crumbs.length - 1;

            return (
              <span key={`${label}-${index}`} className="admin-breadcrumb-item">
                {index > 0 && <span className="admin-breadcrumb-sep" aria-hidden="true"> / </span>}
                {to && !isLast ? (
                  <Link to={to}>{label}</Link>
                ) : (
                  <span aria-current={isLast ? 'page' : undefined}>{label}</span>
                )}
              </span>
            );
          })}
        </nav>
      )}

      <div className="admin-page-header-row">
        <h1>{title}</h1>
        {action ? <div className="admin-page-header-action">{action}</div> : null}
      </div>

      {description ? <p className="admin-page-header-desc">{description}</p> : null}
    </header>
  );
}

export default AdminPageHeader;
