import { memo } from 'react'
import { useDroppable } from '@dnd-kit/react'
import type { FloorTable } from '../../data/table-types'
import type { Guest } from '../../data/guest-types'
import {
  getRectTableSize,
  getCircleTableDiameter,
  getSeatPositions,
  SEAT_RADIUS,
} from '../../data/table-types'
import { LuUsers } from 'react-icons/lu'
import type { DropTableData } from '../../data/dnd-types'
import SeatSlot from '../atoms/SeatSlot'
import { useTableTouchDrag } from '../../hooks/useTableTouchDrag'

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
  onTableTouchDrag: onTouchDragProp,
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

  const { ref: tableDropRef, isDropTarget: isTableDropTarget } = useDroppable({
    id: `table-body-${table.id}`,
    data: { tableId: table.id } satisfies DropTableData,
  })

  const {
    rootRef,
    isDragMode,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  } = useTableTouchDrag({
    tableId: table.id,
    tableX: table.x,
    tableY: table.y,
    isMobile,
    activeTool,
    scale,
    onSelectTable,
    onTableTouchDrag: onTouchDragProp,
  })

  function handleMouseDown(e: React.MouseEvent) {
    e.stopPropagation()
    onSelectTable(table.id)
    onTableMouseDown?.(table.id, e)
  }

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
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
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
        <span className="text-body-sm text-foreground-heading font-semibold text-center">
          {table.label}
        </span>
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
