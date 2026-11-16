import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { interact } from '../utils/haptics';
import { MOBILE_USER_MENU, PREMIUM_NAV, ROUTES, navSectionFromPath } from '../routes';
import { useAuth } from '../context/AuthContext';
import Icon from './Icon';

function userInitial(profile, user) {
  const name = profile?.display_name?.trim() || user?.email?.split('@')[0]?.trim();
  if (!name) return '';
  return name.charAt(0).toUpperCase();
}

export default function HeaderMobileActions() {
  const { pathname } = useLocation();
  const section = navSectionFromPath(pathname);
  const { user, profile, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef(null);

  const items = user ? MOBILE_USER_MENU.member : MOBILE_USER_MENU.guest;
  const initial = userInitial(profile, user);
  const premiumActive = section === PREMIUM_NAV.key || pathname === ROUTES.premium;
  const accountActive = pathname === ROUTES.account
    || pathname === ROUTES.login
    || pathname === ROUTES.signup;

  const close = useCallback(() => setOpen(false), []);
  const onNav = useCallback(() => {
    interact('tap', 'selection');
    close();
  }, [close]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(event) {
      if (event.key === 'Escape') close();
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, close]);

  useEffect(() => {
    if (!open) return undefined;
    function onPointerDown(event) {
      if (wrapRef.current && !wrapRef.current.contains(event.target)) {
        close();
      }
    }
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open, close]);

  return (
    <div className="header-mobile-actions" ref={wrapRef}>
      <Link
        to={PREMIUM_NAV.to}
        className={`header-cta header-mobile-actions__plus ${premiumActive ? 'active' : ''}`}
        onClick={onNav}
      >
        {PREMIUM_NAV.label}
      </Link>
      {loading ? (
        <span
          className="header-mobile-actions__you header-mobile-actions__you--loading"
          aria-hidden
        />
      ) : (
        <>
          <button
            type="button"
            className={`header-mobile-actions__you${accountActive ? ' active' : ''}`}
            aria-expanded={open}
            aria-controls={menuId}
            aria-haspopup="true"
            aria-label={user ? 'Your account and settings' : 'Sign in or create an account'}
            onClick={() => setOpen((was) => !was)}
          >
            {initial ? (
              <span className="header-mobile-actions__initial" aria-hidden>
                {initial}
              </span>
            ) : (
              <Icon name="user" size={22} />
            )}
          </button>
          {open ? (
            <>
              <button
                type="button"
                className="header-user-menu__backdrop"
                aria-label="Close menu"
                tabIndex={-1}
                onClick={close}
              />
              <nav
                id={menuId}
                className="header-user-menu"
                aria-label={user ? 'Account' : 'Sign in'}
              >
                {items.map((item) => (
                  <Link
                    key={item.key}
                    to={item.to}
                    className={pathname === item.to ? 'active' : ''}
                    onClick={onNav}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}