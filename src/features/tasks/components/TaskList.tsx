import { AnimatePresence } from 'motion/react'
import type { Task } from '../model'
import { TaskCard } from './TaskCard'

type TaskListProps = {
  tasks: Task[]
  onToggle: (id: string) => void
  onRemove: (id: string) => void
}

export function TaskList({ tasks, onToggle, onRemove }: TaskListProps) {
  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false} mode="popLayout">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onToggle={onToggle} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </ul>
  )
}
