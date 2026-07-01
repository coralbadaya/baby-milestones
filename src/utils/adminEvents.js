export const ADMIN_INBOX_UPDATED = 'admin-inbox-updated';

export function dispatchAdminInboxUpdated() {
  window.dispatchEvent(new CustomEvent(ADMIN_INBOX_UPDATED));
}
