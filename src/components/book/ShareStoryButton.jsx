import { trackEvent } from '../../utils/analytics';
import { ROUTES } from '../../routes';
import { SITE_URL } from '../../constants/brand';

function ShareStoryButton({ story, isPlus }) {
  if (!story) return null;

  const previewUrl = `${SITE_URL}${ROUTES.storyPreview(story.preview_token || story.id)}`;

  const share = async () => {
    trackEvent('share_story', { is_plus: isPlus, story_id: story.id });
    const text = isPlus
      ? `A page from ${story.title} — made with Yarn Trails`
      : `A preview from ${story.title} — Yarn Trails AI baby book`;

    if (navigator.share) {
      try {
        await navigator.share({ title: story.title, text, url: previewUrl });
        return;
      } catch {
        /* fall through */
      }
    }
    await navigator.clipboard?.writeText?.(previewUrl);
    alert('Preview link copied to clipboard.');
  };

  return (
    <button type="button" className="btn-ghost" onClick={share}>
      {isPlus ? 'Share this page' : 'Share preview (watermarked)'}
    </button>
  );
}

export default ShareStoryButton;
