import PageSection from './PageSection';
import GuideFaqSection from './GuideFaqSection';
import StructuredData from './StructuredData';
import { faqSchema } from '../utils/structuredData';

/**
 * SEO FAQ block for product hubs (vaccination, shopping, …).
 * @param {{ pathname: string, title: string, faqs: { q: string, a: string }[] }} props
 */
function ProductPageFaq({ pathname, title, faqs }) {
  if (!faqs?.length) return null;

  const schemaId = `faq-${pathname.replace(/\//g, '-').replace(/^-/, '')}`;

  return (
    <PageSection surface="ivory" width="wide" className="page-body--with-mobile-nav">
      <GuideFaqSection faqs={faqs} heading={title} />
      <StructuredData id={schemaId} data={faqSchema(faqs)} />
    </PageSection>
  );
}

export default ProductPageFaq;