import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FAMILY } from '../model'
import { DelegateBubbles } from './DelegateBubbles'

function setup() {
  const onPick = vi.fn()
  const onClose = vi.fn()
  const user = userEvent.setup()
  render(<DelegateBubbles title="Einkaufen" onPick={onPick} onClose={onClose} />)
  return { onPick, onClose, user }
}

describe('DelegateBubbles', () => {
  it('shows one bubble per family member', () => {
    setup()
    expect(screen.getByText('Wer übernimmt «Einkaufen»?')).toBeInTheDocument()
    for (const name of FAMILY) {
      expect(screen.getByRole('button', { name })).toBeInTheDocument()
    }
    expect(screen.getAllByRole('button')).toHaveLength(6)
  })

  it('turns the mouse pointer into a magic wand', () => {
    setup()
    expect(screen.getByRole('dialog', { name: 'Aufgabe delegieren' })).toHaveClass('cursor-wand')
  })

  it('pops the clicked bubble and reports the name', async () => {
    const { onPick, onClose, user } = setup()
    await user.click(screen.getByRole('button', { name: 'Sophie' }))
    await waitFor(() => expect(onPick).toHaveBeenCalledWith('Sophie'))
    expect(onPick).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })

  it('closes with Escape without picking', async () => {
    const { onPick, onClose, user } = setup()
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onPick).not.toHaveBeenCalled()
  })

  it('closes when clicking next to the bubbles', async () => {
    const { onPick, onClose, user } = setup()
    await user.click(screen.getByRole('dialog'))
    expect(onClose).toHaveBeenCalledTimes(1)
    expect(onPick).not.toHaveBeenCalled()
  })

  it('closes without picking once every bubble has flown away', async () => {
    const onPick = vi.fn()
    const onClose = vi.fn()
    render(
      <DelegateBubbles
        title="Einkaufen"
        onPick={onPick}
        onClose={onClose}
        riseSeconds={0.05}
        staggerSeconds={0.01}
      />,
    )
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1), { timeout: 3000 })
    expect(onPick).not.toHaveBeenCalled()
  })

  it('starts every bubble at the click point', () => {
    render(
      <DelegateBubbles
        title="Einkaufen"
        origin={{ x: 300, y: 200 }}
        onPick={vi.fn()}
        onClose={vi.fn()}
      />,
    )
    for (const name of FAMILY) {
      const li = screen.getByRole('button', { name }).closest('li')
      expect(li?.style.left).toBe('300px')
      expect(li?.style.top).toBe('200px')
    }
  })

  it('works with the keyboard: first bubble focused, Tab and Enter pick', async () => {
    const { onPick, user } = setup()
    expect(screen.getByRole('button', { name: 'Phil' })).toHaveFocus()
    await user.tab()
    expect(screen.getByRole('button', { name: 'Harvey' })).toHaveFocus()
    await user.keyboard('{Enter}')
    await waitFor(() => expect(onPick).toHaveBeenCalledWith('Harvey'))
  })
})
