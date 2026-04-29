import { Drawer } from 'vaul'
import { LuX } from 'react-icons/lu'
import type { Guest } from '../../data/guest-types'
import type { FloorTable } from '../../data/table-types'
import { getUnassignedGuests } from '../../data/guest-utils'
import IconButton from '../atoms/IconButton'

interface Props {
  guests: Guest[]
  tables: FloorTable[]
  onClose: () => void
}

function MobileGuestsSheet({ guests, tables, onClose }: Props) {
  const unassignedGuests = getUnassignedGuests(guests, tables)
  const seatedTableByGuestId = new Map<string, string>()
  for (const t of tables) {
    for (const s of t.seats) {
      seatedTableByGuestId.set(s.guestId, t.label)
    }
  }

  return (
    <Drawer.Root
      open
      snapPoints={[0.4, 0.75, 1]}
      activeSnapPoint={0.75}
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-black/40" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl border-t border-border h-full flex flex-col outline-none">
          <Drawer.Handle className="bg-gray-600 my-3" />
          <Drawer.Title className="sr-only">Guests</Drawer.Title>
          <Drawer.Description className="sr-only">
            List of guests with seating status
          </Drawer.Description>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border shrink-0">
            <span className="text-label text-foreground-muted tracking-wider uppercase">
              GUESTS ({unassignedGuests.length}/{guests.length})
            </span>
            <IconButton onClick={onClose} label="Close guest list">
              <LuX size={20} />
            </IconButton>
          </div>

          {/* Scrollable guest list */}
          <div className="overflow-y-auto flex-1 px-4 py-3" data-vaul-no-drag>
            {guests.length > 0 ? (
              <div className="flex flex-col gap-2">
                {guests.map((guest) => {
                  const tableLabel = seatedTableByGuestId.get(guest.id)
                  return (
                    <div
                      key={guest.id}
                      className="flex items-center gap-2 py-1.5"
                    >
                      <span className="text-body-sm text-foreground-heading flex-1">
                        {guest.firstName} {guest.lastName}
                      </span>
                      {tableLabel && (
                        <span
                          className="shrink-0 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wider uppercase bg-primary text-primary-foreground"
                          aria-label={`Seated at ${tableLabel}`}
                        >
                          {tableLabel}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-caption text-foreground-muted text-center py-4">
                NO_GUESTS
              </p>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default MobileGuestsSheet
