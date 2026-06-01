import { Link, useLocation } from 'react-router-dom';
import { interact } from '../utils/haptics';
import { ROUTES, navSectionFromPath } from '../routes';
import Icon from './Icon';

function Header({ soundEnabled, onToggleSound }) {
  const { pathname } = useLocation();
  const section = navSectionFromPath(pathname);

  const navClass = (key) => (section === key ? 'active' : '');

  const onNav = () => interact('tap', 'selection');

  return (
    <>
      <header className="header">
        <div className="header-inner">
          <Link to={ROUTES.home} className="header-logo" onClick={onNav}>
            <Icon name="baby" size={28} className="header-logo-icon" label="Baby Milestones" />
            <span>Baby Milestones</span>
          </Link>
          <nav className="header-nav">
            <Link to={ROUTES.home} className={navClass('home')} onClick={onNav}>
              Home
            </Link>
            <Link to={ROUTES.shopping} className={navClass('shopping')} onClick={onNav}>
              Shopping
            </Link>
            <Link to={ROUTES.vaccination} className={navClass('vaccination')} onClick={onNav}>
              Vaccination
            </Link>
            <Link to={ROUTES.travel} className={navClass('travel')} onClick={onNav}>
              Travel
            </Link>
            <Link to={ROUTES.momCare} className={navClass('momCare')} onClick={onNav}>
              Mom Care
            </Link>
            <Link to={ROUTES.communityTab('feed')} className={navClass('community')} onClick={onNav}>
              Community
            </Link>
            <Link to={ROUTES.progress} className={navClass('dashboard')} onClick={onNav}>
              Progress
            </Link>
            <Link to={ROUTES.sources} className={navClass('sources')} onClick={onNav}>
              Sources
            </Link>
            <button
              type="button"
              className="sound-toggle"
              onClick={(e) => { e.stopPropagation(); onToggleSound(); }}
              title={soundEnabled ? 'Mute sounds' : 'Enable sounds'}
            >
              <Icon name={soundEnabled ? 'speaker-loud' : 'speaker-muted'} size={20} label={soundEnabled ? 'Mute sounds' : 'Enable sounds'} />
            </button>
          </nav>
        </div>
      </header>
      <nav className="mobile-nav">
        <Link to={ROUTES.home} className={navClass('home')} onClick={onNav}>
          <Icon name="home" size={18} />
          <span>Home</span>
        </Link>
        <Link to={ROUTES.shopping} className={navClass('shopping')} onClick={onNav}>
          <Icon name="shopping-cart" size={18} />
          <span>Shop</span>
        </Link>
        <Link to={ROUTES.vaccination} className={navClass('vaccination')} onClick={onNav}>
          <Icon name="medical" size={18} />
          <span>Vaccines</span>
        </Link>
        <Link to={ROUTES.travel} className={navClass('travel')} onClick={onNav}>
          <Icon name="luggage" size={18} />
          <span>Travel</span>
        </Link>
        <Link to={ROUTES.momCare} className={navClass('momCare')} onClick={onNav}>
          <Icon name="heart" size={18} />
          <span>Mom Care</span>
        </Link>
        <Link to={ROUTES.communityTab('feed')} className={navClass('community')} onClick={onNav}>
          <Icon name="speech-bubble" size={18} />
          <span>Community</span>
        </Link>
        <Link to={ROUTES.progress} className={navClass('dashboard')} onClick={onNav}>
          <Icon name="bar-chart" size={18} />
          <span>Progress</span>
        </Link>
        <Link to={ROUTES.sources} className={navClass('sources')} onClick={onNav}>
          <Icon name="books" size={18} />
          <span>Sources</span>
        </Link>
        <button
          type="button"
          className="sound-toggle-mobile"
          onClick={(e) => { e.stopPropagation(); onToggleSound(); }}
        >
          <Icon name={soundEnabled ? 'speaker-loud' : 'speaker-muted'} size={18} />
          <span>Sound</span>
        </button>
      </nav>
    </>
  );
}

export default Header;
