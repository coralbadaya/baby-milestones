import {
  useCallback, useEffect, useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import AdminCommunityMemoriesTab from '../../components/admin/community/AdminCommunityMemoriesTab';
import AdminCommunityOverview from '../../components/admin/community/AdminCommunityOverview';
import AdminCommunityRecipesTab from '../../components/admin/community/AdminCommunityRecipesTab';
import AdminCommunityTipsTab from '../../components/admin/community/AdminCommunityTipsTab';
import { splitLines } from '../../components/admin/community/communityAdminHelpers';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes';
import { interact } from '../../utils/haptics';
import {
  approveAllPendingMemories,
  deleteRecipe,
  deleteTip,
  fetchAdminMemories,
  fetchAdminRecipes,
  fetchAdminTips,
  fetchCommunityStats,
  updateMemoryStatus,
  updateRecipeFlags,
  updateTipFlags,
  upsertRecipe,
  upsertTip,
} from '../../utils/communityAdmin';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'tips', label: 'Tips' },
  { id: 'memories', label: 'Memories' },
  { id: 'moderation', label: 'Moderation' },
];

function AdminCommunity() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const initialTab = TABS.some((t) => t.id === tabParam) ? tabParam : 'overview';
  const [tab, setTab] = useState(initialTab);
  const [stats, setStats] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [tips, setTips] = useState([]);
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const showNotice = useCallback((message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 4000);
  }, []);

  const goToTab = useCallback((nextTab) => {
    setTab(nextTab);
    setSearchParams(nextTab === 'overview' ? {} : { tab: nextTab }, { replace: true });
  }, [setSearchParams]);

  useEffect(() => {
    if (tabParam && TABS.some((t) => t.id === tabParam) && tabParam !== tab) {
      setTab(tabParam);
    }
  }, [tabParam, tab]);

  const loadStats = useCallback(async () => {
    const data = await fetchCommunityStats();
    setStats(data);
  }, []);

  const loadRecipes = useCallback(async () => {
    setRecipes(await fetchAdminRecipes());
  }, []);

  const loadTips = useCallback(async () => {
    setTips(await fetchAdminTips());
  }, []);

  const loadMemories = useCallback(async () => {
    setMemories(await fetchAdminMemories('all'));
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([loadStats(), loadRecipes(), loadTips(), loadMemories()]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [loadStats, loadRecipes, loadTips, loadMemories]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleRecipeSave = async (form) => {
    if (!isAdmin) return;
    interact('tap', 'light');
    await upsertRecipe(
      {
        id: form.id.trim(),
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        prepTime: form.prepTime.trim(),
        ageRange: form.ageRange.trim(),
        ageMinMonths: form.ageMinMonths ? Number(form.ageMinMonths) : undefined,
        ingredients: splitLines(form.ingredients),
        steps: splitLines(form.steps),
        nutritionTip: form.nutritionTip.trim() || undefined,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
        mealType: form.mealType || undefined,
        videoUrl: form.videoUrl.trim() || undefined,
      },
      { published: form.published, featured: form.featured },
    );
    showNotice('Recipe saved');
    await loadRecipes();
    await loadStats();
  };

  const handleTipSave = async (form) => {
    if (!isAdmin) return;
    interact('tap', 'light');
    await upsertTip(
      {
        id: form.id.trim(),
        title: form.title.trim(),
        tagline: form.tagline.trim(),
        preview: form.preview.trim(),
        content: form.content.trim(),
        ageRange: form.ageRange.trim(),
        ageMinMonths: form.ageMinMonths ? Number(form.ageMinMonths) : undefined,
        ageMaxMonths: form.ageMaxMonths ? Number(form.ageMaxMonths) : undefined,
        category: form.category,
        tags: form.tags,
      },
      { published: form.published, featured: form.featured },
    );
    showNotice('Tip saved');
    await loadTips();
    await loadStats();
  };

  const handleQuickApprove = async (id) => {
    if (!isAdmin) return;
    interact('tap', 'light');
    await updateMemoryStatus(id, 'published');
    showNotice('Post approved');
    await loadMemories();
    await loadStats();
  };

  const handleApproveAll = async () => {
    if (!isAdmin) return;
    await approveAllPendingMemories();
    showNotice('All pending posts approved');
    await loadMemories();
    await loadStats();
  };

  return (
    <div className="admin-page admin-community-page">
      <AdminPageHeader
        title="Community"
        description="Mom feed moderation, recipe library, and parenting tips — aligned with the public Community tabs."
        breadcrumb={[{ label: 'Admin', to: ROUTES.admin }, { label: 'Community' }]}
        action={(
          <button type="button" className="admin-btn admin-btn--ghost" onClick={refresh}>
            Refresh all
          </button>
        )}
      />

      <nav className="admin-tabs" aria-label="Community admin sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`admin-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => goToTab(t.id)}
          >
            {t.label}
            {t.id === 'moderation' && stats?.pendingMemories ? (
              <span className="admin-nav-badge">{stats.pendingMemories}</span>
            ) : null}
          </button>
        ))}
      </nav>

      {error ? (
        <div className="admin-banner admin-banner--error" role="alert">
          {error}
          <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={refresh}>Retry</button>
        </div>
      ) : null}

      {notice ? (
        <div className="admin-banner admin-banner--success" role="status">
          {notice}
        </div>
      ) : null}

      {loading && tab === 'overview' && !stats ? (
        <AdminLoading message="Loading community data…" />
      ) : null}

      {tab === 'overview' && stats ? (
        <AdminCommunityOverview stats={stats} onGoToTab={goToTab} />
      ) : null}

      {tab === 'recipes' ? (
        <AdminCommunityRecipesTab
          recipes={recipes}
          isAdmin={isAdmin}
          onRefresh={loadRecipes}
          onSave={handleRecipeSave}
          onTogglePublish={(id, published) => updateRecipeFlags(id, { published }).then(refresh)}
          onToggleFeatured={(id, featured) => updateRecipeFlags(id, { featured }).then(refresh)}
          onDelete={(id) => deleteRecipe(id).then(refresh)}
        />
      ) : null}

      {tab === 'tips' ? (
        <AdminCommunityTipsTab
          tips={tips}
          isAdmin={isAdmin}
          onRefresh={loadTips}
          onSave={handleTipSave}
          onTogglePublish={(id, published) => updateTipFlags(id, { published }).then(refresh)}
          onToggleFeatured={(id, featured) => updateTipFlags(id, { featured }).then(refresh)}
          onDelete={(id) => deleteTip(id).then(refresh)}
        />
      ) : null}

      {(tab === 'memories' || tab === 'moderation') ? (
        <AdminCommunityMemoriesTab
          memories={memories}
          mode={tab === 'moderation' ? 'moderation' : 'memories'}
          isAdmin={isAdmin}
          onRefresh={loadMemories}
          onApproveAll={handleApproveAll}
          onQuickApprove={handleQuickApprove}
        />
      ) : null}
    </div>
  );
}

export default AdminCommunity;
