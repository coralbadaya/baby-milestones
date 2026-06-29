import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import CoralLogo from './CoralLogo';
import { interact } from '../utils/haptics';
import { ROUTES, FOOTER_SECTIONS } from '../routes';
import { BRAND_NAME, SOCIAL_LINKS } from '../constants/brand';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    interact('tap', 'light');
    // No backend yet — capture intent locally so the field clears and confirms.
    setSubmitted(true);
    setEmail('');
  };

  return (
    <form className="site-footer-newsletter" onSubmit={handleSubmit}>
      <label htmlFor="footer-newsletter" className="site-footer-newsletter-label">
        Gentle, occasional notes for your journey
      </label>
      {submitted ? (
        <p className="site-footer-newsletter-thanks" role="status">
          <Icon name="check" size={16} /> Thank you — you&apos;re on the list.
        </p>
      ) : (
        <div className="site-footer-newsletter-row">
          <input
            id="footer-newsletter"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="site-footer-newsletter-input"
            aria-label="Email address"
          />
          <button type="submit" className="site-footer-newsletter-btn">
            Subscribe
          </button>
        </div>
      )}
    </form>
  );
}

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
            Curated milestones and care for your first years — educational, not medical advice.
          </p>
          <NewsletterSignup />
        </div>

        <div className="site-footer-columns">
          {FOOTER_SECTIONS.map((section) => (
            <nav key={section.heading} className="site-footer-col" aria-label={section.heading}>
              <h2 className="site-footer-heading">{section.heading}</h2>
              {section.links.map(({ to, label }) => (
                <Link
                  key={`${section.heading}-${label}`}
                  to={to}
                  className="site-footer-link"
                  onClick={() => interact('tap', 'light')}
                >
                  {label}
                </Link>
              ))}
            </nav>
          ))}
        </div>
      </div>

      <div className="site-footer-bottom">
        <div className="site-footer-bottom-inner">
          <div className="site-footer-social">
            {SOCIAL_LINKS.map(({ key, label, icon, url }) => (
              <a
                key={key}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer-social-link"
                aria-label={label}
                onClick={() => interact('tap', 'light')}
              >
                <Icon name={icon} size={20} label={label} />
              </a>
            ))}
          </div>

          <div className="site-footer-meta">
            <p className="site-footer-disclaimer">
              Educational information only. Always consult your pediatrician for health decisions.
            </p>
            <p className="site-footer-copy">&copy; {year} {BRAND_NAME}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
