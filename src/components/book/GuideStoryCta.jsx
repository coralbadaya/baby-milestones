import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { ROUTES } from '../../routes';
import { interact } from '../../utils/haptics';
import { trackEvent } from '../../utils/analytics';

function GuideStoryCta({ month }) {
  const label = month
    ? `Turn month ${month} into a page in their story`
    : 'Turn this month into a page in their story';

  return (
    <aside className="guide-story-cta card-accent-top">
      <Icon name="sparkles" size={28} className="guide-story-cta__icon" />
      <h2 className="font-display">Your AI baby book</h2>
      <p>
        Log milestones free forever — then let Nestbean weave photos and moments into
        an illustrated story with narration.
      </p>
      <Link
        to={ROUTES.babyBookTab('stories')}
        className="btn-primary guide-story-cta__btn"
        onClick={() => {
          interact('tap', 'light');
          trackEvent('guide_cta_click', { month: month || null });
        }}
      >
        {label}
      </Link>
    </aside>
  );
}

export default GuideStoryCta;
