import { Link } from 'react-router-dom';
import { ROUTES } from '../../../routes';
import ShareStoryButton from '../ShareStoryButton';
import { PlusExportPanel } from '../PlusExtras';

function StoryPreviewActions({ story, isPlus, onOpenBook }) {
  if (!story) return null;

  return (
    <div className="baby-book-story-actions">
      <button
        type="button"
        className="baby-book-btn baby-book-btn--primary"
        onClick={onOpenBook}
      >
        Open in 3D Book
      </button>
      <ShareStoryButton story={story} isPlus={isPlus} />
      <PlusExportPanel storyId={story.id} isPlus={isPlus} />
      {!isPlus && (
        <Link to={ROUTES.premium} className="baby-book-btn baby-book-btn--ghost">
          Upgrade for full book
        </Link>
      )}
    </div>
  );
}

export default StoryPreviewActions;
