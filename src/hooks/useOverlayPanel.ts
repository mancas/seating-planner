import { useState, useEffect, useCallback } from 'react'

export function useOverlayPanel(
  isOpen: boolean,
  onClose: () => void,
): {
  visible: boolean
  isClosing: boolean
  onAnimationEnd: () => void
} {
  const [visible, setVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [prevIsOpen, setPrevIsOpen] = useState(false)

  // Adjust state when prop changes (React-recommended pattern, no useEffect)
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      // false → true: panel opening
      setVisible(true)
      setIsClosing(false)
    } else {
      // true → false: panel closing, keep mounted for exit animation
      setIsClosing(true)
    }
  }

  const onAnimationEnd = useCallback(() => {
    if (isClosing) {
      setVisible(false)
      setIsClosing(false)
    }
  }, [isClosing])

  useEffect(() => {
    if (!visible) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [visible, onClose])

  return { visible, isClosing, onAnimationEnd }
}
