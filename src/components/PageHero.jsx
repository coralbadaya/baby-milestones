import { useEffect } from 'react';
import { NESTBEAN_WATERMARK_SRC } from '../constants/brandAssets';
import { pageImages } from '../data/pageImages';
import ImageWithFallback from './ImageWithFallback';

const PRELOAD_ID = 'page-hero-preload';

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
  className = '',
}) {
  const config = pageImages[imageKey] || pageImages.home;
  const isSplit = layout === 'split';

  useEffect(() => {
    if (!eager || !config.src) return undefined;

    let link = document.getElementById(PRELOAD_ID);
    if (!link) {
      link = document.createElement('link');
      link.id = PRELOAD_ID;
      link.rel = 'preload';
      link.as = 'image';
      document.head.appendChild(link);
    }
    link.href = config.src;

    return () => {
      link?.remove();
    };
  }, [eager, config.src]);

  const imageEl = (
    <ImageWithFallback
      className="page-hero__image-wrap"
      imgClassName="page-hero__image"
      src={config.src}
      watermarkSrc={NESTBEAN_WATERMARK_SRC}
      alt={config.alt || ''}
      fallbackGradient={config.fallbackGradient}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : 'auto'}
      imgStyle={config.objectPosition ? { objectPosition: config.objectPosition } : undefined}
    />
  );

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
        className={`page-hero page-hero--split page-hero--${size} page-hero--overlay-${overlay} page-hero--image-${imagePosition} ${className}`.trim()}
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
    <section className={`page-hero page-hero--${size} page-hero--overlay-${overlay} ${className}`.trim()}>
      {imageEl}
      <div className="page-hero__scrim" aria-hidden="true" />
      {content}
    </section>
  );
}

export default PageHero;
