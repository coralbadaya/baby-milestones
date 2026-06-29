import Icon from './Icon';

/**
 * Renders a structured long-form content page (legal / company / trust).
 * @param {{ page: import('../data/legalContent').PAGES[string] }} props
 */
function ContentPage({ page }) {
  if (!page) return null;

  return (
    <article className="content-page legal-page fade-in">
      <header className="content-page-hero">
        {page.icon && <Icon name={page.icon} size={40} className="content-page-icon" />}
        <h1>{page.title}</h1>
        {page.updated && <p className="content-page-updated">Last updated: {page.updated}</p>}
        {page.intro && <p className="content-page-intro">{page.intro}</p>}
      </header>

      {page.note && (
        <div className="content-page-note" role="note">
          <Icon name="info" size={18} />
          <span>{page.note}</span>
        </div>
      )}

      <div className="content-page-body">
        {page.body.map((block, i) => (
          <section key={block.heading || i} className="content-block">
            {block.heading && <h2>{block.heading}</h2>}
            {block.paragraphs?.map((p, j) => (
              <p key={j}>{p}</p>
            ))}
            {block.list && (
              <ul>
                {block.list.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    </article>
  );
}

export default ContentPage;
