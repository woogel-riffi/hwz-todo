import { describe, expect, it } from 'vitest'
import {
  addTask,
  assignTask,
  FAMILY,
  isFamilyMember,
  MAX_TITLE_LENGTH,
  removeTask,
  restoreTask,
  splitTasks,
  toggleTask,
  type Task,
} from './model'

const task = (id: string, title = id, done = false): Task => ({
  id,
  title,
  done,
  createdAt: 1,
  assignee: null,
})

describe('FAMILY', () => {
  it('lists the six family members in order', () => {
    expect(FAMILY).toEqual(['Phil', 'Harvey', 'Sophie', 'Lisa', 'MogliTheCat', 'Wichtel'])
  })

  it('recognises only family members', () => {
    expect(isFamilyMember('Lisa')).toBe(true)
    expect(isFamilyMember('lisa')).toBe(false)
    expect(isFamilyMember(null)).toBe(false)
  })
})

describe('addTask', () => {
  it('adds a trimmed, unassigned task at the top', () => {
    const result = addTask([task('a')], '  Einkaufen  ', { id: 'b', now: 5 })
    expect(result).toEqual([
      { id: 'b', title: 'Einkaufen', done: false, createdAt: 5, assignee: null },
      task('a'),
    ])
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

describe('assignTask', () => {
  it('assigns, replaces and removes a person', () => {
    const tasks = [task('a'), task('b')]
    const sophie = assignTask(tasks, 'a', 'Sophie')
    expect(sophie.map((t) => t.assignee)).toEqual(['Sophie', null])
    const phil = assignTask(sophie, 'a', 'Phil')
    expect(phil.map((t) => t.assignee)).toEqual(['Phil', null])
    expect(assignTask(phil, 'a', null).map((t) => t.assignee)).toEqual([null, null])
  })

  it('keeps everything else of the task unchanged', () => {
    const [assigned] = assignTask([task('a', 'Einkaufen', true)], 'a', 'Lisa')
    expect(assigned).toEqual({ ...task('a', 'Einkaufen', true), assignee: 'Lisa' })
  })
})

describe('splitTasks', () => {
  it('separates my tasks from delegated ones and keeps the order', () => {
    const tasks: Task[] = [
      task('a'),
      { ...task('b'), assignee: 'Sophie' },
      task('c'),
      { ...task('d'), assignee: 'Phil' },
    ]
    const { mine, delegated } = splitTasks(tasks)
    expect(mine.map((t) => t.id)).toEqual(['a', 'c'])
    expect(delegated.map((t) => t.id)).toEqual(['b', 'd'])
  })

  it('returns two empty lists for no tasks', () => {
    expect(splitTasks([])).toEqual({ mine: [], delegated: [] })
  })
})
