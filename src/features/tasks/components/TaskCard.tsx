import { Trash2 } from 'lucide-react'
import { motion } from 'motion/react'
import { useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { celebrate } from '@/lib/celebrate'
import { cn } from '@/lib/utils'
import type { Task } from '../model'

type TaskCardProps = {
  task: Task
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function TaskCard({ task, onToggle, onRemove }: TaskCardProps) {
  const { id, title, done } = task
  const checkboxRef = useRef<HTMLButtonElement>(null)

  function handleToggle() {
    if (!done) celebrate(checkboxRef.current)
    onToggle(id)
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: -12, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.9, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 500, damping: 35 }}
      className="group glass flex min-w-0 items-start gap-3 rounded-xl border p-4 shadow-card transition-look hover:-translate-y-0.5 hover:shadow-pop focus-within:glow"
    >
      <Checkbox
        ref={checkboxRef}
        checked={done}
        onCheckedChange={handleToggle}
        aria-label={`«${title}» erledigt`}
        className="mt-0.5 size-6 rounded-md transition-look data-[state=checked]:animate-pop data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground"
      />
      <span
        className={cn(
          'relative min-w-0 flex-1 break-words [overflow-wrap:anywhere] text-base leading-relaxed',
          done && 'text-muted-foreground',
        )}
      >
        {title}
        <motion.span
          aria-hidden
          className="absolute left-0 top-1/2 h-0.5 w-full origin-left bg-current"
          initial={false}
          animate={{ scaleX: done ? 1 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        />
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(id)}
        aria-label={`«${title}» löschen`}
        className="opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Trash2 className="size-4" />
      </Button>
    </motion.li>
  )
}
