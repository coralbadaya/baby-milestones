import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from './Icon';
import CoralLogo from './CoralLogo';
import { useCookieConsent } from '../context/CookieConsentContext';
import { interact } from '../utils/haptics';
import { subscribeFooter } from '../utils/newsletterAdmin';
import { ROUTES, FOOTER_SECTIONS } from '../routes';
import { BRAND_NAME, SOCIAL_LINKS } from '../constants/brand';

function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;
    interact('tap', 'light');
    setLoading(true);
    try {
      const result = await subscribeFooter(trimmed);
      setSubmitted(true);
      setEmail('');
      setMessage(
        result?.already_subscribed
          ? "You're already on the list — thank you."
          : "Thank you — you're on the list.",
      );
    } catch {
      setMessage('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="site-footer-newsletter" onSubmit={handleSubmit}>
      <label htmlFor="footer-newsletter" className="site-footer-newsletter-label">
        Gentle, occasional notes for your journey
      </label>
      {submitted ? (
        <p className="site-footer-newsletter-thanks" role="status">
          <Icon name="check" size={16} /> {message || "Thank you — you're on the list."}
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
          <button type="submit" className="site-footer-newsletter-btn" disabled={loading}>
            {loading ? '…' : 'Subscribe'}
          </button>
        </div>
      )}
    </form>
  );
}

function Footer() {
  const year = new Date().getFullYear();
  const { analyticsConfigured, openPreferences } = useCookieConsent();

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
            {analyticsConfigured ? (
              <button
                type="button"
                className="site-footer-cookie-btn"
                onClick={() => {
                  interact('tap', 'light');
                  openPreferences();
                }}
              >
                Cookie preferences
              </button>
            ) : null}
            <p className="site-footer-copy">&copy; {year} {BRAND_NAME}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
