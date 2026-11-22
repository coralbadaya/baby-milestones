import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminDataTable from '../../components/admin/AdminDataTable';
import AdminGuideThemePreview from '../../components/admin/AdminGuideThemePreview';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import AdminToolbar from '../../components/admin/AdminToolbar';
import Select from '../../components/Select';
import { guides } from '../../data/guides';
import { GUIDE_THEMES, resolveGuideTheme } from '../../data/guideThemes';
import { tagLabel, tagsForGuide } from '../../data/guideTags';
import { ROUTES } from '../../routes';

const THEME_FILTER_OPTIONS = [
  { value: '', label: 'All themes' },
  ...Object.values(GUIDE_THEMES)
    .filter((t) => t.id !== 'default')
    .map((t) => ({ value: t.id, label: t.label })),
  { value: 'default', label: 'Trail (default)' },
];

function AdminGuides() {
  const [search, setSearch] = useState('');
  const [themeFilter, setThemeFilter] = useState('');
  const [selectedSlug, setSelectedSlug] = useState('postpartum-recovery-week-by-week');

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return guides
      .filter((g) => {
        const theme = resolveGuideTheme(g);
        if (themeFilter && theme.id !== themeFilter) return false;
        if (!q) return true;
        return (
          g.slug.toLowerCase().includes(q)
          || g.title.toLowerCase().includes(q)
          || g.category?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.title.localeCompare(b.title));
  }, [search, themeFilter]);

  const selected = guides.find((g) => g.slug === selectedSlug) || rows[0] || null;

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
    theme: resolveGuideTheme(g),
    tags: tagsForGuide(g),
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

  return (
    <>
      <AdminPageHeader
        title="Guide themes"
        description="Each evergreen article inherits a Wool & Trail theme from its primary hub tag. Preview matches the public `/guides/:slug` page."
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
              ariaLabel="Filter by theme"
            />
          </>
        )}
      />

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
          <h2 className="admin-section-title">Theme preview</h2>
          {selected ? (
            <AdminGuideThemePreview key={selected.slug} guide={selected} />
          ) : (
            <p className="admin-muted">Select a guide from the list.</p>
          )}
        </AdminPanel>
      </div>
    </>
  );
}

export default AdminGuides;