import { useLocation } from 'react-router-dom';
import ContentPage from '../components/ContentPage';
import StructuredData from '../components/StructuredData';
import { PAGES } from '../data/legalContent';
import { usePageMeta } from '../utils/pageMeta';
import { breadcrumbSchema } from '../utils/structuredData';

/**
 * Generic renderer for the static legal / company / trust pages.
 * @param {{ pageKey: keyof typeof PAGES }} props
 */
function StaticPage({ pageKey }) {
  const { pathname } = useLocation();
  const page = PAGES[pageKey];

  usePageMeta({
    title: page?.title,
    description: page?.intro,
  });

  if (!page) return null;

  return (
    <>
      <ContentPage page={page} />
      <StructuredData
        id={`breadcrumb-${pageKey}`}
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: page.title, path: pathname },
        ])}
      />
    </>
  );
}

export default StaticPage;
