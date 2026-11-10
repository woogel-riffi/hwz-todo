import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { CURRENT_VERSION, saveState } from '@/lib/storage'
import { ProgressRing } from './ProgressRing'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }))

const task = (id: string, done: boolean) => ({ id, title: id, done, createdAt: 1 })

describe('ProgressRing', () => {
  it('shows done of total as text and label', () => {
    render(<ProgressRing done={1} total={3} />)
    expect(screen.getByRole('img', { name: '1 von 3 erledigt' })).toBeInTheDocument()
    expect(screen.getByText('1/3')).toBeInTheDocument()
  })

  it('shows 0/0 without tasks', () => {
    render(<ProgressRing done={0} total={0} />)
    expect(screen.getByRole('img', { name: '0 von 0 erledigt' })).toBeInTheDocument()
    expect(screen.getByText('0/0')).toBeInTheDocument()
  })

  it('counts up in the app when a task is checked off', async () => {
    const user = userEvent.setup()
    saveState({
      version: CURRENT_VERSION,
      tasks: [task('a', false), task('b', true), task('c', false)],
    })
    render(<App />)
    expect(screen.getByRole('img', { name: '1 von 3 erledigt' })).toBeInTheDocument()
    await user.click(screen.getByRole('checkbox', { name: '«a» erledigt' }))
    expect(screen.getByRole('img', { name: '2 von 3 erledigt' })).toBeInTheDocument()
  })
})

describe('EmptyState', () => {
  it('appears instead of a list when there are no tasks', () => {
    render(<App />)
    expect(screen.getByText('Alles erledigt. Zeit für Kaffee.')).toBeInTheDocument()
    expect(screen.getByText('Tippe oben eine neue Aufgabe ein oder drücke N.')).toBeInTheDocument()
    expect(screen.queryByRole('list')).not.toBeInTheDocument()
  })

  it('disappears once a task exists', () => {
    saveState({ version: CURRENT_VERSION, tasks: [task('a', false)] })
    render(<App />)
    expect(screen.queryByText('Alles erledigt. Zeit für Kaffee.')).not.toBeInTheDocument()
  })
})
