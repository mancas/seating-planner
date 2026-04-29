import { useEffect, useMemo, useRef } from 'react'
import type { Guest } from '../../data/guest-types'
import type { FloorTable } from '../../data/table-types'

interface Props {
  seatIndex: number
  tableLabel: string
  assignedGuest: Guest | null
  guests: Guest[]
  tables: FloorTable[]
  onAssign: (guestId: string) => void
  onUnassign: () => void
  onClose: () => void
  anchorRect: DOMRect
}

const POPOVER_WIDTH = 224
const POPOVER_GAP = 8

function SeatAssignmentPopover({
  seatIndex,
  tableLabel,
  assignedGuest,
  guests,
  tables,
  onAssign,
  onUnassign,
  onClose,
  anchorRect,
}: Props) {
  const popoverRef = useRef<HTMLDivElement>(null)

  const seatedTableByGuestId = useMemo(() => {
    const map = new Map<string, string>()
    for (const t of tables) {
      for (const s of t.seats) {
        map.set(s.guestId, t.label)
      }
    }
    return map
  }, [tables])

  useEffect(() => {
    function handlePointerDown(e: MouseEvent | TouchEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('touchstart', handlePointerDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('touchstart', handlePointerDown)
    }
  }, [onClose])

  const seatLabel = `SEAT_${String(seatIndex + 1).padStart(2, '0')}`

  // Position: centered horizontally below anchor
  let top = anchorRect.bottom + POPOVER_GAP
  let left = anchorRect.left + anchorRect.width / 2 - POPOVER_WIDTH / 2

  // Flip above if below viewport
  if (top + 200 > window.innerHeight) {
    top = anchorRect.top - POPOVER_GAP - 200
  }

  // Clamp left to stay in viewport
  if (left < POPOVER_GAP) left = POPOVER_GAP
  if (left + POPOVER_WIDTH > window.innerWidth - POPOVER_GAP) {
    left = window.innerWidth - POPOVER_GAP - POPOVER_WIDTH
  }

  return (
    <div
      ref={popoverRef}
      className="fixed z-50 bg-surface border border-border rounded shadow-lg p-3 w-56"
      style={{ top, left }}
    >
      {assignedGuest ? (
        <>
          <p className="text-caption text-foreground-muted mb-2">
            ASSIGNED // {tableLabel} // {seatLabel}
          </p>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-body-sm text-foreground-heading font-semibold">
              {assignedGuest.firstName} {assignedGuest.lastName}
            </span>
          </div>
          <button
            onClick={onUnassign}
            className="btn-ghost w-full mt-2 text-red-400 hover:text-red-300"
          >
            UNASSIGN
          </button>
        </>
      ) : (
        <>
          <p className="text-caption text-foreground-muted mb-2">
            ASSIGN_GUEST // {tableLabel} // {seatLabel}
          </p>
          {guests.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              {guests.map((guest) => {
                const seatedAt = seatedTableByGuestId.get(guest.id)
                return (
                  <button
                    key={guest.id}
                    onClick={() => onAssign(guest.id)}
                    className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-elevated text-left"
                  >
                    <span className="text-body-sm text-foreground-heading flex-1 truncate">
                      {guest.firstName} {guest.lastName}
                    </span>
                    {seatedAt && (
                      <span
                        className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase bg-primary text-primary-foreground"
                        aria-label={`Seated at ${seatedAt}`}
                      >
                        {seatedAt}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          ) : (
            <p className="text-caption text-foreground-muted text-center py-2">
              NO_GUESTS
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default SeatAssignmentPopover
