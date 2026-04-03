import StatCard from '../atoms/StatCard'

interface Props {
  confirmedCount: number
  pendingCount: number
  totalGuests: number
  waitlistCount: number
}

function GuestListHeader({
  confirmedCount,
  pendingCount,
  totalGuests,
  waitlistCount,
}: Props) {
  return (
    <div className="px-4 md:px-6 py-4 md:py-6">
      {/* Desktop layout */}
      <div className="hidden md:block">
        <p className="text-label text-primary tracking-wider">
          REGISTRY.SYSTEM_V4
        </p>
        <h1 className="text-heading-1 text-foreground-heading mt-1">
          GUEST_LIST
        </h1>
        <div className="flex gap-4 mt-4">
          <StatCard label="TOTAL CONFIRMED" value={confirmedCount} />
          <StatCard label="PENDING" value={pendingCount} />
        </div>
      </div>

      {/* Mobile layout */}
      <div className="md:hidden">
        <p className="text-label text-primary tracking-wider">SYSTEM_LOG</p>
        <h1 className="text-heading-1 text-foreground-heading mt-1">
          GUEST LIST
        </h1>
        <p className="text-caption text-foreground-muted mt-1">
          STATUS: {confirmedCount} / {totalGuests} CONFIRMED
        </p>
        <div className="grid grid-cols-2 gap-3 mt-4">
          <StatCard label="TOTAL GUESTS" value={totalGuests} mobileBorder />
          <StatCard label="WAITLIST" value={waitlistCount} mobileBorder />
        </div>
      </div>
    </div>
  )
}

export default GuestListHeader
