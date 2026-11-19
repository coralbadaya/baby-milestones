/** Labels for staff user activity console. */

export const SESSION_END_LABELS = {
  logout_event: 'Signed out (tracked)',
  idle_timeout: 'Session idle (~30 min)',
  open_or_recent: 'Recent / may still be active',
};

export const EVENT_LABELS = {
  page_view: 'Page view',
  session_start: 'Session started',
  consent_accepted: 'Analytics consent accepted',
  consent_rejected: 'Analytics consent declined',
  signup_view: 'Signup screen',
  signup_completed: 'Signup completed',
  login_completed: 'Login completed',
  logout_completed: 'Logout',
  premium_view: 'Plus page view',
  begin_checkout: 'Checkout started',
  subscribe_success: 'Subscription paid',
  trial_started: 'Trial started',
  gate_hit: 'Premium gate',
  birth_date_set: 'Birth date set',
  milestone_checked: 'Milestone checked',
  first_saved: 'Life first saved',
  guide_view: 'Guide view',
  community_tab: 'Community tab',
  baby_book_idea: 'Baby book idea',
  content_shared: 'Content shared',
};

export function formatActivityEventName(name) {
  return EVENT_LABELS[name] || name || '—';
}

export function formatSessionEndReason(code) {
  return SESSION_END_LABELS[code] || code || '—';
}