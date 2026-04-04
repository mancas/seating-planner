import { useMemo } from 'react'
import { Drawer } from 'vaul'
import { LuX } from 'react-icons/lu'
import type { FloorTable } from '../../data/table-types'
import type { Guest } from '../../data/guest-types'
import Avatar from '../atoms/Avatar'
import IconButton from '../atoms/IconButton'

interface Props {
  seatIndex: number
  tableLabel: string
  assignedGuest: Guest | null
  unassignedGuests: Guest[]
  tables: FloorTable[]
  guests: Guest[]
  onAssign: (guestId: string) => void
  onUnassign: () => void
  onClose: () => void
}

function MobileSeatAssignmentSheet({
  seatIndex,
  tableLabel,
  assignedGuest,
  unassignedGuests,
  tables,
  guests,
  onAssign,
  onUnassign,
  onClose,
}: Props) {
  const assignedElsewhere = useMemo(() => {
    const result: { guest: Guest; tableLabel: string; seatIndex: number }[] = []
    for (const table of tables) {
      for (const seat of table.seats) {
        if (table.label === tableLabel && seat.seatIndex === seatIndex) continue
        const guest = guests.find((g) => g.id === seat.guestId)
        if (guest) {
          result.push({
            guest,
            tableLabel: table.label,
            seatIndex: seat.seatIndex,
          })
        }
      }
    }
    return result
  }, [tables, guests, tableLabel, seatIndex])

  return (
    <Drawer.Root
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl border-t border-border max-h-[60vh] flex flex-col outline-none">
          <Drawer.Handle className="bg-gray-600 my-3" />
          <Drawer.Title className="sr-only">Seat Assignment</Drawer.Title>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border shrink-0">
            <div>
              <span className="text-label text-foreground-muted tracking-wider uppercase block">
                {assignedGuest ? 'ASSIGNED_GUEST' : 'ASSIGN_GUEST'}
              </span>
              <span className="text-caption text-foreground-muted">
                {tableLabel} // SEAT_
                {String(seatIndex + 1).padStart(2, '0')}
              </span>
            </div>
            <IconButton onClick={onClose} label="Close seat assignment">
              <LuX size={20} />
            </IconButton>
          </div>

          {/* Scrollable body */}
          <div className="overflow-y-auto flex-1 px-4 py-3" data-vaul-no-drag>
            {assignedGuest ? (
              <>
                <div className="flex items-center gap-2 py-2">
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
                  className="btn-ghost w-full mt-3 text-red-400 hover:text-red-300"
                >
                  UNASSIGN
                </button>
              </>
            ) : (
              <>
                {unassignedGuests.length === 0 &&
                assignedElsewhere.length === 0 ? (
                  <p className="text-caption text-foreground-muted text-center py-4">
                    NO_UNASSIGNED_GUESTS // ALL_ALLOCATED
                  </p>
                ) : (
                  <>
                    {/* Unassigned section */}
                    {unassignedGuests.length > 0 && (
                      <>
                        <p className="text-label text-foreground-muted tracking-wider uppercase mb-2">
                          UNASSIGNED
                        </p>
                        {unassignedGuests.map((guest) => (
                          <button
                            key={guest.id}
                            onClick={() => onAssign(guest.id)}
                            className="w-full flex items-center gap-2 px-2 py-2.5 rounded cursor-pointer active:bg-surface-elevated text-left"
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
                      </>
                    )}

                    {/* Assigned elsewhere section */}
                    {assignedElsewhere.length > 0 && (
                      <>
                        <p className="text-label text-foreground-muted tracking-wider uppercase mb-2 mt-4">
                          ASSIGNED_ELSEWHERE
                        </p>
                        {assignedElsewhere.map(
                          ({ guest, tableLabel: tLabel, seatIndex: sIdx }) => (
                            <button
                              key={guest.id}
                              onClick={() => onAssign(guest.id)}
                              className="w-full flex items-start gap-2 px-2 py-2.5 rounded cursor-pointer active:bg-surface-elevated text-left"
                            >
                              <Avatar
                                firstName={guest.firstName}
                                lastName={guest.lastName}
                                size="sm"
                              />
                              <div>
                                <span className="text-body-sm text-foreground-heading block">
                                  {guest.firstName} {guest.lastName}
                                </span>
                                <span className="text-caption text-foreground-muted">
                                  Currently at {tLabel} / SEAT_
                                  {String(sIdx + 1).padStart(2, '0')}
                                </span>
                              </div>
                            </button>
                          ),
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default MobileSeatAssignmentSheet
