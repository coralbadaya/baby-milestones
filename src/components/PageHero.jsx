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
}) {
  const config = pageImages[imageKey] || pageImages.home;
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = config.src && !imgFailed;

  return (
    <section
      className={`page-hero page-hero--${size} page-hero--overlay-${overlay}`}
      style={!showImage ? { background: config.fallbackGradient } : undefined}
    >
      {showImage && (
        <img
          className="page-hero__image"
          src={config.src}
          alt={config.alt || ''}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onError={() => setImgFailed(true)}
        />
      )}
      <div className="page-hero__scrim" aria-hidden="true" />
      <div className="page-hero__content">
        {eyebrow && <p className="page-hero__eyebrow">{eyebrow}</p>}
        {title && <h1 className="page-hero__title font-display">{title}</h1>}
        {subtitle && <p className="page-hero__subtitle">{subtitle}</p>}
        {children && <div className="page-hero__slot">{children}</div>}
      </div>
    </section>
  );
}

export default PageHero;
