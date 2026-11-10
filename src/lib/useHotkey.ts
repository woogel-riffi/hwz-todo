import { useEffect } from 'react'

function isEditable(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false
  return target.matches('input, textarea, [contenteditable]') || target.isContentEditable
}

/** Calls `handler` when `key` is pressed, unless focus is already in a text field. */
export function useHotkey(key: string, handler: () => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return
      if (event.metaKey || event.ctrlKey || event.altKey) return
      if (isEditable(event.target)) return
      event.preventDefault()
      handler()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [key, handler])
}
