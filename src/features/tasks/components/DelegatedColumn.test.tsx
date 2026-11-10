import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from '@/App'
import { celebrate } from '@/lib/celebrate'
import { CURRENT_VERSION, loadState, saveState } from '@/lib/storage'
import type { FamilyMember, Task } from '../model'

vi.mock('@/lib/celebrate', () => ({ celebrate: vi.fn() }))

// jsdom has no pointer capture; sonner calls it when a toast is clicked.
Element.prototype.setPointerCapture ??= vi.fn()
Element.prototype.releasePointerCapture ??= vi.fn()
Element.prototype.hasPointerCapture ??= vi.fn(() => false)

const task = (id: string, title: string, assignee: FamilyMember | null = null): Task => ({
  id,
  title,
  done: false,
  createdAt: 1,
  assignee,
})

const column = () => screen.getByRole('region', { name: /Delegiert/ })
const mine = () => screen.getByRole('region', { name: 'Meine Liste' })

beforeEach(() => {
  vi.mocked(celebrate).mockClear()
})

describe('DelegatedColumn', () => {
  it('shows the column with its title and an empty hint', () => {
    saveState({ version: CURRENT_VERSION, tasks: [task('a', 'Einkaufen')] })
    render(<App />)
    expect(within(column()).getByRole('heading', { name: 'Delegiert 😄' })).toBeInTheDocument()
    expect(within(column()).getByText('Noch nichts delegiert.')).toBeInTheDocument()
  })

  it('moves a task into the column when delegated and back with ×', async () => {
    const user = userEvent.setup()
    saveState({
      version: CURRENT_VERSION,
      tasks: [task('a', 'Einkaufen'), task('b', 'Mama anrufen')],
    })
    render(<App />)

    await user.click(screen.getByRole('button', { name: '«Einkaufen» delegieren' }))
    await user.click(screen.getByRole('button', { name: 'Sophie' }))
    await waitFor(() => expect(within(column()).getByText('Einkaufen')).toBeInTheDocument())
    await waitFor(() => expect(within(mine()).queryByText('Einkaufen')).not.toBeInTheDocument())
    expect(within(column()).getByText('Sophie')).toBeInTheDocument()
    expect(within(column()).getByText('1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Zuordnung «Sophie» entfernen' }))
    await waitFor(() => expect(within(mine()).getByText('Einkaufen')).toBeInTheDocument())
    await waitFor(() => expect(within(column()).queryByText('Einkaufen')).not.toBeInTheDocument())
    expect(loadState().tasks.map((t) => t.title)).toEqual(['Einkaufen', 'Mama anrufen'])
  })

  it('checks off and deletes tasks inside the column', async () => {
    const user = userEvent.setup()
    saveState({
      version: CURRENT_VERSION,
      tasks: [task('a', 'Einkaufen', 'Lisa'), task('b', 'Mama anrufen', 'Phil')],
    })
    render(<App />)

    await user.click(within(column()).getByRole('checkbox', { name: '«Einkaufen» erledigt' }))
    expect(celebrate).toHaveBeenCalledTimes(1)
    expect(loadState().tasks[0].done).toBe(true)

    await user.click(within(column()).getByRole('button', { name: '«Mama anrufen» löschen' }))
    await waitFor(() => expect(screen.queryByText('Mama anrufen')).not.toBeInTheDocument())
    await user.click(await screen.findByRole('button', { name: 'Rückgängig' }))
    await waitFor(() => expect(within(column()).getByText('Mama anrufen')).toBeInTheDocument())
  })

  it('keeps a delegated task in the column after a reload', () => {
    saveState({ version: CURRENT_VERSION, tasks: [task('a', 'Einkaufen', 'Lisa')] })
    render(<App />)
    expect(within(column()).getByText('Einkaufen')).toBeInTheDocument()
    expect(within(column()).getByText('Lisa')).toBeInTheDocument()
  })

  it('places the two columns side by side from 768 px and stacked below', () => {
    render(<App />)
    expect(column().parentElement).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2')
  })
})
