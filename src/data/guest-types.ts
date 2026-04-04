export type GuestStatus = 'CONFIRMED' | 'PENDING' | 'DECLINED'

export interface Guest {
  id: string
  firstName: string
  lastName: string
  role: string
  status: GuestStatus
  accessLevel: string
  tableAssignment: string | null
  seatNumber: number | null
  dietary: {
    type: string | null
    notes: string | null
  }
  gift: number | null
  logistics: {
    shuttleRequired: boolean
    shuttleFrom: string | null
    lodgingBooked: boolean
    lodgingVenue: string | null
  }
}
