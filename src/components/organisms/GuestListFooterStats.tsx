import StatCard from '../atoms/StatCard'

interface Props {
  confirmationRate: number
  totalGifts: number
  giftCount: number
}

function GuestListFooterStats({
  confirmationRate,
  totalGifts,
  giftCount,
}: Props) {
  return (
    <div className="hidden md:grid grid-cols-3 gap-4 px-6 py-4 mt-auto border-t border-border">
      <StatCard label="CONFIRMATION RATE" value={`${confirmationRate}%`}>
        <div className="bg-gray-800 rounded-full h-1.5 w-full mt-3">
          <div
            className="bg-primary rounded-full h-1.5"
            style={{ width: `${confirmationRate}%` }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-caption text-foreground-muted">
            {confirmationRate}% SYSTEM TARGET
          </span>
          <span className="text-caption text-foreground-muted">
            {100 - confirmationRate}% PENDING
          </span>
        </div>
      </StatCard>

      <StatCard
        label="TOTAL GIFTS"
        value={`€${new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(totalGifts)}`}
      >
        <p className="text-caption text-foreground-muted mt-1">
          {giftCount > 0 ? `${giftCount} GIFTS RECEIVED` : 'NO_GIFTS_RECEIVED'}
        </p>
      </StatCard>

      <StatCard label="RSVP DEADLINE" value="T-08D">
        <span className="badge mt-2">URGENT</span>
      </StatCard>
    </div>
  )
}

export default GuestListFooterStats
