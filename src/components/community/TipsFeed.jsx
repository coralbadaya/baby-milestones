import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TipCard from './TipCard';
import TagFilterBar from './TagFilterBar';
import Icon from '../Icon';
import { useHelpfulTips } from '../../hooks/useHelpfulTips';
import { AGE_FILTERS, tipMatchesAge } from '../../utils/tipFilters';
import { buildTagOptions, matchesTag } from '../../utils/tagFilters';
import { ROUTES } from '../../routes';
import { communityItemPath } from '../../utils/communityUrls';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'health', label: 'Health' },
  { id: 'sleep', label: 'Sleep' },
  { id: 'feeding', label: 'Feeding' },
  { id: 'play', label: 'Play' },
];

function TipsFeed({ tips, itemId }) {
  const navigate = useNavigate();
  const [category, setCategory] = useState('all');
  const [ageFilter, setAgeFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [expandedId, setExpandedId] = useState(itemId || null);
  const { markHelpful, getCount } = useHelpfulTips();

  const tagOptions = useMemo(
    () => buildTagOptions(tips, (t) => t.tags, { allLabel: 'All tags' }),
    [tips]
  );

  const filtered = useMemo(() => {
    return tips.filter((t) => {
      const catOk = category === 'all' || t.category === category;
      const ageOk = tipMatchesAge(t, ageFilter);
      const tagOk = matchesTag(t.tags, tagFilter);
      return catOk && ageOk && tagOk;
    });
  }, [tips, category, ageFilter, tagFilter]);

  const hasFilters = category !== 'all' || ageFilter !== 'all' || tagFilter !== 'all';

  useEffect(() => {
    setExpandedId(itemId || null);
  }, [itemId]);

  useEffect(() => {
    if (!itemId) return;
    const match = tips.find((t) => t.id === itemId);
    if (!match) return;
    if (!filtered.some((t) => t.id === match.id)) {
      setCategory('all');
      setAgeFilter('all');
      setTagFilter('all');
    }
  }, [itemId, tips, filtered]);

  useEffect(() => {
    if (!itemId) return;
    const el = document.getElementById(`community-tip-${itemId}`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [itemId, filtered]);

  const toggleTip = (id) => {
    const next = expandedId === id ? null : id;
    setExpandedId(next);
    navigate(next ? communityItemPath('tips', next) : ROUTES.communityTab('tips'), { replace: true });
  };

  if (tips.length === 0) {
    return (
      <div className="community-empty">
        <Icon name="light-bulb" size={48} className="community-empty-icon" />
        <h3>Tips coming soon</h3>
        <p>Parenting tips from moms who've been there.</p>
      </div>
    );
  }

  return (
    <div className="tips-feed">
      <div className="community-section-filters">
        <p className="community-filter-count">
          {filtered.length === tips.length
            ? `${tips.length} tips`
            : `${filtered.length} of ${tips.length} tips`}
        </p>

        <div className="community-filters" role="tablist" aria-label="Tip categories">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              type="button"
              role="tab"
              aria-selected={category === c.id}
              className={`community-filter-btn${category === c.id ? ' active' : ''}`}
              onClick={() => setCategory(c.id)}
            >
              {c.label}
            </button>
          ))}
        </div>

        <TagFilterBar
          options={tagOptions}
          selected={tagFilter}
          onSelect={setTagFilter}
          label="Tip tags"
        />

        <div className="community-filters community-age-filters" role="tablist" aria-label="Baby age">
          {AGE_FILTERS.map((a) => (
            <button
              key={a.id}
              type="button"
              role="tab"
              aria-selected={ageFilter === a.id}
              className={`community-filter-btn community-age-btn${ageFilter === a.id ? ' active' : ''}`}
              onClick={() => setAgeFilter(a.id)}
            >
              {a.label}
            </button>
          ))}
        </div>

        {hasFilters && (
          <button
            type="button"
            className="community-clear-filters"
            onClick={() => {
              setCategory('all');
              setAgeFilter('all');
              setTagFilter('all');
            }}
          >
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="community-empty community-empty-inline">
          <p>No tips match these filters — try another tag, category, or age.</p>
        </div>
      ) : (
        <div className="tips-grid-community">
          {filtered.map((tip) => (
            <TipCard
              key={tip.id}
              tip={tip}
              expanded={expandedId === tip.id}
              highlighted={itemId === tip.id}
              onToggleExpand={() => toggleTip(tip.id)}
              helpfulCount={getCount(tip.id)}
              onHelpful={markHelpful}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TipsFeed;
