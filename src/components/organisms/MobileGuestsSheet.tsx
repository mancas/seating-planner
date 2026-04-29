import { Drawer } from 'vaul'
import { LuX, LuCircleCheck } from 'react-icons/lu'
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
  const unassignedIds = new Set(unassignedGuests.map((g) => g.id))
  const seatedGuests = guests.filter((g) => !unassignedIds.has(g.id))

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
                {unassignedGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center gap-2 py-1.5"
                  >
                    <span className="text-body-sm text-foreground-heading">
                      {guest.firstName} {guest.lastName}
                    </span>
                  </div>
                ))}
                {seatedGuests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center gap-2 py-1.5 opacity-60"
                  >
                    <LuCircleCheck
                      size={14}
                      className="text-primary shrink-0"
                      aria-label="Seated"
                    />
                    <span className="text-body-sm text-foreground-muted">
                      {guest.firstName} {guest.lastName}
                    </span>
                  </div>
                ))}
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
