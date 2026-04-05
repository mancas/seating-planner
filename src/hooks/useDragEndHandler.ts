import { useCallback } from 'react'
import type { FloorTable } from '../data/table-types'
import { findFirstEmptySeat } from '../data/table-store'
import {
  isDragGuestData,
  isDragSeatData,
  isDropSeatData,
  isDropTableData,
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

      const sourceData: unknown = source.data
      const targetData: unknown = target.data

      if (isDragGuestData(sourceData) && isDropSeatData(targetData)) {
        handleAssignGuest(
          targetData.tableId,
          targetData.seatIndex,
          sourceData.guestId,
        )
      } else if (isDragSeatData(sourceData) && isDropSeatData(targetData)) {
        handleSwapSeats(
          sourceData.tableId,
          sourceData.seatIndex,
          targetData.tableId,
          targetData.seatIndex,
        )
      } else if (isDragGuestData(sourceData) && isDropTableData(targetData)) {
        const table = tables.find((t) => t.id === targetData.tableId)
        if (table) {
          const seatIndex = findFirstEmptySeat(table)
          if (seatIndex !== null) {
            handleAssignGuest(targetData.tableId, seatIndex, sourceData.guestId)
          }
        }
      }
    },
    [tables, handleAssignGuest, handleSwapSeats],
  )
}
