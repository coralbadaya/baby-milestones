import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes';

function StorySourcePhotos({ photos = [] }) {
  const withImages = photos.filter((p) => p.data_url);

  return (
    <section className="baby-book-studio__section baby-book-glass" aria-labelledby="story-photos-heading">
      <h3 id="story-photos-heading" className="baby-book-studio__section-title">Photos for this chapter</h3>
      <p className="baby-book-section-sub baby-book-studio__section-sub">
        Stories draw from your monthly album — add photos to enrich illustrations.
      </p>

      {withImages.length === 0 ? (
        <p className="baby-book-section-sub">
          No album photos yet.{' '}
          <Link to={ROUTES.babyAlbum} className="baby-book-studio__link">
            Add photos on My Baby
          </Link>
        </p>
      ) : (
        <div className="baby-book-source-photos">
          {withImages.slice(0, 6).map((photo) => (
            <figure key={photo.id} className="baby-book-source-photos__item">
              <img src={photo.data_url} alt={photo.caption || 'Album photo'} />
              {photo.caption && <figcaption>{photo.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </section>
  );
}

export default StorySourcePhotos;
