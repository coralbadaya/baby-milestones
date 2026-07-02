import { useEffect, useState } from 'react';
import { NESTBEAN_WATERMARK_ALT, NESTBEAN_WATERMARK_SRC } from '../constants/brandAssets';

/**
 * Image with Nestbean watermark fallback when primary src is missing or fails.
 * @param {{
 *   src?: string,
 *   watermarkSrc?: string,
 *   alt: string,
 *   fallbackGradient?: string,
 *   placeholderColor?: string,
 *   className?: string,
 *   imgClassName?: string,
 *   loading?: 'lazy' | 'eager',
 *   decoding?: 'async' | 'sync' | 'auto',
 *   fetchPriority?: 'high' | 'low' | 'auto',
 *   style?: import('react').CSSProperties,
 *   imgStyle?: import('react').CSSProperties,
 *   onError?: () => void,
 * }} props
 */
function ImageWithFallback({
  src,
  watermarkSrc = NESTBEAN_WATERMARK_SRC,
  alt,
  fallbackGradient = 'linear-gradient(145deg, #F5EDE5 0%, #FCF8F2 100%)',
  placeholderColor,
  className,
  imgClassName,
  loading = 'lazy',
  decoding = 'async',
  fetchPriority,
  style,
  imgStyle,
  onError,
}) {
  const initialStage = src ? 'primary' : (watermarkSrc ? 'watermark' : 'gradient');
  const [stage, setStage] = useState(initialStage);

  useEffect(() => {
    setStage(src ? 'primary' : (watermarkSrc ? 'watermark' : 'gradient'));
  }, [src, watermarkSrc]);

  const activeSrc = stage === 'primary' ? src : stage === 'watermark' ? watermarkSrc : null;
  const resolvedAlt = stage === 'watermark' && alt ? alt : (alt || NESTBEAN_WATERMARK_ALT);

  const containerStyle = {
    ...style,
    ...(activeSrc
      ? { backgroundColor: placeholderColor || undefined }
      : { background: fallbackGradient }),
  };

  if (!activeSrc) {
    return <div className={className} style={containerStyle} aria-hidden="true" />;
  }

  return (
    <div className={className} style={containerStyle}>
      <img
        className={imgClassName}
        src={activeSrc}
        alt={resolvedAlt}
        loading={loading}
        decoding={decoding}
        fetchPriority={fetchPriority}
        style={imgStyle}
        onError={() => {
          if (stage === 'primary' && watermarkSrc) {
            setStage('watermark');
          } else {
            setStage('gradient');
            onError?.();
          }
        }}
      />
    </div>
  );
}

export default ImageWithFallback;
