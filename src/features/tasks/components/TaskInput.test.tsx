import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from '@/App'

describe('TaskInput', () => {
  it('adds a task with Enter and clears the field', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aufgabe' })
    await user.type(input, 'Einkaufen{Enter}')
    expect(screen.getByRole('listitem')).toHaveTextContent('Einkaufen')
    expect(input).toHaveValue('')
    expect(input).toHaveFocus()
  })

  it('adds a task with the plus button', async () => {
    const user = userEvent.setup()
    render(<App />)
    await user.type(screen.getByRole('textbox', { name: 'Neue Aufgabe' }), 'Mama anrufen')
    await user.click(screen.getByRole('button', { name: 'Aufgabe hinzufügen' }))
    expect(screen.getByRole('listitem')).toHaveTextContent('Mama anrufen')
  })

  it('adds nothing for empty input and shakes the form', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aufgabe' })
    await user.type(input, '   {Enter}')
    expect(screen.queryAllByRole('listitem')).toHaveLength(0)
    expect(input.closest('form')).toHaveClass('animate-shake')
  })

  it('limits the title to 200 characters', () => {
    render(<App />)
    expect(screen.getByRole('textbox', { name: 'Neue Aufgabe' })).toHaveAttribute('maxLength', '200')
  })

  it('focuses the field with N and clears it with Escape', async () => {
    const user = userEvent.setup()
    render(<App />)
    const input = screen.getByRole('textbox', { name: 'Neue Aufgabe' })
    await user.keyboard('n')
    expect(input).toHaveFocus()
    expect(input).toHaveValue('')
    await user.type(input, 'Entwurf{Escape}')
    expect(input).toHaveValue('')
    expect(input).not.toHaveFocus()
  })
})
