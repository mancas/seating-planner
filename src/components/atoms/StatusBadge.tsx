import type { GuestStatus } from '../../data/mock-guests'

interface Props {
  status: GuestStatus
}

const variantClasses: Record<GuestStatus, string> = {
  CONFIRMED: 'bg-primary text-primary-foreground',
  PENDING: 'border border-primary text-primary bg-transparent',
  DECLINED: 'border border-red-500/50 text-red-400/70 bg-transparent',
}

function StatusBadge({ status }: Props) {
  return (
    <span
      className={`hidden md:inline-flex items-center px-3 py-0.5 rounded text-label uppercase tracking-wider ${variantClasses[status]}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
