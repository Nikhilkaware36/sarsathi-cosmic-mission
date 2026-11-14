import { describe, expect, it } from 'vitest';
import { INTRO_DURATION, SCENES, sceneAt, introFinished } from './timeline';

describe('Requested cinematic timing', () => {
  it('finishes at exactly 25 seconds, never before', () => {
    expect(INTRO_DURATION).toBe(25000);
    expect(introFinished(24999)).toBe(false);
    expect(introFinished(25000)).toBe(true);
    expect(sceneAt(25000)).toBe(-1);
  });
  for (const [name, start] of [['NISHIT', 3000], ['NIKHIL (RAVANA)', 6000], ['SAUNAK', 9000], ['SRAYAN', 12000], ['SOHAM', 15000]] as const) {
    it(`${name} has precisely its requested three-second slot`, () => {
      const index = sceneAt(start);
      const scene = SCENES[index];
      expect(scene?.name).toBe(name);
      if (!scene) throw new Error('Missing required member scene');
      expect(scene.end - scene.start).toBe(3000);
      expect(sceneAt(start + 2999)).toBe(index);
      expect(sceneAt(start + 3000)).not.toBe(index);
    });
  }
  it('reserves 18–22 seconds for the team and 22–25 for the title', () => {
    expect(SCENES[sceneAt(18000)]?.id).toBe('team');
    expect(SCENES[sceneAt(21999)]?.id).toBe('team');
    expect(SCENES[sceneAt(22000)]?.id).toBe('title');
    expect(SCENES[sceneAt(24999)]?.id).toBe('title');
  });
});