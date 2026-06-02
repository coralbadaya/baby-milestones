import { BRAND_NAME, BRAND_TAGLINE } from '../constants/brand';

/**
 * Nestmile brand mark — nest + baby + ascending milestone path.
 * Static files: /public/brand/coral-mark.svg, coral-logo.svg
 */
function CoralMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`coral-logo-mark${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <path
        className="coral-logo-stroke-parent"
        d="M8 12.25Q16 5.75 24 12.25"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        className="coral-logo-stroke-mile"
        d="M10.5 16.75L14 13.25L17.25 10.25L21 8.25"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle className="coral-logo-fill-primary" cx="10.5" cy="16.75" r="1.35" />
      <circle className="coral-logo-fill-primary" cx="14" cy="13.25" r="1.35" />
      <circle className="coral-logo-fill-accent" cx="17.25" cy="10.25" r="1.35" />
      <circle className="coral-logo-fill-accent" cx="21" cy="8.25" r="1.35" />
      <path
        className="coral-logo-stroke-parent"
        d="M7 20.25Q16 27.25 25 20.25"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle
        className="coral-logo-stroke-baby"
        cx="16"
        cy="21.25"
        r="2.35"
        strokeWidth="1.75"
      />
    </svg>
  );
}

/**
 * @param {{
 *   variant?: 'mark' | 'lockup',
 *   size?: number,
 *   tagline?: string | null,
 *   className?: string,
 *   label?: string,
 * }} props
 */
function CoralLogo({
  variant = 'lockup',
  size = 32,
  tagline = BRAND_TAGLINE,
  className = '',
  label = BRAND_NAME,
}) {
  if (variant === 'mark') {
    return <CoralMark size={size} className={className} />;
  }

  return (
    <span
      className={`coral-logo coral-logo--lockup${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={tagline ? `${label} ${tagline}` : label}
    >
      <CoralMark size={size} />
      <span className="coral-logo-text" aria-hidden="true">
        <span className="coral-logo-wordmark">{label}</span>
        {tagline ? <span className="coral-logo-tagline">{tagline}</span> : null}
      </span>
    </span>
  );
}

export default CoralLogo;
export { CoralMark };
