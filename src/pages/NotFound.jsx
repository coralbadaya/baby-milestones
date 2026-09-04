import { Link } from 'react-router-dom';
import { ROUTES } from '../routes';
import { usePageMeta } from '../utils/pageMeta';
import { ROBOTS_NOINDEX } from '../seo/metadata';

function NotFound() {
  usePageMeta({
    title: 'Page not found',
    description: 'This page is not available on Yarn Trails.',
    robots: ROBOTS_NOINDEX,
  });

  return (
    <div className="content-page fade-in">
      <header className="content-page-hero">
        <h1>Page not found</h1>
        <p className="content-page-intro">
          That address is not a page on Yarn Trails. The link may be outdated, or the page may have moved.
        </p>
        <p>
          <Link to={ROUTES.home}>Return home</Link>
          {' · '}
          <Link to={ROUTES.guides}>Browse guides</Link>
        </p>
      </header>
    </div>
  );
}

export default NotFound;
