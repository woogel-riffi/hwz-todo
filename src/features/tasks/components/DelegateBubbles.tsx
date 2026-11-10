import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState, type MouseEvent } from 'react'
import { cn } from '@/lib/utils'
import { flightKeyframes, planFlights, PUFF_SECONDS } from '@/lib/bubbleFlights'
import { FAMILY, type FamilyMember } from '../model'

type DelegateBubblesProps = {
  title: string
  /** Click point in px (middle of the wand button); bubbles are blown out from here. */
  origin?: { x: number; y: number }
  onPick: (name: FamilyMember) => void
  onClose: () => void
  /** Reference flight time in seconds; every path scales with it (default 8). */
  riseSeconds?: number
  /** Seconds between two bubbles starting. */
  staggerSeconds?: number
  /** Random source, replaceable in tests. */
  random?: () => number
}

const POP_MS = 250

export function DelegateBubbles({
  title,
  origin,
  onPick,
  onClose,
  riseSeconds = 14,
  staggerSeconds = 0.15,
  random = Math.random,
}: DelegateBubblesProps) {
  const [plan] = useState(() => planFlights(random))
  const [start] = useState(() => origin ?? { x: window.innerWidth / 2, y: window.innerHeight - 80 })
  const [screenSize] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }))
  const [popped, setPopped] = useState<FamilyMember | null>(null)
  const escaped = useRef(new Set<FamilyMember>())
  const firstRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    firstRef.current?.focus({ preventScroll: true })
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  useEffect(() => {
    if (!popped) return
    const timer = window.setTimeout(() => onPick(popped), reduceMotion ? 0 : POP_MS)
    return () => window.clearTimeout(timer)
  }, [popped, onPick, reduceMotion])

  function handleBackdropClick(event: MouseEvent<HTMLDivElement>) {
    if (event.target === event.currentTarget) onClose()
  }

  /** Seconds a bubble needs to leave the screen; slow, and different for every bubble. */
  function flightSeconds(name: FamilyMember): number {
    return (plan[name].path.seconds * riseSeconds) / 8
  }

  /** Endless, smooth back-and-forth for swaying and tilting. */
  function swayLoop(name: FamilyMember) {
    return {
      duration: plan[name].path.seconds * 0.6,
      repeat: Infinity,
      repeatType: 'mirror' as const,
      ease: 'easeInOut' as const,
      delay: plan[name].order * staggerSeconds,
    }
  }

  function handleEscaped(name: FamilyMember) {
    if (popped) return
    escaped.current.add(name)
    if (escaped.current.size === FAMILY.length) onClose()
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Aufgabe delegieren"
      onClick={handleBackdropClick}
      className="cursor-wand fixed inset-0 z-50 flex flex-col items-center justify-start gap-6 overflow-hidden px-4 pt-6"
    >
      <p className="glass max-w-xl break-words [overflow-wrap:anywhere] rounded-full border px-5 py-2 text-center font-heading text-lg text-foreground shadow-card">
        Wer übernimmt «{title}»?
      </p>
      <ul
        className={cn(
          reduceMotion
            ? 'mt-auto mb-24 flex max-w-xl flex-wrap justify-center gap-4'
            : 'pointer-events-none absolute inset-0 overflow-hidden',
        )}
      >
        {/* Own presence scope: the task list skips start animations, the bubbles must not. */}
        <AnimatePresence>
          {FAMILY.map((name, index) => {
            const state = popped === null ? 'idle' : popped === name ? 'popped' : 'faded'
            return (
              <li
                key={name}
                className={reduceMotion ? undefined : 'absolute -mt-12 -ml-12'}
                style={reduceMotion ? undefined : { left: start.x, top: start.y }}
              >
                {/* Outer layer: the smooth flight away from the click point. */}
                <motion.div
                  initial={reduceMotion ? false : { x: 0, y: 0 }}
                  animate={reduceMotion ? undefined : flightKeyframes(plan[name].angle, screenSize)}
                  transition={{
                    duration: flightSeconds(name),
                    times: [0, PUFF_SECONDS / flightSeconds(name), 1],
                    ease: ['easeOut', 'linear'],
                    delay: plan[name].order * staggerSeconds,
                  }}
                  onAnimationComplete={() => {
                    if (!reduceMotion) handleEscaped(name)
                  }}
                >
                  {/* Inner layer: appear, sway and tilt back and forth, pop. */}
                  <motion.button
                    ref={index === 0 ? firstRef : undefined}
                    type="button"
                    disabled={popped !== null}
                    onClick={() => setPopped(name)}
                    initial={reduceMotion ? { opacity: 1 } : { scale: 0.4, opacity: 0 }}
                    animate={
                      state === 'popped'
                        ? { scale: 1.6, opacity: 0, transition: { duration: 0.25 } }
                        : state === 'faded'
                          ? { opacity: 0, transition: { duration: 0.2 } }
                          : reduceMotion
                            ? { opacity: 1 }
                            : {
                                scale: 1,
                                opacity: 1,
                                x: plan[name].path.sway,
                                rotate: plan[name].path.tilt,
                              }
                    }
                    transition={{
                      delay: plan[name].order * staggerSeconds,
                      scale: { duration: PUFF_SECONDS, ease: 'easeOut' },
                      opacity: { duration: PUFF_SECONDS / 2 },
                      x: swayLoop(name),
                      rotate: swayLoop(name),
                    }}
                    className="bubble pointer-events-auto flex size-24 items-center justify-center rounded-full font-heading text-sm font-semibold text-foreground"
                  >
                    <span className="animate-float">{name}</span>
                  </motion.button>
                </motion.div>
              </li>
            )
          })}
        </AnimatePresence>
      </ul>
    </div>
  )
}
