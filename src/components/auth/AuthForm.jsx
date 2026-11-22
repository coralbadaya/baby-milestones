import { useState } from 'react';
import { interact } from '../../utils/haptics';
import Icon from '../Icon';
import DevAuthAssist from './DevAuthAssist';
import { CONTACT_EMAIL } from '../../constants/brand';

/**
 * Common sign-in / create-account form. One email + password continues:
 * existing members are signed in; new emails get an account.
 *
 * @param {{
 *   onSubmit: (values: { email: string, password: string, displayName?: string }) => Promise<void>,
 *   error?: string|null,
 * }} props
 */
function AuthForm({ onSubmit, error: externalError }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    interact('tap', 'light');
    try {
      await onSubmit({ email, password, displayName });
    } catch (err) {
      setError(err.message || 'Something went wrong');
      interact('tap', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const displayError = externalError || error;

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="auth-display-name">Display name (optional)</label>
        <input
          id="auth-display-name"
          type="text"
          autoComplete="name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          placeholder="How we greet you"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={CONTACT_EMAIL}
        />
      </div>

      <div className="auth-field">
        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
        />
      </div>

      {displayError && (
        <p className="auth-error" role="alert">
          <Icon name="warning" size={16} />
          {displayError}
        </p>
      )}

      <button type="submit" className="btn-primary auth-submit" disabled={submitting}>
        {submitting ? 'Please wait…' : 'Continue'}
      </button>

      <DevAuthAssist
        onFillCredentials={({ email: e, password: p, displayName: name }) => {
          setEmail(e);
          setPassword(p);
          if (name) setDisplayName(name);
        }}
      />
    </form>
  );
}

export default AuthForm;

export function AuthPageShell({ title, intro, children, footer }) {
  return (
    <div className="auth-page fade-in">
      <div className="auth-card card-accent-top">
        <header className="auth-card-header">
          <Icon name="heart" size={32} className="auth-card-icon" />
          <h1 className="font-display">{title}</h1>
          {intro && <p className="auth-card-intro">{intro}</p>}
        </header>
        {children}
        {footer}
      </div>
    </div>
  );
}
