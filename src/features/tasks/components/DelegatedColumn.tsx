import { useId } from 'react'
import { Badge } from '@/components/ui/badge'
import type { FamilyMember, Task } from '../model'
import { TaskList } from './TaskList'

type DelegatedColumnProps = {
  tasks: Task[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onAssign: (id: string, assignee: FamilyMember | null) => void
}

export function DelegatedColumn({ tasks, onToggle, onRemove, onAssign }: DelegatedColumnProps) {
  const headingId = useId()
  return (
    <section
      aria-labelledby={headingId}
      className="glass flex min-h-64 min-w-0 flex-col gap-3 rounded-2xl border p-3 transition-look"
    >
      <div className="flex items-center justify-between gap-3 px-1">
        <h2 id={headingId} className="font-heading text-lg">
          Delegiert 😄
        </h2>
        <Badge variant="secondary" className="font-mono">
          {tasks.length}
        </Badge>
      </div>
      {tasks.length === 0 ? (
        <p className="px-1 text-muted-foreground">Noch nichts delegiert.</p>
      ) : (
        <TaskList tasks={tasks} onToggle={onToggle} onRemove={onRemove} onAssign={onAssign} />
      )}
    </section>
  )
}
