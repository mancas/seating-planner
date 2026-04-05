// Drag item type discriminators
export const DRAG_TYPE_GUEST = 'guest' as const
export const DRAG_TYPE_SEAT = 'seat' as const

// Data attached to a draggable guest item (from sidebar guest list)
export interface DragGuestData {
  type: typeof DRAG_TYPE_GUEST
  guestId: string
}

// Data attached to a draggable occupied seat (for seat swapping)
export interface DragSeatData {
  type: typeof DRAG_TYPE_SEAT
  tableId: string
  seatIndex: number
  guestId: string
}

// Data attached to a droppable seat zone
export interface DropSeatData {
  tableId: string
  seatIndex: number
}

// Data attached to a droppable table body zone
export interface DropTableData {
  tableId: string
}

// Type guards for safe runtime checks

export function isDragGuestData(data: unknown): data is DragGuestData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    (data as Record<string, unknown>).type === DRAG_TYPE_GUEST
  )
}

export function isDragSeatData(data: unknown): data is DragSeatData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'type' in data &&
    (data as Record<string, unknown>).type === DRAG_TYPE_SEAT
  )
}

export function isDropSeatData(data: unknown): data is DropSeatData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'tableId' in data &&
    'seatIndex' in data
  )
}

export function isDropTableData(data: unknown): data is DropTableData {
  return (
    typeof data === 'object' &&
    data !== null &&
    'tableId' in data &&
    !('seatIndex' in data)
  )
}
