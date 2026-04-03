import type { Guest } from '../../data/mock-guests'
import Avatar from '../atoms/Avatar'
import StatusBadge from '../atoms/StatusBadge'
import StatusIcon from '../atoms/StatusIcon'
import IconButton from '../atoms/IconButton'

interface Props {
  guest: Guest
  isSelected: boolean
  onClick: () => void
}

function GuestRow({ guest, isSelected, onClick }: Props) {
  const selectedClasses = isSelected
    ? 'border-l-2 border-l-primary bg-surface-elevated'
    : 'border-l-2 border-l-transparent'

  const seatDisplay =
    guest.seatNumber !== null ? String(guest.seatNumber).padStart(2, '0') : '--'

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer hover:bg-gray-800/50 ${selectedClasses}`}
    >
      {/* Desktop layout */}
      <div className="hidden md:grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 px-4 py-3">
        <div className="flex items-center gap-3">
          <Avatar
            firstName={guest.firstName}
            lastName={guest.lastName}
            size="sm"
          />
          <div>
            <p className="text-body-sm font-semibold text-foreground-heading uppercase">
              {guest.firstName} {guest.lastName}
            </p>
            <p className="text-caption text-foreground-muted">ID: {guest.id}</p>
          </div>
        </div>
        <StatusBadge status={guest.status} />
        <span className="text-body-sm text-foreground-muted">
          {guest.tableAssignment ?? '- - -'}
        </span>
        <IconButton label="Actions">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="4" cy="8" r="1.5" />
            <circle cx="8" cy="8" r="1.5" />
            <circle cx="12" cy="8" r="1.5" />
          </svg>
        </IconButton>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3">
        <span className="text-caption text-foreground-muted w-8 shrink-0">
          {seatDisplay}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-semibold text-foreground-heading uppercase">
            {guest.firstName}_{guest.lastName}
          </p>
          <p className="text-caption text-foreground-muted">{guest.role}</p>
        </div>
        <StatusIcon status={guest.status} />
      </div>
    </div>
  )
}

export default GuestRow
