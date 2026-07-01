import { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from '../components/Select';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';
import { CONTACT_EMAIL } from '../constants/brand';
import { CONTACT_SUBJECT_OPTIONS } from '../constants/contactSubjects';

function Contact() {
  usePageMeta({
    title: 'Contact Us',
    description: 'Get in touch with the Nestbean team — feedback, partnerships, and questions.',
  });

  const { user } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;

    setSubmitting(true);
    setError(null);
    interact('tap', 'light');

    try {
      const { error: insertError } = await supabase.rpc('submit_contact_form', {
        p_email: email.trim(),
        p_name: name.trim() || null,
        p_subject: subject,
        p_message: message.trim(),
        p_user_id: user?.id ?? null,
      });

      if (insertError) throw insertError;

      interact('check', 'success');
      setSent(true);
      setMessage('');
    } catch (err) {
      setError(err.message || 'Could not send your message. Please try again.');
      interact('tap', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page fade-in">
      <header className="content-page-hero">
        <Icon name="envelope" size={40} className="content-page-icon" />
        <h1>Contact Us</h1>
        <p className="content-page-intro">
          We would love to hear from you — feedback, questions, partnership ideas, or just a hello.
        </p>
      </header>

      {sent ? (
        <div className="contact-success card-accent-top" role="status">
          <Icon name="check" size={32} />
          <h2 className="font-display">Message received</h2>
          <p>Thank you. We aim to reply within a few business days.</p>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => { setSent(false); interact('tap', 'light'); }}
          >
            Send another message
          </button>
        </div>
      ) : (
        <form className="contact-form card-accent-top" onSubmit={handleSubmit}>
          <div className="contact-form-grid">
            <div className="auth-field">
              <label htmlFor="contact-name">Name</label>
              <input
                id="contact-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="contact-email">Email</label>
              <input
                id="contact-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

          <div className="auth-field">
            <label htmlFor="contact-subject">Subject</label>
            <Select
              id="contact-subject"
              value={subject}
              onChange={setSubject}
              options={CONTACT_SUBJECT_OPTIONS}
            />
          </div>

          <div className="auth-field">
            <label htmlFor="contact-message">Message</label>
            <textarea
              id="contact-message"
              required
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="How can we help?"
              className="contact-textarea"
            />
          </div>

          {/* Honeypot — hidden from users */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="contact-honeypot"
            aria-hidden
          />

          {error && (
            <p className="auth-error" role="alert">
              <Icon name="warning" size={16} />
              {error}
            </p>
          )}

          <button type="submit" className="btn-primary contact-submit" disabled={submitting}>
            {submitting ? 'Sending…' : 'Send message'}
          </button>

          <p className="contact-disclaimer">
            We cannot provide medical advice. For urgent concerns, contact your pediatrician or
            local emergency number. You can also email us directly at{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </form>
      )}

      <p className="contact-back">
        <Link to={ROUTES.home} onClick={() => interact('tap', 'light')}>
          ← Back to Today
        </Link>
      </p>
    </div>
  );
}

export default Contact;
