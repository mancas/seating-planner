import type { GuestStatus } from '../../data/mock-guests'

interface Props {
  status: GuestStatus
  alwaysVisible?: boolean
}

const variantClasses: Record<GuestStatus, string> = {
  CONFIRMED: 'bg-primary text-primary-foreground',
  PENDING: 'border border-primary text-primary bg-transparent',
  DECLINED: 'border border-red-500/50 text-red-400/70 bg-transparent',
}

function StatusBadge({ status, alwaysVisible = false }: Props) {
  const visibilityClass = alwaysVisible
    ? 'inline-flex'
    : 'hidden md:inline-flex'
  return (
    <span
      className={`${visibilityClass} items-center px-3 py-0.5 rounded text-label uppercase tracking-wider ${variantClasses[status]}`}
    >
      {status}
    </span>
  )
}

export default StatusBadge
