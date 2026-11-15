import { useEffect, useMemo, useState } from 'react';
import { IDEA_COLLECTIONS } from '../../../data/bookIdeasConfig';
import { buildSelectablePhotos } from '../../../utils/ideaStudioPhotos';
import { useBabyProfiles } from '../../../hooks/useBabyProfiles';
import { useVoiceProfiles } from '../../../hooks/useVoiceProfiles';
import useMonthlyAlbum from '../../../hooks/useMonthlyAlbum';
import IdeaStudioHero from './IdeaStudioHero';
import MemorySourceSection from './MemorySourceSection';
import IdeaCollection from './IdeaCollection';
import IdeaCreationFlow from './IdeaCreationFlow';
import { trackIdeaStudio } from './trackIdeaStudio';

function IdeaStudio({
  ideas = [],
  ideasLoading = false,
  albumPhotos = [],
  firstMoments = {},
  currentMonth = 6,
  birthDate,
  generating,
  onGenerate,
}) {
  const { uploadPhoto } = useMonthlyAlbum(currentMonth);
  const { profiles } = useBabyProfiles();
  const { blessings } = useVoiceProfiles();
  const [activeIdea, setActiveIdea] = useState(null);

  const selectablePhotos = useMemo(
    () => buildSelectablePhotos(albumPhotos, firstMoments),
    [albumPhotos, firstMoments],
  );

  const albumCount = selectablePhotos.length;
  const heroPhotoUrl = selectablePhotos[0]?.dataUrl || null;
  const hasFirstMoments = Object.keys(firstMoments || {}).length > 0;
  const babyProfileId = profiles.find((p) => p.is_primary)?.id;

  const ideasById = useMemo(() => {
    const map = {};
    ideas.forEach((idea) => { map[idea.id] = idea; });
    return map;
  }, [ideas]);

  useEffect(() => {
    trackIdeaStudio('studio_view');
  }, []);

  const handleGenerate = async (conceptId, matchedPhotoIds, meta) => {
    return onGenerate(conceptId, matchedPhotoIds, meta);
  };

  return (
    <div className="idea-studio">
      <IdeaStudioHero heroPhotoUrl={heroPhotoUrl} albumCount={albumCount} />

      <MemorySourceSection
        albumCount={albumCount}
        hasFirstMoments={hasFirstMoments}
        hasScanned={albumCount > 0}
      />

      {ideasLoading && (
        <p className="idea-studio__loading baby-book-section-sub" role="status">
          Loading saved ideas…
        </p>
      )}

      <div className="idea-studio__collections">
        {IDEA_COLLECTIONS.map((collection) => (
          <IdeaCollection
            key={collection.id}
            collection={collection}
            ideasById={ideasById}
            generating={generating}
            onOpenIdea={(idea) => {
              trackIdeaStudio('card_view', { ideaId: idea.id });
              setActiveIdea(idea);
            }}
          />
        ))}
      </div>

      {activeIdea && (
        <IdeaCreationFlow
          idea={activeIdea}
          photos={selectablePhotos}
          birthDate={birthDate}
          babyProfileId={babyProfileId}
          blessingCount={blessings?.length || 0}
          uploadPhoto={uploadPhoto}
          onClose={() => setActiveIdea(null)}
          onGenerate={handleGenerate}
        />
      )}
    </div>
  );
}

export default IdeaStudio;