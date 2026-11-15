import { describe, expect, it } from 'vitest';
import { CURL_STRIPS, FOLD_MS, FOLD_POSES, curlAngles, curlLift, curlPose, foldPlayerScript, poseAt, poseTransform } from './pageFold';

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
    expect(script).toContain('CURL_STRIPS');
    expect(script).toContain('function curlPose');
    expect(script).toContain('function curlPose');
    expect(script).not.toContain('`');
  });

  it('bends the sheet across many strips, edge ahead of the spine', () => {
    expect(CURL_STRIPS).toBeGreaterThanOrEqual(12);
    expect(curlAngles(0)[0]).toBe(0);
    expect(curlAngles(1).every((angle) => angle === 180)).toBe(true);
    const mid = curlAngles(0.5);
    expect(mid).toHaveLength(CURL_STRIPS);
    expect(mid[mid.length - 1] - mid[0]).toBeGreaterThan(30);
    expect(Math.max(...curlAngles(0.72))).toBeLessThan(180);
    expect(curlLift(0.5)).toBeGreaterThan(30);
    expect(curlLift(0)).toBe(0);
    const flat = curlPose(0, 400);
    expect(flat[0]).toMatchObject({ angle: 0, x: 0, z: 0 });
    expect(flat[flat.length - 1].x).toBeGreaterThan(90);
    const curled = curlPose(0.5, 400);
    expect(Math.max(...curled.map((pose) => pose.z))).toBeGreaterThan(20);
    const laid = curlPose(1, 400);
    expect(laid.every((pose) => pose.angle === 180)).toBe(true);
    expect(laid[laid.length - 1].x).toBeLessThan(0);
  });
});
