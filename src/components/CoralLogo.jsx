import { BRAND_NAME, BRAND_TAGLINE } from '../constants/brand';

/**
 * Yarn Trails brand mark — yarn ball with trailing thread.
 * Static files: /public/brand/yarntrails-mark.svg, yarntrails-logo.svg
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
      <circle
        className="coral-logo-stroke-accent"
        cx="26"
        cy="30"
        r="13"
        fill="none"
        strokeWidth="3.5"
      />
      <path
        className="coral-logo-stroke-accent"
        d="M18 26 C22 22 30 22 34 26"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        className="coral-logo-stroke-accent"
        d="M17.5 30 C22 34 30 34 34.5 30"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        className="coral-logo-stroke-accent"
        d="M19 34.5 C23 38 29 38 33 34.5"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        className="coral-logo-stroke-parent"
        d="M38 34 C46 36 50 42 52 50"
        fill="none"
        strokeWidth="4"
        strokeLinecap="round"
      />
      <path
        className="coral-logo-stroke-parent"
        d="M39 26 C48 22 52 16 54 12"
        fill="none"
        strokeWidth="3.2"
        strokeLinecap="round"
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
