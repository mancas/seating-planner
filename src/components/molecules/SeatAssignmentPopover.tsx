import { useEffect, useRef } from 'react'
import type { Guest } from '../../data/mock-guests'
import Avatar from '../atoms/Avatar'

interface Props {
  seatIndex: number
  tableLabel: string
  assignedGuest: Guest | null
  unassignedGuests: Guest[]
  onAssign: (guestId: string) => void
  onUnassign: () => void
  onClose: () => void
  anchorRect: DOMRect
}

function SeatAssignmentPopover({
  seatIndex,
  tableLabel,
  assignedGuest,
  unassignedGuests,
  onAssign,
  onUnassign,
  onClose,
  anchorRect,
}: Props) {
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleMouseDown(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node)
      ) {
        onClose()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    return () => document.removeEventListener('mousedown', handleMouseDown)
  }, [onClose])

  const seatLabel = `SEAT_${String(seatIndex + 1).padStart(2, '0')}`

  // Position: centered horizontally below anchor, 8px gap
  const popoverWidth = 224 // w-56 = 14rem = 224px
  let top = anchorRect.bottom + 8
  let left = anchorRect.left + anchorRect.width / 2 - popoverWidth / 2

  // Flip above if below viewport
  if (top + 200 > window.innerHeight) {
    top = anchorRect.top - 8 - 200
  }

  // Clamp left to stay in viewport
  if (left < 8) left = 8
  if (left + popoverWidth > window.innerWidth - 8) {
    left = window.innerWidth - 8 - popoverWidth
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
            <Avatar
              firstName={assignedGuest.firstName}
              lastName={assignedGuest.lastName}
              size="sm"
            />
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
          {unassignedGuests.length > 0 ? (
            <div className="max-h-48 overflow-y-auto">
              {unassignedGuests.map((guest) => (
                <button
                  key={guest.id}
                  onClick={() => onAssign(guest.id)}
                  className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-surface-elevated text-left"
                >
                  <Avatar
                    firstName={guest.firstName}
                    lastName={guest.lastName}
                    size="sm"
                  />
                  <span className="text-body-sm text-foreground-heading">
                    {guest.firstName} {guest.lastName}
                  </span>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-caption text-foreground-muted text-center py-2">
              NO_UNASSIGNED_GUESTS // ALL_ALLOCATED
            </p>
          )}
        </>
      )}
    </div>
  )
}

export default SeatAssignmentPopover
