/** @typedef {import('../types/community').Memory} Memory */

export const COMMUNITY_MEMORIES_STORAGE_KEY = 'coral_memories';

/**
 * @param {string} id
 * @returns {boolean}
 */
export function isCommunityMemoryUuid(id) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
}

/**
 * @param {Partial<Memory>} memory
 * @returns {Memory}
 */
export function createCommunityMemoryRecord(memory) {
  return {
    id: `memory-${Date.now()}`,
    createdAt: new Date().toISOString(),
    reactions: { heart: 0, celebrate: 0, support: 0 },
    comments: [],
    tags: [],
    ...memory,
  };
}

/**
 * Merge Supabase published posts with local-only posts; dedupe seeded legacy ids.
 * @param {Memory[]} remote
 * @param {Memory[]} local
 * @returns {Memory[]}
 */
export function mergeCommunityMemories(remote, local) {
  const remoteLegacyIds = new Set(
    remote.map((m) => m.id).filter((id) => id.startsWith('memory-seed-')),
  );
  const localOnly = local.filter((m) => !remoteLegacyIds.has(m.id));
  const combined = [...remote, ...localOnly];
  return combined.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * @param {Memory[]} memories
 * @returns {Memory[]}
 */
export function sortMemoriesNewestFirst(memories) {
  return [...memories].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/**
 * @param {Memory} memory
 * @param {'heart' | 'celebrate' | 'support'} reactionType
 * @returns {Memory}
 */
export function incrementMemoryReaction(memory, reactionType) {
  return {
    ...memory,
    reactions: {
      ...memory.reactions,
      [reactionType]: (memory.reactions[reactionType] || 0) + 1,
    },
  };
}

/**
 * @param {Memory} memory
 * @param {{ id: number | string, text: string, author: string, timestamp: string }} comment
 * @returns {Memory}
 */
export function appendMemoryComment(memory, comment) {
  return {
    ...memory,
    comments: [...memory.comments, comment],
  };
}

/**
 * @param {Memory[]} memories
 * @param {string} memoryId
 * @returns {Memory | undefined}
 */
export function findMemoryById(memories, memoryId) {
  return memories.find((m) => m.id === memoryId);
}

/**
 * @param {Memory[]} memories
 * @returns {Memory[]}
 */
export function localOnlyMemories(memories) {
  return memories.filter((m) => !m._fromSupabase);
}
