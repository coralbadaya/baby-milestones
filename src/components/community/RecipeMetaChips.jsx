import Icon from '../Icon';

/**
 * Prep time + age range chips for recipe modal header.
 * @param {{ prepTime: string, ageRange: string }} props
 */
function RecipeMetaChips({ prepTime, ageRange }) {
  return (
    <div className="recipe-meta-chips">
      <span className="meta-chip">
        <Icon name="timer" size={16} />
        {prepTime}
      </span>
      <span className="meta-chip">
        <Icon name="baby" size={16} />
        {ageRange}
      </span>
    </div>
  );
}

export default RecipeMetaChips;
