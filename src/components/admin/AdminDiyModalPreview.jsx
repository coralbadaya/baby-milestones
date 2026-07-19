import { diyCategoryConfig } from '../diyCategoryConfig';
import DiyActivityModalBody from '../DiyActivityModalBody';
import ImageWithFallback from '../ImageWithFallback';
import { BRAND_WATERMARK_SRC } from '../../constants/brandAssets';

/**
 * Live preview of the consumer "Open guide" modal for admin editing.
 * @param {{
 *   activity: {
 *     name: string,
 *     category: string,
 *     duration: string,
 *     difficulty: string,
 *     materials: string[],
 *     steps: string[],
 *     benefits: string[],
 *     whyItWorks: string,
 *     videoSearch: string,
 *   },
 *   imageSrc?: string,
 *   imageAlt?: string,
 * }} props
 */
function AdminDiyModalPreview({ activity, imageSrc, imageAlt }) {
  const cat = diyCategoryConfig[activity.category] || diyCategoryConfig.sensory;

  const image = (
    <ImageWithFallback
      className="diy-activity-media-photo admin-diy-modal-preview__image"
      imgClassName="diy-activity-media-photo__img"
      src={imageSrc}
      watermarkSrc={BRAND_WATERMARK_SRC}
      alt={imageAlt || activity.name}
      fallbackGradient={`linear-gradient(145deg, ${cat.bg} 0%, #F3F5F2 100%)`}
      loading="lazy"
    />
  );

  return (
    <div className="admin-diy-modal-preview">
      <div className="admin-diy-modal-preview__chrome">
        <h3 className="admin-diy-modal-preview__title">{activity.name || 'Untitled activity'}</h3>
        <p className="admin-diy-modal-preview__subtitle">
          {cat.label}
          {' · '}
          {activity.duration || '—'}
          {' · '}
          {activity.difficulty || 'Easy'}
        </p>
      </div>
      <div className="admin-diy-modal-preview__body">
        <DiyActivityModalBody activity={activity} image={image} />
      </div>
      {activity.videoSearch ? (
        <p className="admin-diy-modal-preview__url">
          <span>YouTube link</span>
          <a href={activity.videoSearch} target="_blank" rel="noreferrer">{activity.videoSearch}</a>
        </p>
      ) : null}
    </div>
  );
}

export default AdminDiyModalPreview;
