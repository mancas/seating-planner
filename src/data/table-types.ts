export type TableShape = 'rectangular' | 'circular'

export interface SeatAssignment {
  seatIndex: number
  guestId: string
}

export interface FloorTable {
  id: string
  badgeId: string
  label: string
  shape: TableShape
  seatCount: number
  x: number
  y: number
  rotation: number
  seats: SeatAssignment[]
}

// ── Sizing constants ──────────────────────────────────────────────────
export const SEAT_SPACING = 48
export const TABLE_PADDING = 28
export const SEAT_RADIUS = 18
export const MIN_RECT_WIDTH = 120
export const MIN_RECT_HEIGHT = 80
export const MIN_CIRCLE_DIAMETER = 80

// ── NATO phonetic labels ──────────────────────────────────────────────
export const NATO_LABELS = [
  'ALPHA',
  'BRAVO',
  'CHARLIE',
  'DELTA',
  'ECHO',
  'FOXTROT',
  'GOLF',
  'HOTEL',
  'INDIA',
  'JULIET',
  'KILO',
  'LIMA',
  'MIKE',
  'NOVEMBER',
  'OSCAR',
  'PAPA',
  'QUEBEC',
  'ROMEO',
  'SIERRA',
  'TANGO',
  'UNIFORM',
  'VICTOR',
  'WHISKEY',
  'XRAY',
  'YANKEE',
  'ZULU',
]

// ── Geometry helpers ──────────────────────────────────────────────────

export function getRectTableSize(seatCount: number): {
  width: number
  height: number
} {
  const longSideSeats = Math.max(1, Math.ceil(seatCount / 2))
  const width = Math.max(
    MIN_RECT_WIDTH,
    longSideSeats * SEAT_SPACING + TABLE_PADDING,
  )
  const height = Math.max(MIN_RECT_HEIGHT, 60 + (seatCount <= 2 ? 0 : 20))
  return { width, height }
}

export function getCircleTableDiameter(seatCount: number): number {
  return Math.max(MIN_CIRCLE_DIAMETER, seatCount * 16 + 40)
}

export function getSeatPositions(
  shape: TableShape,
  seatCount: number,
  width: number,
  height: number,
): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = []

  if (shape === 'rectangular') {
    const topCount = Math.ceil(seatCount / 2)
    const bottomCount = seatCount - topCount

    for (let i = 0; i < topCount; i++) {
      positions.push({
        x: (width / (topCount + 1)) * (i + 1),
        y: -SEAT_RADIUS,
      })
    }

    for (let i = 0; i < bottomCount; i++) {
      positions.push({
        x: (width / (bottomCount + 1)) * (i + 1),
        y: height + SEAT_RADIUS,
      })
    }
  } else {
    const radius = width / 2 + SEAT_RADIUS
    const centerX = width / 2
    const centerY = height / 2

    for (let i = 0; i < seatCount; i++) {
      const angle = ((2 * Math.PI) / seatCount) * i - Math.PI / 2
      positions.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      })
    }
  }

  return positions
}
