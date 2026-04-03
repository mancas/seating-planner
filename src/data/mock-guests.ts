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
  logistics: {
    shuttleRequired: boolean
    shuttleFrom: string | null
    lodgingBooked: boolean
    lodgingVenue: string | null
  }
}

export const guests: Guest[] = [
  {
    id: '4492-AX',
    firstName: 'ELARA',
    lastName: 'RIVERA',
    role: 'LEAD SYSTEMS ARCHITECT',
    status: 'CONFIRMED',
    accessLevel: 'TIER_01',
    tableAssignment: 'TABLE_04',
    seatNumber: 1,
    dietary: {
      type: 'VEGAN',
      notes:
        'Severe nut allergy. Prefers quiet zone seating away from main speakers.',
    },
    logistics: {
      shuttleRequired: true,
      shuttleFrom: 'Neo Tokyo North Port',
      lodgingBooked: true,
      lodgingVenue: 'Cobalt Executive Suites',
    },
  },
  {
    id: '3371-BK',
    firstName: 'ALEXANDER',
    lastName: 'VANCE',
    role: 'PRIORITY VIP',
    status: 'CONFIRMED',
    accessLevel: 'TIER_01',
    tableAssignment: 'TABLE_04',
    seatNumber: 2,
    dietary: {
      type: null,
      notes: null,
    },
    logistics: {
      shuttleRequired: false,
      shuttleFrom: null,
      lodgingBooked: false,
      lodgingVenue: null,
    },
  },
  {
    id: '5580-CR',
    firstName: 'MARCUS',
    lastName: 'CHEN',
    role: 'GENERAL',
    status: 'PENDING',
    accessLevel: 'TIER_02',
    tableAssignment: 'TABLE_02',
    seatNumber: 1,
    dietary: {
      type: 'VEGETARIAN',
      notes: null,
    },
    logistics: {
      shuttleRequired: true,
      shuttleFrom: 'AIRPORT_TERMINAL',
      lodgingBooked: false,
      lodgingVenue: null,
    },
  },
  {
    id: '1039-CK',
    firstName: 'MARCUS',
    lastName: 'STERLING',
    role: 'PLUS ONE',
    status: 'CONFIRMED',
    accessLevel: 'TIER_01',
    tableAssignment: 'TABLE_02',
    seatNumber: 2,
    dietary: {
      type: null,
      notes: null,
    },
    logistics: {
      shuttleRequired: false,
      shuttleFrom: null,
      lodgingBooked: true,
      lodgingVenue: 'PARKSIDE INN',
    },
  },
  {
    id: '3311-DS',
    firstName: 'SARA',
    lastName: 'MORGAN',
    role: 'GENERAL',
    status: 'DECLINED',
    accessLevel: 'TIER_02',
    tableAssignment: null,
    seatNumber: null,
    dietary: {
      type: 'GLUTEN-FREE',
      notes: 'Celiac disease - strict cross-contamination protocol',
    },
    logistics: {
      shuttleRequired: false,
      shuttleFrom: null,
      lodgingBooked: false,
      lodgingVenue: null,
    },
  },
  {
    id: '8821-BL',
    firstName: 'JULIAN',
    lastName: 'KANE',
    role: 'PENDING RESPONSE',
    status: 'PENDING',
    accessLevel: 'TIER_02',
    tableAssignment: null,
    seatNumber: null,
    dietary: {
      type: null,
      notes: null,
    },
    logistics: {
      shuttleRequired: false,
      shuttleFrom: null,
      lodgingBooked: false,
      lodgingVenue: null,
    },
  },
]

export function getConfirmedCount(): number {
  return guests.filter((g) => g.status === 'CONFIRMED').length
}

export function getPendingCount(): number {
  return guests.filter((g) => g.status === 'PENDING').length
}

export function getConfirmationRate(): number {
  return Math.round((getConfirmedCount() / guests.length) * 100)
}

export function getDietaryFlagCount(): number {
  return guests.filter((g) => g.dietary.type !== null).length
}

export function getTotalGuests(): number {
  return guests.length
}

export function getWaitlistCount(): number {
  return getPendingCount()
}

export function getGuestsByTable(): Map<string, Guest[]> {
  const map = new Map<string, Guest[]>()
  for (const guest of guests) {
    const key = guest.tableAssignment ?? 'UNASSIGNED'
    const group = map.get(key)
    if (group) {
      group.push(guest)
    } else {
      map.set(key, [guest])
    }
  }
  return map
}
