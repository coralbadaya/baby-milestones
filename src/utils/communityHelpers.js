export const MEMORY_TYPES = [
  { id: 'milestone', label: 'Milestone', icon: "star-glow" },
  { id: 'tip', label: 'Parenting Tip', icon: "light-bulb" },
  { id: 'recipe', label: 'Recipe Win', icon: "plate" },
  { id: 'moment', label: 'Sweet Moment', icon: "two-hearts" },
  { id: 'struggle', label: 'Real Talk', icon: "handshake" },
];

export function getMemoryTypeConfig(type) {
  return MEMORY_TYPES.find((t) => t.id === type) ?? MEMORY_TYPES[3];
}

export function formatRelativeTime(isoString, now = new Date()) {
  const date = new Date(isoString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;

  /** @type {Intl.DateTimeFormatOptions} */
  const opts = { month: 'short', day: 'numeric' };
  if (date.getFullYear() !== now.getFullYear()) {
    opts.year = 'numeric';
  }
  return date.toLocaleDateString(undefined, opts);
}
