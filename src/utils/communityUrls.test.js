import { describe, it, expect } from 'vitest';
import { ROUTES } from '../routes';
import {
  communityItemPath,
  communityItemUrl,
  memoryMatchesPermalink,
  memoryPublicSlug,
  slugifyCommunityTitle,
} from './communityUrls';

describe('slugifyCommunityTitle', () => {
  it('kebabs titles and strips punctuation', () => {
    expect(slugifyCommunityTitle('First Real Smile!')).toBe('first-real-smile');
  });

  it('falls back when the title has no letters', () => {
    expect(slugifyCommunityTitle('!!!')).toBe('post');
  });
});

describe('memoryPublicSlug', () => {
  it('prefers slug, then legacy_id, then uuid', () => {
    expect(memoryPublicSlug({
      slug: 'first-real-smile',
      legacy_id: 'memory-seed-smile',
      id: '550e8400-e29b-41d4-a716-446655440000',
    })).toBe('first-real-smile');
    expect(memoryPublicSlug({
      slug: null,
      legacy_id: 'memory-seed-smile',
      id: '550e8400-e29b-41d4-a716-446655440000',
    })).toBe('memory-seed-smile');
    expect(memoryPublicSlug({
      slug: null,
      legacy_id: null,
      id: '550e8400-e29b-41d4-a716-446655440000',
    })).toBe('550e8400-e29b-41d4-a716-446655440000');
  });
});

describe('communityItemPath', () => {
  it('builds feed, recipe, and tip permalinks', () => {
    expect(communityItemPath('feed', 'first-real-smile')).toBe('/community/feed/first-real-smile');
    expect(communityItemPath('recipes', 'ragi-porridge')).toBe('/community/recipes/ragi-porridge');
    expect(communityItemPath('tips', 'baby-teething')).toBe('/community/tips/baby-teething');
  });

  it('falls back to the tab when slug is missing', () => {
    expect(communityItemPath('feed')).toBe(ROUTES.communityTab('feed'));
  });

  it('does not add an item segment under create', () => {
    expect(communityItemPath('create', 'anything')).toBe(ROUTES.communityTab('create'));
  });
});

describe('communityItemUrl', () => {
  it('prefixes origin when provided', () => {
    expect(communityItemUrl('feed', 'first-real-smile', 'https://yarntrails.com'))
      .toBe('https://yarntrails.com/community/feed/first-real-smile');
  });
});

describe('memoryMatchesPermalink', () => {
  it('matches public id or database uuid', () => {
    const memory = { id: 'first-real-smile', _dbId: '550e8400-e29b-41d4-a716-446655440000' };
    expect(memoryMatchesPermalink(memory, 'first-real-smile')).toBe(true);
    expect(memoryMatchesPermalink(memory, memory._dbId)).toBe(true);
    expect(memoryMatchesPermalink(memory, 'other')).toBe(false);
  });
});
