import type { GuestStatus } from '../../data/mock-guests'

interface Props {
  status: GuestStatus
}

function StatusIcon({ status }: Props) {
  if (status === 'CONFIRMED') {
    return (
      <svg
        className="md:hidden text-primary"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    )
  }

  return (
    <svg
      className="md:hidden text-foreground-muted"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="currentColor"
    >
      <circle cx="6" cy="12" r="1.5" />
      <circle cx="12" cy="12" r="1.5" />
      <circle cx="18" cy="12" r="1.5" />
    </svg>
  )
}

export default StatusIcon
