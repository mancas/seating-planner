import { LuCircleCheck, LuEllipsis } from 'react-icons/lu'
import type { GuestStatus } from '../../data/mock-guests'

interface Props {
  status: GuestStatus
}

function StatusIcon({ status }: Props) {
  if (status === 'CONFIRMED') {
    return <LuCircleCheck size={24} className="md:hidden text-primary" />
  }

  return <LuEllipsis size={24} className="md:hidden text-foreground-muted" />
}

export default StatusIcon
