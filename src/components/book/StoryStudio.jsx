import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useEntitlements } from '../../hooks/useEntitlements';
import { useBabyStories } from '../../hooks/useBabyStories';
import { useVoiceProfiles } from '../../hooks/useVoiceProfiles';
import { useMonthlyAlbum } from '../../hooks/useMonthlyAlbum';
import { generateDemoStory } from '../../utils/storyGeneration';
import { readAloudPages, stopReadAloud, isReadAloudSupported } from '../../utils/storyNarration';
import { PREMIUM_FEATURES } from '../../constants/premium';
import { ROUTES } from '../../routes';
import LanguageSwitchDemo from './LanguageSwitchDemo';
import FolkTaleToggle from './FolkTaleToggle';
import AnnualTrialOffer from './AnnualTrialOffer';
import StoryChapterBanner from './story/StoryChapterBanner';
import StoryQuotaChip from './story/StoryQuotaChip';
import StoryHowItWorks from './story/StoryHowItWorks';
import StorySourcePhotos from './story/StorySourcePhotos';
import StoryScenePicker from './story/StoryScenePicker';
import StoryPersonaPicker from './story/StoryPersonaPicker';
import StoryPreviewPanel from './story/StoryPreviewPanel';
import StoryHistoryList from './story/StoryHistoryList';
import StoryPreviewActions from './story/StoryPreviewActions';
import StoryVoiceMode from './story/StoryVoiceMode';

function buildPreviewVariants(opts) {
  return generateDemoStory(opts).languageVariants;
}

