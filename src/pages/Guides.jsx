import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import guides from '../data/guides';
import { ROUTES } from '../routes';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';

function Guides() {
  usePageMeta({
    title: 'Guides & Articles',
    description:
      'Evidence-informed guides on baby development, postpartum recovery, vaccinations, and the practical side of early parenthood.',
  });

  return (
    <div className="guides-page fade-in">
      <header className="content-page-hero">
        <Icon name="book-open" size={40} className="content-page-icon" />
        <h1>Guides &amp; Articles</h1>
        <p className="content-page-intro">
          Evidence-informed, gently written guides for the first years — reviewed against trusted
          medical guidance.
        </p>
      </header>

      <div className="guides-grid">
        {guides.map((guide) => (
          <Link
            key={guide.slug}
            to={ROUTES.guide(guide.slug)}
            className="guide-card"
            onClick={() => interact('tap', 'light')}
          >
            <div className="guide-card-icon">
              <Icon name={guide.icon} size={28} />
            </div>
            <span className="guide-card-category">{guide.category}</span>
            <h2 className="guide-card-title">{guide.title}</h2>
            <p className="guide-card-desc">{guide.description}</p>
            <span className="guide-card-meta">{guide.readMinutes} min read</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Guides;
