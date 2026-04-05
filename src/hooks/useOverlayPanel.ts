import { useState, useEffect, useCallback } from 'react'

type PanelPhase = 'closed' | 'open' | 'closing'

export function useOverlayPanel(
  isOpen: boolean,
  onClose: () => void,
): {
  visible: boolean
  isClosing: boolean
  onAnimationEnd: () => void
} {
  const [phase, setPhase] = useState<PanelPhase>('closed')
  const [prevIsOpen, setPrevIsOpen] = useState(false)

  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen)
    if (isOpen) {
      setPhase('open')
    } else if (phase === 'open') {
      setPhase('closing')
    }
  }

  const onAnimationEnd = useCallback(() => {
    if (phase === 'closing') {
      setPhase('closed')
    }
  }, [phase])

  useEffect(() => {
    if (phase === 'closed') return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [phase, onClose])

  return {
    visible: phase !== 'closed',
    isClosing: phase === 'closing',
    onAnimationEnd,
  }
}
