import { Trash2, Wand2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { celebrate } from '@/lib/celebrate'
import { cn } from '@/lib/utils'
import type { FamilyMember, Task } from '../model'
import { DelegateBubbles } from './DelegateBubbles'

type TaskCardProps = {
  task: Task
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onAssign?: (id: string, assignee: FamilyMember | null) => void
}

export function TaskCard({ task, onToggle, onRemove, onAssign }: TaskCardProps) {
  const { id, title, done, assignee } = task
  const checkboxRef = useRef<HTMLButtonElement>(null)
  const delegateRef = useRef<HTMLButtonElement>(null)
  const [delegating, setDelegating] = useState<{ x: number; y: number } | null>(null)

  function handleToggle() {
    if (!done) celebrate(checkboxRef.current)
    onToggle(id)
  }

  function openBubbles() {
    const rect = delegateRef.current?.getBoundingClientRect()
    setDelegating(
      rect
        ? { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
        : { x: window.innerWidth / 2, y: window.innerHeight / 2 },
    )
  }

  function closeBubbles() {
    setDelegating(null)
    delegateRef.current?.focus()
  }

  function handlePick(name: FamilyMember) {
    onAssign?.(id, name)
    closeBubbles()
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
      <div className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <span
          className={cn(
            'relative min-w-0 max-w-full break-words [overflow-wrap:anywhere] text-base leading-relaxed',
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
        <AnimatePresence initial={false}>
          {assignee && (
            <motion.div
              key="assignee"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            >
              <Badge variant="secondary" className="gap-1 pr-1 font-heading">
                {assignee}
                <button
                  type="button"
                  onClick={() => onAssign?.(id, null)}
                  aria-label={`Zuordnung «${assignee}» entfernen`}
                  className="flex size-5 items-center justify-center rounded-full transition-look hover:bg-background"
                >
                  <X className="size-3" />
                </button>
              </Badge>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Button
        ref={delegateRef}
        variant="ghost"
        size="icon"
        onClick={openBubbles}
        aria-label={`«${title}» delegieren`}
        className="opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Wand2 className="size-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(id)}
        aria-label={`«${title}» löschen`}
        className="opacity-60 transition-look group-hover:opacity-100 focus-visible:opacity-100"
      >
        <Trash2 className="size-4" />
      </Button>
      {delegating &&
        createPortal(
          <DelegateBubbles
            title={title}
            origin={delegating}
            onPick={handlePick}
            onClose={closeBubbles}
          />,
          document.body,
        )}
    </motion.li>
  )
}
