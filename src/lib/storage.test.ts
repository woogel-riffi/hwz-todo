import { describe, expect, it } from 'vitest'
import { CURRENT_VERSION, loadState, saveState, STORAGE_KEY } from './storage'

const sample = { id: 'a', title: 'Einkaufen', done: true, createdAt: 1 }

describe('storage', () => {
  it('returns an empty list when nothing is stored', () => {
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty list for broken JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{kaputt')
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('returns an empty list for the wrong shape', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 1, tasks: [{ id: 1 }] }))
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [] })
  })

  it('loads exactly what was saved', () => {
    saveState({ version: CURRENT_VERSION, tasks: [sample] })
    expect(loadState()).toEqual({ version: CURRENT_VERSION, tasks: [sample] })
  })
})
