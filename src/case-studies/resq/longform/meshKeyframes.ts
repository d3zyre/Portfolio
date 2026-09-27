/**
 * Smart-Animate keyframes for B10a–B10e.
 *
 * The five Figma frames are one identically-named layer set — only opacity and
 * the coverage-ring size differ between them — so instead of five stacked
 * screens the web build renders the diagram once and interpolates these values
 * against scroll progress. Each array is [B10a, B10b, B10c, B10d, B10e].
 */

export const STEPS = [
  '01  ·  TOWERS CARRY EVERYTHING',
  '02  ·  THE WATER RISES',
  '03  ·  THE NETWORK IS GONE',
  '04  ·  PHONES FIND EACH OTHER',
  '05  ·  TWO ISLANDS, STILL CONNECTED',
]

/** Layer id → opacity at each keyframe. */
export const OPACITY: Record<string, number[]> = {
  ...fanOut('Backbone', 3, [1, 0.35, 0, 0, 0]),
  ...fanOut('Mesh', 9, [0, 0, 0, 0, 1]),
  ...fanOut('TowerGlow', 4, [1, 0.3, 0, 0, 0]),
  ...fanOut('Glow', 10, [0, 0, 0, 1, 1]),
  ...fanOut('Tower', 4, [1, 0.45, 0, 0, 0]),
  ...fanOut('TowerDead', 4, [0, 0.5, 0.28, 0.28, 0.28]),
}

/**
 * Tower coverage fades out through its gradient alpha in Figma (0.16 → 0.07 → 0)
 * rather than through layer opacity. Scaling the layer is equivalent, since every
 * stop is the same green.
 */
export const COVERAGE_OPACITY = [1, 0.44, 0, 0, 0]

/**
 * Phone markers are slate while the towers still work, then switch to the red
 * gradient once they start relaying for each other. A red copy of each phone is
 * built at runtime and cross-faded over the slate original.
 */
export const PHONE_LIVE = [0, 0, 0, 1, 1]

/** Stops of the red phone gradient, replacing the slate one stop for stop. */
export const PHONE_RED_STOPS: Array<[string, number]> = [
  ['#F0866E', 1],
  ['#D4351C', 1],
  ['#992311', 1],
]

/** Coverage rings shrink from 300px to 80px as the towers fail. */
export const COVERAGE_SCALE = [1, 0.64, 0.2667, 0.2667, 0.2667]

/** Centre of each coverage ring, so it scales in place rather than from a corner. */
export const COVERAGE_CENTRES: Array<[number, number]> = [
  [250, 150],
  [500, 300],
  [820, 130],
  [1080, 300],
]

/**
 * Layers that appear together in Figma get a small per-index delay here — nine
 * mesh links snapping on at the same instant reads as a cut, not a transition.
 */
export const STAGGER = 0.055

function fanOut(prefix: string, count: number, values: number[]) {
  const out: Record<string, number[]> = {}
  for (let i = 0; i < count; i++) out[`${prefix} ${i}`] = values
  return out
}
