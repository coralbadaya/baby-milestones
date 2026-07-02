import { useState } from 'react';
import { useVoiceProfiles } from '../../hooks/useVoiceProfiles';

function GrandparentInviteFlow() {
  const { createGrandparentInvite, getInviteUrl, profiles, approveProfile } = useVoiceProfiles();
  const [name, setName] = useState('Nani');
  const [language, setLanguage] = useState('hi');
  const [inviteUrl, setInviteUrl] = useState('');
  const [creating, setCreating] = useState(false);

  const pendingGrandparents = profiles.filter(
    (p) => p.role === 'grandparent' && p.status === 'pending',
  );

  const handleInvite = async () => {
    setCreating(true);
    try {
      const profile = await createGrandparentInvite(name, language);
      setInviteUrl(getInviteUrl(profile));
    } finally {
      setCreating(false);
    }
  };

  const copyLink = () => {
    if (inviteUrl) navigator.clipboard?.writeText(inviteUrl);
  };

  return (
    <div className="baby-book-glass" style={{ padding: '1.25rem', marginTop: '1rem' }}>
      <h3 className="baby-book-section-title" style={{ fontSize: '1.15rem' }}>
        Invite Nani to record hers
      </h3>
      <p className="baby-book-section-sub" style={{ marginBottom: '0.75rem' }}>
        Grandma records once — your baby hears bedtime stories in Nani&apos;s voice forever.
      </p>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Display name"
          aria-label="Grandparent display name"
          style={{
            flex: 1,
            minWidth: '120px',
            padding: '0.5rem 0.75rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--book-twilight-border)',
            background: 'rgba(0,0,0,0.2)',
            color: 'var(--book-twilight-text)',
            fontFamily: 'inherit',
          }}
        />
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          aria-label="Language"
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            border: '1px solid var(--book-twilight-border)',
            background: 'rgba(0,0,0,0.2)',
            color: 'var(--book-twilight-text)',
            fontFamily: 'inherit',
          }}
        >
          <option value="hi">हिन्दी</option>
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
          <option value="te">తెలుగు</option>
        </select>
      </div>

      <button
        type="button"
        className="baby-book-btn baby-book-btn--primary"
        onClick={handleInvite}
        disabled={creating}
      >
        {creating ? 'Creating…' : 'Generate invite link'}
      </button>

      {inviteUrl && (
        <div className="baby-book-invite-link">
          <input type="text" readOnly value={inviteUrl} aria-label="Invite link" />
          <button type="button" className="baby-book-btn" onClick={copyLink}>
            Copy
          </button>
        </div>
      )}

      {pendingGrandparents.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <p style={{ fontSize: '0.8rem', color: 'var(--book-twilight-text-muted)', margin: '0 0 0.5rem' }}>
            Pending approval
          </p>
          {pendingGrandparents.map((p) => (
            <div key={p.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span>{p.display_name}</span>
              {p.sample_storage_path && (
                <button type="button" className="baby-book-btn" onClick={() => approveProfile(p.id)}>
                  Approve voice
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default GrandparentInviteFlow;
