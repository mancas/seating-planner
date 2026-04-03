import { LuSettings } from 'react-icons/lu'
import NavLink from '../atoms/NavLink'
import SearchInput from '../atoms/SearchInput'
import IconButton from '../atoms/IconButton'
import Avatar from '../atoms/Avatar'

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

function TopNav({
  activeTab,
  onTabChange,
  searchQuery,
  onSearchChange,
}: Props) {
  return (
    <nav className="w-full h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-primary md:hidden" />
        <span className="text-label font-semibold text-foreground-heading tracking-wider">
          PLANNER_V1.0
        </span>
      </div>

      {/* Center section — desktop only */}
      <div className="hidden md:flex items-center gap-6">
        <NavLink
          label="CANVAS"
          isActive={activeTab === 'canvas'}
          onClick={() => onTabChange('canvas')}
        />
        <NavLink
          label="GUEST LIST"
          isActive={activeTab === 'guests'}
          onClick={() => onTabChange('guests')}
        />
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:block">
          <SearchInput value={searchQuery} onChange={onSearchChange} />
        </div>
        <IconButton label="Settings">
          <LuSettings size={20} />
        </IconButton>
        <Avatar firstName="John" lastName="Doe" size="sm" />
      </div>
    </nav>
  )
}

export default TopNav
