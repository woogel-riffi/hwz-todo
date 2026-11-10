import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { celebrate } from '@/lib/celebrate'
import { CURRENT_VERSION, loadState, saveState } from '@/lib/storage'
import type { Task } from '../model'
import { TaskCard } from './TaskCard'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }))

// jsdom has no pointer capture; sonner calls it when a toast is clicked.
Element.prototype.setPointerCapture ??= vi.fn()
Element.prototype.releasePointerCapture ??= vi.fn()
Element.prototype.hasPointerCapture ??= vi.fn(() => false)

const task = (id: string, title: string, done = false): Task => ({
  id,
  title,
  done,
  createdAt: 1,
  assignee: null,
})
const noop = () => {}

function renderCard(t: Task) {
  return render(
    <ul>
      <TaskCard task={t} onToggle={noop} onRemove={noop} />
    </ul>,
  )
}

beforeEach(() => {
  vi.mocked(celebrate).mockClear()
})

describe('TaskList', () => {
  it('shows two tasks from localStorage after rendering', () => {
    saveState({
      version: CURRENT_VERSION,
      tasks: [task('a', 'Einkaufen'), task('b', 'Mama anrufen', true)],
    })
    render(<App />)
    const items = screen.getAllByRole('listitem')
    expect(items).toHaveLength(2)
    expect(items[0]).toHaveTextContent('Einkaufen')
    expect(items[1]).toHaveTextContent('Mama anrufen')
  })
})

describe('TaskCard', () => {
  it('wraps a 200 character title without spaces', () => {
    const long = 'x'.repeat(200)
    renderCard(task('a', long))
    const text = screen.getByText(long)
    expect(text).toHaveClass('min-w-0', 'break-words', '[overflow-wrap:anywhere]')
    expect(screen.getByRole('listitem')).toHaveClass('min-w-0')
  })

  it('shows a done task in muted text with a checked box', () => {
    renderCard(task('a', 'Einkaufen', true))
    expect(screen.getByText('Einkaufen')).toHaveClass('text-muted-foreground')
    expect(screen.getByRole('checkbox', { name: '«Einkaufen» erledigt' })).toBeChecked()
  })
})

describe('checking off and deleting', () => {
  it('checks a task, celebrates once, and unchecks it again', async () => {
    const user = userEvent.setup()
    saveState({ version: CURRENT_VERSION, tasks: [task('a', 'Einkaufen')] })
    render(<App />)
    const box = screen.getByRole('checkbox', { name: '«Einkaufen» erledigt' })

    await user.click(box)
    expect(box).toBeChecked()
    expect(celebrate).toHaveBeenCalledTimes(1)
    expect(loadState().tasks[0].done).toBe(true)

    await user.click(box)
    expect(box).not.toBeChecked()
    expect(celebrate).toHaveBeenCalledTimes(1)
    expect(loadState().tasks[0].done).toBe(false)
  })

  it('deletes a task and restores it at the same place with «Rückgängig»', async () => {
    const user = userEvent.setup()
    saveState({
      version: CURRENT_VERSION,
      tasks: [task('a', 'Einkaufen'), task('b', 'Mama anrufen'), task('c', 'Blumen giessen')],
    })
    render(<App />)

    await user.click(screen.getByRole('button', { name: '«Mama anrufen» löschen' }))
    await waitFor(() => expect(screen.queryByText('Mama anrufen')).not.toBeInTheDocument())
    expect(loadState().tasks.map((t) => t.id)).toEqual(['a', 'c'])

    await user.click(await screen.findByRole('button', { name: 'Rückgängig' }))
    await waitFor(() =>
      expect(screen.getAllByRole('listitem').map((li) => li.textContent)).toEqual([
        'Einkaufen',
        'Mama anrufen',
        'Blumen giessen',
      ]),
    )
    expect(loadState().tasks.map((t) => t.id)).toEqual(['a', 'b', 'c'])
  })
})

describe('delegating on the card', () => {
  it('assigns via bubble, reassigns, removes, and keeps it after reload', async () => {
    const user = userEvent.setup()
    saveState({ version: CURRENT_VERSION, tasks: [task('a', 'Einkaufen')] })
    const { unmount } = render(<App />)

    await user.click(screen.getByRole('button', { name: '«Einkaufen» delegieren' }))
    expect(screen.getByRole('dialog', { name: 'Aufgabe delegieren' })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Sophie' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('listitem')).toHaveTextContent('Sophie')
    expect(loadState().tasks[0].assignee).toBe('Sophie')

    await user.click(screen.getByRole('button', { name: '«Einkaufen» delegieren' }))
    await user.click(screen.getByRole('button', { name: 'Phil' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('listitem')).toHaveTextContent('Phil')
    expect(screen.getByRole('listitem')).not.toHaveTextContent('Sophie')

    unmount()
    render(<App />)
    expect(screen.getByRole('listitem')).toHaveTextContent('Phil')

    await user.click(screen.getByRole('button', { name: 'Zuordnung «Phil» entfernen' }))
    await waitFor(() => expect(screen.getByRole('listitem')).not.toHaveTextContent('Phil'))
    expect(loadState().tasks[0].assignee).toBeNull()
  })

  it('leaves the assignment unchanged when cancelled with Escape', async () => {
    const user = userEvent.setup()
    saveState({ version: CURRENT_VERSION, tasks: [{ ...task('a', 'Einkaufen'), assignee: 'Lisa' }] })
    render(<App />)
    await user.click(screen.getByRole('button', { name: '«Einkaufen» delegieren' }))
    await user.keyboard('{Escape}')
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    expect(screen.getByRole('listitem')).toHaveTextContent('Lisa')
    expect(loadState().tasks[0].assignee).toBe('Lisa')
  })
})
