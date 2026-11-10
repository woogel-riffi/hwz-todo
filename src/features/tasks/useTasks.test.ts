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
