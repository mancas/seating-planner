import type { FloorTable, SeatAssignment } from './table-types'
import { NATO_LABELS } from './table-types'
import { v4 as uuidv4 } from 'uuid'
import { createStorage } from './storage-utils'

const tableStorage = createStorage<FloorTable[]>('seating-plan:tables', [])
const counterStorage = createStorage<number>('seating-plan:table-counter', 0)

// ── Public API ────────────────────────────────────────────────────────

export function getTables(): FloorTable[] {
  return tableStorage.read()
}

export function getTableById(id: string): FloorTable | undefined {
  return tableStorage.read().find((t) => t.id === id)
}

export function addTable(
  data: Omit<FloorTable, 'id' | 'badgeId' | 'label' | 'seats'> & {
    seats?: SeatAssignment[]
  },
): FloorTable {
  const tables = tableStorage.read()
  const counter = counterStorage.read() + 1
  counterStorage.write(counter)

  const badgeId = `T${String(counter).padStart(2, '0')}`
  const label = `TABLE ${NATO_LABELS[(counter - 1) % NATO_LABELS.length]}`

  const newTable: FloorTable = {
    id: uuidv4(),
    badgeId,
    label,
    shape: data.shape,
    seatCount: data.seatCount,
    x: data.x,
    y: data.y,
    rotation: data.rotation,
    seats: data.seats ?? [],
  }

  tables.push(newTable)
  tableStorage.write(tables)
  return newTable
}

export function updateTable(
  id: string,
  data: Partial<Omit<FloorTable, 'id' | 'badgeId'>>,
): FloorTable | undefined {
  const tables = tableStorage.read()
  const index = tables.findIndex((t) => t.id === id)
  if (index === -1) return undefined

  const existing = tables[index]

  // Clamp rotation if provided
  let rotation = data.rotation ?? existing.rotation
  rotation = ((rotation % 360) + 360) % 360

  // Handle seatCount reduction: auto-unassign seats beyond the new count
  const newSeatCount = data.seatCount ?? existing.seatCount
  let seats = data.seats ?? existing.seats
  if (newSeatCount < existing.seatCount) {
    seats = seats.filter((s) => s.seatIndex < newSeatCount)
  }

  const updated: FloorTable = {
    ...existing,
    ...data,
    rotation,
    seats,
  }

  tables[index] = updated
  tableStorage.write(tables)
  return updated
}

export function deleteTable(id: string): boolean {
  const tables = tableStorage.read()
  const filtered = tables.filter((t) => t.id !== id)
  if (filtered.length === tables.length) return false
  tableStorage.write(filtered)
  return true
}

export function assignGuestToSeat(
  tableId: string,
  seatIndex: number,
  guestId: string,
): FloorTable | undefined {
  const tables = tableStorage.read()
  const index = tables.findIndex((t) => t.id === tableId)
  if (index === -1) return undefined

  // Clear guest from ALL tables first to prevent multi-assignment
  for (let i = 0; i < tables.length; i++) {
    const filtered = tables[i].seats.filter((s) => s.guestId !== guestId)
    if (filtered.length !== tables[i].seats.length) {
      tables[i] = { ...tables[i], seats: filtered }
    }
  }

  const table = { ...tables[index] }
  // Remove any existing assignment at this seat
  table.seats = table.seats.filter((s) => s.seatIndex !== seatIndex)
  table.seats.push({ seatIndex, guestId })

  tables[index] = table
  tableStorage.write(tables)
  return table
}

export function unassignSeat(
  tableId: string,
  seatIndex: number,
): FloorTable | undefined {
  const tables = tableStorage.read()
  const index = tables.findIndex((t) => t.id === tableId)
  if (index === -1) return undefined

  const table = { ...tables[index] }
  table.seats = table.seats.filter((s) => s.seatIndex !== seatIndex)

  tables[index] = table
  tableStorage.write(tables)
  return table
}

export function swapSeats(
  sourceTableId: string,
  sourceSeatIndex: number,
  targetTableId: string,
  targetSeatIndex: number,
): void {
  // No-op if same table and same seat
  if (sourceTableId === targetTableId && sourceSeatIndex === targetSeatIndex)
    return

  const tables = tableStorage.read()

  const sourceTableIdx = tables.findIndex((t) => t.id === sourceTableId)
  if (sourceTableIdx === -1) return

  const sourceAssignment = tables[sourceTableIdx].seats.find(
    (s) => s.seatIndex === sourceSeatIndex,
  )
  // No-op if source seat is empty
  if (!sourceAssignment) return

  const targetTableIdx = tables.findIndex((t) => t.id === targetTableId)
  if (targetTableIdx === -1) return

  const targetAssignment = tables[targetTableIdx].seats.find(
    (s) => s.seatIndex === targetSeatIndex,
  )

  // Remove both assignments
  tables[sourceTableIdx] = {
    ...tables[sourceTableIdx],
    seats: tables[sourceTableIdx].seats.filter(
      (s) => s.seatIndex !== sourceSeatIndex,
    ),
  }

  // Remove target assignment (works for both same-table and cross-table cases)
  tables[targetTableIdx] = {
    ...tables[targetTableIdx],
    seats: tables[targetTableIdx].seats.filter(
      (s) => s.seatIndex !== targetSeatIndex,
    ),
  }

  // Re-add swapped
  tables[targetTableIdx].seats.push({
    seatIndex: targetSeatIndex,
    guestId: sourceAssignment.guestId,
  })

  if (targetAssignment) {
    tables[sourceTableIdx].seats.push({
      seatIndex: sourceSeatIndex,
      guestId: targetAssignment.guestId,
    })
  }

  tableStorage.write(tables)
}

export function findFirstEmptySeat(table: FloorTable): number | null {
  const occupiedSeats = new Set(table.seats.map((s) => s.seatIndex))
  for (let i = 0; i < table.seatCount; i++) {
    if (!occupiedSeats.has(i)) return i
  }
  return null
}

export function clearGuestAssignments(guestId: string): void {
  const tables = tableStorage.read()
  let changed = false

  for (let i = 0; i < tables.length; i++) {
    const filtered = tables[i].seats.filter((s) => s.guestId !== guestId)
    if (filtered.length !== tables[i].seats.length) {
      tables[i] = { ...tables[i], seats: filtered }
      changed = true
    }
  }

  if (changed) {
    tableStorage.write(tables)
  }
}
