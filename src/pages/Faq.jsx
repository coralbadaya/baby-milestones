import { useState } from 'react';
import Icon from '../components/Icon';
import PageBreadcrumb from '../components/PageBreadcrumb';
import StructuredData from '../components/StructuredData';
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
    <div className="content-page faq-page fade-in">
      <PageBreadcrumb
        items={[
          { name: 'Home', to: ROUTES.home },
          { name: 'FAQ' },
        ]}
      />
      <header className="content-page-hero">
        <Icon name="question" size={40} className="content-page-icon" />
        <h1>Frequently Asked Questions</h1>
        <p className="content-page-intro">
          Quick answers about milestones, mom care, your data, and how the app works.
        </p>
      </header>

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

      <StructuredData id="faq" data={faqSchema(FAQS)} />
      <StructuredData
        id="faq-breadcrumb"
        data={breadcrumbSchema([
          { name: 'Home', path: '/' },
          { name: 'FAQ', path: ROUTES.faq },
        ])}
      />
    </div>
  );
}

export default Faq;
