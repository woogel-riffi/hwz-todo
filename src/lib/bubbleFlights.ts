import { FAMILY, type FamilyMember } from '@/features/tasks/model'

export type FlightPath = { seconds: number; sway: number[]; tilt: number[] }

/**
 * Six soap-bubble characters: own pace (s, at riseSeconds = 8), a sideways sway that
 * changes direction (px) and a gentle tilt (deg); sway and tilt loop back and forth.
 */
const PATHS: FlightPath[] = [
  { seconds: 8, sway: [0, 28, -14, 34, -6, 22, 4], tilt: [0, -4, 3, -2, 4, -3, 0] },
  { seconds: 9.5, sway: [0, -22, 18, -30, 12, -16, 8], tilt: [0, 3, -4, 2, -3, 4, 0] },
  { seconds: 7.5, sway: [0, 20, 40, 10, -18, 6, 24], tilt: [0, -3, -5, 2, 4, -2, 0] },
  { seconds: 9, sway: [0, -16, -36, -8, 22, 4, -12], tilt: [0, 4, 2, -3, -4, 3, 0] },
  { seconds: 8.5, sway: [0, -30, -12, -38, -20, -44, -28], tilt: [0, 2, -3, 4, -2, 3, 0] },
  { seconds: 10, sway: [0, 24, -10, 18, 36, 14, 30], tilt: [0, -2, 4, -4, 2, -3, 0] },
]

function shuffle<T>(items: readonly T[], random: () => number): T[] {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

export type FlightPlan = { angle: number; order: number; path: FlightPath }

/**
 * Random direction (degrees, 0 = right, 90 = down), start order and flight path for every
 * family member, new on each opening. Six directions all around, 60° apart, the whole
 * star turned at random and each direction shifted by up to ±15° (DESIGN.md, Rezept 10).
 */
export function planFlights(random: () => number = Math.random): Record<FamilyMember, FlightPlan> {
  const turn = random() * 360
  const angles = shuffle(
    FAMILY.map((_, i) => (turn + i * 60 + (random() - 0.5) * 30) % 360),
    random,
  )
  const orders = shuffle(
    FAMILY.map((_, i) => i),
    random,
  )
  const paths = shuffle(PATHS, random)
  return Object.fromEntries(
    FAMILY.map((name, i) => [name, { angle: angles[i], order: orders[i], path: paths[i] }]),
  ) as Record<FamilyMember, FlightPlan>
}

/** Pixels a bubble is blown out from the click point at the start. */
export const PUFF = 120

/** Seconds the puff takes; afterwards the bubble drifts on at an even speed. */
export const PUFF_SECONDS = 0.5

/**
 * Smooth flight (px, relative to the click point): a quick puff in direction `angle`,
 * then an even drift further out until well off screen, rising a little on the way.
 * The swaying and tilting runs separately on the bubble itself, so the flight never stutters.
 */
export function flightKeyframes(
  angle: number,
  screen: { width: number; height: number },
): { x: number[]; y: number[] } {
  const rad = (angle * Math.PI) / 180
  const dx = Math.cos(rad)
  const dy = Math.sin(rad)
  const far = Math.hypot(screen.width, screen.height) + 200
  const rise = screen.height * 0.3
  return {
    x: [0, Math.round(dx * PUFF), Math.round(dx * far)],
    y: [0, Math.round(dy * PUFF), Math.round(dy * far - rise)],
  }
}
