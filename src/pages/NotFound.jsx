import { Link } from 'react-router-dom';
import TrustShell from '../components/TrustShell';
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
    <TrustShell title="Page not found">
      <p>That address is not a page on Yarn Trails. The link may be outdated, or the page may have moved.</p>
      <p className="trust-actions">
        <Link to={ROUTES.home}>Return home</Link>
        <Link to={ROUTES.guides}>Browse guides</Link>
      </p>
    </TrustShell>
  );
}

export default NotFound;
