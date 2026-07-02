import { Link } from 'react-router-dom';
import { interact } from '../utils/haptics';

/**
 * Quiet editorial CTA row — one outcome line + primary/secondary actions.
 */
function ConversionBand({
  text,
  primaryLabel,
  primaryTo,
  onPrimaryClick,
  secondaryLabel,
  secondaryTo,
  onSecondaryClick,
  className = '',
}) {
  const onPrimary = () => {
    interact('tap', 'light');
    onPrimaryClick?.();
  };

  const onSecondary = () => {
    interact('tap', 'light');
    onSecondaryClick?.();
  };

  return (
    <div className={`conversion-band ${className}`.trim()}>
      <p className="conversion-band__text">{text}</p>
      <div className="conversion-band__actions">
        {primaryTo ? (
          <Link to={primaryTo} className="btn-primary conversion-band__btn" onClick={onPrimary}>
            {primaryLabel}
          </Link>
        ) : (
          <button type="button" className="btn-primary conversion-band__btn" onClick={onPrimary}>
            {primaryLabel}
          </button>
        )}
        {secondaryLabel && (secondaryTo || onSecondaryClick) && (
          secondaryTo ? (
            <Link to={secondaryTo} className="btn-ghost conversion-band__btn" onClick={onSecondary}>
              {secondaryLabel}
            </Link>
          ) : (
            <button type="button" className="btn-ghost conversion-band__btn" onClick={onSecondary}>
              {secondaryLabel}
            </button>
          )
        )}
      </div>
    </div>
  );
}

export default ConversionBand;
