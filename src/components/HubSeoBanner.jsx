import { Link } from 'react-router-dom';
import { HUB_SEO_INTROS } from '../data/hubSeoIntros';

function HubSeoBanner({ pathname, onLink }) {
  const intro = HUB_SEO_INTROS[pathname];
  if (!intro) return null;
  return (
    <p className="hub-banner">
      {intro.parts.map((part, i) => (
        part.to ? (
          <Link key={i} to={part.to} onClick={onLink}>{part.label}</Link>
        ) : (
          <span key={i}>{part.text}</span>
        )
      ))}
    </p>
  );
}

export default HubSeoBanner;
