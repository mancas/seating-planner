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
