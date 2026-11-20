import { Link } from 'react-router-dom';
import Icon from './Icon';
import PageSection from './PageSection';
import { interact } from '../utils/haptics';

/**
 * Shared reading shell for legal, trust, and company pages.
 * Ivory hero, then the body. Guide articles do not use this.
 * @param {{
 *   icon?: string,
 *   title: string,
 *   updated?: string,
 *   breadcrumb?: import('react').ReactNode,
 *   children?: import('react').ReactNode,
 *   related?: { to: string, label: string }[],
 *   bodyWidth?: 'narrow' | 'wide',
 *   bodySurface?: 'white' | 'ivory',
 *   className?: string,
 * }} props
 */
function TrustShell({
  icon,
  title,
  updated,
  breadcrumb,
  children,
  related,
  bodyWidth = 'narrow',
  bodySurface = 'white',
  className = '',
}) {
  return (
    <div className={`trust-page fade-in${className ? ` ${className}` : ''}`}>
      <PageSection
        surface="ivory"
        width={bodyWidth}
        reveal={false}
        className="trust-page__hero-band"
      >
        {breadcrumb}
        <header className="trust-hero">
          {icon && (
            <span className="trust-hero__disc" aria-hidden="true">
              <Icon name={icon} size={26} />
            </span>
          )}
          <h1>{title}</h1>
          {updated && <p className="trust-hero__updated">Last updated: {updated}</p>}
        </header>
      </PageSection>

      {(children || related?.length) && (
        <PageSection
          surface={bodySurface}
          width={bodyWidth}
          reveal={false}
          className="trust-page__body-band page-body--with-mobile-nav"
        >
          {children}
          {related?.length > 0 && (
            <p className="trust-related">
              {related.map((link, i) => (
                <span key={link.to}>
                  {i > 0 ? ' · ' : null}
                  <Link to={link.to} onClick={() => interact('tap', 'light')}>
                    {link.label}
                  </Link>
                </span>
              ))}
            </p>
          )}
        </PageSection>
      )}
    </div>
  );
}

export default TrustShell;
