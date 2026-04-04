import { LuEllipsisVertical } from 'react-icons/lu'
import IconButton from '../atoms/IconButton'

interface Props {
  onOpenProjectMenu?: () => void
}

function TopNav({ onOpenProjectMenu }: Props) {
  return (
    <nav className="w-full h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-primary md:hidden" />
        <span className="text-label font-semibold text-foreground-heading tracking-wider">
          PLANNER_V1.0
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-3">
        {onOpenProjectMenu && (
          <div className="md:hidden">
            <IconButton onClick={onOpenProjectMenu} label="Project menu">
              <LuEllipsisVertical size={20} />
            </IconButton>
          </div>
        )}
      </div>
    </nav>
  )
}

export default TopNav
