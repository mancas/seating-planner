import { memo } from 'react'
import { useDraggable, useDroppable } from '@dnd-kit/react'
import type { SeatAssignment } from '../../data/table-types'
import type { Guest } from '../../data/guest-types'
import { DRAG_TYPE_SEAT } from '../../data/dnd-types'
import type { DragSeatData, DropSeatData } from '../../data/dnd-types'
import SeatIndicator from './SeatIndicator'

interface Props {
  seatIndex: number
  tableId: string
  assignment: SeatAssignment | undefined
  guest: Guest | undefined
  activeSeatIndex: number | null
  onSeatClick: (tableId: string, seatIndex: number, anchorRect: DOMRect) => void
  isMobile?: boolean
  activeTool?: string
}

function SeatSlot({
  seatIndex,
  tableId,
  assignment,
  guest,
  activeSeatIndex,
  onSeatClick,
  isMobile,
  activeTool,
}: Props) {
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

export default memo(SeatSlot)
