import { useState } from 'react';
import Icon from '../components/Icon';
import StructuredData from '../components/StructuredData';
import { FAQS } from '../data/legalContent';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import { faqSchema } from '../utils/structuredData';

function Faq() {
  const [open, setOpen] = useState(0);

  usePageMeta({
    title: 'Frequently Asked Questions',
    description: 'Answers to common questions about milestones, mom care, privacy, and using the app.',
  });

  const toggle = (i) => {
    setOpen(open === i ? null : i);
    interact('tap', 'light');
  };

  return (
    <div className="content-page faq-page fade-in">
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
    </div>
  );
}

export default Faq;
