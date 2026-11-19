import { useId, useState } from 'react';

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
              onClick={() => setOpen(open === i ? -1 : i)}
            >
              {item.q}
            </button>
            {open === i ? (
              <div className="faq-answer fade-in">
                <p>{item.a}</p>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

export default GuideFaqSection;