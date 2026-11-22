import { describe, it, expect } from 'vitest';
import diyActivities from '../data/diyActivities';
import {
  currentRangeItems,
  difficultyRank,
  durationMinutes,
  orderForCarousel,
} from './smartCarouselOrder';

describe('durationMinutes', () => {
  it('reads the first number', () => {
    expect(durationMinutes('5–10 min')).toBe(5);
    expect(durationMinutes('2–3 min, 4× daily')).toBe(2);
  });

  it('ranks missing duration last', () => {
    expect(durationMinutes(null)).toBe(Number.POSITIVE_INFINITY);
  });
});

describe('difficultyRank', () => {
  it('orders Easy before Medium and Hard', () => {
    expect(difficultyRank('Easy')).toBeLessThan(difficultyRank('Medium'));
    expect(difficultyRank('Medium')).toBeLessThan(difficultyRank('Hard'));
  });
});

describe('orderForCarousel', () => {
  const items = [
    { id: 'a', category: 'sensory', difficulty: 'Easy', duration: '10 min' },
    { id: 'b', category: 'sensory', difficulty: 'Easy', duration: '8 min' },
    { id: 'c', category: 'sensory', difficulty: 'Medium', duration: '5 min' },
    { id: 'd', category: 'motor', difficulty: 'Easy', duration: '3 min' },
    { id: 'e', category: 'bonding', difficulty: 'Easy', duration: '15 min' },
  ];

  it('starts on the easiest then shortest', () => {
    const ordered = orderForCarousel(items);
    expect(ordered[0].id).toBe('d');
  });

  it('does not run the same category twice when another remains', () => {
    const cats = orderForCarousel(items).map((item) => item.category);
    for (let i = 1; i < cats.length; i += 1) {
      if (cats.slice(i).some((cat) => cat !== cats[i - 1])) {
        expect(cats[i]).not.toBe(cats[i - 1]);
      }
    }
  });

  it('keeps a single item', () => {
    expect(orderForCarousel([items[0]])).toEqual([items[0]]);
  });

  it('starts month 1 DIY on the shortest easy activity', () => {
    const month1 = diyActivities.find((row) => row.month === 1).activities;
    expect(orderForCarousel(month1)[0].id).toBe('m1-2');
  });
});

describe('currentRangeItems', () => {
  it('returns items not in the previous list', () => {
    const prev = [{ id: 'a' }, { id: 'b' }];
    const current = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
    expect(currentRangeItems(current, prev).map((item) => item.id)).toEqual(['c']);
  });
});
