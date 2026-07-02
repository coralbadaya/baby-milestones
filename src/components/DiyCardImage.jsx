import ImageWithFallback from './ImageWithFallback';
import { getDiyImage } from '../data/diyImages';
import { useDiyImagesContext } from '../context/DiyImagesContext';

function DiyCardImage({ activity, loading = 'lazy' }) {
  const { overrides } = useDiyImagesContext();
  const config = getDiyImage(
    { activityId: activity.id, illustration: activity.illustration, category: activity.category },
    overrides,
  );

  return (
    <ImageWithFallback
      className="diy-activity-media-photo"
      imgClassName="diy-activity-media-photo__img"
      src={config.src}
      watermarkSrc={config.watermarkSrc}
      alt={config.alt}
      fallbackGradient={config.fallbackGradient}
      placeholderColor={config.placeholderColor}
      loading={loading}
    />
  );
}

export default DiyCardImage;
