/** @param {{ email_confirmed_at?: string|null }|null|undefined} user */
export function isEmailVerified(user) {
  return Boolean(user?.email_confirmed_at);
}

/** @param {{ message?: string }|null|undefined} error */
export function isEmailNotConfirmedError(error) {
  const msg = error?.message?.toLowerCase() || '';
  return msg.includes('email not confirmed') || msg.includes('not confirmed');
}
