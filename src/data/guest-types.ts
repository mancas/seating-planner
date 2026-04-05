export type GuestStatus = 'CONFIRMED' | 'PENDING' | 'DECLINED'

export interface Guest {
  id: string
  firstName: string
  lastName: string
  status: GuestStatus
  dietary: {
    type: string | null
    notes: string | null
  }
  gift: number | null
}
