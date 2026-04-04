import { useRef, useCallback } from 'react'

interface UseLongPressOptions {
  threshold?: number // ms, default 300
  moveThreshold?: number // px, default 10 — finger must move beyond this to cancel
  onLongPress: () => void
  onTap?: () => void
}

export function useLongPress({
  threshold = 300,
  moveThreshold = 10,
  onLongPress,
  onTap,
}: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)
  const startPos = useRef<{ x: number; y: number } | null>(null)

  const onTouchStart = useCallback(
    (x?: number, y?: number) => {
      isLongPress.current = false
      startPos.current = x !== undefined && y !== undefined ? { x, y } : null
      timerRef.current = setTimeout(() => {
        isLongPress.current = true
        onLongPress()
      }, threshold)
    },
    [threshold, onLongPress],
  )

  const onTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (!isLongPress.current) {
      onTap?.()
    }
    startPos.current = null
  }, [onTap])

  const onTouchMove = useCallback(
    (x?: number, y?: number) => {
      // Cancel long-press only if finger moves beyond moveThreshold
      if (timerRef.current && !isLongPress.current) {
        if (startPos.current && x !== undefined && y !== undefined) {
          const dist = Math.hypot(
            x - startPos.current.x,
            y - startPos.current.y,
          )
          if (dist > moveThreshold) {
            clearTimeout(timerRef.current)
            timerRef.current = null
          }
        } else {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
      }
    },
    [moveThreshold],
  )

  return { onTouchStart, onTouchEnd, onTouchMove }
}
