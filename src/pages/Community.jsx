import { useCallback, useEffect } from 'react';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import Icon from '../components/Icon';
import { useNavigate } from 'react-router-dom';
import { interact } from '../utils/haptics';
import { COMMUNITY_TAGLINE } from '../constants/brand';
import { applyPageMeta, resetPageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';
import { useMemories } from '../hooks/useMemories';
import { useCommunityRecipes } from '../hooks/useCommunityRecipes';
import { useCommunityTips } from '../hooks/useCommunityTips';
import MemoryFeed from '../components/community/MemoryFeed';
import RecipeFeed from '../components/community/RecipeFeed';
import TipsFeed from '../components/community/TipsFeed';
import CreateMemory from '../components/community/CreateMemory';

const TABS = [
  { id: 'feed', label: 'Feed', icon: 'speech-bubble' },
  { id: 'recipes', label: 'Recipes', icon: 'baby-bottle' },
  { id: 'tips', label: 'Tips', icon: 'light-bulb' },
  { id: 'create', label: 'Create', icon: 'sparkles' },
];

function formatBabyAge(currentMonth) {
  if (!currentMonth) return '';
  return `${currentMonth} month${currentMonth === 1 ? '' : 's'}`;
}

const TAB_META = {
  feed: {
    title: 'Mom Feed',
    description: 'Share memories, tips, and baby milestones with other parents.',
  },
  recipes: {
    title: 'Baby Recipes',
    description: 'Swipe through baby-friendly recipes — purees, khichdi, finger foods, and more.',
  },
  tips: {
    title: 'Parenting Tips',
    description: 'Real parenting tips on teething, sleep, feeding, and more.',
  },
  create: {
    title: 'Share a Memory',
    description: 'Post a milestone, tip, or sweet moment for other moms.',
  },
};

function Community({ currentMonth, tab }) {
  const navigate = useNavigate();
  const {
    memories,
    loading: memoriesLoading,
    addMemory,
    addComment,
    reactToMemory,
    submitStatus,
    clearSubmitStatus,
  } = useMemories();
  const { recipes, loading: recipesLoading } = useCommunityRecipes();
  const { tips, loading: tipsLoading } = useCommunityTips();

  useEffect(() => {
    const meta = TAB_META[tab] || TAB_META.feed;
    applyPageMeta({
      ...meta,
      url: `${window.location.origin}${ROUTES.communityTab(tab)}`,
    });
    return resetPageMeta;
  }, [tab]);

  useEffect(() => {
    if (tab !== 'create') clearSubmitStatus();
  }, [tab, clearSubmitStatus]);

  const handleTab = useCallback((id) => {
    interact('tap', 'selection');
    navigate(ROUTES.communityTab(id));
  }, [navigate]);

  const handleCreate = useCallback(async (memory) => {
    const result = await addMemory(memory);
    if (result?.pending) {
      navigate(ROUTES.communityTab('create'));
      return;
    }
    if (result?.ok) {
      navigate(ROUTES.communityTab('feed'));
    }
  }, [addMemory, navigate]);

  return (
    <div className="community-page-wrap">
      <PageHero
        imageKey="community"
        layout="split"
        eyebrow="Connection"
        title="Community"
        subtitle={COMMUNITY_TAGLINE}
        size="md"
      />

      <PageSection surface="sand" width="narrow">
        <SectionHeader
          eyebrow="Yarn Trails Community"
          title={TAB_META[tab]?.title || 'Community'}
          subtitle={TAB_META[tab]?.description}
        />
        <nav className="community-tabs community-tabs--editorial" role="tablist" aria-label="Community sections">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              className={`community-tab${tab === t.id ? ' active' : ''}`}
              onClick={() => handleTab(t.id)}
            >
              <Icon name={t.icon} size={18} className="community-tab-icon" />
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
      </PageSection>

      <PageSection
        surface="white"
        width={tab === 'feed' ? 'wide' : 'narrow'}
        className="page-body--with-mobile-nav"
      >
        <div
          className={`community-panel community-panel--editorial${tab === 'feed' ? ' community-panel--feed' : ''}`}
          role="tabpanel"
        >
          {tab === 'feed' && (
            memoriesLoading ? (
              <p className="community-loading">Loading feed…</p>
            ) : (
              <MemoryFeed
                memories={memories}
                onReact={reactToMemory}
                onAddComment={addComment}
              />
            )
          )}
          {tab === 'recipes' && (
            recipesLoading ? (
              <p className="community-loading">Loading recipes…</p>
            ) : (
              <RecipeFeed recipes={recipes} />
            )
          )}
          {tab === 'tips' && (
            tipsLoading ? (
              <p className="community-loading">Loading tips…</p>
            ) : (
              <TipsFeed tips={tips} />
            )
          )}
          {tab === 'create' && (
            <>
              {submitStatus?.type === 'pending' && (
                <p className="community-notice community-notice--success" role="status">
                  {submitStatus.message}
                </p>
              )}
              {submitStatus?.type === 'error' && (
                <p className="community-form-error" role="alert">{submitStatus.message}</p>
              )}
              <CreateMemory
                onSubmit={handleCreate}
                defaultBabyAge={formatBabyAge(currentMonth)}
              />
            </>
          )}
        </div>
      </PageSection>
    </div>
  );
}

export default Community;
