export type GuestStatus = 'CONFIRMED' | 'PENDING' | 'DECLINED'

export type Allergy =
  | 'LACTOSE'
  | 'SEAFOOD'
  | 'SOY'
  | 'SPICY'
  | 'COW_MILK_PROTEIN'
  | 'PEACH'
  | 'COD'
  | 'DRIED_FRUITS'
  | 'CORN'

export const ALLERGIES: readonly Allergy[] = [
  'LACTOSE',
  'COW_MILK_PROTEIN',
  'SEAFOOD',
  'COD',
  'SOY',
  'CORN',
  'PEACH',
  'DRIED_FRUITS',
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
  secretMission: boolean
}
