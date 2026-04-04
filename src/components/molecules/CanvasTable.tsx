import { useState, useRef, memo } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/react'
import type { FloorTable, SeatAssignment } from '../../data/table-types'
import type { Guest } from '../../data/guest-types'
import {
  getRectTableSize,
  getCircleTableDiameter,
  getSeatPositions,
  SEAT_RADIUS,
} from '../../data/table-types'
import { LuUsers } from 'react-icons/lu'
import { DRAG_TYPE_SEAT } from '../../data/dnd-types'
import type {
  DragSeatData,
  DropSeatData,
  DropTableData,
} from '../../data/dnd-types'
import SeatIndicator from '../atoms/SeatIndicator'

const TOUCH_MOVE_THRESHOLD = 10

interface Props {
  table: FloorTable
  isSelected: boolean
  guests: Guest[]
  onSelectTable: (id: string) => void
  onSeatClick: (tableId: string, seatIndex: number, anchorRect: DOMRect) => void
  activeSeatIndex: number | null
  onTableMouseDown?: (tableId: string, e: React.MouseEvent) => void
  isMobile?: boolean
  activeTool?: string
  scale?: number
  onTableTouchDrag?: (tableId: string, deltaX: number, deltaY: number) => void
}

/** A single seat: droppable (always) and draggable (only when occupied, for swap). */
function SeatSlot({
  seatIndex,
  tableId,
  assignment,
  guest,
  activeSeatIndex,
  onSeatClick,
  isMobile,
  activeTool,
}: {
  seatIndex: number
  tableId: string
  assignment: SeatAssignment | undefined
  guest: Guest | undefined
  activeSeatIndex: number | null
  onSeatClick: (tableId: string, seatIndex: number, anchorRect: DOMRect) => void
  isMobile?: boolean
  activeTool?: string
}) {
  const initials = guest
    ? `${guest.firstName.charAt(0)}${guest.lastName.charAt(0)}`
    : undefined
  const isEmpty = !assignment

  const { ref: dropRef, isDropTarget } = useDroppable({
    id: `seat-${tableId}-${seatIndex}`,
    data: { tableId, seatIndex } satisfies DropSeatData,
  })

  const { ref: dragRef, isDragging } = useDraggable({
    id: `seat-drag-${tableId}-${seatIndex}`,
    disabled: isEmpty || !!isMobile,
    data: {
      type: DRAG_TYPE_SEAT,
      tableId,
      seatIndex,
      guestId: assignment?.guestId ?? '',
    } satisfies DragSeatData,
  })

  return (
    <div ref={dropRef}>
      <div ref={dragRef} className={isDragging ? 'opacity-40' : ''}>
        <SeatIndicator
          isEmpty={isEmpty}
          initials={initials}
          isSelected={activeSeatIndex === seatIndex}
          isDropTarget={isDropTarget && isEmpty}
          isSwapTarget={isDropTarget && !isEmpty}
          onClick={(e) => {
            e.stopPropagation()
            const rect = (
              e.currentTarget as HTMLElement
            ).getBoundingClientRect()
            onSeatClick(tableId, seatIndex, rect)
          }}
          onMobileTap={
            isMobile && activeTool === 'select'
              ? (e) => {
                  e.stopPropagation()
                  const rect = (
                    e.currentTarget as HTMLElement
                  ).getBoundingClientRect()
                  onSeatClick(tableId, seatIndex, rect)
                }
              : undefined
          }
        />
      </div>
    </div>
  )
}