function StoryStudio({ birthDate, babyName = 'little one', babyAgeMonths = 6 }) {
  const navigate = useNavigate();
  const { canUseFeature, recordStoryGeneration, offerAnnualTrial, isPlus, state } = useEntitlements();
  const { stories, generateStory, generating } = useBabyStories();
  const { profiles, createProfile, uploadVoiceSample } = useVoiceProfiles();
  const { photos } = useMonthlyAlbum();

  const [activeLanguage, setActiveLanguage] = useState('en');
  const [sceneId, setSceneId] = useState('astronaut');
  const [folkEnabled, setFolkEnabled] = useState(false);
  const [folkTemplateId, setFolkTemplateId] = useState('moonJourney');
  const [persona, setPersona] = useState('gentle');
  const [artStyle, setArtStyle] = useState('watercolor');
  const [voiceMode, setVoiceMode] = useState('storyteller');
  const [narrating, setNarrating] = useState(false);
  const [activeStory, setActiveStory] = useState(null);
  const [languageVariants, setLanguageVariants] = useState(() =>
    buildPreviewVariants({ babyName, babyAgeMonths, sceneId: 'astronaut' }),
  );
  const [showTrial, setShowTrial] = useState(false);
  const [parentProfile, setParentProfile] = useState(null);

  const parentVoiceProfile = profiles.find((p) => p.role === 'parent') || parentProfile;
  const canGenerate = canUseFeature(PREMIUM_FEATURES.aiStory);
  const storiesRemaining = state?.stories?.remaining ?? 1;
  const hasVoiceClone = Boolean(
    parentVoiceProfile?.clone_provider_id
    || parentVoiceProfile?.sample_url
    || parentVoiceProfile?.sample_storage_path
    || parentVoiceProfile?.voice_sample_url,
  );

  const previewOpts = {
    babyName,
    babyAgeMonths,
    sceneId: folkEnabled ? null : sceneId,
    folkTemplateId: folkEnabled ? folkTemplateId : null,
    persona,
    artStyle,
  };

  useEffect(() => {
    setLanguageVariants(buildPreviewVariants(previewOpts));
  }, [babyName, babyAgeMonths, sceneId, folkEnabled, folkTemplateId, persona, artStyle]);

  const syncVariantsFromStory = (story) => {
    const variants = story?.language_variants || story?.languageVariants;
    if (variants) {
      setLanguageVariants(variants);
      return;
    }
    setLanguageVariants(buildPreviewVariants(previewOpts));
  };

  const handleGenerate = async () => {
    const result = await generateStory(
      {
        babyName,
        babyAgeMonths,
        language: activeLanguage,
        sceneId: folkEnabled ? null : sceneId,
        folkTemplateId: folkEnabled ? folkTemplateId : null,
        persona,
        artStyle,
      },
      isPlus ? null : recordStoryGeneration,
    );

    if (result?.blocked) return;

    if (result?.story) {
      setActiveStory(result.story);
      syncVariantsFromStory(result.story);
    }

    if (result?.quota?.offer_annual_trial) {
      setShowTrial(true);
    }
  };

  const handleSelectHistory = (story) => {
    setActiveStory(story);
    syncVariantsFromStory(story);
    if (story.language) setActiveLanguage(story.language);
  };

  const handleCreateParentProfile = async () => {
    const p = await createProfile({ role: 'parent', displayName: 'You', language: activeLanguage });
    setParentProfile(p);
  };

  const handleVoiceComplete = async (blob, duration) => {
    if (!parentVoiceProfile) return;
    await uploadVoiceSample(parentVoiceProfile.id, blob, duration);
  };

  const handleReadAloud = async () => {
    if (narrating) {
      stopReadAloud();
      setNarrating(false);
      return;
    }

    const variant = languageVariants[activeLanguage];
    const texts = (variant?.pages || []).map((p) => p.text);
    if (!texts.length) return;

    setNarrating(true);
    try {
      if (voiceMode === 'clone' && hasVoiceClone && parentVoiceProfile?.clone_provider_id) {
        const { narrateStoryPages } = await import('../../utils/narrateStory');
        await narrateStoryPages({
          texts,
          languageCode: activeLanguage,
          voiceId: parentVoiceProfile.clone_provider_id,
          useClone: true,
        });
      } else if (voiceMode === 'storyteller') {
        await readAloudPages(texts, activeLanguage);
      }
    } catch {
      /* speech unsupported or blocked */
    } finally {
      setNarrating(false);
    }
  };

  const previewStory = activeStory || null;
  const canReadAloud = isReadAloudSupported()
    && (voiceMode === 'storyteller' || (voiceMode === 'clone' && hasVoiceClone));

  return (
    <div className="baby-book-studio">
      <h2 className="baby-book-section-title">Story Studio</h2>
      <p className="baby-book-section-sub">
        Pick a dream, pick a language — tonight the story is told the way your childhood stories were told.
      </p>

      <StoryChapterBanner birthDate={birthDate} babyName={babyName} />
      <StoryQuotaChip isPlus={isPlus} storiesRemaining={storiesRemaining} />
      <StoryHowItWorks />
      <StorySourcePhotos photos={photos} />

      <StoryScenePicker sceneId={sceneId} onSceneChange={setSceneId} />

      <FolkTaleToggle
        enabled={folkEnabled}
        onChange={setFolkEnabled}
        selectedTemplateId={folkTemplateId}
        onTemplateChange={setFolkTemplateId}
      />

      <LanguageSwitchDemo
        languageVariants={languageVariants}
        activeLanguage={activeLanguage}
        onLanguageChange={setActiveLanguage}
        hasVoiceProfile={voiceMode === 'clone' && hasVoiceClone}
      />

      <StoryPersonaPicker
        persona={persona}
        artStyle={artStyle}
        onPersonaChange={setPersona}
        onArtStyleChange={setArtStyle}
        isPlus={isPlus}
      />

      <div className="baby-book-studio__cta-row">
        {canGenerate ? (
          <button
            type="button"
            className={`baby-book-btn baby-book-btn--primary${generating ? ' baby-book-btn--generating' : ''}`}
            onClick={handleGenerate}
            disabled={generating}
          >
            {generating ? 'Creating story…' : 'Generate this month\'s story'}
          </button>
        ) : (
          <>
            <button
              type="button"
              className="baby-book-btn baby-book-btn--primary"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? 'Creating…' : 'Try your free story'}
            </button>
            <Link to={ROUTES.premium} className="baby-book-btn baby-book-btn--ghost">
              Upgrade for unlimited
            </Link>
          </>
        )}
        <button
          type="button"
          className="baby-book-btn baby-book-btn--ghost"
          onClick={handleReadAloud}
          disabled={!canReadAloud}
          title={canReadAloud ? 'Read story aloud' : 'Record your voice or use storyteller mode'}
        >
          {narrating ? '■ Stop' : '▶ Read it aloud'}
        </button>
      </div>

      <StoryPreviewPanel
        story={previewStory}
        activeLanguage={activeLanguage}
        languageVariants={languageVariants}
        hasVoiceProfile={voiceMode === 'clone' && hasVoiceClone}
      />

      {previewStory && (
        <StoryPreviewActions
          story={previewStory}
          isPlus={isPlus}
          onOpenBook={() => navigate(ROUTES.babyBookTab('book'))}
        />
      )}

      <StoryHistoryList
        stories={stories}
        activeStoryId={activeStory?.id}
        onSelect={handleSelectHistory}
      />

      <StoryVoiceMode
        voiceMode={voiceMode}
        onVoiceModeChange={setVoiceMode}
        isPlus={isPlus}
        profile={parentVoiceProfile}
        onComplete={handleVoiceComplete}
        onCreateProfile={handleCreateParentProfile}
        showInvite
      />

      <AnnualTrialOffer
        open={showTrial}
        onClose={() => setShowTrial(false)}
        onAccept={async () => {
          await offerAnnualTrial();
          setShowTrial(false);
        }}
      />
    </div>
  );
}

export default StoryStudio;
