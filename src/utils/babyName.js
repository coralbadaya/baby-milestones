export const BABY_NAME_STORAGE_KEY = 'babyName';

const DEFAULT_NAME = 'Your little one';

/**
 * @param {string|null|undefined} stored
 * @param {string|null|undefined} [profileDisplayName]
 */
export function resolveBabyDisplayName(stored, profileDisplayName) {
  const trimmed = (stored || '').trim();
  if (trimmed) return trimmed;
  const fromProfile = (profileDisplayName || '').trim();
  if (fromProfile) return fromProfile.split(' ')[0];
  return DEFAULT_NAME;
}

/** First name for possessive copy ("Aria's first year"). */
export function babyFirstName(displayName) {
  const name = (displayName || DEFAULT_NAME).trim();
  if (name === DEFAULT_NAME || name === 'Your baby') return name;
  return name.split(' ')[0];
}

export function loadStoredBabyName() {
  if (typeof localStorage === 'undefined') return '';
  return localStorage.getItem(BABY_NAME_STORAGE_KEY) || '';
}

export function saveStoredBabyName(name) {
  if (typeof localStorage === 'undefined') return;
  const trimmed = (name || '').trim();
  if (trimmed) {
    localStorage.setItem(BABY_NAME_STORAGE_KEY, trimmed);
  } else {
    localStorage.removeItem(BABY_NAME_STORAGE_KEY);
  }
}

export default resolveBabyDisplayName;