function CanvasTable({
  table,
  isSelected,
  guests,
  onSelectTable,
  onSeatClick,
  activeSeatIndex,
  onTableMouseDown,
  isMobile,
  activeTool,
  scale,
  onTableTouchDrag,
}: Props) {
  const isCircle = table.shape === 'circular'

  const { width, height } = isCircle
    ? (() => {
        const d = getCircleTableDiameter(table.seatCount)
        return { width: d, height: d }
      })()
    : getRectTableSize(table.seatCount)

  const seatPositions = getSeatPositions(
    table.shape,
    table.seatCount,
    width,
    height,
  )
  const assignedCount = table.seats.length

  const containerWidth = width + SEAT_RADIUS * 2
  const containerHeight = height + SEAT_RADIUS * 2

  // Table body is a drop target (guest dropped on table → first empty seat)
  const { ref: tableDropRef, isDropTarget: isTableDropTarget } = useDroppable({
    id: `table-body-${table.id}`,
    data: { tableId: table.id } satisfies DropTableData,
  })

  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation()
    onSelectTable(table.id)
    onTableMouseDown?.(table.id, e)
  }

  const touchStartPos = useRef<{ x: number; y: number } | null>(null)
  const touchMoved = useRef(false)
  const dragAccumRef = useRef({ x: 0, y: 0 })
  const rootRef = useRef<HTMLDivElement>(null)
  const [isDragMode, setIsDragMode] = useState(false)

  return (
    <div
      ref={rootRef}
      className={`absolute ${isDragMode ? 'shadow-lg ring-2 ring-primary rounded' : ''}`}
      style={{
        left: table.x,
        top: table.y,
        width: containerWidth,
        height: containerHeight,
        transform: `rotate(${table.rotation}deg)`,
        transformOrigin: 'center center',
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => e.stopPropagation()}
      onTouchStart={(e) => {
        if (!isMobile) return
        if (activeTool === 'pan') {
          // Pan/hand tool: start table drag immediately
          touchStartPos.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          }
          dragAccumRef.current = { x: 0, y: 0 }
          setIsDragMode(true)
          e.stopPropagation()
        } else if (activeTool === 'select') {
          // Select tool: track for tap detection, let TransformWrapper pan
          touchStartPos.current = {
            x: e.touches[0].clientX,
            y: e.touches[0].clientY,
          }
          touchMoved.current = false
        }
      }}
      onTouchMove={(e) => {
        if (!touchStartPos.current) return
        if (isDragMode && rootRef.current) {
          // Dragging table — direct DOM update, no React re-render
          e.preventDefault()
          e.stopPropagation()
          const touch = e.touches[0]
          const dx = touch.clientX - touchStartPos.current.x
          const dy = touch.clientY - touchStartPos.current.y
          touchStartPos.current = { x: touch.clientX, y: touch.clientY }
          const s = scale ?? 1
          dragAccumRef.current.x += dx / s
          dragAccumRef.current.y += dy / s
          rootRef.current.style.left = `${table.x + dragAccumRef.current.x}px`
          rootRef.current.style.top = `${table.y + dragAccumRef.current.y}px`
        } else {
          // Select tool: track movement to distinguish tap from pan
          const touch = e.touches[0]
          const dist = Math.hypot(
            touch.clientX - touchStartPos.current.x,
            touch.clientY - touchStartPos.current.y,
          )
          if (dist > TOUCH_MOVE_THRESHOLD) {
            touchMoved.current = true
          }
        }
      }}
      onTouchEnd={() => {
        if (isDragMode) {
          setIsDragMode(false)
          // Persist final position (single localStorage write)
          onTableTouchDrag?.(
            table.id,
            dragAccumRef.current.x,
            dragAccumRef.current.y,
          )
          dragAccumRef.current = { x: 0, y: 0 }
        } else if (isMobile && activeTool === 'select' && !touchMoved.current) {
          // Tap detected in select mode → select table
          onSelectTable(table.id)
        }
        touchStartPos.current = null
        touchMoved.current = false
      }}
    >
      {/* Table body */}
      <div
        ref={tableDropRef}
        className={`absolute flex flex-col items-center justify-center gap-0.5 bg-surface-elevated ${
          isTableDropTarget
            ? 'border-2 border-dashed border-primary ring-2 ring-primary/30'
            : isSelected
              ? 'border-2 border-dashed border-primary'
              : 'border border-border'
        }`}
        style={{
          left: SEAT_RADIUS,
          top: SEAT_RADIUS,
          width,
          height,
          borderRadius: isCircle ? '50%' : '8px',
        }}
      >
        {/* Label */}
        <span className="text-body-sm text-foreground-heading font-semibold text-center">
          {table.label}
        </span>

        {/* Guest count */}
        <span className="text-caption text-foreground-muted flex items-center justify-center gap-1">
          <LuUsers size={10} />
          {assignedCount}/{table.seatCount}
        </span>
      </div>

      {/* Seats */}
      {seatPositions.map((pos, i) => {
        const assignment = table.seats.find((s) => s.seatIndex === i)
        const guest = assignment
          ? guests.find((g) => g.id === assignment.guestId)
          : undefined

        return (
          <div
            key={i}
            className="absolute"
            style={{
              left: pos.x + SEAT_RADIUS - 14,
              top: pos.y + SEAT_RADIUS - 14,
            }}
            onTouchStart={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <SeatSlot
              seatIndex={i}
              tableId={table.id}
              assignment={assignment}
              guest={guest}
              activeSeatIndex={activeSeatIndex}
              onSeatClick={onSeatClick}
              isMobile={isMobile}
              activeTool={activeTool}
            />
          </div>
        )
      })}
    </div>
  )
}

export default memo(CanvasTable)
