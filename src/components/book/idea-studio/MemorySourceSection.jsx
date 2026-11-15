import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes';

const SOURCES = [
  {
    id: 'album',
    title: 'Monthly album',
    desc: 'Photos you added on My Baby — the primary source for most ideas.',
  },
  {
    id: 'upload',
    title: 'Uploads',
    desc: 'Add photos when you start an idea. Nothing uploads without your tap.',
  },
  {
    id: 'firsts',
    title: 'Life firsts',
    desc: 'First smiles and steps from your journal, when you saved a photo.',
  },
  {
    id: 'family',
    title: 'Family Circle',
    desc: 'Faces and voice blessings you invited — only with your consent.',
  },
  {
    id: 'milestones',
    title: 'Milestones',
    desc: 'Growth measurements you enter — we never invent weight or height.',
  },
];

function MemorySourceSection({
  albumCount = 0,
  hasFirstMoments = false,
  hasScanned = false,
}) {
  return (
    <section className="idea-memory-sources baby-book-glass" aria-labelledby="idea-sources-heading">
      <h2 id="idea-sources-heading" className="idea-memory-sources__title">
        Your memories, waiting to become stories
      </h2>
      <p className="baby-book-section-sub idea-memory-sources__intro">
        {hasScanned
          ? `We matched ideas to ${albumCount} photo${albumCount === 1 ? '' : 's'} already in your Yarn Trails album — not your full camera roll unless you upload more.`
          : 'Connect memories by adding photos to your album. We do not scan your camera roll until you choose photos or upload.'}
      </p>

      <ul className="idea-memory-sources__list">
        {SOURCES.map((src) => (
          <li key={src.id} className="idea-memory-sources__item">
            <h3 className="idea-memory-sources__item-title">{src.title}</h3>
            <p className="idea-memory-sources__item-desc">{src.desc}</p>
          </li>
        ))}
      </ul>

      <div className="idea-memory-sources__actions">
        <Link to={ROUTES.babyAlbum} className="baby-book-btn baby-book-btn--primary">
          {albumCount > 0 ? 'Add more photos' : 'Add your first photos'}
        </Link>
        {hasFirstMoments && (
          <Link to={ROUTES.baby} className="baby-book-btn baby-book-btn--ghost">
            Life firsts journal
          </Link>
        )}
      </div>
    </section>
  );
}

export default MemorySourceSection;