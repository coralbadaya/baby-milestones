import { Link } from 'react-router-dom';
import Icon from '../../Icon';
import AdminPanel from '../AdminPanel';
import { ROUTES } from '../../../routes';

const SURFACES = [
  {
    tab: 'feed',
    icon: 'speech-bubble',
    title: 'Mom Feed',
    description: 'Published memories with reactions and comments. Member posts require approval.',
    manageTab: 'memories',
    href: ROUTES.communityTab('feed'),
  },
  {
    tab: 'recipes',
    icon: 'baby-bottle',
    title: 'Baby Recipes',
    description: 'Swipeable recipe stack with filters, saved list, and detail modal.',
    manageTab: 'recipes',
    href: ROUTES.communityTab('recipes'),
  },
  {
    tab: 'tips',
    icon: 'light-bulb',
    title: 'Parenting Tips',
    description: 'Curated tips by category and age — expand, helpful vote, share.',
    manageTab: 'tips',
    href: ROUTES.communityTab('tips'),
  },
  {
    tab: 'create',
    icon: 'sparkles',
    title: 'Share a Memory',
    description: 'Authenticated members post milestones, tips, wins, moments, or real talk.',
    manageTab: 'moderation',
    href: ROUTES.communityTab('create'),
  },
];

/**
 * @param {{
 *   stats: { publishedMemories: number, pendingMemories: number, recipeCount: number, tipCount: number },
 *   onGoToTab: (tab: string) => void,
 * }} props
 */
function AdminCommunityOverview({ stats, onGoToTab }) {
  return (
    <>
      <AdminPanel>
        <div className="admin-stat-grid">
          <button type="button" className="admin-stat-card admin-stat-card--button" onClick={() => onGoToTab('memories')}>
            <span className="admin-stat-value">{stats.publishedMemories}</span>
            <span className="admin-stat-label">Published memories</span>
          </button>
          <button type="button" className="admin-stat-card admin-stat-card--button" onClick={() => onGoToTab('moderation')}>
            <span className="admin-stat-value">{stats.pendingMemories}</span>
            <span className="admin-stat-label">Awaiting moderation</span>
          </button>
          <button type="button" className="admin-stat-card admin-stat-card--button" onClick={() => onGoToTab('recipes')}>
            <span className="admin-stat-value">{stats.recipeCount}</span>
            <span className="admin-stat-label">Recipes in library</span>
          </button>
          <button type="button" className="admin-stat-card admin-stat-card--button" onClick={() => onGoToTab('tips')}>
            <span className="admin-stat-value">{stats.tipCount}</span>
            <span className="admin-stat-label">Parenting tips</span>
          </button>
        </div>

        {stats.pendingMemories > 0 ? (
          <div className="admin-community-alert">
            <p>
              <strong>{stats.pendingMemories}</strong>
              {' '}
              post{stats.pendingMemories === 1 ? '' : 's'}
              {' '}
              waiting for review.
            </p>
            <button type="button" className="admin-btn admin-btn--primary" onClick={() => onGoToTab('moderation')}>
              Review queue
            </button>
          </div>
        ) : null}
      </AdminPanel>

      <h2 className="admin-section-title">Consumer surfaces</h2>
      <div className="admin-community-surfaces">
        {SURFACES.map((item) => (
          <article key={item.tab} className="admin-community-surface-card">
            <div className="admin-community-surface-card__icon" aria-hidden="true">
              <Icon name={item.icon} size={22} />
            </div>
            <div className="admin-community-surface-card__body">
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <div className="admin-community-surface-card__actions">
                <Link to={item.href} className="admin-btn admin-btn--ghost" target="_blank" rel="noreferrer">
                  View live
                </Link>
                <button type="button" className="admin-btn admin-btn--primary" onClick={() => onGoToTab(item.manageTab)}>
                  Manage
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

export default AdminCommunityOverview;
