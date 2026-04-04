import { Drawer } from 'vaul'
import { LuX } from 'react-icons/lu'
import type { Guest } from '../../data/guest-types'
import IconButton from '../atoms/IconButton'

interface Props {
  guests: Guest[]
  onClose: () => void
}

function MobileGuestsSheet({ guests, onClose }: Props) {
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
          <Drawer.Title className="sr-only">Unassigned Guests</Drawer.Title>

          {/* Header */}
          <div className="flex items-center justify-between px-4 pb-3 border-b border-border shrink-0">
            <span className="text-label text-foreground-muted tracking-wider uppercase">
              UNASSIGNED_GUESTS ({guests.length})
            </span>
            <IconButton onClick={onClose} label="Close guest list">
              <LuX size={20} />
            </IconButton>
          </div>

          {/* Scrollable guest list */}
          <div className="overflow-y-auto flex-1 px-4 py-3" data-vaul-no-drag>
            {guests.length > 0 ? (
              <div className="flex flex-col gap-2">
                {guests.map((guest) => (
                  <div
                    key={guest.id}
                    className="flex items-center gap-2 py-1.5"
                  >
                    <span className="text-body-sm text-foreground-heading">
                      {guest.firstName} {guest.lastName}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-caption text-foreground-muted text-center py-4">
                NO_UNASSIGNED_GUESTS // ALL_ALLOCATED
              </p>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  )
}

export default MobileGuestsSheet
