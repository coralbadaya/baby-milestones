import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Link } from 'react-router-dom';
import Select from '../../components/Select';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes';
import { interact } from '../../utils/haptics';
import { memoryStatusLabel, rowToRecipe, rowToTip } from '../../utils/community';
import {
  fetchCommunityStats,
  fetchAdminRecipes,
  fetchAdminTips,
  fetchAdminMemories,
  fetchMemoryComments,
  upsertRecipe,
  upsertTip,
  deleteRecipe,
  deleteTip,
  updateRecipeFlags,
  updateTipFlags,
  updateMemoryStatus,
  updateMemoryFeatured,
  deleteMemory,
} from '../../utils/communityAdmin';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'recipes', label: 'Recipes' },
  { id: 'tips', label: 'Tips' },
  { id: 'memories', label: 'Memories' },
  { id: 'moderation', label: 'Moderation' },
];

const MEMORY_STATUS_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'pending', label: 'Pending' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
];

const TIP_CATEGORIES = [
  { value: 'health', label: 'Health' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'feeding', label: 'Feeding' },
  { value: 'play', label: 'Play' },
];

const CONSUMER_MAP = [
  {
    tab: 'feed',
    title: 'Mom Feed',
    description: 'Published memories with reactions and comments. Signed-in posts go to moderation first.',
    href: ROUTES.communityTab('feed'),
  },
  {
    tab: 'recipes',
    title: 'Baby Recipes',
    description: 'Swipeable recipe stack with filters, saved list, and detail modal.',
    href: ROUTES.communityTab('recipes'),
  },
  {
    tab: 'tips',
    title: 'Parenting Tips',
    description: 'Curated tips by category and age — expand, mark helpful, share.',
    href: ROUTES.communityTab('tips'),
  },
  {
    tab: 'create',
    title: 'Share a Memory',
    description: 'Members post milestones, tips, recipe wins, moments, or real talk.',
    href: ROUTES.communityTab('create'),
  },
];

const emptyRecipeForm = {
  id: '',
  title: '',
  description: '',
  prepTime: '',
  ageRange: '',
  ageMinMonths: '',
  ingredients: '',
  steps: '',
  nutritionTip: '',
  tags: '',
  mealType: '',
  videoUrl: '',
  published: true,
  featured: false,
};

const emptyTipForm = {
  id: '',
  title: '',
  tagline: '',
  preview: '',
  content: '',
  ageRange: '',
  ageMinMonths: '',
  ageMaxMonths: '',
  category: 'health',
  tags: '',
  published: true,
  featured: false,
};

function StatusBadge({ status }) {
  return (
    <span className={`admin-badge admin-badge--${status === 'published' ? 'active' : status === 'pending' ? 'warning' : 'neutral'}`}>
      {memoryStatusLabel(status)}
    </span>
  );
}

function splitLines(value) {
  return value.split('\n').map((s) => s.trim()).filter(Boolean);
}

