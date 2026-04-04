import type { Guest } from '../../data/guest-types'
import StatusIcon from '../atoms/StatusIcon'

interface Props {
  guest: Guest
  isSelected: boolean
  onClick: () => void
}

function GuestRowMobile({ guest, isSelected, onClick }: Props) {
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
      <div className="flex items-center gap-3 px-4 py-3">
        <span className="text-caption text-foreground-muted w-8 shrink-0">
          {seatDisplay}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-body-sm font-semibold text-foreground-heading uppercase">
            {guest.firstName}_{guest.lastName}
          </p>
        </div>
        <StatusIcon status={guest.status} />
      </div>
    </div>
  )
}

export default GuestRowMobile
