import { Plus } from 'lucide-react'
import { useCallback, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useHotkey } from '@/lib/useHotkey'
import { cn } from '@/lib/utils'
import { MAX_TITLE_LENGTH } from '../model'

type TaskInputProps = {
  onAdd: (title: string) => void
}

export function TaskInput({ onAdd }: TaskInputProps) {
  const [value, setValue] = useState('')
  const [shaking, setShaking] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const focusInput = useCallback(() => inputRef.current?.focus(), [])
  useHotkey('n', focusInput)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (value.trim() === '') {
      setShaking(true)
      inputRef.current?.focus()
      return
    }
    onAdd(value)
    setValue('')
    inputRef.current?.focus()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') {
      setValue('')
      inputRef.current?.blur()
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      onAnimationEnd={() => setShaking(false)}
      className={cn(
        'glass flex items-center gap-2 rounded-2xl border p-2 shadow-card',
        shaking && 'animate-shake',
      )}
    >
      <Input
        ref={inputRef}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Was steht an?"
        aria-label="Neue Aufgabe"
        maxLength={MAX_TITLE_LENGTH}
        className="h-14 flex-1 border-0 bg-transparent px-4 text-lg shadow-none focus-visible:ring-0"
      />
      <Button
        type="submit"
        size="icon"
        className="size-12 rounded-xl bg-primary text-primary-foreground transition-look hover:scale-105 active:scale-95"
        aria-label="Aufgabe hinzufügen"
      >
        <Plus className="size-6" />
      </Button>
    </form>
  )
}
