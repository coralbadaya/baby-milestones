import { Link } from 'react-router-dom';
import TrustShell from './TrustShell';
import { interact } from '../utils/haptics';

/**
 * Renders a structured long-form content page (legal / company / trust).
 * Guide articles keep `.content-page` and do not use this shell.
 * @param {{ page: import('../data/legalContent').PAGES[string], breadcrumb?: import('react').ReactNode }} props
 */
function ContentPage({ page, breadcrumb }) {
  if (!page) return null;

  const layout = page.layout === 'policy' ? 'policy' : 'brief';

  return (
    <TrustShell
      icon={page.icon}
      title={page.title}
      updated={page.updated}
      breadcrumb={breadcrumb}
      related={page.related}
      bodySurface={layout === 'brief' ? 'ivory' : 'white'}
    >
      {page.note && <p className="trust-note">{page.note}</p>}
      <div className={`trust-blocks trust-blocks--${layout}`}>
        {page.body.map((block, i) => (
          <section
            key={block.heading || i}
            className={`trust-block${block.tone === 'boundary' ? ' trust-block--boundary' : ''}`}
          >
            {block.heading && <h2>{block.heading}</h2>}
            {block.sources?.length > 0 && (
              <ul className="trust-chips">
                {block.sources.map((source) => (
                  <li key={source.label}>
                    <Link to={source.to} onClick={() => interact('tap', 'light')}>
                      {source.label}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {block.paragraphs?.map((p) => (
              <p key={p}>{p}</p>
            ))}
            {block.list && (
              <ul>
                {block.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </TrustShell>
  );
}

export default ContentPage;
