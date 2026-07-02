import { useCallback, useEffect, useRef, useState } from 'react';
import { useEntitlements } from '../../hooks/useEntitlements';
import PremiumGate from '../PremiumGate';
import { PREMIUM_FEATURES } from '../../constants/premium';
import GrandparentInviteFlow from './GrandparentInviteFlow';

const MAX_SECONDS = 60;

function VoiceCloneRecorder({ profile, onComplete, onCreateProfile, skipGate = false }) {
  const { isPlus } = useEntitlements();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [consent, setConsent] = useState(false);
  const [waveHeights, setWaveHeights] = useState(Array(24).fill(4));
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const analyserRef = useRef(null);
  const animRef = useRef(null);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    if (timerRef.current) clearInterval(timerRef.current);
    if (animRef.current) cancelAnimationFrame(animRef.current);
    setRecording(false);
  }, []);

  const startRecording = useCallback(async () => {
    if (!consent) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 64;
      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tickWave = () => {
        analyser.getByteFrequencyData(data);
        const heights = Array.from({ length: 24 }, (_, i) => {
          const v = data[i] || 0;
          return Math.max(4, (v / 255) * 48);
        });
        setWaveHeights(heights);
        animRef.current = requestAnimationFrame(tickWave);
      };
      tickWave();

      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        audioCtx.close();
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        onComplete?.(blob, seconds);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);

      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= MAX_SECONDS) {
            stopRecording();
            return MAX_SECONDS;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      /* mic permission denied */
    }
  }, [consent, onComplete, seconds, stopRecording]);

  useEffect(() => () => {
    stopRecording();
  }, [stopRecording]);

  const content = (
    <div className="baby-book-recorder baby-book-glass">
      <h3 className="baby-book-section-title" style={{ fontSize: '1.15rem' }}>
        Your voice
      </h3>
      <p className="baby-book-section-sub" style={{ marginBottom: '0.5rem' }}>
        Record 60 seconds once — AI narrates every story in your voice, in your language.
      </p>

      <div className="baby-book-waveform" aria-hidden="true">
        {waveHeights.map((h, i) => (
          <div key={i} className="baby-book-waveform__bar" style={{ height: `${h}px` }} />
        ))}
      </div>

      <p className="baby-book-recorder__timer">
        {String(Math.floor(seconds / 60)).padStart(2, '0')}:
        {String(seconds % 60).padStart(2, '0')}
        {' '}/ 01:00
      </p>

      <div className="baby-book-consent">
        <label>
          <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
          <span>
            I consent to voice cloning for personal story narration only.
            Recordings are stored securely and can be deleted anytime.
          </span>
        </label>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {!recording ? (
          <button
            type="button"
            className="baby-book-btn baby-book-btn--primary"
            disabled={!consent || !profile}
            onClick={startRecording}
          >
            {profile ? 'Start recording' : 'Create profile first'}
          </button>
        ) : (
          <button type="button" className="baby-book-btn" onClick={stopRecording}>
            Stop & save
          </button>
        )}
        {!profile && (
          <button type="button" className="baby-book-btn baby-book-btn--ghost" onClick={onCreateProfile}>
            Create voice profile
          </button>
        )}
      </div>
    </div>
  );

  if (!isPlus && !skipGate) {
    return (
      <PremiumGate feature={PREMIUM_FEATURES.voiceClone}>
        {content}
      </PremiumGate>
    );
  }

  return content;
}

export default VoiceCloneRecorder;
