import type { Guest } from './guest-types'
import type { FloorTable } from './table-types'

export function getUnassignedGuests(
  guests: Guest[],
  tables: FloorTable[],
): Guest[] {
  const assignedGuestIds = new Set(
    tables.flatMap((t) => t.seats.map((s) => s.guestId)),
  )
  return guests.filter((g) => !assignedGuestIds.has(g.id))
}

export function getGuestSeatLocation(
  guestId: string,
  tables: FloorTable[],
): { tableId: string; tableLabel: string; seatIndex: number } | null {
  for (const table of tables) {
    const seat = table.seats.find((s) => s.guestId === guestId)
    if (seat) {
      return {
        tableId: table.id,
        tableLabel: table.label,
        seatIndex: seat.seatIndex,
      }
    }
  }
  return null
}
