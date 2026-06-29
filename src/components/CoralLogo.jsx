import { BRAND_NAME, BRAND_TAGLINE } from '../constants/brand';

/**
 * Nestbean brand mark — an "N" monogram cradling a golden bean (baby in a nest).
 * Static files: /public/brand/nestbean-mark.svg, nestbean-logo.svg
 */
function CoralMark({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`coral-logo-mark${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      <path className="coral-logo-stroke-parent" d="M18 17 V47" strokeWidth="6" strokeLinecap="round" />
      <path className="coral-logo-stroke-parent" d="M46 17 V47" strokeWidth="6" strokeLinecap="round" />
      <path
        className="coral-logo-stroke-parent"
        d="M18 18.5 L46 45.5"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse className="coral-logo-fill-accent" cx="32" cy="41.5" rx="8.2" ry="5.4" />
      <circle className="coral-logo-fill-accent" cx="25.4" cy="39.2" r="3.1" />
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
