import { Link } from 'react-router-dom';
import { interact } from '../utils/haptics';

function SectionHeader({
  id,
  eyebrow,
  title,
  subtitle,
  linkTo,
  linkLabel,
  className = '',
}) {
  return (
    <header className={`section-header ${className}`.trim()}>
      <div className="section-header__text">
        {eyebrow && <p className="section-header__eyebrow">{eyebrow}</p>}
        <h2 id={id} className="section-header__title font-display">{title}</h2>
        {subtitle && <p className="section-header__subtitle">{subtitle}</p>}
      </div>
      {linkTo && linkLabel && (
        <Link
          to={linkTo}
          className="section-header__link"
          onClick={() => interact('tap', 'light')}
        >
          {linkLabel}
        </Link>
      )}
    </header>
  );
}

export default SectionHeader;
