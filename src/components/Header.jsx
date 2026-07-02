import { Link, useLocation } from 'react-router-dom';
import { interact } from '../utils/haptics';
import { PRIMARY_NAV, MOBILE_NAV, PREMIUM_NAV, ROUTES, navSectionFromPath } from '../routes';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';
import CoralLogo from './CoralLogo';

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
            <CoralLogo variant="lockup" size={32} tagline="for parents" />
          </Link>
          <nav className="header-nav" aria-label="Primary">
            {PRIMARY_NAV.map(({ key, to, label }) => (
              <Link key={key} to={to} className={navClass(key)} onClick={onNav}>
                {label}
              </Link>
            ))}
            {!loading && (
              user ? (
                <Link
                  to={ROUTES.account}
                  className={`header-auth ${pathname === ROUTES.account ? 'active' : ''}`}
                  onClick={onNav}
                >
                  <Icon name="user" size={16} />
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
              <Icon name={PREMIUM_NAV.icon} size={16} />
              {PREMIUM_NAV.label}
            </Link>
          </nav>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Primary">
        {MOBILE_NAV.map(({ key, to, mobileLabel, icon }) => (
          <Link key={key} to={to} className={navClass(key)} onClick={onNav}>
            <Icon name={icon} size={18} />
            <span>{mobileLabel}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}

export default Header;
