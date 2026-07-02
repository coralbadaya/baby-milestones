import AdminBadge from '../AdminBadge';

/** @typedef {'pending' | 'published' | 'hidden'} MemoryStatus */

/** @param {MemoryStatus} status */
export function memoryBadgeVariant(status) {
  if (status === 'published') return 'active';
  if (status === 'pending') return 'warning';
  return 'neutral';
}

/** @param {MemoryStatus} status */
export function memoryStatusLabel(status) {
  const labels = { pending: 'Pending', published: 'Published', hidden: 'Hidden' };
  return labels[status] || status;
}

/** @param {MemoryStatus} status */
export function MemoryStatusBadge({ status }) {
  return (
    <AdminBadge variant={memoryBadgeVariant(status)}>
      {memoryStatusLabel(status)}
    </AdminBadge>
  );
}

/** @param {Record<string, number> | null | undefined} reactions */
export function formatReactions(reactions) {
  const r = reactions || {};
  const heart = r.heart ?? 0;
  const celebrate = r.celebrate ?? 0;
  const support = r.support ?? 0;
  return { heart, celebrate, support, total: heart + celebrate + support };
}

export function splitLines(value) {
  return value.split('\n').map((s) => s.trim()).filter(Boolean);
}

export function formatDateTime(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** @param {string} type */
export function memoryTypeLabel(type) {
  const labels = {
    milestone: 'Milestone',
    tip: 'Tip',
    recipe: 'Recipe win',
    moment: 'Moment',
    struggle: 'Real talk',
  };
  return labels[type] || type;
}
