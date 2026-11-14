export const INTRO_DURATION = 25_000;
export const SCENES = [
  { start: 0, end: 3000, id: 'opening', name: '' },
  { start: 3000, end: 6000, id: 'nishit', name: 'NISHIT' },
  { start: 6000, end: 9000, id: 'nikhil', name: 'NIKHIL (RAVANA)' },
  { start: 9000, end: 12000, id: 'saunak', name: 'SAUNAK' },
  { start: 12000, end: 15000, id: 'srayan', name: 'SRAYAN' },
  { start: 15000, end: 18000, id: 'soham', name: 'SOHAM' },
  { start: 18000, end: 22000, id: 'team', name: 'TEAM DRISHTI' },
  { start: 22000, end: 25000, id: 'title', name: 'SARSATHI' },
] as const;
export function sceneAt(ms: number) {
  return SCENES.findIndex((scene) => ms >= scene.start && ms < scene.end);
}
export function introFinished(ms: number) { return ms >= INTRO_DURATION; }