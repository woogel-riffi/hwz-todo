import { isFamilyMember, type Task } from '@/features/tasks/model'

export const STORAGE_KEY = 'hwz-todo'
export const CURRENT_VERSION = 2

export type StoredState = { version: typeof CURRENT_VERSION; tasks: Task[] }

/** Task as written by version 1 of the app (before delegating existed). */
type TaskV1 = Omit<Task, 'assignee'>

const emptyState = (): StoredState => ({ version: CURRENT_VERSION, tasks: [] })

function isTaskV1(value: unknown): value is TaskV1 {
  if (typeof value !== 'object' || value === null) return false
  const t = value as Record<string, unknown>
  return (
    typeof t.id === 'string' &&
    typeof t.title === 'string' &&
    typeof t.done === 'boolean' &&
    typeof t.createdAt === 'number'
  )
}

/** Version 1 → 2: every task gets `assignee: null`, nothing else changes. */
export function migrateV1toV2(tasks: TaskV1[]): Task[] {
  return tasks.map(({ id, title, done, createdAt }) => ({
    id,
    title,
    done,
    createdAt,
    assignee: null,
  }))
}

function readV2Task(value: TaskV1 & { assignee?: unknown }): Task {
  const { id, title, done, createdAt, assignee } = value
  return { id, title, done, createdAt, assignee: isFamilyMember(assignee) ? assignee : null }
}

export function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return emptyState()
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return emptyState()
    const { version, tasks } = parsed as Record<string, unknown>
    if (!Array.isArray(tasks) || !tasks.every(isTaskV1)) return emptyState()
    if (version === 1) return { version: CURRENT_VERSION, tasks: migrateV1toV2(tasks) }
    if (version === CURRENT_VERSION) return { version: CURRENT_VERSION, tasks: tasks.map(readV2Task) }
    return emptyState()
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
