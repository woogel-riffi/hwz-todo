import { useCallback, useEffect, useState } from 'react'
import { CURRENT_VERSION, loadState, saveState } from '@/lib/storage'
import { addTask, removeTask, restoreTask, toggleTask, type Task } from './model'

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>(() => loadState().tasks)

  useEffect(() => {
    saveState({ version: CURRENT_VERSION, tasks })
  }, [tasks])

  const add = useCallback((title: string) => setTasks((prev) => addTask(prev, title)), [])

  const toggle = useCallback((id: string) => setTasks((prev) => toggleTask(prev, id)), [])

  const remove = useCallback(
    (id: string): (() => void) | undefined => {
      const { tasks: rest, removed } = removeTask(tasks, id)
      if (!removed) return undefined
      setTasks(rest)
      return () => setTasks((prev) => restoreTask(prev, removed.task, removed.index))
    },
    [tasks],
  )

  return { tasks, add, toggle, remove }
}
