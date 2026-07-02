import { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import { useSwipe } from '../../hooks/useSwipe';
import { useSavedRecipes } from '../../hooks/useSavedRecipes';
import { interact } from '../../utils/haptics';
import { AGE_FILTERS, filterRecipe } from '../../utils/recipeFilters';
import { buildTagOptions } from '../../utils/tagFilters';
import TagFilterBar from './TagFilterBar';
import Icon from '../Icon';
import ImageWithFallback from '../ImageWithFallback';
import { NESTBEAN_WATERMARK_SRC } from '../../constants/brandAssets';
import RecipeDetailModal from './RecipeDetailModal';

function RecipeCard({ recipe, offset = 0, isActive, onTap }) {
  const tapStart = useRef(null);

  const handlePointerDown = (e) => {
    tapStart.current = { x: e.clientX ?? e.touches?.[0]?.clientX, y: e.clientY ?? e.touches?.[0]?.clientY };
  };

  const handlePointerUp = (e) => {
    if (!tapStart.current || !onTap) return;
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX;
    const y = e.clientY ?? e.changedTouches?.[0]?.clientY;
    const dx = Math.abs(x - tapStart.current.x);
    const dy = Math.abs(y - tapStart.current.y);
    if (dx < 10 && dy < 10 && Math.abs(offset) < 10) {
      onTap(recipe);
    }
    tapStart.current = null;
  };

  return (
    <article
      className={`recipe-card card-accent-top${isActive ? ' recipe-card-active' : ''}`}
      style={{
        '--cat-color': 'var(--mint-dark)',
        transform: isActive ? `translateX(${offset}px) rotate(${offset * 0.03}deg)` : undefined,
        opacity: isActive && Math.abs(offset) > 50 ? 0.85 : 1,
      }}
      onMouseDown={handlePointerDown}
      onMouseUp={handlePointerUp}
      onTouchStart={handlePointerDown}
      onTouchEnd={handlePointerUp}
    >
      <div className="recipe-card-media">
        <ImageWithFallback
          className="recipe-card-media__frame"
          imgClassName="recipe-thumbnail"
          src={recipe.thumbnail}
          watermarkSrc={NESTBEAN_WATERMARK_SRC}
          alt=""
          fallbackGradient="linear-gradient(145deg, #D4ECD9 0%, #FCF8F2 100%)"
          loading="lazy"
        />
      </div>

      <div className="recipe-card-body">
        <h3 className="recipe-card-title">{recipe.title}</h3>
        <p className="recipe-card-meta">
          {recipe.prepTime} · {recipe.ageRange}
        </p>
        <p className="recipe-card-caption">{recipe.description}</p>

        {recipe.tags?.length > 0 && (
          <div className="recipe-card-tags">
            {recipe.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="memory-tag">#{tag}</span>
            ))}
          </div>
        )}

        <ul className="recipe-ingredients-preview">
          {recipe.ingredients.slice(0, 3).map((ing) => (
            <li key={ing}>{ing}</li>
          ))}
          {recipe.ingredients.length > 3 && (
            <li className="recipe-more">+{recipe.ingredients.length - 3} more — tap for full recipe</li>
          )}
        </ul>
      </div>
    </article>
  );
}

