import { useEffect, useRef, useState } from 'react';
import Icon from '../Icon';
import PremiumGate from '../PremiumGate';
import { PREMIUM_FEATURES, ENTITLEMENT_LIMITS } from '../../constants/premium';
import { interact } from '../../utils/haptics';
import useVoiceNotes from '../../hooks/useVoiceNotes';

function VoiceNoteRecorder({ attachType, attachId }) {
  const { notes, quota, isPlus, saveNote, removeNote } = useVoiceNotes();
  const [recording, setRecording] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [error, setError] = useState(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  useEffect(() => () => {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRef.current?.stream?.getTracks?.().forEach((t) => t.stop());
  }, []);

  const start = async () => {
    setError(null);
    interact('tap', 'light');
    if (!quota.canRecord && !isPlus) {
      setError('Voice note limit reached — upgrade to Plus.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
      recorder.onstop = async () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        try {
          await saveNote(blob, { attachType, attachId, durationSeconds: seconds });
        } catch (err) {
          setError(err.message);
        }
      };
      mediaRef.current = recorder;
      recorder.start();
      setRecording(true);
      setSeconds(0);
      timerRef.current = setInterval(() => {
        setSeconds((s) => {
          if (s + 1 >= ENTITLEMENT_LIMITS.voiceNoteMaxSeconds) {
            stop();
            return ENTITLEMENT_LIMITS.voiceNoteMaxSeconds;
          }
          return s + 1;
        });
      }, 1000);
    } catch {
      setError('Microphone access is required to record voice notes.');
    }
  };

  const stop = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    mediaRef.current?.stop?.();
    setRecording(false);
  };

  return (
    <div className="voice-notes">
      <p className="voice-notes__quota">
        {isPlus
          ? 'Unlimited voice notes on Plus'
          : `${quota.remaining} of ${quota.limit} notes stored`}
      </p>

      <PremiumGate feature={PREMIUM_FEATURES.voiceNotes} compact={!quota.canRecord && !isPlus}>
        <div className="voice-notes__recorder">
          {!recording ? (
            <button type="button" className="btn-primary" onClick={start}>
              <Icon name="speech-bubble" size={18} />
              Record voice note
            </button>
          ) : (
            <button type="button" className="btn-ghost" onClick={stop}>
              Stop ({seconds}s / {ENTITLEMENT_LIMITS.voiceNoteMaxSeconds}s)
            </button>
          )}
        </div>
      </PremiumGate>

      {error && <p className="auth-error" role="alert">{error}</p>}

      <ul className="voice-notes__list">
        {notes.map((note) => (
          <li key={note.id} className="voice-notes__item">
            <audio controls src={note.data_url} preload="none" />
            <button type="button" className="btn-ghost" onClick={() => removeNote(note.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VoiceNoteRecorder;
