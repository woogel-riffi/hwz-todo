import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, loadState, migrateV1toV2, saveState, STORAGE_KEY } from './storage'

const sample = {
  id: 'a',
  title: 'Einkaufen',
  done: true,
  createdAt: 1,
  assignee: 'Sophie' as const,
}

// Exactly what version 1 of the app wrote to localStorage.
const v1Raw = JSON.stringify({
  version: 1,
  tasks: [
    { id: 'x1', title: 'Einkaufen', done: true, createdAt: 1731230000000 },
    { id: 'x2', title: 'Mama anrufen', done: false, createdAt: 1731230100000 },
  ],
})

describe('storage', () => {
  it('uses version 2', () => {
    expect(CURRENT_VERSION).toBe(2)
  })

  it('returns an empty list when nothing is stored', () => {
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty list for broken JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{kaputt')
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty list for the wrong shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, tasks: [{ id: 1 }] }))
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('loads exactly what was saved', () => {
    saveState({ version: CURRENT_VERSION, tasks: [sample] })
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [sample] })
  })

  it('turns an unknown name into null', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ version: 2, tasks: [{ ...sample, assignee: 'Fremder' }] }),
    )
    expect(loadState().tasks[0].assignee).toBeNull()
  })
})

describe('migration from version 1', () => {
  it('keeps every version 1 task, unassigned, as version 2', () => {
    localStorage.setItem(STORAGE_KEY, v1Raw)
    expect(loadState()).toEqual({
      version: 2,
      tasks: [
        { id: 'x1', title: 'Einkaufen', done: true, createdAt: 1731230000000, assignee: null },
        { id: 'x2', title: 'Mama anrufen', done: false, createdAt: 1731230100000, assignee: null },
      ],
    })
  })

  it('migrateV1toV2 adds assignee null and changes nothing else', () => {
    const tasks = [{ id: 'a', title: 'A', done: false, createdAt: 5 }]
    expect(migrateV1toV2(tasks)).toEqual([{ ...tasks[0], assignee: null }])
  })
})
