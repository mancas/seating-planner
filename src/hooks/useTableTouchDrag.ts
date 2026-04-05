import { useEffect, useRef, useState } from 'react'

const TOUCH_MOVE_THRESHOLD = 10

interface Options {
  tableId: string
  tableX: number
  tableY: number
  isMobile?: boolean
  activeTool?: string
  scale?: number
  onSelectTable: (id: string) => void
  onTableTouchDrag?: (tableId: string, deltaX: number, deltaY: number) => void
}

export function useTableTouchDrag({
  tableId,
  tableX,
  tableY,
  isMobile,
  activeTool,
  scale,
  onSelectTable,
  onTableTouchDrag,
}: Options) {
  const touchStartPos = useRef<{ x: number; y: number } | null>(null)
  const touchMoved = useRef(false)
  const dragAccumRef = useRef({ x: 0, y: 0 })
  const rootRef = useRef<HTMLDivElement>(null)
  const [isDragMode, setIsDragMode] = useState(false)

  // Store latest values in refs so the native listener always reads fresh data
  const scaleRef = useRef(scale)
  const tableXRef = useRef(tableX)
  const tableYRef = useRef(tableY)
  useEffect(() => {
    scaleRef.current = scale
  }, [scale])
  useEffect(() => {
    tableXRef.current = tableX
  }, [tableX])
  useEffect(() => {
    tableYRef.current = tableY
  }, [tableY])

  // Attach touchmove with { passive: false } so preventDefault() works
  useEffect(() => {
    const el = rootRef.current
    if (!el || !isDragMode) return

    function handleTouchMove(e: TouchEvent) {
      if (!touchStartPos.current || !rootRef.current) return
      e.preventDefault()
      e.stopPropagation()
      const touch = e.touches[0]
      const dx = touch.clientX - touchStartPos.current.x
      const dy = touch.clientY - touchStartPos.current.y
      touchStartPos.current = { x: touch.clientX, y: touch.clientY }
      const s = scaleRef.current ?? 1
      dragAccumRef.current.x += dx / s
      dragAccumRef.current.y += dy / s
      rootRef.current.style.left = `${tableXRef.current + dragAccumRef.current.x}px`
      rootRef.current.style.top = `${tableYRef.current + dragAccumRef.current.y}px`
    }

    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    return () => el.removeEventListener('touchmove', handleTouchMove)
  }, [isDragMode])

  function onTouchStart(e: React.TouchEvent) {
    if (!isMobile) return
    if (activeTool === 'pan') {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
      dragAccumRef.current = { x: 0, y: 0 }
      setIsDragMode(true)
      e.stopPropagation()
    } else if (activeTool === 'select') {
      touchStartPos.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
      touchMoved.current = false
    }
  }

  function onTouchMove(e: React.TouchEvent) {
    // Drag-mode moves are handled by the native listener above.
    // This only handles select-mode movement tracking.
    if (!touchStartPos.current || isDragMode) return
    const touch = e.touches[0]
    const dist = Math.hypot(
      touch.clientX - touchStartPos.current.x,
      touch.clientY - touchStartPos.current.y,
    )
    if (dist > TOUCH_MOVE_THRESHOLD) {
      touchMoved.current = true
    }
  }

  function onTouchEnd() {
    if (isDragMode) {
      setIsDragMode(false)
      onTableTouchDrag?.(
        tableId,
        dragAccumRef.current.x,
        dragAccumRef.current.y,
      )
      dragAccumRef.current = { x: 0, y: 0 }
    } else if (isMobile && activeTool === 'select' && !touchMoved.current) {
      onSelectTable(tableId)
    }
    touchStartPos.current = null
    touchMoved.current = false
  }

  return {
    rootRef,
    isDragMode,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  }
}
