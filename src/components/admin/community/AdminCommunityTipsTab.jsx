import { useMemo, useState } from 'react';
import Select from '../../Select';
import AdminBadge from '../AdminBadge';
import AdminDataTable from '../AdminDataTable';
import AdminEmpty from '../AdminEmpty';
import AdminPanel from '../AdminPanel';
import AdminTagPicker from '../AdminTagPicker';
import AdminToolbar from '../AdminToolbar';
import { rowToTip } from '../../../utils/community';
import { TIP_SUGGESTED_TAGS } from './tipTagSuggestions';

const TIP_CATEGORIES = [
  { value: 'health', label: 'Health' },
  { value: 'sleep', label: 'Sleep' },
  { value: 'feeding', label: 'Feeding' },
  { value: 'play', label: 'Play' },
];

export const emptyTipForm = {
  id: '',
  title: '',
  tagline: '',
  preview: '',
  content: '',
  ageRange: '',
  ageMinMonths: '',
  ageMaxMonths: '',
  category: 'health',
  tags: [],
  published: true,
  featured: false,
};

const TIP_COLUMNS = [
  { key: 'title', header: 'Tip' },
  { key: 'category', header: 'Category', className: 'admin-cell-narrow' },
  { key: 'age', header: 'Age', className: 'admin-cell-narrow' },
  { key: 'flags', header: 'Flags', className: 'admin-cell-narrow' },
  { key: 'status', header: 'Status', className: 'admin-cell-narrow' },
  { key: 'actions', header: '', className: 'admin-cell-actions' },
];

function AdminCommunityTipsTab({
  tips,
  isAdmin,
  onRefresh,
  onSave,
  onTogglePublish,
  onToggleFeatured,
  onDelete,
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [form, setForm] = useState(emptyTipForm);
  const [saving, setSaving] = useState(false);

  const tagSuggestions = useMemo(() => {
    const fromTips = tips.flatMap((row) => row.tags ?? []);
    return [...new Set([...TIP_SUGGESTED_TAGS, ...fromTips])];
  }, [tips]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return tips.filter((row) => {
      if (categoryFilter !== 'all' && row.category !== categoryFilter) return false;
      if (!q) return true;
      return row.title?.toLowerCase().includes(q) || row.id?.toLowerCase().includes(q);
    });
  }, [tips, search, categoryFilter]);

  const openCreate = () => {
    setForm(emptyTipForm);
    setEditorOpen(true);
  };

  const openEdit = (row) => {
    const tip = rowToTip(row);
    setForm({
      id: tip.id,
      title: tip.title,
      tagline: tip.tagline || '',
      preview: tip.preview,
      content: tip.content,
      ageRange: tip.ageRange,
      ageMinMonths: tip.ageMinMonths?.toString() || '',
      ageMaxMonths: tip.ageMaxMonths?.toString() || '',
      category: tip.category,
      tags: [...(tip.tags || [])],
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
      setForm(emptyTipForm);
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
            <span className="admin-cell-sub">{row.preview}</span>
          </>
        );
      case 'category':
        return row.category;
      case 'age':
        return row.age_range || '—';
      case 'flags':
        return row.featured ? <AdminBadge variant="trial">Featured</AdminBadge> : null;
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
            <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => onTogglePublish(row.id, !row.published)}>
              {row.published ? 'Unpublish' : 'Publish'}
            </button>
            <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={() => onToggleFeatured(row.id, !row.featured)}>
              {row.featured ? 'Unfeature' : 'Feature'}
            </button>
            <button
              type="button"
              className="admin-btn admin-btn--danger admin-btn--sm"
              onClick={() => {
                if (window.confirm(`Delete tip “${row.title}”?`)) onDelete(row.id);
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
              placeholder="Search tips…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search tips"
            />
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={[{ value: 'all', label: 'All categories' }, ...TIP_CATEGORIES]}
              aria-label="Filter by category"
            />
          </>
        )}
        primaryAction={
          isAdmin ? (
            <button type="button" className="admin-btn admin-btn--primary" onClick={openCreate}>Add tip</button>
          ) : null
        }
      />

      {!isAdmin ? (
        <p className="admin-readonly-note">Tips are read-only for staff. Admin role required to edit.</p>
      ) : null}

      <AdminPanel padding={false}>
        {filtered.length === 0 ? (
          <AdminEmpty
            message={tips.length === 0 ? 'No parenting tips yet.' : 'No tips match your filters.'}
            action={isAdmin ? (
              <button type="button" className="admin-btn admin-btn--primary" onClick={openCreate}>Add tip</button>
            ) : null}
          />
        ) : (
          <AdminDataTable columns={TIP_COLUMNS} rows={filtered} rowKey={(row) => row.id} renderCell={renderCell} />
        )}
      </AdminPanel>

      {editorOpen && isAdmin ? (
        <div className="admin-modal-backdrop" role="presentation" onClick={() => setEditorOpen(false)}>
          <div
            className="admin-modal admin-modal--wide admin-community-editor"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tip-editor-title"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 id="tip-editor-title">{form.id && tips.some((t) => t.id === form.id) ? 'Edit tip' : 'Add tip'}</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <div className="admin-form-grid">
                <div className="auth-field">
                  <label htmlFor="tip-id">ID (slug)</label>
                  <input id="tip-id" required value={form.id} onChange={(e) => setForm({ ...form, id: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label htmlFor="tip-title">Title</label>
                  <input id="tip-title" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                </div>
              </div>
              <div className="admin-form-grid admin-form-grid--3">
                <div className="auth-field">
                  <label htmlFor="tip-category">Category</label>
                  <Select id="tip-category" value={form.category} onChange={(v) => setForm({ ...form, category: v })} options={TIP_CATEGORIES} />
                </div>
                <div className="auth-field">
                  <label htmlFor="tip-age">Age range</label>
                  <input id="tip-age" value={form.ageRange} onChange={(e) => setForm({ ...form, ageRange: e.target.value })} />
                </div>
                <div className="auth-field">
                  <label htmlFor="tip-tagline">Tagline</label>
                  <input id="tip-tagline" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
                </div>
              </div>
              <div className="auth-field">
                <label htmlFor="tip-preview">Preview</label>
                <input id="tip-preview" required value={form.preview} onChange={(e) => setForm({ ...form, preview: e.target.value })} />
              </div>
              <div className="auth-field">
                <label htmlFor="tip-content">Content (markdown ok)</label>
                <textarea id="tip-content" rows={10} required value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} />
              </div>
              <AdminTagPicker
                id="tip-tags"
                label="Tags"
                hint="Tap pills to toggle — selected tags appear in the public tip filters."
                value={form.tags}
                onChange={(tags) => setForm({ ...form, tags })}
                suggestions={tagSuggestions}
              />
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
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save tip'}</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default AdminCommunityTipsTab;
