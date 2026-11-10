export const MAX_TITLE_LENGTH = 200

export type Task = {
  id: string // crypto.randomUUID()
  title: string // trimmed, 1 to 200 characters
  done: boolean
  createdAt: number // Date.now()
}

export type RemovedTask = { task: Task; index: number }

export function addTask(
  tasks: Task[],
  title: string,
  { id = crypto.randomUUID(), now = Date.now() }: { id?: string; now?: number } = {},
): Task[] {
  const clean = title.trim().slice(0, MAX_TITLE_LENGTH)
  if (clean === '') return tasks
  return [{ id, title: clean, done: false, createdAt: now }, ...tasks]
}

export function toggleTask(tasks: Task[], id: string): Task[] {
  return tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
}

export function removeTask(
  tasks: Task[],
  id: string,
): { tasks: Task[]; removed: RemovedTask | undefined } {
  const index = tasks.findIndex((t) => t.id === id)
  if (index === -1) return { tasks, removed: undefined }
  return { tasks: tasks.filter((t) => t.id !== id), removed: { task: tasks[index], index } }
}

export function restoreTask(tasks: Task[], task: Task, index: number): Task[] {
  if (tasks.some((t) => t.id === task.id)) return tasks
  const at = Math.min(Math.max(index, 0), tasks.length)
  return [...tasks.slice(0, at), task, ...tasks.slice(at)]
}
