import { useId, useState } from 'react';
import { interact } from '../utils/haptics';
import { guideRichText } from '../utils/guideRichText';

/**
 * Visible FAQ — same content feeds FAQPage JSON-LD on the guide.
 * @param {{ faqs: { q: string, a: string }[], heading?: string }} props
 */
function GuideFaqSection({ faqs, heading = 'Common questions' }) {
  const headingId = useId();
  const [open, setOpen] = useState(0);

  if (!faqs?.length) return null;

  return (
    <section className="guide-faq content-block" aria-labelledby={headingId}>
      <h2 id={headingId}>{heading}</h2>
      <div className="faq-list">
        {faqs.map((item, i) => (
          <div key={item.q} className={`faq-item ${open === i ? 'expanded' : ''}`}>
            <button
              type="button"
              className="faq-question"
              aria-expanded={open === i}
              onClick={() => {
                setOpen(open === i ? -1 : i);
                interact('tap', 'light');
              }}
            >
              <span className="faq-question-text">{item.q}</span>
              <span className={`expand-arrow ${open === i ? 'open' : ''}`} aria-hidden="true">
                ▾
              </span>
            </button>
            {open === i ? (
              <div className="faq-answer fade-in">
                <p>{guideRichText(item.a)}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default GuideFaqSection;