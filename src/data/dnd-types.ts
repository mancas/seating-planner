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
