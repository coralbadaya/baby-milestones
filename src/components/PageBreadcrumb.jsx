import { Link } from 'react-router-dom';
import Icon from './Icon';

/**
 * Visible breadcrumb for editorial / content pages. Keep chrome quiet.
 * Must sit inside the page column (`.content-page` or `PageSection`), never as a
 * full-bleed sibling of `<main>`.
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
              {index > 0 && <Icon name="caret-right" size={12} className="page-breadcrumb-sep" />}
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
