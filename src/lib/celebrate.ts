import confetti from 'canvas-confetti'
import { readConfettiColors } from '@/lib/theme'

/** Small confetti burst from the middle of `element`. Does nothing with reduced motion. */
export function celebrate(element: Element | null): void {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const rect = element?.getBoundingClientRect()
  const origin = rect
    ? {
        x: (rect.left + rect.width / 2) / window.innerWidth,
        y: (rect.top + rect.height / 2) / window.innerHeight,
      }
    : { x: 0.5, y: 0.5 }
  void confetti({
    particleCount: 40,
    spread: 60,
    startVelocity: 25,
    scalar: 0.8,
    ticks: 120,
    colors: readConfettiColors(),
    origin,
  })
}
