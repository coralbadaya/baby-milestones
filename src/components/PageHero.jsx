import { useState } from 'react';
import { pageImages } from '../data/pageImages';

function PageHero({
  imageKey,
  eyebrow,
  title,
  subtitle,
  children,
  size = 'lg',
  overlay = 'dark',
  eager = false,
  layout = 'stack',
  imagePosition = 'right',
}) {
  const config = pageImages[imageKey] || pageImages.home;
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = config.src && !imgFailed;
  const isSplit = layout === 'split';

  const imageEl = showImage ? (
    <img
      className="page-hero__image"
      src={config.src}
      alt={config.alt || ''}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={eager ? 'high' : 'auto'}
      style={config.objectPosition ? { objectPosition: config.objectPosition } : undefined}
      onError={() => setImgFailed(true)}
    />
  ) : null;

  const content = (
    <div className="page-hero__content">
      {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}
      {title && <h1 className="page-hero__title font-display">{title}</h1>}
      {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
      {children && <div className="page-hero__slot">{children}</div>}
    </div>
  );

  if (isSplit) {
    return (
      <section
        className={`page-hero page-hero--split page-hero--${size} page-hero--overlay-${overlay} page-hero--image-${imagePosition}`}
        style={!showImage ? { background: config.fallbackGradient } : undefined}
      >
        <div className="page-hero__split">
          <div className="page-hero__split-copy">
            {content}
          </div>
          <div className="page-hero__split-media">
            {imageEl}
            <div className="page-hero__scrim page-hero__scrim--split" aria-hidden="true" />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      className={`page-hero page-hero--${size} page-hero--overlay-${overlay}`}
      style={!showImage ? { background: config.fallbackGradient } : undefined}
    >
      {imageEl}
      <div className="page-hero__scrim" aria-hidden="true" />
      {content}
    </section>
  );
}

export default PageHero;
