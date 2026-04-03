import { LuUserPlus, LuPlus, LuGripVertical } from 'react-icons/lu'
import { useDraggable } from '@dnd-kit/react'
import SidebarNavItem from '../molecules/SidebarNavItem'
import type { Guest } from '../../data/mock-guests'
import type { FloorTable } from '../../data/table-types'
import { DRAG_TYPE_GUEST } from '../../data/dnd-types'

interface Props {
  activeTab: string
  onAddGuest: () => void
  onAddTable?: () => void
  guests?: Guest[]
  tables?: FloorTable[]
}

function DraggableGuestItem({ guest }: { guest: Guest }) {
  const { ref, isDragging } = useDraggable({
    id: `guest-${guest.id}`,
    data: { type: DRAG_TYPE_GUEST, guestId: guest.id },
  })

  return (
    <li
      ref={ref}
      className={`flex items-center gap-2 text-body-sm text-foreground cursor-grab px-1 py-1 rounded hover:bg-surface-elevated ${isDragging ? 'opacity-40' : ''}`}
    >
      <LuGripVertical
        size={14}
        className="text-foreground-muted flex-shrink-0"
      />
      <span className="truncate">
        {guest.firstName} {guest.lastName}
      </span>
    </li>
  )
}

function LeftSidebar({
  activeTab,
  onAddGuest,
  onAddTable,
  guests = [],
  tables = [],
}: Props) {
  const allAssignedGuestIds = new Set(
    tables.flatMap((t) => t.seats.map((s) => s.guestId)),
  )
  const unassignedGuests = guests.filter((g) => !allAssignedGuestIds.has(g.id))

  return (
    <aside className="hidden md:flex flex-col w-[220px] min-w-[220px] bg-surface border-r border-border">
      {/* Session info */}
      <div className="px-4 py-3 border-b border-border">
        <p className="text-label text-primary tracking-wider">SEATING_01</p>
        <p className="text-caption text-foreground-muted">ACTIVE SESSION</p>
      </div>

      {/* Nav items */}
      <div className="flex-1 py-2">
        <SidebarNavItem label="PROPERTIES" isActive={false} />
        <SidebarNavItem label="LAYOUT" isActive={activeTab === 'canvas'} />
        <SidebarNavItem label="OBJECTS" isActive={activeTab === 'guests'} />
        <SidebarNavItem label="EXPORT" isActive={false} />
      </div>

      {/* Bottom actions */}
      <div className="mt-auto px-4 py-4 border-t border-border">
        {activeTab === 'canvas' ? (
          <>
            <button
              className="btn-primary w-full flex items-center justify-center gap-2"
              onClick={onAddTable}
            >
              <LuPlus size={16} />
              ADD TABLE
            </button>
            {unassignedGuests.length > 0 && (
              <div className="mt-3">
                <p className="text-caption text-foreground-muted mb-2">
                  UNASSIGNED ({unassignedGuests.length})
                </p>
                <ul className="space-y-1 max-h-[200px] overflow-y-auto">
                  {unassignedGuests.map((g) => (
                    <DraggableGuestItem key={g.id} guest={g} />
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <button
            className="btn-primary w-full flex items-center justify-center gap-2"
            onClick={onAddGuest}
          >
            <LuUserPlus size={16} />
            ADD GUEST
          </button>
        )}
        <p className="text-caption text-foreground-muted hover:text-foreground cursor-pointer mt-3 text-center">
          HISTORY
        </p>
      </div>
    </aside>
  )
}

export default LeftSidebar
