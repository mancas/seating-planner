import { useCallback } from 'react'
import type { FloorTable } from '../data/table-types'
import { DRAG_TYPE_GUEST, DRAG_TYPE_SEAT } from '../data/dnd-types'
import type {
  DragGuestData,
  DragSeatData,
  DropSeatData,
  DropTableData,
} from '../data/dnd-types'

export function useDragEndHandler(
  tables: FloorTable[],
  handleAssignGuest: (
    tableId: string,
    seatIndex: number,
    guestId: string,
  ) => void,
  handleSwapSeats: (
    srcTableId: string,
    srcSeatIdx: number,
    tgtTableId: string,
    tgtSeatIdx: number,
  ) => void,
) {
  return useCallback(
    (event: {
      operation: {
        source: { data: Record<string, unknown> } | null
        target: { data: Record<string, unknown> } | null
      }
    }) => {
      const { source, target } = event.operation
      if (!source || !target) return

      const sourceData = source.data as Record<string, unknown>
      const targetData = target.data as Record<string, unknown>

      if (sourceData.type === DRAG_TYPE_GUEST && 'seatIndex' in targetData) {
        // Guest dropped on a seat
        const guestData = sourceData as unknown as DragGuestData
        const seatData = targetData as unknown as DropSeatData
        handleAssignGuest(
          seatData.tableId,
          seatData.seatIndex,
          guestData.guestId,
        )
      } else if (
        sourceData.type === DRAG_TYPE_SEAT &&
        'seatIndex' in targetData
      ) {
        // Seat dropped on another seat — swap
        const seatSrc = sourceData as unknown as DragSeatData
        const seatTgt = targetData as unknown as DropSeatData
        handleSwapSeats(
          seatSrc.tableId,
          seatSrc.seatIndex,
          seatTgt.tableId,
          seatTgt.seatIndex,
        )
      } else if (
        sourceData.type === DRAG_TYPE_GUEST &&
        'tableId' in targetData &&
        !('seatIndex' in targetData)
      ) {
        // Guest dropped on table body — find first empty seat
        const guestData = sourceData as unknown as DragGuestData
        const tableData = targetData as unknown as DropTableData
        const table = tables.find((t) => t.id === tableData.tableId)
        if (table) {
          const occupiedSeats = new Set(table.seats.map((s) => s.seatIndex))
          for (let i = 0; i < table.seatCount; i++) {
            if (!occupiedSeats.has(i)) {
              handleAssignGuest(tableData.tableId, i, guestData.guestId)
              break
            }
          }
        }
      }
    },
    [tables, handleAssignGuest, handleSwapSeats],
  )
}
