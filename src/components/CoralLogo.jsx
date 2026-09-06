import { useId } from 'react';
import { BRAND_NAME, BRAND_TAGLINE } from '../constants/brand';

const SAGE = '#3F5E52';
const HEART = '#C57A58';

/**
 * Yarn Trails brand mark — yarn ball with a heart-shaped trail thread.
 * Static files: /public/brand/yarntrails-mark.svg, yarntrails-logo.svg
 */
function CoralMark({ size = 32, className = '' }) {
  const uid = useId().replace(/:/g, '');
  const gradId = `yt-thread-${uid}`;

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
      <defs>
        <linearGradient id={gradId} x1="28" y1="34" x2="58" y2="20" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={SAGE} />
          <stop offset="45%" stopColor="#A88870" />
          <stop offset="100%" stopColor={HEART} />
        </linearGradient>
      </defs>
      <circle className="coral-logo-stroke-yarn" cx="17" cy="36.5" r="13.2" fill="none" strokeWidth="3.4" />
      <path className="coral-logo-stroke-yarn" d="M8 32.4 C13 27.4 21.2 27.4 26.2 32.4" fill="none" strokeWidth="2.2" strokeLinecap="round" />
      <path className="coral-logo-stroke-yarn" d="M7.4 36.6 C12.8 41.8 21.4 41.8 26.8 36.6" fill="none" strokeWidth="2.2" strokeLinecap="round" />
      <path className="coral-logo-stroke-yarn" d="M9.4 40.6 C14.2 45 20.2 45 25 40.6" fill="none" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M29.4 33.4 C34 28.6 38.6 23.4 42.2 19.8" fill="none" stroke={`url(#${gradId})`} strokeWidth="3" strokeLinecap="round" />
      <path
        d="M48 21.6 C48 17.8 44.2 15.2 40.8 17.6 C38 19.6 37.6 23.6 40.8 27.2 L48 36.2 L55.2 27.2 C58.4 23.6 58 19.6 55.2 17.6 C51.8 15.2 48 17.8 48 21.6"
        fill="none"
        stroke={HEART}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M56.2 20.4 C60.2 18.6 62.6 22.4 60.4 26.6" fill="none" stroke={HEART} strokeWidth="2.6" strokeLinecap="round" />
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

  const [yarnWord, trailsWord] = label.includes(' ')
    ? [label.slice(0, label.indexOf(' ')), label.slice(label.indexOf(' ') + 1)]
    : [label, ''];

  return (
    <span
      className={`coral-logo coral-logo--lockup${className ? ` ${className}` : ''}`}
      role="img"
      aria-label={tagline ? `${label} ${tagline}` : label}
    >
      <CoralMark size={size} />
      <span className="coral-logo-text" aria-hidden="true">
        <span className="coral-logo-wordmark">
          <span className="coral-logo-yarn">{yarnWord}</span>
          {trailsWord ? (
            <>
              {' '}
              <span className="coral-logo-trails">{trailsWord}</span>
            </>
          ) : null}
        </span>
        {tagline ? <span className="coral-logo-tagline">{tagline}</span> : null}
      </span>
    </span>
  );
}

export default CoralLogo;
export { CoralMark };
