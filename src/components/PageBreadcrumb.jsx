import { Link } from 'react-router-dom';

/**
 * Visible breadcrumb for editorial / content pages. Keep chrome quiet.
 * @param {{ items: { name: string, to?: string }[] }} props
 */
function PageBreadcrumb({ items }) {
  if (!items?.length) return null;

  return (
    <nav className="page-breadcrumb" aria-label="Breadcrumb">
      <ol className="page-breadcrumb-list">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.name}-${index}`} className="page-breadcrumb-item">
              {index > 0 && <span className="page-breadcrumb-sep" aria-hidden="true">/</span>}
              {!last && item.to ? (
                <Link to={item.to}>{item.name}</Link>
              ) : (
                <span aria-current={last ? 'page' : undefined}>{item.name}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default PageBreadcrumb;
