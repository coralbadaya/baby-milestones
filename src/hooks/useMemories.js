import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { rowToMemory } from '../utils/community';
import {
  COMMUNITY_MEMORIES_STORAGE_KEY,
  createCommunityMemoryRecord,
  isCommunityMemoryUuid,
  mergeCommunityMemories,
  localOnlyMemories,
} from '../utils/communityMemories';

const STORAGE_KEY = COMMUNITY_MEMORIES_STORAGE_KEY;

/** @type {import('../types/community').Memory[]} */
const SEED_MEMORIES = [
  {
    id: 'memory-seed-teething',
    type: 'tip',
    title: 'Baby Teething — What Worked for Us',
    content:
      'Cold teething rings + a little chamomile tea dabbed on gums were our lifesaver. Frozen washcloth knots helped on rough nights too.',
    babyAge: '6 months',
    tags: ['teething', 'remedies'],
    createdAt: '2026-05-28T10:00:00.000Z',
    reactions: { heart: 5, celebrate: 2, support: 3 },
    comments: [
      {
        id: 1,
        text: 'Trying the frozen washcloth tonight!',
        author: 'NewMom23',
        timestamp: '2026-05-29T14:00:00.000Z',
      },
    ],
  },
  {
    id: 'memory-seed-smile',
    type: 'milestone',
    title: 'First Real Smile',
    content: 'She smiled at her dad during tummy time today — we both cried a little.',
    babyAge: '2 months',
    tags: ['milestone', 'smile'],
    createdAt: '2026-05-25T09:00:00.000Z',
    reactions: { heart: 8, celebrate: 4, support: 1 },
    comments: [],
  },
];

function loadLocalMemories() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {
    /* use seed */
  }
  return SEED_MEMORIES;
}

async function fetchPublishedMemories() {
  const { data: rows, error } = await supabase
    .from('community_memories')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });

  if (error || !rows?.length) return [];

  const ids = rows.map((r) => r.id);
  const { data: commentRows } = await supabase
    .from('community_memory_comments')
    .select('*')
    .in('memory_id', ids)
    .order('created_at');

  /** @type {Record<string, import('../types/community').MemoryComment[]>} */
  const byMemory = {};
  for (const comment of commentRows || []) {
    if (!byMemory[comment.memory_id]) byMemory[comment.memory_id] = [];
    byMemory[comment.memory_id].push({
      id: comment.id,
      text: comment.text,
      author: comment.author_name,
      timestamp: comment.created_at,
    });
  }

  return rows.map((row) => {
    const memory = rowToMemory(
      { ...row, id: row.legacy_id || row.id },
      byMemory[row.id] || [],
    );
    memory._dbId = row.id;
    memory._fromSupabase = true;
    return memory;
  });
}

export function useMemories() {
  const { user, profile } = useAuth();
  const [memories, setMemories] = useState(loadLocalMemories);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const remote = await fetchPublishedMemories();
      if (!cancelled) {
        if (remote.length) {
          setMemories(mergeCommunityMemories(remote, loadLocalMemories()));
        }
        setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const localOnly = localOnlyMemories(memories);
    if (localOnly.length) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(localOnly));
    }
  }, [memories]);

  /** @param {Omit<import('../types/community').Memory, 'id' | 'createdAt' | 'reactions' | 'comments'> & { tags?: string[] }} memory */
  const addMemory = useCallback(async (memory) => {
    if (user?.id) {
      setSubmitStatus(null);
      const { error } = await supabase.from('community_memories').insert({
        type: memory.type,
        title: memory.title,
        content: memory.content,
        baby_age: memory.babyAge ?? null,
        tags: memory.tags ?? [],
        author_id: user.id,
        author_name: profile?.display_name || user.email?.split('@')[0] || 'Member',
        status: 'pending',
      });

      if (error) {
        setSubmitStatus({ type: 'error', message: error.message });
        return { ok: false };
      }

      setSubmitStatus({
        type: 'pending',
        message: 'Thanks! Your post is pending review and will appear in the feed once approved.',
      });
      return { ok: true, pending: true };
    }

    setMemories((prev) => [createCommunityMemoryRecord(memory), ...prev]);
    setSubmitStatus(null);
    return { ok: true, pending: false };
  }, [user, profile]);

  /** @param {string} memoryId @param {string} text @param {string} [author] */
  const addComment = useCallback(async (memoryId, text, author = 'You') => {
    const target = memories.find((m) => m.id === memoryId);
    if (target?._fromSupabase && target._dbId && user?.id) {
      const { data, error } = await supabase
        .from('community_memory_comments')
        .insert({
          memory_id: target._dbId,
          text,
          author_name: author,
        })
        .select()
        .single();

      if (!error && data) {
        setMemories((prev) =>
          prev.map((m) =>
            m.id === memoryId
              ? {
                  ...m,
                  comments: [
                    ...m.comments,
                    {
                      id: data.id,
                      text: data.text,
                      author: data.author_name,
                      timestamp: data.created_at,
                    },
                  ],
                }
              : m,
          ),
        );
      }
      return;
    }

    setMemories((prev) =>
      prev.map((m) =>
        m.id === memoryId
          ? {
              ...m,
              comments: [
                ...m.comments,
                {
                  id: Date.now(),
                  text,
                  author,
                  timestamp: new Date().toISOString(),
                },
              ],
            }
          : m,
      ),
    );
  }, [memories, user]);

  /** @param {string} memoryId @param {'heart' | 'celebrate' | 'support'} reactionType */
  const reactToMemory = useCallback(async (memoryId, reactionType) => {
    const target = memories.find((m) => m.id === memoryId);
    const dbId = target?._dbId || (isCommunityMemoryUuid(memoryId) ? memoryId : null);

    if (dbId) {
      await supabase.rpc('react_to_community_memory', {
        p_memory_id: dbId,
        p_reaction: reactionType,
      });
    }

    setMemories((prev) =>
      prev.map((m) =>
        m.id === memoryId
          ? {
              ...m,
              reactions: {
                ...m.reactions,
                [reactionType]: m.reactions[reactionType] + 1,
              },
            }
          : m,
      ),
    );
  }, [memories]);

  const deleteMemory = useCallback((memoryId) => {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId && !m._fromSupabase));
  }, []);

  const refreshMemories = useCallback(async () => {
    const remote = await fetchPublishedMemories();
    if (remote.length) {
      setMemories(mergeCommunityMemories(remote, loadLocalMemories()));
    }
  }, []);

  return {
    memories,
    loading,
    addMemory,
    addComment,
    reactToMemory,
    deleteMemory,
    submitStatus,
    refreshMemories,
    clearSubmitStatus: () => setSubmitStatus(null),
  };
}
