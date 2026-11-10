import { describe, expect, it } from 'vitest'
import { FAMILY } from '@/features/tasks/model'
import { flightKeyframes, planFlights } from './bubbleFlights'

/** Deterministic random source for tests. */
function seeded(seed: number) {
  let value = seed
  return () => {
    value = (value * 16807) % 2147483647
    return (value - 1) / 2147483646
  }
}

describe('planFlights', () => {
  it('gives every name its own direction, start position and path', () => {
    const plan = planFlights(seeded(7))
    const entries = FAMILY.map((name) => plan[name])
    const angles = entries.map((p) => p.angle).sort((x, y) => x - y)
    // six directions all around: neighbours at least 30° apart, none twice
    angles.forEach((angle, i) => {
      const next = i === angles.length - 1 ? angles[0] + 360 : angles[i + 1]
      expect(next - angle).toBeGreaterThanOrEqual(30)
    })
    expect(entries.map((p) => p.order).sort()).toEqual([0, 1, 2, 3, 4, 5])
    expect(new Set(entries.map((p) => p.path)).size).toBe(6)
  })

  it('starts a different name first on different openings', () => {
    const firstOut = new Set(
      [1, 2, 3, 4, 5, 6, 7, 8].map((seed) => {
        const plan = planFlights(seeded(seed))
        return FAMILY.find((name) => plan[name].order === 0)
      }),
    )
    expect(firstOut.size).toBeGreaterThan(1)
  })

  it('flies from the click point outwards until it is off screen', () => {
    const { x, y } = flightKeyframes(0, { width: 1000, height: 800 })
    expect(x[0]).toBe(0)
    expect(y[0]).toBe(0)
    expect(x[1]).toBe(120)
    expect(x.at(-1)!).toBeGreaterThan(Math.hypot(1000, 800))
    expect(x).toEqual([...x].sort((a, b) => a - b))
  })
})
