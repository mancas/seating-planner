import { useState, useCallback } from 'react'
import type { FloorTable, TableShape } from '../data/table-types'
import {
  getTables,
  addTable as storeAddTable,
  updateTable as storeUpdateTable,
  deleteTable as storeDeleteTable,
  assignGuestToSeat as storeAssignGuestToSeat,
  unassignSeat as storeUnassignSeat,
  swapSeats as storeSwapSeats,
  clearGuestAssignments as storeClearGuestAssignments,
} from '../data/table-store'

export function useTableState() {
  const [tables, setTables] = useState<FloorTable[]>(() => getTables())
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null)

  const refreshTables = useCallback(() => setTables(getTables()), [])

  const handleAddTable = useCallback(
    (data: { shape: TableShape; seatCount: number; x: number; y: number }) => {
      storeAddTable({ ...data, rotation: 0 })
      refreshTables()
    },
    [refreshTables],
  )

  const handleUpdateTable = useCallback(
    (
      id: string,
      data: Partial<
        Pick<
          FloorTable,
          'label' | 'shape' | 'seatCount' | 'x' | 'y' | 'rotation'
        >
      >,
    ) => {
      storeUpdateTable(id, data)
      refreshTables()
    },
    [refreshTables],
  )

  const handleDeleteTable = useCallback(
    (id: string) => {
      storeDeleteTable(id)
      refreshTables()
      setSelectedTableId(null)
    },
    [refreshTables],
  )

  const handleAssignGuest = useCallback(
    (tableId: string, seatIndex: number, guestId: string) => {
      storeAssignGuestToSeat(tableId, seatIndex, guestId)
      refreshTables()
    },
    [refreshTables],
  )

  // assignGuestToSeat already clears previous assignments atomically,
  // so reassign is just a direct call to assign.
  const handleReassignGuest = useCallback(
    (tableId: string, seatIndex: number, guestId: string) => {
      storeAssignGuestToSeat(tableId, seatIndex, guestId)
      refreshTables()
    },
    [refreshTables],
  )

  const handleUnassignSeat = useCallback(
    (tableId: string, seatIndex: number) => {
      storeUnassignSeat(tableId, seatIndex)
      refreshTables()
    },
    [refreshTables],
  )

  const handleSwapSeats = useCallback(
    (
      srcTableId: string,
      srcSeatIdx: number,
      tgtTableId: string,
      tgtSeatIdx: number,
    ) => {
      storeSwapSeats(srcTableId, srcSeatIdx, tgtTableId, tgtSeatIdx)
      refreshTables()
    },
    [refreshTables],
  )

  const handleClearGuestAssignments = useCallback(
    (guestId: string) => {
      storeClearGuestAssignments(guestId)
      refreshTables()
    },
    [refreshTables],
  )

  return {
    tables,
    selectedTableId,
    setSelectedTableId,
    handleAddTable,
    handleUpdateTable,
    handleDeleteTable,
    handleAssignGuest,
    handleReassignGuest,
    handleUnassignSeat,
    handleSwapSeats,
    handleClearGuestAssignments,
  }
}
