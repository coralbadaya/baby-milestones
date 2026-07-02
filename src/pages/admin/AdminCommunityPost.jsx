import {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import Select from '../../components/Select';
import AdminLoading from '../../components/admin/AdminLoading';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPanel from '../../components/admin/AdminPanel';
import {
  formatDateTime,
  formatReactions,
  MemoryStatusBadge,
} from '../../components/admin/community/communityAdminHelpers';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes';
import { MEMORY_TYPES } from '../../utils/communityHelpers';
import {
  deleteMemory,
  deleteMemoryComment,
  fetchAdminMemory,
  fetchMemoryComments,
  updateMemory,
  updateMemoryComment,
  updateMemoryFeatured,
  updateMemoryStatus,
} from '../../utils/communityAdmin';
import { interact } from '../../utils/haptics';

const TYPE_OPTIONS = MEMORY_TYPES.map((t) => ({ value: t.id, label: t.label }));

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending review' },
  { value: 'published', label: 'Published' },
  { value: 'hidden', label: 'Hidden' },
];

function emptyForm() {
  return {
    type: 'moment',
    title: '',
    content: '',
    baby_age: '',
    tags: '',
    status: 'pending',
    featured: false,
    author_name: '',
  };
}

/** @param {Record<string, unknown>} row */
function rowToForm(row) {
  return {
    type: row.type || 'moment',
    title: row.title || '',
    content: row.content || '',
    baby_age: row.baby_age || '',
    tags: (row.tags || []).join(', '),
    status: row.status || 'pending',
    featured: Boolean(row.featured),
    author_name: row.author_name || '',
  };
}

