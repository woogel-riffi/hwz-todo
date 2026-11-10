import { describe, expect, it } from 'vitest'
import { addTask, MAX_TITLE_LENGTH, removeTask, restoreTask, toggleTask, type Task } from './model'

const task = (id: string, title = id, done = false): Task => ({ id, title, done, createdAt: 1 })

describe('addTask', () => {
  it('adds a trimmed task at the top', () => {
    const result = addTask([task('a')], '  Einkaufen  ', { id: 'b', now: 5 })
    expect(result).toEqual([{ id: 'b', title: 'Einkaufen', done: false, createdAt: 5 }, task('a')])
  })

  it('ignores an empty or whitespace-only title', () => {
    const tasks = [task('a')]
    expect(addTask(tasks, '')).toBe(tasks)
    expect(addTask(tasks, '   ')).toBe(tasks)
  })

  it('cuts the title to 200 characters', () => {
    const [created] = addTask([], 'x'.repeat(250))
    expect(created.title).toHaveLength(MAX_TITLE_LENGTH)
  })
})

describe('toggleTask', () => {
  it('toggles done and back', () => {
    const once = toggleTask([task('a')], 'a')
    expect(once[0].done).toBe(true)
    expect(toggleTask(once, 'a')[0].done).toBe(false)
  })
})

describe('removeTask and restoreTask', () => {
  it('removes a task and restores it at the same position', () => {
    const tasks = [task('a'), task('b'), task('c')]
    const { tasks: rest, removed } = removeTask(tasks, 'b')
    expect(rest.map((t) => t.id)).toEqual(['a', 'c'])
    expect(removed).toEqual({ task: task('b'), index: 1 })
    expect(restoreTask(rest, removed!.task, removed!.index)).toEqual(tasks)
  })

  it('returns no removed entry for an unknown id', () => {
    const tasks = [task('a')]
    expect(removeTask(tasks, 'x')).toEqual({ tasks, removed: undefined })
  })
})