function SavedRecipeList({ recipes, savedIds, onSelect }) {
  const saved = recipes.filter((r) => savedIds.includes(r.id));

  if (saved.length === 0) return null;

  return (
    <div className="saved-recipes">
      <h3 className="saved-recipes-title">Saved recipes ({saved.length})</h3>
      <ul className="saved-recipes-list">
        {saved.map((r) => (
          <li key={r.id}>
            <button type="button" className="saved-recipe-btn" onClick={() => onSelect(r)}>
              <span>{r.title}</span>
              <span className="saved-recipe-meta">{r.ageRange}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecipeFilters({
  recipes,
  age,
  tag,
  onAge,
  onTag,
  count,
  total,
}) {
  const tagOptions = useMemo(
    () => buildTagOptions(recipes, (r) => r.tags, { max: 14, allLabel: 'All tags' }),
    [recipes]
  );

  const hasActive = age !== 'all' || tag !== 'all';

  return (
    <div className="community-section-filters recipe-filters">
      <p className="community-filter-count">
        {count === total ? `${total} recipes` : `${count} of ${total} recipes`}
      </p>

      <TagFilterBar
        options={tagOptions}
        selected={tag}
        onSelect={onTag}
        label="Recipe tags"
      />

      <div className="community-filters community-age-filters" role="tablist" aria-label="Baby age">
        {AGE_FILTERS.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            aria-selected={age === a.id}
            className={`community-filter-btn community-age-btn${age === a.id ? ' active' : ''}`}
            onClick={() => onAge(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>

      {hasActive && (
        <button
          type="button"
          className="community-clear-filters"
          onClick={() => {
            onAge('all');
            onTag('all');
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  );
}

function RecipeFeed({ recipes }) {
  const [skipped, setSkipped] = useState([]);
  const [detailRecipe, setDetailRecipe] = useState(null);
  const [ageFilter, setAgeFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const { savedIds, saveRecipe } = useSavedRecipes();

  const filters = useMemo(
    () => ({ age: ageFilter, tag: tagFilter }),
    [ageFilter, tagFilter]
  );

  const filtered = useMemo(
    () => recipes.filter((r) => filterRecipe(r, filters)),
    [recipes, filters]
  );

  useEffect(() => {
    setSkipped([]);
  }, [ageFilter, tagFilter]);

  const remaining = filtered.filter(
    (r) => !savedIds.includes(r.id) && !skipped.includes(r.id)
  );
  const current = remaining[0];
  const next = remaining[1];

  const goNext = useCallback((direction) => {
    if (!current) return;
    interact(direction === 'like' ? 'check' : 'swoosh', 'light');
    if (direction === 'like') saveRecipe(current.id);
    else setSkipped((prev) => [...prev, current.id]);
  }, [current, saveRecipe]);

  const { offset, handlers } = useSwipe(
    () => goNext('skip'),
    () => goNext('like')
  );

  const resetSkipped = () => setSkipped([]);

  if (recipes.length === 0) {
    return (
      <div className="community-empty">
        <Icon name="baby-bottle" size={48} className="community-empty-icon" />
        <h3>Recipes coming soon</h3>
        <p>Swipe through baby-friendly recipes curated for new moms.</p>
      </div>
    );
  }

  return (
    <div className="recipe-feed">
      <RecipeFilters
        recipes={recipes}
        age={ageFilter}
        tag={tagFilter}
        onAge={setAgeFilter}
        onTag={setTagFilter}
        count={filtered.length}
        total={recipes.length}
      />

      {filtered.length === 0 ? (
        <div className="community-empty community-empty-inline">
          <p>No recipes match these filters — try another tag or age.</p>
        </div>
      ) : !current ? (
        <div className="community-empty">
          <Icon name="sparkles" size={48} className="community-empty-icon" />
          <h3>All caught up!</h3>
          <p>
            You&apos;ve seen all {filtered.length} recipes in this filter.
            {savedIds.length > 0 && ` Saved ${savedIds.length} total.`}
          </p>
          {skipped.length > 0 && (
            <button type="button" className="recipe-reset-btn" onClick={resetSkipped}>
              Show skipped again
            </button>
          )}
        </div>
      ) : (
        <>
          <p className="recipe-swipe-hint">Swipe right to save · left to skip · tap card for full recipe</p>
          <div className="recipe-stack">
            {next && (
              <div className="recipe-stack-next" aria-hidden="true">
                <RecipeCard recipe={next} />
              </div>
            )}
            <div className="recipe-stack-current" {...handlers}>
              <RecipeCard
                recipe={current}
                offset={offset}
                isActive
                onTap={setDetailRecipe}
              />
            </div>
          </div>
          <div className="recipe-actions">
            <button type="button" className="recipe-skip-btn" onClick={() => goNext('skip')}>
              Skip
            </button>
            <button type="button" className="recipe-like-btn" onClick={() => goNext('like')}>
              Save <Icon name="heart" size={18} />
            </button>
          </div>
        </>
      )}

      <SavedRecipeList
        recipes={recipes}
        savedIds={savedIds}
        onSelect={setDetailRecipe}
      />

      {detailRecipe && (
        <RecipeDetailModal
          recipe={detailRecipe}
          onClose={() => setDetailRecipe(null)}
        />
      )}
    </div>
  );
}

export default RecipeFeed;
