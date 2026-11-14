export const INTRO_DURATION = 30_000;
export const SCENES = [
  { start: 0, end: 4000, id: 'unknown', name: '' },
  { start: 4000, end: 8000, id: 'earth', name: '' },
  { start: 8000, end: 12000, id: 'radar', name: '' },
  { start: 12000, end: 13000, id: 'nishit', name: 'NISHIT' },
  { start: 13000, end: 14000, id: 'nikhil', name: 'NIKHIL (RAVANA)' },
  { start: 14000, end: 15000, id: 'saunak', name: 'SAUNAK' },
  { start: 15000, end: 16000, id: 'srayan', name: 'SRAYAN' },
  { start: 16000, end: 17000, id: 'soham', name: 'SOHAM' },
  { start: 17000, end: 19000, id: 'flood', name: '' },
  { start: 19000, end: 21000, id: 'wetland', name: '' },
  { start: 21000, end: 23000, id: 'surface', name: '' },
  { start: 23000, end: 27000, id: 'revelation', name: "GOD'S EYE" },
  { start: 27000, end: 30000, id: 'initialize', name: "GOD'S EYE" },
] as const;
export const CREW = SCENES.filter((scene) => ['nishit', 'nikhil', 'saunak', 'srayan', 'soham'].includes(scene.id));
export function sceneAt(ms: number) {
  return SCENES.findIndex((scene) => ms >= scene.start && ms < scene.end);
}
export function introFinished(ms: number) { return ms >= INTRO_DURATION; }