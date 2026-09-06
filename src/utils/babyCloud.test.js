import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  ensurePrimaryBabyProfile,
  isUniqueViolation,
  resetEnsurePrimaryInflight,
  seedPatchForEmptyProfile,
} from './babyCloud';

vi.mock('./supabaseClient', () => ({
  supabase: { from: () => { throw new Error('use the injected client'); } },
}));

function createClient(store) {
  return {
    from() {
      const filters = {};
      const builder = {
        select() { return builder; },
        eq(col, val) { filters[col] = val; return builder; },
        order() { return builder; },
        limit() { return builder; },
        maybeSingle: async () => {
          const row = store.rows.find((r) => (
            Object.entries(filters).every(([k, v]) => r[k] === v)
          )) || null;
          return { data: row, error: null };
        },
        insert(payload) {
          return {
            select() {
              return {
                single: async () => {
                  if (payload.is_primary && store.rows.some((r) => r.user_id === payload.user_id && r.is_primary)) {
                    return { data: null, error: { code: '23505', message: 'duplicate key value violates unique constraint' } };
                  }
                  const row = {
                    id: `id-${store.seq += 1}`,
                    name: 'Baby',
                    birth_date: null,
                    is_primary: true,
                    ...payload,
                  };
                  store.rows.push(row);
                  store.inserts += 1;
                  return { data: row, error: null };
                },
              };
            },
          };
        },
        update(patch) {
          return {
            eq: async (col, val) => {
              const row = store.rows.find((r) => r[col] === val);
              if (row) Object.assign(row, patch);
              store.updates += 1;
              return { error: null };
            },
          };
        },
      };
      return builder;
    },
  };
}

function emptyStore() {
  return { rows: [], seq: 0, inserts: 0, updates: 0 };
}

describe('babyCloud', () => {
  beforeEach(() => {
    resetEnsurePrimaryInflight();
  });

  it('detects unique violations', () => {
    expect(isUniqueViolation({ code: '23505' })).toBe(true);
    expect(isUniqueViolation({ message: 'duplicate key value' })).toBe(true);
    expect(isUniqueViolation({ code: '42501' })).toBe(false);
  });

  it('only seeds empty cloud name and birth date', () => {
    expect(seedPatchForEmptyProfile(
      { name: 'Baby', birth_date: null },
      { name: 'Luna', birthDate: '2026-05-01' },
    )).toEqual({ name: 'Luna', birth_date: '2026-05-01' });

    expect(seedPatchForEmptyProfile(
      { name: 'Aria', birth_date: '2024-01-01' },
      { name: 'Luna', birthDate: '2026-05-01' },
    )).toBeNull();
  });

  it('creates one primary row when two callers race', async () => {
    const store = emptyStore();
    const client = createClient(store);

    const [a, b] = await Promise.all([
      ensurePrimaryBabyProfile('user-1', {}, client),
      ensurePrimaryBabyProfile('user-1', { name: 'Luna', birthDate: '2026-05-01' }, client),
    ]);

    expect(store.inserts).toBe(1);
    expect(store.rows).toHaveLength(1);
    expect(a.id).toBe(b.id);
    expect(b.birth_date).toBe('2026-05-01');
    expect(b.name).toBe('Luna');
    expect(store.rows[0].birth_date).toBe('2026-05-01');
  });

  it('retries on unique violation and applies local seed', async () => {
    const store = emptyStore();
    store.rows.push({
      id: 'existing',
      user_id: 'user-1',
      name: 'Baby',
      birth_date: null,
      is_primary: true,
    });
    const client = createClient(store);

    const profile = await ensurePrimaryBabyProfile(
      'user-1',
      { name: 'Luna', birthDate: '2026-05-01' },
      client,
    );

    expect(store.inserts).toBe(0);
    expect(profile.id).toBe('existing');
    expect(profile.birth_date).toBe('2026-05-01');
    expect(profile.name).toBe('Luna');
  });

  it('recovers when insert loses the unique race', async () => {
    const store = emptyStore();
    let selects = 0;
    const client = {
      from() {
        const filters = {};
        const builder = {
          select() { return builder; },
          eq(col, val) { filters[col] = val; return builder; },
          order() { return builder; },
          limit() { return builder; },
          maybeSingle: async () => {
            selects += 1;
            if (selects === 1) return { data: null, error: null };
            const row = store.rows.find((r) => (
              Object.entries(filters).every(([k, v]) => r[k] === v)
            )) || null;
            return { data: row, error: null };
          },
          insert() {
            return {
              select() {
                return {
                  single: async () => {
                    store.rows.push({
                      id: 'raced',
                      user_id: 'user-1',
                      name: 'Baby',
                      birth_date: null,
                      is_primary: true,
                    });
                    return { data: null, error: { code: '23505', message: 'duplicate key' } };
                  },
                };
              },
            };
          },
          update(patch) {
            return {
              eq: async (col, val) => {
                const row = store.rows.find((r) => r[col] === val);
                if (row) Object.assign(row, patch);
                return { error: null };
              },
            };
          },
        };
        return builder;
      },
    };

    const profile = await ensurePrimaryBabyProfile(
      'user-1',
      { birthDate: '2026-05-01' },
      client,
    );
    expect(profile.id).toBe('raced');
    expect(profile.birth_date).toBe('2026-05-01');
  });
});
