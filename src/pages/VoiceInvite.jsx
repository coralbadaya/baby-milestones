import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { usePageMeta } from '../utils/pageMeta';
import VoiceCloneRecorder from '../components/book/VoiceCloneRecorder';
import { supabase } from '../utils/supabaseClient';

function VoiceInvite() {
  const { token } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [consent, setConsent] = useState(false);

  usePageMeta({
    title: 'Record your voice',
    description: 'Leave a voice blessing for your grandchild — Yarn Trails Baby Book.',
  });

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    supabase
      .from('voice_profiles')
      .select('*')
      .eq('invite_token', token)
      .maybeSingle()
      .then(({ data }) => {
        setProfile(data);
        setLoading(false);
      });
  }, [token]);

  const handleComplete = async (blob, duration) => {
    if (!profile) return;
    const path = `voice-samples/${profile.id}-${Date.now()}.webm`;
    await supabase.storage.from('voice-notes').upload(path, blob, { contentType: 'audio/webm' });
    await supabase
      .from('voice_profiles')
      .update({
        sample_storage_path: path,
        consent_signed_at: new Date().toISOString(),
        status: 'pending',
      })
      .eq('id', profile.id);
    setDone(true);
  };

  if (loading) {
    return (
      <div className="baby-book-shell" style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Loading invite…</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="baby-book-shell" style={{ minHeight: '100dvh', padding: '2rem' }}>
        <p>This invite link is invalid or has expired.</p>
      </div>
    );
  }

  if (done) {
    return (
      <div className="baby-book-shell" style={{ minHeight: '100dvh', padding: '2rem' }}>
        <div className="baby-book-glass" style={{ padding: '1.5rem', maxWidth: 400, margin: '0 auto' }}>
          <h1 className="baby-book-section-title">Thank you!</h1>
          <p className="baby-book-section-sub">
            Your recording has been submitted. The parent will approve it before stories use your voice.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="baby-book-shell" style={{ minHeight: '100dvh', padding: '1rem' }}>
      <div style={{ maxWidth: 480, margin: '0 auto' }}>
        <h1 className="baby-book-section-title">
          Record for {profile.display_name || 'your grandchild'}
        </h1>
        <p className="baby-book-section-sub">
          Read aloud for up to 60 seconds. Your voice will narrate bedtime stories in {profile.language || 'your language'}.
        </p>

        <div className="baby-book-consent baby-book-glass" style={{ padding: '1rem' }}>
          <label>
            <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
            <span>
              I consent to voice cloning for personal family story narration only.
            </span>
          </label>
        </div>

        {consent && (
          <VoiceCloneRecorder
            profile={profile}
            onComplete={handleComplete}
            onCreateProfile={() => {}}
            skipGate
          />
        )}
      </div>
    </div>
  );
}

export default VoiceInvite;
