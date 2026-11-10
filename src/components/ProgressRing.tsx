import { motion } from 'motion/react'

type ProgressRingProps = {
  done: number
  total: number
}

const RADIUS = 30
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function ProgressRing({ done, total }: ProgressRingProps) {
  const share = total === 0 ? 0 : done / total
  const strokeDashoffset = CIRCUMFERENCE * (1 - share)

  return (
    <div role="img" aria-label={`${done} von ${total} erledigt`} className="relative size-18 shrink-0">
      <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden className="-rotate-90">
        <circle cx="36" cy="36" r={RADIUS} strokeWidth={8} fill="none" className="stroke-muted" />
        <motion.circle
          cx="36"
          cy="36"
          r={RADIUS}
          strokeWidth={8}
          fill="none"
          strokeLinecap="round"
          className="stroke-accent"
          strokeDasharray={CIRCUMFERENCE}
          initial={false}
          animate={{ strokeDashoffset }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </svg>
      <span
        aria-hidden
        className="absolute inset-0 flex items-center justify-center font-mono text-sm font-semibold"
      >
        {done}/{total}
      </span>
    </div>
  )
}
