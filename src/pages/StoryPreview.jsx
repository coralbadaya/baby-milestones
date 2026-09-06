import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import FlipBookViewer from '../components/book/FlipBookViewer';
import { supabase } from '../utils/supabaseClient';
import { ROUTES } from '../routes';
import { usePageMeta } from '../utils/pageMeta';

function StoryPreview() {
  const { token } = useParams();
  const [story, setStory] = useState(null);
  const [loading, setLoading] = useState(true);

  usePageMeta({
    title: story?.title || 'Story preview',
    description: 'A preview page from a Yarn Trails AI baby book story.',
    robots: 'noindex, nofollow',
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase.rpc('get_story_by_preview_token', { p_token: token });
      if (mounted) {
        const row = Array.isArray(data) ? data[0] : data;
        setStory(error ? null : row || null);
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [token]);

  if (loading) return <p className="story-preview__loading">Loading preview…</p>;
  if (!story) {
    return (
      <div className="story-preview">
        <p>Story not found.</p>
        <Link to={ROUTES.home}>Back to Today</Link>
      </div>
    );
  }

  return (
    <div className="story-preview page-body--with-mobile-nav">
      <h1 className="font-display">{story.title}</h1>
      <FlipBookViewer pages={story.pages} isPlus={false} theme="glow" />
      <Link to={ROUTES.signup} className="btn-primary">Start your free baby book</Link>
    </div>
  );
}

export default StoryPreview;
