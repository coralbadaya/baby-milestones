import { describe, expect, it } from 'vitest';
import {
  assignLayouts,
  composeSpread,
  layoutPlayerScript,
  previousSpreadIndex,
  walkSpreads,
} from './pageLayouts';

const photo = (title) => ({ title, file: title + '.jpg' });

describe('page layouts', () => {
  it('pairs a photograph with its story on opposite pages', () => {
    const spread = composeSpread([photo('One')], 0, 'photo-story');
    expect(spread.left.role).toBe('photo');
    expect(spread.right.role).toBe('story');
    expect(spread.take).toBe(1);
  });

  it('uses two photographs for a facing spread and for two photos beside the words', () => {
    const pages = [photo('One'), photo('Two')];
    const facing = composeSpread(pages, 0, 'facing');
    expect(facing.left.page.title).toBe('One');
    expect(facing.right.page.title).toBe('Two');
    expect(facing.take).toBe(2);
    const pair = composeSpread(pages, 0, 'pair');
    expect(pair.left.role).toBe('pair');
    expect(pair.left.extra.title).toBe('Two');
    expect(pair.right.role).toBe('story');
  });

  it('does not spend the closing page as a second photograph', () => {
    const pages = [photo('One'), { ending: true, title: 'Close' }];
    const spread = composeSpread(pages, 0, 'facing');
    expect(spread.id).toBe('photo-story');
    expect(spread.take).toBe(1);
  });

  it('walks back to the start of the previous spread', () => {
    const pages = assignLayouts([
      photo('A'),
      photo('B'),
      photo('C'),
      photo('D'),
      photo('E'),
      { ending: true, title: 'Close' },
    ]);
    const starts = walkSpreads(pages).map((spread) => spread.index);
    expect(starts).toEqual([0, 1, 2, 4, 5]);
    expect(previousSpreadIndex(pages, starts[2])).toBe(starts[1]);
    expect(pages.map((page) => page.layout).filter(Boolean)).toEqual([
      'chapter',
      'photo-story',
      'facing',
      'story-photo',
      'chapter',
    ]);
  });

  it('ships the same layouts into the standalone album', () => {
    const script = layoutPlayerScript();
    expect(script).toContain('facing');
    expect(script).toContain('pair');
    expect(script).not.toContain('`');
    const api = new Function(script + '\nreturn { composeSpread, previousSpreadIndex };')();
    const spread = api.composeSpread([photo('One'), photo('Two')], 0, 'facing');
    expect(spread.take).toBe(2);
    expect(spread.right.page.title).toBe('Two');
  });
});
