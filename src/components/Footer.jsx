import { Link } from 'react-router-dom';
import Icon from './Icon';
import CoralLogo from './CoralLogo';
import { interact } from '../utils/haptics';
import { ROUTES } from '../routes';

const FOOTER_LINKS = [
  { to: ROUTES.home, label: 'Home', icon: 'home' },
  { to: ROUTES.shopping, label: 'Shopping', icon: 'shopping-cart' },
  { to: ROUTES.vaccination, label: 'Vaccination', icon: 'medical' },
  { to: ROUTES.travel, label: 'Travel', icon: 'luggage' },
  { to: ROUTES.momCare, label: 'Mom Care', icon: 'heart' },
  { to: ROUTES.communityTab('feed'), label: 'Community', icon: 'speech-bubble' },
  { to: ROUTES.progress, label: 'Progress', icon: 'bar-chart' },
  { to: ROUTES.sources, label: 'Sources', icon: 'books' },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <Link to={ROUTES.home} className="site-footer-logo" onClick={() => interact('tap', 'light')}>
            <CoralLogo variant="lockup" size={28} tagline={null} />
          </Link>
          <p className="site-footer-tagline">
            Milestones, care tips, and shopping from our journey — not medical advice.
          </p>
        </div>

        <nav className="site-footer-nav" aria-label="Footer">
          {FOOTER_LINKS.map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="site-footer-link"
              onClick={() => interact('tap', 'light')}
            >
              <Icon name={icon} size={14} />
              {label}
            </Link>
          ))}
        </nav>

        <div className="site-footer-meta">
          <p className="site-footer-disclaimer">
            Personal recommendations only. Always check with your pediatrician for health decisions.
          </p>
          <p className="site-footer-copy">&copy; {year} Nestmile</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
