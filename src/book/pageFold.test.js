import { describe, expect, it } from 'vitest';
import { FOLD_MS, FOLD_POSES, foldPlayerScript, poseAt, poseTransform } from './pageFold';

describe('page fold', () => {
  it('holds four moving poses and a rest, over a slow turn', () => {
    expect(FOLD_POSES.filter((pose) => pose.t > 0)).toHaveLength(4);
    expect(FOLD_MS).toBeGreaterThan(1600);
  });

  it('starts flat, folds through the middle pose, and finishes turned over', () => {
    expect(poseAt(0).y).toBe(0);
    expect(poseAt(0.5).y).toBe(74);
    expect(poseAt(0.5).z).toBeGreaterThan(60);
    expect(poseAt(1).y).toBe(180);
    expect(poseAt(1).z).toBe(0);
  });

  it('lifts the page toward the camera while it folds forward', () => {
    const mid = poseTransform(poseAt(0.5), true);
    expect(mid).toContain('rotateY(-74deg)');
    expect(mid).toContain('translateZ(70px)');
    expect(poseTransform(poseAt(0.24), false)).toContain('rotateY(16deg)');
  });

  it('ships the same poses into the standalone album script', () => {
    const script = foldPlayerScript();
    expect(script).toContain('"t":0.5');
    expect(script).toContain('const FOLD_MS = 1900');
    expect(script).toContain('snowglobe');
    expect(script).not.toContain('`');
  });
});
