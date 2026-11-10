import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { loadState } from '@/lib/storage'
import { useTasks } from './useTasks'

describe('useTasks', () => {
  it('adds, toggles and keeps tasks after a reload', () => {
    const { result, unmount } = renderHook(() => useTasks())
    act(() => result.current.add('Einkaufen'))
    act(() => result.current.add('Mama anrufen'))
    const id = result.current.tasks[1].id
    act(() => result.current.toggle(id))
    unmount()

    expect(loadState().tasks.map((t) => [t.title, t.done])).toEqual([
      ['Mama anrufen', false],
      ['Einkaufen', true],
    ])
    const reloaded = renderHook(() => useTasks())
    expect(reloaded.result.current.tasks).toHaveLength(2)
  })

  it('removes a task and restores it', () => {
    const { result } = renderHook(() => useTasks())
    act(() => result.current.add('a'))
    act(() => result.current.add('b'))
    const id = result.current.tasks[1].id
    let restore: (() => void) | undefined
    act(() => {
      restore = result.current.remove(id)
    })
    expect(result.current.tasks.map((t) => t.title)).toEqual(['b'])
    act(() => restore?.())
    expect(result.current.tasks.map((t) => t.title)).toEqual(['b', 'a'])
  })
})

describe('useTasks assign', () => {
  it('assigns a person and keeps it after a reload', () => {
    const { result, unmount } = renderHook(() => useTasks())
    act(() => result.current.add('Einkaufen'))
    const id = result.current.tasks[0].id
    act(() => result.current.assign(id, 'Sophie'))
    act(() => result.current.assign(id, 'Lisa'))
    expect(result.current.tasks[0].assignee).toBe('Lisa')
    unmount()

    expect(loadState().tasks[0].assignee).toBe('Lisa')
    const reloaded = renderHook(() => useTasks())
    expect(reloaded.result.current.tasks[0].assignee).toBe('Lisa')
    act(() => reloaded.result.current.assign(id, null))
    expect(loadState().tasks[0].assignee).toBeNull()
  })
})
