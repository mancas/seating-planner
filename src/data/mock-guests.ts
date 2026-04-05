import type { Guest } from './guest-types'

export const guests: Guest[] = [
  {
    id: '4492-AX',
    firstName: 'ELARA',
    lastName: 'RIVERA',
    status: 'CONFIRMED',
    gift: 250,
    dietary: {
      type: 'VEGAN',
      notes:
        'Severe nut allergy. Prefers quiet zone seating away from main speakers.',
    },
  },
  {
    id: '3371-BK',
    firstName: 'ALEXANDER',
    lastName: 'VANCE',
    status: 'CONFIRMED',
    gift: null,
    dietary: {
      type: null,
      notes: null,
    },
  },
  {
    id: '5580-CR',
    firstName: 'MARCUS',
    lastName: 'CHEN',
    status: 'PENDING',
    gift: 100,
    dietary: {
      type: 'VEGETARIAN',
      notes: null,
    },
  },
  {
    id: '1039-CK',
    firstName: 'MARCUS',
    lastName: 'STERLING',
    status: 'CONFIRMED',
    gift: 150,
    dietary: {
      type: null,
      notes: null,
    },
  },
  {
    id: '3311-DS',
    firstName: 'SARA',
    lastName: 'MORGAN',
    status: 'DECLINED',
    gift: null,
    dietary: {
      type: 'GLUTEN-FREE',
      notes: 'Celiac disease - strict cross-contamination protocol',
    },
  },
  {
    id: '8821-BL',
    firstName: 'JULIAN',
    lastName: 'KANE',
    status: 'PENDING',
    gift: null,
    dietary: {
      type: null,
      notes: null,
    },
  },
]
