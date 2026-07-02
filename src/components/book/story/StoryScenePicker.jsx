import { STORY_SCENES } from '../../../data/storyScenes';

function StoryScenePicker({ sceneId, onSceneChange }) {
  return (
    <section className="baby-book-studio__section" aria-labelledby="story-scene-heading">
      <h3 id="story-scene-heading" className="baby-book-studio__section-title">Who will they become?</h3>
      <p className="baby-book-section-sub baby-book-studio__section-sub">
        Pick a dream — tonight the story is told the way your childhood stories were told.
      </p>
      <div className="baby-book-scene-row">
        {STORY_SCENES.map((scene) => (
          <button
            key={scene.id}
            type="button"
            className={`baby-book-scene-card baby-book-glass${sceneId === scene.id ? ' baby-book-scene-card--active' : ''}`}
            onClick={() => onSceneChange(scene.id)}
          >
            <span className="baby-book-scene-card__emoji">{scene.emoji}</span>
            <strong>{scene.title}</strong>
            <span>{scene.sub}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

export default StoryScenePicker;
