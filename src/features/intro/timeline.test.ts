import { describe, expect, it } from 'vitest';
import { INTRO_DURATION, SCENES, sceneAt, introFinished } from './timeline';

describe('Requested cinematic timing', () => {
  it('finishes at exactly 30 seconds, never before', () => {
    expect(INTRO_DURATION).toBe(30000);
    expect(introFinished(29999)).toBe(false);
    expect(introFinished(30000)).toBe(true);
    expect(sceneAt(30000)).toBe(-1);
  });
  for (const [name, start] of [['NISHIT', 12000], ['NIKHIL (RAVANA)', 13000], ['SAUNAK', 14000], ['SRAYAN', 15000], ['SOHAM', 16000]] as const) {
    it(`${name} has precisely its requested one-second slot`, () => {
      const index = sceneAt(start);
      const scene = SCENES[index];
      expect(scene?.name).toBe(name);
      if (!scene) throw new Error('Missing required member scene');
      expect(scene.end - scene.start).toBe(1000);
      expect(sceneAt(start + 999)).toBe(index);
      expect(sceneAt(start + 1000)).not.toBe(index);
    });
  }
  for (const [id,start,end] of [['unknown',0,4000],['earth',4000,8000],['radar',8000,12000],['flood',17000,19000],['wetland',19000,21000],['surface',21000,23000],['revelation',23000,27000],['initialize',27000,30000]] as const) {
    it(`${id} occupies its exact requested boundary`, () => {
      expect(SCENES[sceneAt(start)]?.id).toBe(id);
      expect(SCENES[sceneAt(end-1)]?.id).toBe(id);
      expect(SCENES[sceneAt(end)]?.id).not.toBe(id);
    });
  }
});