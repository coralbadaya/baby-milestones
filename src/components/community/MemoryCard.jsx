import { useState } from 'react';
import { interact } from '../../utils/haptics';
import { getMemoryTypeConfig, formatRelativeTime } from '../../utils/communityHelpers';
import Icon from '../Icon';
import CommentSection from './CommentSection';
import ShareButton from './ShareButton';

function MemoryCard({ memory, onReact, onAddComment }) {
  const [showComments, setShowComments] = useState(false);
  const typeCfg = getMemoryTypeConfig(memory.type);

  const handleReact = (type) => {
    interact('tap', 'light');
    onReact(memory.id, type);
  };

  return (
    <article
      className="content-card memory-card card-accent-top"
      style={{ '--cat-color': 'var(--coral-primary)' }}
    >
      <header className="memory-card-header">
        <span className="memory-type-badge">
          <Icon name={typeCfg.icon} size={16} />
          {typeCfg.label}
        </span>
        {memory.babyAge && (
          <span className="memory-age">{memory.babyAge}</span>
        )}
      </header>

      <h3 className="memory-card-title">{memory.title}</h3>
      <p className="memory-card-content">{memory.content}</p>

      {memory.tags?.length > 0 && (
        <div className="memory-tags">
          {memory.tags.map((tag) => (
            <span key={tag} className="memory-tag">#{tag}</span>
          ))}
        </div>
      )}

      <footer className="memory-card-footer">
        <span className="memory-timestamp">{formatRelativeTime(memory.createdAt)}</span>
        <div className="memory-reactions">
          <button type="button" className="memory-react-btn" onClick={() => handleReact('heart')}>
            <Icon name="heart" size={16} /> {memory.reactions.heart || ''}
          </button>
          <button type="button" className="memory-react-btn" onClick={() => handleReact('celebrate')}>
            <Icon name="party" size={16} /> {memory.reactions.celebrate || ''}
          </button>
          <button type="button" className="memory-react-btn" onClick={() => handleReact('support')}>
            <Icon name="handshake" size={16} /> {memory.reactions.support || ''}
          </button>
        </div>
      </footer>

      <div className="memory-actions">
        <button
          type="button"
          className="memory-action-btn"
          onClick={() => {
            interact('tap', 'light');
            setShowComments((v) => !v);
          }}
        >
          <Icon name="speech-bubble" size={16} />
          {memory.comments.length > 0 ? memory.comments.length : 'Comment'}
        </button>
      </div>

      <div className="memory-share-row">
        <ShareButton
          title={memory.title}
          text={`${memory.content.slice(0, 120)}…`}
          label="Share"
        />
      </div>

      {showComments && (
        <CommentSection
          comments={memory.comments}
          onAddComment={(text) => onAddComment(memory.id, text)}
        />
      )}
    </article>
  );
}

export default MemoryCard;
