import { useMemo, useState } from 'react';
import Select from '../../Select';
import AdminBadge from '../AdminBadge';
import AdminDataTable from '../AdminDataTable';
import AdminEmpty from '../AdminEmpty';
import AdminPanel from '../AdminPanel';
import AdminToolbar from '../AdminToolbar';
import { rowToRecipe } from '../../../utils/community';
import { splitLines } from './communityAdminHelpers';

const MEAL_TYPES = [
  { value: '', label: 'Any meal' },
  { value: 'breakfast', label: 'Breakfast' },
  { value: 'lunch', label: 'Lunch' },
  { value: 'snack', label: 'Snack' },
];

export const emptyRecipeForm = {
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

const RECIPE_COLUMNS = [
  { key: 'title', header: 'Recipe' },
  { key: 'age', header: 'Age', className: 'admin-cell-narrow' },
  { key: 'prep', header: 'Prep', className: 'admin-cell-narrow' },
  { key: 'flags', header: 'Flags', className: 'admin-cell-narrow' },
  { key: 'status', header: 'Status', className: 'admin-cell-narrow' },
  { key: 'actions', header: '', className: 'admin-cell-actions' },
];

/**
 * @param {{
 *   recipes: object[],
 *   isAdmin: boolean,
 *   onRefresh: () => void,
 *   onSave: (form: typeof emptyRecipeForm) => Promise<void>,
 *   onTogglePublish: (id: string, published: boolean) => Promise<void>,
 *   onToggleFeatured: (id: string, featured: boolean) => Promise<void>,
 *   onDelete: (id: string) => Promise<void>,
 * }} props
 */
function AdminCommunityRecipesTab({
  recipes,
  isAdmin,
  onRefresh,
  onSave,
  onTogglePublish,
  onToggleFeatured,
  onDelete,
}) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(emptyRecipeForm);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recipes.filter((row) => {
      if (statusFilter === 'published' && !row.published) return false;
      if (statusFilter === 'draft' && row.published) return false;
      if (!q) return true;
      return row.title?.toLowerCase().includes(q) || row.id?.toLowerCase().includes(q);
    });
  }, [recipes, search, statusFilter]);

  const openCreate = () => {
    setForm(emptyRecipeForm);
    setEditorOpen(true);
  };

  const openEdit = (row) => {
    const recipe = rowToRecipe(row);
    setForm({
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
    setEditorOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave(form);
      setEditorOpen(false);
      setForm(emptyRecipeForm);
    } finally {
      setSaving(false);
    }
  };

  const renderCell = (row, col) => {
    switch (col.key) {
      case 'title':
        return (
          <>
            <strong className="admin-cell-title">{row.title}</strong>
            <span className="admin-cell-sub">{row.id}</span>
          </>
        );
      case 'age':
        return row.age_range || '—';
      case 'prep':
        return row.prep_time || '—';
      case 'flags':
        return (
          <div className="admin-flag-group">
            {row.featured ? <AdminBadge variant="trial">Featured</AdminBadge> : null}
          </div>
        );
      case 'status':
        return (
          <AdminBadge variant={row.published ? 'active' : 'draft'}>
            {row.published ? 'Published' : 'Draft'}
          </AdminBadge>
        );
      case 'actions':
        if (!isAdmin) return null;
        return (
          <div className="admin-actions">
            <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => openEdit(row)}>Edit</button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-btn--sm"
              onClick={() => onTogglePublish(row.id, !row.published)}
            >
              {row.published ? 'Unpublish' : 'Publish'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--ghost admin-btn--sm"
              onClick={() => onToggleFeatured(row.id, !row.featured)}
            >
              {row.featured ? 'Unfeature' : 'Feature'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--sm"
              onClick={() => {
                if (window.confirm(`Delete recipe “${row.title}”?`)) onDelete(row.id);
              }}
            >
              Delete
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <AdminToolbar
        onRefresh={onRefresh}
        left={(
          <>
            <input
              type="search"
              className="admin-search"
              placeholder="Search recipes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search recipes"
            />
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              options={[
                { value: 'all', label: 'All statuses' },
                { value: 'published', label: 'Published' },
                { value: 'draft', label: 'Draft' },
              ]}
              aria-label="Filter by status"
            />
          </>
        )}
        primaryAction={
          isAdmin ? (
            <button type="button" className="admin-btn admin-btn--primary" onClick={openCreate}>
              Add recipe
            </button>
          ) : null
        }
      />

      {!isAdmin ? (
        <p className="admin-readonly-note">Recipes are read-only for staff. Admin role required to edit.</p>
      ) : null}

      <AdminPanel padding={false}>
        {filtered.length === 0 ? (
          <AdminEmpty
            message={recipes.length === 0 ? 'No recipes yet. Add your first recipe to populate the swipe feed.' : 'No recipes match your filters.'}
            action={isAdmin ? (
              <button type="button" className="admin-btn admin-btn--primary" onClick={openCreate}>Add recipe</button>
            ) : null}
          />
        ) : (
          <AdminDataTable
            columns={RECIPE_COLUMNS}
            rows={filtered}
            rowKey={(row) => row.id}
            renderCell={renderCell}
          />
        )}
      </AdminPanel>

      {editorOpen && isAdmin ? (
        <div className="admin-modal-backdrop" role="presentation" onClick={() => setEditorOpen(false)}>
          <div
            className="admin-modal admin-modal--wide admin-community-editor"
            role="dialog"
            aria-modal="true"
            aria-labelledby="recipe-editor-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="recipe-editor-title">{form.id && recipes.some((r) => r.id === form.id) ? 'Edit recipe' : 'Add recipe'}</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="auth-field">
                  <label htmlFor="recipe-id">ID (slug)</label>
                  <input
                    id="recipe-id"
                    required
                    value={form.id}
                    onChange={(e) => setForm({ ...form, id: e.target.value })}
                    placeholder="ragi-porridge"
                  />
                </div>
                <div className="auth-field">
                  <label htmlFor="recipe-title">Title</label>
                  <input
                    id="recipe-title"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                  />
                </div>
              </div>
              <div className="admin-form-grid admin-form-grid--3">
                <div className="auth-field">
                  <label htmlFor="recipe-prep">Prep time</label>
                  <input id="recipe-prep" value={form.prepTime} onChange={(e) => setForm({ ...form, prepTime: e.target.value })} placeholder="15 mins" />
                </div>
                <div className="auth-field">
                  <label htmlFor="recipe-age">Age range</label>
                  <input id="recipe-age" value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })} placeholder="6+ months" />
                </div>
                <div className="auth-field">
                  <label htmlFor="recipe-meal">Meal type</label>
                  <Select id="recipe-meal" value={form.mealType} onChange={(v) => setForm({ ...form, mealType: v })} options={MEAL_TYPES} />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="recipe-desc">Description</label>
                <input id="recipe-desc" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="auth-field">
                <label htmlFor="recipe-ingredients">Ingredients (one per line)</label>
                <textarea id="recipe-ingredients" rows={4} value={form.ingredients} onChange={(e) => setForm({ ...form, ingredients: e.target.value })} />
              </div>
              <div className="auth-field">
                <label htmlFor="recipe-steps">Steps (one per line)</label>
                <textarea id="recipe-steps" rows={4} value={form.steps} onChange={(e) => setForm({ ...form, steps: e.target.value })} />
              </div>
              <div className="admin-form-grid">
                <div className="auth-field">
                  <label htmlFor="recipe-nutrition">Nutrition tip</label>
                  <input id="recipe-nutrition" value={form.nutritionTip} onChange={(e) => setForm({ ...form, nutritionTip: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label htmlFor="recipe-video">Video URL</label>
                  <input id="recipe-video" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://…" />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="recipe-tags">Tags (comma-separated)</label>
                <input id="recipe-tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} />
              </div>
              <div className="admin-form-actions">
                <label className="admin-checkbox">
                  <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
                  Published
                </label>
                <label className="admin-checkbox">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured
                </label>
              </div>
              <div className="admin-modal-actions">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={() => setEditorOpen(false)}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
                  {saving ? 'Saving…' : 'Save recipe'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default AdminCommunityRecipesTab;
