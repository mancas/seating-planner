import { LuUserPlus } from 'react-icons/lu'
import SidebarNavItem from '../molecules/SidebarNavItem'

interface Props {
  onAddGuest: () => void
}

function LeftSidebar({ onAddGuest }: Props) {
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
        <SidebarNavItem label="LAYOUT" isActive={false} />
        <SidebarNavItem label="OBJECTS" isActive={true} />
        <SidebarNavItem label="EXPORT" isActive={false} />
      </div>

      {/* Bottom actions */}
      <div className="mt-auto px-4 py-4 border-t border-border">
        <button
          className="btn-primary w-full flex items-center justify-center gap-2"
          onClick={onAddGuest}
        >
          <LuUserPlus size={16} />
          ADD GUEST
        </button>
        <p className="text-caption text-foreground-muted hover:text-foreground cursor-pointer mt-3 text-center">
          HISTORY
        </p>
      </div>
    </aside>
  )
}

export default LeftSidebar
