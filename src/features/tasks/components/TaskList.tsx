import { AnimatePresence } from 'motion/react'
import type { FamilyMember, Task } from '../model'
import { TaskCard } from './TaskCard'

type TaskListProps = {
  tasks: Task[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
  onAssign: (id: string, assignee: FamilyMember | null) => void
}

export function TaskList({ tasks, onToggle, onRemove, onAssign }: TaskListProps) {
  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false} mode="popLayout">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onToggle={onToggle}
            onRemove={onRemove}
            onAssign={onAssign}
          />
        ))}
      </AnimatePresence>
    </ul>
  )
}
