export type GuestStatus = 'CONFIRMED' | 'PENDING' | 'DECLINED'

export type Allergy = 'LACTOSE' | 'SEAFOOD' | 'SOY' | 'SPICY'

export const ALLERGIES: readonly Allergy[] = [
  'LACTOSE',
  'SEAFOOD',
  'SOY',
  'SPICY',
] as const

export interface Guest {
  id: string
  firstName: string
  lastName: string
  status: GuestStatus
  dietary: {
    type: string | null
    notes: string | null
  }
  allergies: Allergy[]
  gift: number | null
}
