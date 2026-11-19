import { Link, useLocation } from 'react-router-dom';
import { interact } from '../utils/haptics';
import { PRIMARY_NAV, MOBILE_NAV, PREMIUM_NAV, ROUTES, navSectionFromPath } from '../routes';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import CoralLogo from './CoralLogo';
import HeaderMobileActions from './HeaderMobileActions';

function pagePath(to) {
  return String(to).split('#')[0];
}

function isNamedPage(pathname, to) {
  const path = pagePath(to);
  if (path === ROUTES.home) return pathname === ROUTES.home;
  if (path === ROUTES.baby) return pathname === ROUTES.baby;
  if (path === ROUTES.communityTab('feed')) {
    return pathname === path || pathname.startsWith(`${path}/`);
  }
  return pathname === path || pathname.startsWith(`${path}/`);
}

function Header() {
  const { pathname } = useLocation();
  const section = navSectionFromPath(pathname);
  const { user, loading } = useAuth();

  const navClass = (key) => (section === key ? 'active' : '');
  const onNav = () => interact('tap', 'selection');

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to={PRIMARY_NAV[0].to} className="header-logo" onClick={onNav}>
            <CoralLogo variant="lockup" size={24} tagline={null} />
          </Link>
          <nav className="header-nav" aria-label="Primary">
            <div className="header-nav-links">
              {PRIMARY_NAV.map((item) => (
                <div key={item.key} className="header-item">
                  <Link to={item.to} className={navClass(item.key)} onClick={onNav}>
                    {item.label}
                  </Link>
                  {item.pages ? (
                    <div className="header-menu" role="group" aria-label={`${item.label} pages`}>
                      {item.pages.map((page) => (
                        <Link
                          key={page.to}
                          to={page.to}
                          className={isNamedPage(pathname, page.to) ? 'active' : ''}
                          onClick={onNav}
                        >
                          {page.label}
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
            <div className="header-nav-foot">
              {!loading && (
                user ? (
                  <Link
                    to={ROUTES.account}
                    className={`header-auth ${pathname === ROUTES.account ? 'active' : ''}`}
                    onClick={onNav}
                  >
                    Account
                  </Link>
                ) : (
                  <>
                    <Link
                      to={ROUTES.signup}
                      className={`header-auth ${pathname === ROUTES.signup ? 'active' : ''}`}
                      onClick={onNav}
                    >
                      Sign up
                    </Link>
                    <Link
                      to={ROUTES.login}
                      className={`header-auth ${pathname === ROUTES.login ? 'active' : ''}`}
                      onClick={onNav}
                    >
                      Sign in
                    </Link>
                  </>
                )
              )}
              <Link
                to={PREMIUM_NAV.to}
                className={`header-cta ${navClass(PREMIUM_NAV.key)}`}
                onClick={onNav}
              >
                {PREMIUM_NAV.label}
              </Link>
            </div>
          </nav>
          <HeaderMobileActions />
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Primary">
        {MOBILE_NAV.map(({ key, to, mobileLabel, icon, paid }) => (
          <Link
            key={key}
            to={to}
            className={`${navClass(key)}${paid ? ' mobile-nav__paid' : ''}`}
            onClick={onNav}
          >
            {paid ? (
              <span className="mobile-nav__paid-disc" aria-hidden="true">
                <Icon name={icon} size={22} />
              </span>
            ) : (
              <Icon name={icon} size={18} />
            )}
            <span>{mobileLabel}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

export default Header;