function AdminCommunity() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [tips, setTips] = useState([]);
  const [memories, setMemories] = useState([]);
  const [memoryFilter, setMemoryFilter] = useState('all');
  const [selectedMemory, setSelectedMemory] = useState(null);
  const [memoryComments, setMemoryComments] = useState([]);
  const [recipeForm, setRecipeForm] = useState(emptyRecipeForm);
  const [tipForm, setTipForm] = useState(emptyTipForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);

  const moderationMemories = useMemo(
    () => memories.filter((m) => m.status === 'pending'),
    [memories],
  );

  const loadStats = useCallback(async () => {
    try {
      const data = await fetchCommunityStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    }
  }, []);

  const loadRecipes = useCallback(async () => {
    const rows = await fetchAdminRecipes();
    setRecipes(rows);
  }, []);

  const loadTips = useCallback(async () => {
    const rows = await fetchAdminTips();
    setTips(rows);
  }, []);

  const loadMemories = useCallback(async () => {
    const status = tab === 'moderation' ? 'pending' : memoryFilter;
    const rows = await fetchAdminMemories(status);
    setMemories(rows);
  }, [memoryFilter, tab]);

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

  useEffect(() => {
    if (tab === 'memories' || tab === 'moderation') {
      loadMemories().catch((err) => setError(err.message));
    }
  }, [tab, memoryFilter, loadMemories]);

  const openMemoryDetail = async (row) => {
    setSelectedMemory(row);
    const comments = await fetchMemoryComments(row.id);
    setMemoryComments(comments);
  };

  const handleRecipeSave = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    setError(null);
    interact('tap', 'light');

    try {
      await upsertRecipe(
        {
          id: recipeForm.id.trim(),
          title: recipeForm.title.trim(),
          description: recipeForm.description.trim() || undefined,
          prepTime: recipeForm.prepTime.trim(),
          ageRange: recipeForm.ageRange.trim(),
          ageMinMonths: recipeForm.ageMinMonths ? Number(recipeForm.ageMinMonths) : undefined,
          ingredients: splitLines(recipeForm.ingredients),
          steps: splitLines(recipeForm.steps),
          nutritionTip: recipeForm.nutritionTip.trim() || undefined,
          tags: recipeForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
          mealType: recipeForm.mealType || undefined,
          videoUrl: recipeForm.videoUrl.trim() || undefined,
        },
        { published: recipeForm.published, featured: recipeForm.featured },
      );
      setRecipeForm(emptyRecipeForm);
      setNotice('Recipe saved');
      await loadRecipes();
      await loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleTipSave = async (e) => {
    e.preventDefault();
    if (!isAdmin) return;
    setError(null);
    interact('tap', 'light');

    try {
      await upsertTip(
        {
          id: tipForm.id.trim(),
          title: tipForm.title.trim(),
          tagline: tipForm.tagline.trim(),
          preview: tipForm.preview.trim(),
          content: tipForm.content.trim(),
          ageRange: tipForm.ageRange.trim(),
          ageMinMonths: tipForm.ageMinMonths ? Number(tipForm.ageMinMonths) : undefined,
          ageMaxMonths: tipForm.ageMaxMonths ? Number(tipForm.ageMaxMonths) : undefined,
          category: tipForm.category,
          tags: tipForm.tags.split(',').map((t) => t.trim()).filter(Boolean),
        },
        { published: tipForm.published, featured: tipForm.featured },
      );
      setTipForm(emptyTipForm);
      setNotice('Tip saved');
      await loadTips();
      await loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  const editRecipe = (row) => {
    const recipe = rowToRecipe(row);
    setRecipeForm({
      id: recipe.id,
      title: recipe.title,
      description: recipe.description || '',
      prepTime: recipe.prepTime,
      ageRange: recipe.ageRange,
      ageMinMonths: recipe.ageMinMonths?.toString() || '',
      ingredients: recipe.ingredients.join('\n'),
      steps: recipe.steps.join('\n'),
      nutritionTip: recipe.nutritionTip || '',
      tags: (recipe.tags || []).join(', '),
      mealType: recipe.mealType || '',
      videoUrl: recipe.videoUrl || '',
      published: row.published,
      featured: row.featured,
    });
    setTab('recipes');
  };

  const editTip = (row) => {
    const tip = rowToTip(row);
    setTipForm({
      id: tip.id,
      title: tip.title,
      tagline: tip.tagline || '',
      preview: tip.preview,
      content: tip.content,
      ageRange: tip.ageRange,
      ageMinMonths: tip.ageMinMonths?.toString() || '',
      ageMaxMonths: tip.ageMaxMonths?.toString() || '',
      category: tip.category,
      tags: (tip.tags || []).join(', '),
      published: row.published,
      featured: row.featured,
    });
    setTab('tips');
  };

  const handleMemoryAction = async (id, action) => {
    if (!isAdmin) return;
    interact('tap', 'light');
    try {
      if (action === 'delete') {
        await deleteMemory(id);
      } else if (action === 'feature') {
        const row = memories.find((m) => m.id === id);
        await updateMemoryFeatured(id, !row?.featured);
      } else {
        await updateMemoryStatus(id, action);
      }
      setNotice(`Memory ${action}`);
      if (selectedMemory?.id === id) setSelectedMemory(null);
      await loadMemories();
      await loadStats();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="admin-page">
      <AdminPageHeader
        title="Community"
        description="Manage mom feed, recipes, tips, and moderation — mirrors the consumer Community tabs."
        breadcrumb={[{ label: 'Admin', to: ROUTES.admin }, { label: 'Community' }]}
        action={(
          <button type="button" className="admin-btn admin-btn--ghost" onClick={refresh}>
            Refresh
          </button>
        )}
      />

      <nav className="admin-tabs" aria-label="Community admin sections">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={`admin-tab${tab === t.id ? ' active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
            {t.id === 'moderation' && stats?.pendingMemories ? (
              <span className="admin-nav-badge">{stats.pendingMemories}</span>
            ) : null}
          </button>
        ))}
      </nav>

      {error ? <p className="admin-error" role="alert">{error}</p> : null}
      {notice ? <p className="admin-notice">{notice}</p> : null}
      {loading && tab === 'overview' ? <p className="admin-loading">Loading community data…</p> : null}

      {tab === 'overview' && stats && (
        <div className="admin-panel">
          <div className="admin-stat-grid">
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.publishedMemories}</span>
              <span className="admin-stat-label">Published memories</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.pendingMemories}</span>
              <span className="admin-stat-label">Pending moderation</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.recipeCount}</span>
              <span className="admin-stat-label">Recipes</span>
            </div>
            <div className="admin-stat-card">
              <span className="admin-stat-value">{stats.tipCount}</span>
              <span className="admin-stat-label">Parenting tips</span>
            </div>
          </div>

          <h2 className="admin-section-title">What happens in Community</h2>
          <div className="admin-community-map">
            {CONSUMER_MAP.map((item) => (
              <article key={item.tab} className="admin-community-map-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <Link to={item.href} className="admin-link" target="_blank" rel="noreferrer">
                  View /community/{item.tab} →
                </Link>
              </article>
            ))}
          </div>
        </div>
      )}

      {tab === 'recipes' && (
        <div className="admin-panel">
          {isAdmin ? (
            <form className="admin-form" onSubmit={handleRecipeSave}>
              <h2>{recipeForm.id ? 'Edit recipe' : 'Add recipe'}</h2>
              <div className="admin-form-grid">
                <div className="auth-field">
                  <label htmlFor="recipe-id">ID (slug)</label>
                  <input
                    id="recipe-id"
                    required
                    value={recipeForm.id}
                    onChange={(e) => setRecipeForm({ ...recipeForm, id: e.target.value })}
                    placeholder="ragi-porridge"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="recipe-title">Title</label>
                  <input
                    id="recipe-title"
                    required
                    value={recipeForm.title}
                    onChange={(e) => setRecipeForm({ ...recipeForm, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-form-grid">
                <div className="auth-field">
                  <label htmlFor="recipe-prep">Prep time</label>
                  <input
                    id="recipe-prep"
                    value={recipeForm.prepTime}
                    onChange={(e) => setRecipeForm({ ...recipeForm, prepTime: e.target.value })}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="recipe-age">Age range</label>
                  <input
                    id="recipe-age"
                    value={recipeForm.ageRange}
                    onChange={(e) => setRecipeForm({ ...recipeForm, ageRange: e.target.value })}
                  />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="recipe-desc">Description</label>
                <input
                  id="recipe-desc"
                  value={recipeForm.description}
                  onChange={(e) => setRecipeForm({ ...recipeForm, description: e.target.value })}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="recipe-ingredients">Ingredients (one per line)</label>
                <textarea
                  id="recipe-ingredients"
                  rows={4}
                  value={recipeForm.ingredients}
                  onChange={(e) => setRecipeForm({ ...recipeForm, ingredients: e.target.value })}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="recipe-steps">Steps (one per line)</label>
                <textarea
                  id="recipe-steps"
                  rows={4}
                  value={recipeForm.steps}
                  onChange={(e) => setRecipeForm({ ...recipeForm, steps: e.target.value })}
                />
              </div>
              <div className="admin-form-actions">
                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={recipeForm.published}
                    onChange={(e) => setRecipeForm({ ...recipeForm, published: e.target.checked })}
                  />
                  Published
                </label>
                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={recipeForm.featured}
                    onChange={(e) => setRecipeForm({ ...recipeForm, featured: e.target.checked })}
                  />
                  Featured
                </label>
                <button type="submit" className="admin-btn admin-btn--primary">Save recipe</button>
                {recipeForm.id ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() => setRecipeForm(emptyRecipeForm)}
                  >
                    Clear form
                  </button>
                ) : null}
              </div>
            </form>
          ) : (
            <p className="admin-readonly-note">Recipes are read-only for staff. Admin role required to edit.</p>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Age</th>
                  <th>Prep</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {recipes.map((row) => (
                  <tr key={row.id}>
                    <td>{row.title}</td>
                    <td>{row.age_range}</td>
                    <td>{row.prep_time}</td>
                    <td>{row.published ? 'Published' : 'Draft'}</td>
                    <td>
                      {isAdmin ? (
                        <>
                          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => editRecipe(row)}>Edit</button>
                          <button
                            type="button"
                            className="admin-btn admin-btn--ghost"
                            onClick={() => updateRecipeFlags(row.id, { published: !row.published }).then(refresh)}
                          >
                            {row.published ? 'Unpublish' : 'Publish'}
                          </button>
                          <button type="button" className="admin-btn admin-btn--danger" onClick={() => deleteRecipe(row.id).then(refresh)}>Delete</button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'tips' && (
        <div className="admin-panel">
          {isAdmin ? (
            <form className="admin-form" onSubmit={handleTipSave}>
              <h2>{tipForm.id ? 'Edit tip' : 'Add tip'}</h2>
              <div className="admin-form-grid">
                <div className="auth-field">
                  <label htmlFor="tip-id">ID (slug)</label>
                  <input
                    id="tip-id"
                    required
                    value={tipForm.id}
                    onChange={(e) => setTipForm({ ...tipForm, id: e.target.value })}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="tip-title">Title</label>
                  <input
                    id="tip-title"
                    required
                    value={tipForm.title}
                    onChange={(e) => setTipForm({ ...tipForm, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-form-grid">
                <div className="auth-field">
                  <label htmlFor="tip-category">Category</label>
                  <Select
                    id="tip-category"
                    value={tipForm.category}
                    onChange={(v) => setTipForm({ ...tipForm, category: v })}
                    options={TIP_CATEGORIES}
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="tip-age">Age range</label>
                  <input
                    id="tip-age"
                    value={tipForm.ageRange}
                    onChange={(e) => setTipForm({ ...tipForm, ageRange: e.target.value })}
                  />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="tip-preview">Preview</label>
                <input
                  id="tip-preview"
                  value={tipForm.preview}
                  onChange={(e) => setTipForm({ ...tipForm, preview: e.target.value })}
                />
              </div>
              <div className="auth-field">
                <label htmlFor="tip-content">Content (markdown ok)</label>
                <textarea
                  id="tip-content"
                  rows={8}
                  value={tipForm.content}
                  onChange={(e) => setTipForm({ ...tipForm, content: e.target.value })}
                />
              </div>
              <div className="admin-form-actions">
                <label className="admin-checkbox">
                  <input
                    type="checkbox"
                    checked={tipForm.published}
                    onChange={(e) => setTipForm({ ...tipForm, published: e.target.checked })}
                  />
                  Published
                </label>
                <button type="submit" className="admin-btn admin-btn--primary">Save tip</button>
              </div>
            </form>
          ) : (
            <p className="admin-readonly-note">Tips are read-only for staff. Admin role required to edit.</p>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Age</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {tips.map((row) => (
                  <tr key={row.id}>
                    <td>{row.title}</td>
                    <td>{row.category}</td>
                    <td>{row.age_range}</td>
                    <td>{row.published ? 'Published' : 'Draft'}</td>
                    <td>
                      {isAdmin ? (
                        <>
                          <button type="button" className="admin-btn admin-btn--ghost" onClick={() => editTip(row)}>Edit</button>
                          <button type="button" className="admin-btn admin-btn--danger" onClick={() => deleteTip(row.id).then(refresh)}>Delete</button>
                        </>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {(tab === 'memories' || tab === 'moderation') && (
        <div className="admin-panel">
          {tab === 'memories' ? (
            <div className="admin-toolbar">
              <Select
                value={memoryFilter}
                onChange={setMemoryFilter}
                options={MEMORY_STATUS_OPTIONS}
                aria-label="Filter memories by status"
              />
            </div>
          ) : (
            <p className="admin-section-desc">
              {moderationMemories.length} post{moderationMemories.length === 1 ? '' : 's'} awaiting review.
            </p>
          )}

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {(tab === 'moderation' ? moderationMemories : memories).map((row) => (
                  <tr key={row.id}>
                    <td>{row.type}</td>
                    <td>{row.title}</td>
                    <td>{row.author_name || '—'}</td>
                    <td><StatusBadge status={row.status} /></td>
                    <td>{new Date(row.created_at).toLocaleDateString()}</td>
                    <td>
                      <button type="button" className="admin-btn admin-btn--ghost" onClick={() => openMemoryDetail(row)}>View</button>
                      {isAdmin && row.status === 'pending' ? (
                        <button type="button" className="admin-btn admin-btn--primary" onClick={() => handleMemoryAction(row.id, 'published')}>Approve</button>
                      ) : null}
                      {isAdmin && row.status === 'published' ? (
                        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => handleMemoryAction(row.id, 'hidden')}>Hide</button>
                      ) : null}
                      {isAdmin && row.status === 'hidden' ? (
                        <button type="button" className="admin-btn admin-btn--ghost" onClick={() => handleMemoryAction(row.id, 'published')}>Publish</button>
                      ) : null}
                      {isAdmin ? (
                        <button type="button" className="admin-btn admin-btn--danger" onClick={() => handleMemoryAction(row.id, 'delete')}>Delete</button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedMemory ? (
            <div className="admin-detail-panel">
              <h3>{selectedMemory.title}</h3>
              <p className="admin-detail-meta">
                {selectedMemory.type} · {selectedMemory.author_name || 'Anonymous'} · {selectedMemory.baby_age || 'Age n/a'}
              </p>
              <p>{selectedMemory.content}</p>
              {memoryComments.length > 0 ? (
                <ul className="admin-comment-list">
                  {memoryComments.map((c) => (
                    <li key={c.id}>
                      <strong>{c.author_name}</strong>
                      {' — '}
                      {c.text}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="admin-muted">No comments</p>
              )}
              <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setSelectedMemory(null)}>Close</button>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default AdminCommunity;
