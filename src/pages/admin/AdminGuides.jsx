import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminGuideThemePreview from '../../components/admin/AdminGuideThemePreview';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminToolbar from '../../components/admin/AdminToolbar';
import Select from '../../components/Select';
import { useAuth } from '../../context/AuthContext';
import { guides } from '../../data/guides';
import { GUIDE_THEMES, resolveGuideTheme } from '../../data/guideThemes';
import {
  JOB_TAGS,
  defaultTagsForGuide,
  orderTags,
  tagLabel,
  tagsForGuide,
} from '../../data/guideTags';
import { useGuideTagOverrides } from '../../hooks/useGuideTagOverrides';
import { ROUTES } from '../../routes';
import { resetGuideTags, upsertGuideTags } from '../../utils/guideTagAdmin';
import { supabase } from '../../utils/supabaseClient';

const THEME_FILTER_OPTIONS = [
  { value: '', label: 'All themes' },
  ...Object.values(GUIDE_THEMES)
    .filter((t) => t.id !== 'default')
    .map((t) => ({ value: t.id, label: t.label })),
  { value: 'default', label: 'Trail (default)' },
];

function AdminGuides() {
  const { user } = useAuth();
  const { overrides, error: loadError, reload } = useGuideTagOverrides();
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('postpartum-recovery-week-by-week');
  const [draftTags, setDraftTags] = useState([]);
  const [primary, setPrimary] = useState('');
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState('');

  const selected = guides.find((g) => g.slug === selectedSlug) || null;

  useEffect(() => {
    if (!selected) {
      setDraftTags([]);
      setPrimary('');
      return;
    }
    const next = tagsForGuide(selected, overrides);
    setDraftTags(next);
    setPrimary(next[0] || '');
    setStatus('');
  }, [selected, overrides]);

  const previewOverrides = selected
    ? { ...overrides, [selected.slug]: orderTags(draftTags, primary) }
    : overrides;

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guides
      .filter((g) => {
        const theme = resolveGuideTheme(g, overrides);
        if (themeFilter && theme.id !== themeFilter) return false;
        if (!q) return true;
        const tagText = tagsForGuide(g, overrides).map(tagLabel).join(' ').toLowerCase();
        return (
          g.slug.toLowerCase().includes(q)
          || g.title.toLowerCase().includes(q)
          || g.category?.toLowerCase().includes(q)
          || tagText.includes(q)
        );
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [search, themeFilter, overrides]);

  const columns = [
    { key: 'title', header: 'Guide' },
    { key: 'theme', header: 'Theme' },
    { key: 'tags', header: 'Tags' },
    { key: 'actions', header: '', className: 'admin-cell-actions' },
  ];

  const tableRows = rows.map((g) => ({
    slug: g.slug,
    title: g.title,
    guide: g,
    theme: resolveGuideTheme(g, overrides),
    tags: tagsForGuide(g, overrides),
  }));

  const renderCell = (row, col) => {
    if (col.key === 'title') return row.title;
    if (col.key === 'theme') {
      return (
        <span
          className="admin-guide-theme-chip"
          style={{ borderColor: row.theme.accent, background: row.theme.surface, color: row.theme.accentDark }}
        >
          {row.theme.label}
        </span>
      );
    }
    if (col.key === 'tags') {
      return row.tags.map((id) => tagLabel(id)).join(', ') || '—';
    }
    if (col.key === 'actions') {
      return (
        <Link to={ROUTES.guide(row.slug)} target="_blank" rel="noreferrer">
          Open
        </Link>
      );
    }
    return null;
  };

  const toggleTag = (id) => {
    setDraftTags((prev) => {
      if (prev.includes(id)) {
        const next = prev.filter((tag) => tag !== id);
        if (primary === id) setPrimary(next[0] || '');
        return next;
      }
      if (!primary) setPrimary(id);
      return [...prev, id];
    });
    setStatus('');
  };

  const hasOverride = Boolean(selected && overrides[selected.slug]);
  const bundled = selected ? defaultTagsForGuide(selected) : [];

  const handleSave = async () => {
    if (!selected) return;
    setBusy(true);
    setStatus('');
    try {
      await upsertGuideTags(supabase, selected.slug, draftTags, primary, user?.id);
      await reload();
      setStatus('Tags saved.');
    } catch (err) {
      setStatus(err.message || 'Could not save tags.');
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    if (!selected) return;
    setBusy(true);
    setStatus('');
    try {
      await resetGuideTags(supabase, selected.slug);
      await reload();
      setStatus('Back to bundled tags.');
    } catch (err) {
      setStatus(err.message || 'Could not reset tags.');
    } finally {
      setBusy(false);
    }
  };

  const primaryOptions = draftTags.map((id) => ({ value: id, label: tagLabel(id) }));

  return (
    <>
      <AdminPageHeader
        title="Guides"
        description="Assign one or more job tags per article. The primary tag sets the Wool & Trail theme on `/guides/:slug`. Sections on the public hub stay in their original categories."
      />

      <AdminToolbar
        left={(
          <>
            <input
              type="search"
              className="admin-search"
              placeholder="Search guides…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search guides"
            />
            <Select
              value={themeFilter}
              onChange={setThemeFilter}
              options={THEME_FILTER_OPTIONS}
              aria-label="Filter by theme"
            />
          </>
        )}
      />

      {loadError ? <p className="admin-muted">Using bundled tags — {loadError}</p> : null}

      <div className="admin-guide-layout">
        <AdminPanel className="admin-guide-layout__list">
          <h2 className="admin-section-title">Guides</h2>
          <AdminDataTable
            columns={columns}
            rows={tableRows}
            rowKey={(row) => row.slug}
            renderCell={renderCell}
            selectedRowKey={selected?.slug}
            onRowClick={(row) => setSelectedSlug(row.slug)}
          />
        </AdminPanel>

        <AdminPanel className="admin-guide-layout__preview">
          <h2 className="admin-section-title">Tags</h2>
          {selected ? (
            <>
              <p className="admin-guide-tags-lede">
                {selected.title}
                {hasOverride ? ' · custom' : ' · bundled'}
              </p>
              <div className="admin-guide-tags" role="group" aria-label="Job tags">
                {JOB_TAGS.map((tag) => {
                  const checked = draftTags.includes(tag.id);
                  return (
                    <label key={tag.id} className={`admin-guide-tag-option${checked ? ' is-on' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleTag(tag.id)}
                      />
                      {tag.label}
                    </label>
                  );
                })}
              </div>
              {draftTags.length > 1 ? (
                <div className="admin-guide-primary">
                  <Select
                    label="Primary tag (theme)"
                    value={primary}
                    onChange={setPrimary}
                    options={primaryOptions}
                    aria-label="Primary tag"
                  />
                </div>
              ) : null}
              <div className="admin-guide-tag-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn--primary"
                  disabled={busy}
                  onClick={handleSave}
                >
                  Save tags
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn--ghost"
                  disabled={busy || !hasOverride}
                  onClick={handleReset}
                >
                  Reset to bundled
                </button>
              </div>
              <p className="admin-muted">
                Bundled default: {bundled.map(tagLabel).join(', ') || 'none'}
                {status ? ` · ${status}` : ''}
              </p>
              <h2 className="admin-section-title">Theme preview</h2>
              <AdminGuideThemePreview
                key={`${selected.slug}-${draftTags.join('-')}-${primary}`}
                guide={selected}
                overrides={previewOverrides}
              />
            </>
          ) : (
            <p className="admin-muted">Select a guide from the list.</p>
          )}
        </AdminPanel>
      </div>
    </>
  );
}

export default AdminGuides;
