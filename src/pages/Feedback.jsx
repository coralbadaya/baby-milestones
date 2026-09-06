import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import { getStaticMeta } from '../seo/routes';
import { ROUTES } from '../routes';
import { CONTACT_EMAIL } from '../constants/brand';
import { FEEDBACK_TOPIC_OPTIONS, feedbackMessage, feedbackTopicLabel } from '../constants/feedbackTopics';

function Feedback() {
  usePageMeta(getStaticMeta(ROUTES.feedback) || {});

  const { user } = useAuth();
  const [topic, setTopic] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState(user?.email || '');
  const [description, setDescription] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (honeypot) return;
    if (!topic) {
      setError('Please choose what this is about.');
      return;
    }

    setSubmitting(true);
    setError(null);
    interact('tap', 'light');

    try {
      const message = feedbackMessage(topic, description);
      const payload = {
        p_email: email.trim(),
        p_name: name.trim() || null,
        p_message: message,
        p_user_id: user?.id ?? null,
      };

      let { error: insertError } = await supabase.rpc('submit_contact_form', {
        ...payload,
        p_subject: topic,
      });

      if (insertError && /invalid subject/i.test(insertError.message || '')) {
        const topicLabel = feedbackTopicLabel(topic);
        const prefixed = topicLabel && message !== topicLabel
          ? `${topicLabel}\n\n${message}`
          : message;
        ({ error: insertError } = await supabase.rpc('submit_contact_form', {
          ...payload,
          p_subject: 'feedback',
          p_message: prefixed,
        }));
      }

      if (insertError) throw insertError;

      interact('check', 'success');
      setSent(true);
      setDescription('');
    } catch (err) {
      setError(err.message || 'Could not send your feedback. Please try again.');
      interact('tap', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page fade-in">
      <header className="content-page-hero">
        <Icon name="speech-bubble" size={40} className="content-page-icon" />
        <h1>Share feedback</h1>
        <p className="content-page-intro">
          A tap and a note is enough. Tell us what is working, what is missing, or what felt off.
        </p>
      </header>

      {sent ? (
        <div className="contact-success card-accent-top" role="status">
          <Icon name="check" size={32} />
          <h2 className="font-display">Thank you</h2>
          <p>We read every note. No reply is needed unless you asked a question.</p>
          <button
            type="button"
            className="btn-ghost"
            onClick={() => { setSent(false); interact('tap', 'light'); }}
          >
            Share more feedback
          </button>
        </div>
      ) : (
        <form className="contact-form card-accent-top" onSubmit={handleSubmit}>
          <fieldset className="feedback-topics">
            <legend>What's this about?</legend>
            <div className="feedback-topics-grid">
              {FEEDBACK_TOPIC_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className={`feedback-topic${topic === option.value ? ' is-selected' : ''}`}
                >
                  <input
                    className="sr-only"
                    type="radio"
                    name="feedback-topic"
                    value={option.value}
                    checked={topic === option.value}
                    onChange={() => {
                      setTopic(option.value);
                      interact('tap', 'selection');
                    }}
                    required
                  />
                  <Icon name={option.icon} size={22} />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="auth-field">
            <label htmlFor="feedback-description">A little more, if you like</label>
            <textarea
              id="feedback-description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What happened, what you hoped for, or what you loved."
              className="contact-textarea"
            />
          </div>

          <div className="contact-form-grid">
            <div className="auth-field">
              <label htmlFor="feedback-name">Name</label>
              <input
                id="feedback-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="feedback-email">Email</label>
              <input
                id="feedback-email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </div>

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
            {submitting ? 'Sending…' : 'Share feedback'}
          </button>

          <p className="contact-disclaimer">
            We cannot provide medical advice. For urgent concerns, contact your pediatrician or
            local emergency number. For press or partnership, use{' '}
            <Link to={ROUTES.contact}>Contact</Link>. You can also email{' '}
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

export default Feedback;
