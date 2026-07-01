/** @typedef {'new' | 'draft' | 'active' | 'sent' | 'trial' | 'scheduled' | 'sending' | 'warning' | 'error' | 'cancelled' | 'neutral' | 'read' | 'replied' | 'archived' | 'free' | 'expired' | 'comp'} AdminBadgeVariant */

const VARIANT_CLASS = {
  new: 'admin-badge--new',
  draft: 'admin-badge--draft',
  active: 'admin-badge--active',
  sent: 'admin-badge--sent',
  trial: 'admin-badge--trial',
  scheduled: 'admin-badge--scheduled',
  sending: 'admin-badge--sending',
  warning: 'admin-badge--warning',
  error: 'admin-badge--error',
  cancelled: 'admin-badge--cancelled',
  neutral: 'admin-badge--neutral',
  read: 'admin-badge--neutral',
  replied: 'admin-badge--active',
  archived: 'admin-badge--neutral',
  free: 'admin-badge--neutral',
  expired: 'admin-badge--error',
  comp: 'admin-badge--active',
};

/**
 * Status pill — maps design doc colors.
 * @param {{ variant?: AdminBadgeVariant, children: import('react').ReactNode, className?: string }} props
 */
function AdminBadge({ variant = 'neutral', children, className = '' }) {
  const mod = VARIANT_CLASS[variant] || 'admin-badge--neutral';
  return (
    <span className={`admin-badge ${mod}${className ? ` ${className}` : ''}`}>
      {children}
    </span>
  );
}

export default AdminBadge;
