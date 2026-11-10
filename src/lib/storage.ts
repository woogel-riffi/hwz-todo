import type { Task } from '@/features/tasks/model'

export const STORAGE_KEY = 'hwz-todo'
export const CURRENT_VERSION = 1

export type StoredState = { version: typeof CURRENT_VERSION; tasks: Task[] }

const emptyState = (): StoredState => ({ version: CURRENT_VERSION, tasks: [] })

function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.done === 'boolean' &&
    typeof t.createdAt === 'number'
  )
}

export function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return emptyState()
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return emptyState()
    const { version, tasks } = parsed as Record<string, unknown>
    if (version !== CURRENT_VERSION || !Array.isArray(tasks) || !tasks.every(isTask)) {
      return emptyState()
    }
    return { version: CURRENT_VERSION, tasks }
  } catch {
    return emptyState()
  }
}

export function saveState(state: StoredState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Storage full or blocked: the app keeps working in memory.
  }
}
