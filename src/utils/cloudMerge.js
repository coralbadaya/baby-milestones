export const CLOUD_MERGED_KEY = 'yarntrailsCloudMerged';
export const SHOPPING_CHECKS_KEY = 'yarntrailsShoppingChecks';
export const SHOPPING_SPLIT_KEY = 'yarntrailsShoppingSplit';
export const MILESTONE_CHECKS_KEY = 'babyMilestoneChecks';
export const SHOP_ID_PREFIX = 'shop-';

/** @param {string} id */
export function isShopItemId(id) {
  return String(id).startsWith(SHOP_ID_PREFIX);
}

/**
 * Split the legacy shared checkedItems blob into milestones vs shopping.
 * @param {Record<string, boolean>|null|undefined} checkedItems
 * @returns {{ milestones: Record<string, boolean>, shopping: Record<string, boolean> }}
 */
export function splitLegacyChecks(checkedItems) {
  const milestones = {};
  const shopping = {};
  for (const [id, checked] of Object.entries(checkedItems || {})) {
    if (!checked) continue;
    if (isShopItemId(id)) shopping[id] = true;
    else milestones[id] = true;
  }
  return { milestones, shopping };
}

/**
 * Union of two checked maps — checked if either side is checked.
 * @param {Record<string, boolean>} localMap
 * @param {string[]} cloudIds
 */
export function unionChecks(localMap, cloudIds) {
  const next = { ...(localMap || {}) };
  for (const id of cloudIds || []) {
    if (id) next[id] = true;
  }
  return next;
}

/** @returns {{ userId: string, at: string, domains?: Record<string, boolean> } | null} */
export function readCloudMerged() {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(CLOUD_MERGED_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

/** @param {string} userId @param {string} domain */
export function isDomainMerged(userId, domain) {
  if (!userId) return false;
  const rec = readCloudMerged();
  return rec?.userId === userId && rec?.domains?.[domain] === true;
}

/** @param {string} userId @param {string} domain */
export function markDomainMerged(userId, domain) {
  if (typeof localStorage === 'undefined' || !userId) return;
  const rec = readCloudMerged();
  const domains = rec?.userId === userId ? { ...(rec.domains || {}) } : {};
  domains[domain] = true;
  localStorage.setItem(CLOUD_MERGED_KEY, JSON.stringify({
    userId,
    at: new Date().toISOString(),
    domains,
  }));
}

/** One-time split of shop-* ids out of babyMilestoneChecks. */
export function migrateLegacyShoppingSplit() {
  if (typeof localStorage === 'undefined') return;
  if (localStorage.getItem(SHOPPING_SPLIT_KEY)) return;

  let parsed;
  try {
    const raw = localStorage.getItem(MILESTONE_CHECKS_KEY);
    parsed = raw ? JSON.parse(raw) : {};
  } catch {
    parsed = {};
  }

  const { milestones, shopping } = splitLegacyChecks(parsed);
  localStorage.setItem(MILESTONE_CHECKS_KEY, JSON.stringify(milestones));

  let existingShopping;
  try {
    const raw = localStorage.getItem(SHOPPING_CHECKS_KEY);
    existingShopping = raw ? JSON.parse(raw) : {};
  } catch {
    existingShopping = {};
  }
  localStorage.setItem(SHOPPING_CHECKS_KEY, JSON.stringify({ ...existingShopping, ...shopping }));
  localStorage.setItem(SHOPPING_SPLIT_KEY, '1');
}

/** @param {Record<string, boolean>} map */
export function checkedIds(map) {
  return Object.entries(map || {})
    .filter(([, v]) => v)
    .map(([id]) => id);
}

/** @param {Record<string, boolean>} map */
export function checksToRpcItems(map) {
  return Object.entries(map || {}).map(([id, checked]) => ({ id, checked: Boolean(checked) }));
}

/**
 * @param {string} localName
 * @param {string|null|undefined} localBirth
 * @param {{ name?: string, birth_date?: string|null }|null} cloud
 */
export function mergeBabyIdentity(localName, localBirth, cloud) {
  if (cloud?.birth_date) {
    return {
      name: (cloud.name && cloud.name !== 'Baby') ? cloud.name : (localName || cloud.name || ''),
      birthDate: cloud.birth_date,
      source: 'cloud',
    };
  }
  return {
    name: localName || cloud?.name || '',
    birthDate: localBirth || '',
    source: 'local',
  };
}
