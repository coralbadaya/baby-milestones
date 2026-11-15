import { describe, expect, it } from 'vitest';
import { PAGE_TURN_PLAYGROUND_ALBUM, PROGRESS_SAMPLE_MS } from '../../../data/pageTurnPlaygroundAlbum.js';
import { buildScenarioCatalog, runLogicScenario } from './scenarioCatalog.js';
import { getSheetPose } from '../../../book/engine/index.js';

describe('page turn QA catalog', () => {
  const catalog = buildScenarioCatalog(PAGE_TURN_PLAYGROUND_ALBUM.pages);
  const logic = catalog.filter((s) => s.kind === 'logic');

  it('defines logic, stage, and manual scenarios', () => {
    expect(catalog.length).toBeGreaterThan(30);
    expect(logic.length).toBeGreaterThan(15);
    expect(catalog.some((s) => s.kind === 'stage')).toBe(true);
    expect(catalog.some((s) => s.kind === 'manual')).toBe(true);
  });

  it('runs every logic scenario to completion', async () => {
    const rows = [];
    for (const scenario of logic) {
      const row = await runLogicScenario(scenario);
      rows.push(row);
      expect(row.status, scenario.id).toBe('pass');
    }
  });

  it('sheet samples at documentation ms values', () => {
    PROGRESS_SAMPLE_MS.forEach((ms) => {
      const pose = getSheetPose(ms / 1900);
      expect(pose.progress).toBeGreaterThanOrEqual(0);
      expect(pose.progress).toBeLessThanOrEqual(1);
    });
    expect(getSheetPose(950 / 1900).rotateY).toBe(-90);
  });
});