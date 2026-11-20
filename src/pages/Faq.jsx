import { useState } from 'react';
import PageBreadcrumb from '../components/PageBreadcrumb';
import StructuredData from '../components/StructuredData';
import TrustShell from '../components/TrustShell';
import { FAQS } from '../data/legalContent';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import { getStaticMeta } from '../seo/routes';
import { ROUTES } from '../routes';
import { breadcrumbSchema, faqSchema } from '../utils/structuredData';

function Faq() {
  const [open, setOpen] = useState(0);

  usePageMeta(getStaticMeta(ROUTES.faq) || {});

  const toggle = (i) => {
    setOpen(open === i ? null : i);
    interact('tap', 'light');
  };

  return (
    <>
      <TrustShell
        icon="question"
        title="Frequently Asked Questions"
        breadcrumb={(
          <PageBreadcrumb
            items={[
              { name: 'Home', to: ROUTES.home },
              { name: 'FAQ' },
            ]}
          />
        )}
      >
        <div className="faq-list">
          {FAQS.map((item, i) => (
            <div key={item.q} className={`faq-item ${open === i ? 'expanded' : ''}`}>
              <button
                type="button"
                className="faq-question"
                aria-expanded={open === i}
                onClick={() => toggle(i)}
              >
                <span>{item.q}</span>
                <span className={`expand-arrow ${open === i ? 'open' : ''}`}>▾</span>
              </button>
              {open === i && (
                <div className="faq-answer fade-in">
                  <p>{item.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </TrustShell>
      <StructuredData id="faq" data={faqSchema(FAQS)} />
      <StructuredData
        id="faq-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: ROUTES.faq },
        ])}
      />
    </>
  );
}

export default Faq;