function AdminCommunityPost() {
  const { postId } = useParams();
  const [searchParams] = useSearchParams();
  const returnTab = searchParams.get('tab') || 'memories';
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [post, setPost] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [notice, setNotice] = useState(null);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [commentDraft, setCommentDraft] = useState({ text: '', author_name: '' });

  const backTo = `${ROUTES.adminCommunity}?tab=${returnTab}`;

  const showNotice = useCallback((message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 4000);
  }, []);

  const load = useCallback(async () => {
    if (!postId) return;
    setLoading(true);
    setError(null);
    try {
      const [row, commentRows] = await Promise.all([
        fetchAdminMemory(postId),
        fetchMemoryComments(postId),
      ]);
      setPost(row);
      setForm(rowToForm(row));
      setComments(commentRows);
    } catch (err) {
      setError(err.message);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    load();
  }, [load]);

  const reactions = useMemo(
    () => (post ? formatReactions(post.reactions) : null),
    [post],
  );

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!isAdmin || !postId) return;
    interact('tap', 'light');
    setSaving(true);
    setError(null);
    try {
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean);
      const updated = await updateMemory(postId, {
        type: form.type,
        title: form.title.trim(),
        content: form.content.trim(),
        baby_age: form.baby_age.trim() || null,
        tags,
        status: form.status,
        featured: form.featured,
        author_name: form.author_name.trim() || null,
      });
      setPost(updated);
      setForm(rowToForm(updated));
      showNotice('Post saved');
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusAction = async (status) => {
    if (!isAdmin || !postId) return;
    interact('tap', 'light');
    try {
      const updated = await updateMemoryStatus(postId, status);
      setPost(updated);
      setForm(rowToForm(updated));
      showNotice(status === 'published' ? 'Post published' : 'Post hidden');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleToggleFeatured = async () => {
    if (!isAdmin || !post) return;
    interact('tap', 'light');
    try {
      const updated = await updateMemoryFeatured(postId, !post.featured);
      setPost(updated);
      setForm(rowToForm(updated));
      showNotice(updated.featured ? 'Marked featured' : 'Removed from featured');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeletePost = async () => {
    if (!isAdmin || !post) return;
    if (!window.confirm(`Delete post “${post.title}”? This cannot be undone.`)) return;
    interact('tap', 'light');
    try {
      await deleteMemory(postId);
      navigate(backTo);
    } catch (err) {
      setError(err.message);
    }
  };

  const startEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setCommentDraft({ text: comment.text, author_name: comment.author_name || '' });
  };

  const cancelEditComment = () => {
    setEditingCommentId(null);
    setCommentDraft({ text: '', author_name: '' });
  };

  const handleSaveComment = async (commentId) => {
    if (!isAdmin) return;
    interact('tap', 'light');
    try {
      await updateMemoryComment(commentId, {
        text: commentDraft.text.trim(),
        author_name: commentDraft.author_name.trim() || 'Anonymous',
      });
      const next = await fetchMemoryComments(postId);
      setComments(next);
      cancelEditComment();
      showNotice('Comment updated');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!isAdmin) return;
    if (!window.confirm('Delete this comment?')) return;
    interact('tap', 'light');
    try {
      await deleteMemoryComment(commentId);
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      if (editingCommentId === commentId) cancelEditComment();
      showNotice('Comment deleted');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="admin-page admin-community-post-page">
        <AdminLoading message="Loading post…" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="admin-page admin-community-post-page">
        <AdminPageHeader
          title="Post not found"
          breadcrumb={[
            { label: 'Admin', to: ROUTES.admin },
            { label: 'Community', to: ROUTES.adminCommunity },
            { label: 'Post' },
          ]}
        />
        <div className="admin-banner admin-banner--error" role="alert">
          {error || 'This post may have been deleted.'}
        </div>
        <Link to={backTo} className="admin-btn admin-btn--ghost">Back to Community</Link>
      </div>
    );
  }

  return (
    <div className="admin-page admin-community-post-page">
      <AdminPageHeader
        title={form.title || 'Untitled post'}
        description="Review, edit, and moderate this community feed post and its comments."
        breadcrumb={[
          { label: 'Admin', to: ROUTES.admin },
          { label: 'Community', to: backTo },
          { label: form.title || 'Post' },
        ]}
        action={(
          <div className="admin-post-header-actions">
            <Link to={backTo} className="admin-btn admin-btn--ghost">
              Back to list
            </Link>
            <Link
              to={ROUTES.communityTab('feed')}
              className="admin-btn admin-btn--ghost"
              target="_blank"
              rel="noreferrer"
            >
              View feed
            </Link>
            {isAdmin ? (
              <button
                type="button"
                className="admin-btn admin-btn--primary"
                onClick={handleSave}
                disabled={saving || !form.title.trim() || !form.content.trim()}
              >
                {saving ? 'Saving…' : 'Save changes'}
              </button>
            ) : null}
          </div>
        )}
      />

      {error ? (
        <div className="admin-banner admin-banner--error" role="alert">
          {error}
        </div>
      ) : null}

      {notice ? (
        <div className="admin-banner admin-banner--success" role="status">
          {notice}
        </div>
      ) : null}

      <div className="admin-post-moderator">
        <div className="admin-post-moderator-main">
          <AdminPanel>
            <h2 className="admin-post-section-title">Post content</h2>
            <form
              className="admin-form admin-form--post"
              onSubmit={(e) => {
                e.preventDefault();
                handleSave();
              }}
            >
              <div className="admin-form-grid admin-form-grid--3">
                <label className="admin-field">
                  <span>Type</span>
                  <Select
                    value={form.type}
                    onChange={(v) => setField('type', v)}
                    options={TYPE_OPTIONS}
                    disabled={!isAdmin}
                    aria-label="Post type"
                  />
                </label>
                <label className="admin-field">
                  <span>Status</span>
                  <Select
                    value={form.status}
                    onChange={(v) => setField('status', v)}
                    options={STATUS_OPTIONS}
                    disabled={!isAdmin}
                    aria-label="Post status"
                  />
                </label>
                <label className="admin-field admin-field--checkbox">
                  <span>Featured</span>
                  <label className="admin-checkbox-row">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(e) => setField('featured', e.target.checked)}
                      disabled={!isAdmin}
                    />
                    Show in featured slot
                  </label>
                </label>
              </div>

              <label className="admin-field">
                <span>Title</span>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setField('title', e.target.value)}
                  disabled={!isAdmin}
                  required
                />
              </label>

              <label className="admin-field">
                <span>Content</span>
                <textarea
                  value={form.content}
                  onChange={(e) => setField('content', e.target.value)}
                  rows={8}
                  disabled={!isAdmin}
                  required
                />
              </label>

              <div className="admin-form-grid">
                <label className="admin-field">
                  <span>Author display name</span>
                  <input
                    type="text"
                    value={form.author_name}
                    onChange={(e) => setField('author_name', e.target.value)}
                    disabled={!isAdmin}
                    placeholder="Anonymous"
                  />
                </label>
                <label className="admin-field">
                  <span>Baby age</span>
                  <input
                    type="text"
                    value={form.baby_age}
                    onChange={(e) => setField('baby_age', e.target.value)}
                    disabled={!isAdmin}
                    placeholder="e.g. 6 months"
                  />
                </label>
              </div>

              <label className="admin-field">
                <span>Tags (comma-separated)</span>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setField('tags', e.target.value)}
                  disabled={!isAdmin}
                  placeholder="sleep, feeding, milestone"
                />
              </label>
            </form>
          </AdminPanel>

          <AdminPanel>
            <div className="admin-post-comments-head">
              <h2 className="admin-post-section-title">
                Comments (
                {comments.length}
                )
              </h2>
            </div>

            {comments.length === 0 ? (
              <p className="admin-muted">No comments on this post yet.</p>
            ) : (
              <ul className="admin-comment-list admin-comment-list--full">
                {comments.map((c) => (
                  <li key={c.id} className="admin-comment-item admin-comment-item--full">
                    {editingCommentId === c.id ? (
                      <div className="admin-comment-edit">
                        <label className="admin-field">
                          <span>Author</span>
                          <input
                            type="text"
                            value={commentDraft.author_name}
                            onChange={(e) => setCommentDraft((d) => ({ ...d, author_name: e.target.value }))}
                          />
                        </label>
                        <label className="admin-field">
                          <span>Comment</span>
                          <textarea
                            value={commentDraft.text}
                            onChange={(e) => setCommentDraft((d) => ({ ...d, text: e.target.value }))}
                            rows={3}
                          />
                        </label>
                        <div className="admin-comment-edit-actions">
                          <button
                            type="button"
                            className="admin-btn admin-btn--primary admin-btn--sm"
                            onClick={() => handleSaveComment(c.id)}
                            disabled={!commentDraft.text.trim()}
                          >
                            Save comment
                          </button>
                          <button type="button" className="admin-btn admin-btn--ghost admin-btn--sm" onClick={cancelEditComment}>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="admin-comment-item__head">
                          <strong>{c.author_name || 'Anonymous'}</strong>
                          <time dateTime={c.created_at}>{formatDateTime(c.created_at)}</time>
                        </div>
                        <p className="admin-comment-item__body">{c.text}</p>
                        {isAdmin ? (
                          <div className="admin-comment-item__actions">
                            <button
                              type="button"
                              className="admin-btn admin-btn--ghost admin-btn--sm"
                              onClick={() => startEditComment(c)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn--danger admin-btn--sm"
                              onClick={() => handleDeleteComment(c.id)}
                            >
                              Delete
                            </button>
                          </div>
                        ) : null}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </AdminPanel>
        </div>

        <aside className="admin-post-moderator-sidebar" aria-label="Post metadata and moderation">
          <AdminPanel>
            <h2 className="admin-post-section-title">Overview</h2>
            <dl className="admin-detail-meta">
              <div>
                <dt>Status</dt>
                <dd><MemoryStatusBadge status={post.status} /></dd>
              </div>
              <div>
                <dt>Posted</dt>
                <dd><time dateTime={post.created_at}>{formatDateTime(post.created_at)}</time></dd>
              </div>
              <div>
                <dt>Last updated</dt>
                <dd><time dateTime={post.updated_at}>{formatDateTime(post.updated_at)}</time></dd>
              </div>
              {post.author_id ? (
                <div>
                  <dt>Author ID</dt>
                  <dd className="admin-mono">{post.author_id}</dd>
                </div>
              ) : null}
              <div>
                <dt>Post ID</dt>
                <dd className="admin-mono">{post.id}</dd>
              </div>
              {post.legacy_id ? (
                <div>
                  <dt>Legacy ID</dt>
                  <dd className="admin-mono">{post.legacy_id}</dd>
                </div>
              ) : null}
            </dl>

            {reactions && reactions.total > 0 ? (
              <div className="admin-detail-section">
                <h3 className="admin-detail-section-title">Reactions</h3>
                <div className="admin-reaction-chips">
                  <span className="admin-reaction-chip">Heart {reactions.heart}</span>
                  <span className="admin-reaction-chip">Celebrate {reactions.celebrate}</span>
                  <span className="admin-reaction-chip">Support {reactions.support}</span>
                </div>
              </div>
            ) : null}
          </AdminPanel>

          {isAdmin ? (
            <AdminPanel>
              <h2 className="admin-post-section-title">Moderation</h2>
              <div className="admin-post-moderation-actions">
                {form.status === 'pending' ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary"
                    onClick={() => handleStatusAction('published')}
                  >
                    Approve & publish
                  </button>
                ) : null}
                {form.status === 'published' ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn--ghost"
                    onClick={() => handleStatusAction('hidden')}
                  >
                    Hide from feed
                  </button>
                ) : null}
                {form.status === 'hidden' ? (
                  <button
                    type="button"
                    className="admin-btn admin-btn--primary"
                    onClick={() => handleStatusAction('published')}
                  >
                    Re-publish
                  </button>
                ) : null}
                <button type="button" className="admin-btn admin-btn--ghost" onClick={handleToggleFeatured}>
                  {post.featured ? 'Remove featured' : 'Mark featured'}
                </button>
                <button type="button" className="admin-btn admin-btn--danger" onClick={handleDeletePost}>
                  Delete post
                </button>
              </div>
            </AdminPanel>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

export default AdminCommunityPost;
