import { useRef, useCallback } from 'react'

interface UseLongPressOptions {
  threshold?: number // ms, default 300
  onLongPress: () => void
  onTap?: () => void
}

export function useLongPress({
  threshold = 300,
  onLongPress,
  onTap,
}: UseLongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPress = useRef(false)

  const onTouchStart = useCallback(() => {
    isLongPress.current = false
    timerRef.current = setTimeout(() => {
      isLongPress.current = true
      onLongPress()
    }, threshold)
  }, [threshold, onLongPress])

  const onTouchEnd = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
    if (!isLongPress.current) {
      onTap?.()
    }
  }, [onTap])

  const onTouchMove = useCallback(() => {
    // Cancel long-press if finger moves before threshold
    if (timerRef.current && !isLongPress.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  return { onTouchStart, onTouchEnd, onTouchMove }
}
