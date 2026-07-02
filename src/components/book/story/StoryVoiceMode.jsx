import { useState } from 'react';
import PremiumGate from '../../PremiumGate';
import { PREMIUM_FEATURES } from '../../../constants/premium';
import VoiceCloneRecorder from '../VoiceCloneRecorder';
import GrandparentInviteFlow from '../GrandparentInviteFlow';

function StoryVoiceMode({
  voiceMode,
  onVoiceModeChange,
  isPlus,
  profile,
  onComplete,
  onCreateProfile,
  showInvite = false,
}) {
  const [showRecorder, setShowRecorder] = useState(voiceMode === 'clone');

  const selectMode = (mode) => {
    onVoiceModeChange(mode);
    setShowRecorder(mode === 'clone');
  };

  const card = (
    <section className="baby-book-studio__section baby-book-glass" aria-labelledby="story-voice-heading">
      <h3 id="story-voice-heading" className="baby-book-studio__section-title">Narration voice</h3>
      <div className="baby-book-voice-mode">
        <div className="baby-book-voice-mode__header">
          <p className="baby-book-voice-mode__hint">
            {voiceMode === 'clone'
              ? 'Cloned from one 60-second recording'
              : 'Warm storyteller voice'}
          </p>
          <div className="baby-book-pill-row">
            <button
              type="button"
              className={`baby-book-pill${voiceMode === 'storyteller' ? ' baby-book-pill--active' : ''}`}
              onClick={() => selectMode('storyteller')}
            >
              Storyteller
            </button>
            <button
              type="button"
              className={`baby-book-pill${voiceMode === 'clone' ? ' baby-book-pill--active' : ''}`}
              onClick={() => selectMode('clone')}
            >
              Your voice
              {!isPlus && <span className="baby-book-plus-tag">Plus</span>}
            </button>
          </div>
        </div>

        {showRecorder && voiceMode === 'clone' && (
          <div className="baby-book-voice-mode__recorder">
            <VoiceCloneRecorder
              profile={profile}
              onComplete={onComplete}
              onCreateProfile={onCreateProfile}
              skipGate
            />
            {showInvite && isPlus && <GrandparentInviteFlow />}
          </div>
        )}
      </div>
    </section>
  );

  if (isPlus || voiceMode === 'storyteller') return card;

  return (
    <PremiumGate feature={PREMIUM_FEATURES.voiceClone} compact>
      {card}
    </PremiumGate>
  );
}

export default StoryVoiceMode;
