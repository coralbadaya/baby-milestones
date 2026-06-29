import DetailModal from '../DetailModal';
import ShareButton from './ShareButton';
import RecipeMetaChips from './RecipeMetaChips';

function RecipeDetailBody({ recipe }) {
  return (
    <>
      <div className="recipe-detail-section">
        <h4>Ingredients</h4>
        <ul>
          {recipe.ingredients.map((ing) => (
            <li key={ing}>{ing}</li>
          ))}
        </ul>
      </div>

      <div className="recipe-detail-section">
        <h4>Steps</h4>
        <ol>
          {recipe.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {recipe.nutritionTip && (
        <p className="recipe-detail-tip">
          <strong>Nutrition tip:</strong> {recipe.nutritionTip}
        </p>
      )}

      <div className="recipe-detail-actions">
        <ShareButton
          title={recipe.title}
          text={`${recipe.title} — ${recipe.description || ''}`.trim()}
          label="Share this recipe"
        />
      </div>
    </>
  );
}

function RecipeDetailModal({ recipe, onClose }) {
  if (!recipe) return null;

  return (
    <DetailModal
      title={recipe.title}
      meta={<RecipeMetaChips prepTime={recipe.prepTime} ageRange={recipe.ageRange} />}
      lead={recipe.description || undefined}
      displayTitle
      onClose={onClose}
    >
      <RecipeDetailBody recipe={recipe} />
    </DetailModal>
  );
}

export default RecipeDetailModal;
