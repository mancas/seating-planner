import { useCallback } from 'react'
import { useNavigate } from 'react-router'
import { getGuests } from '../data/guest-store'
import { getTables } from '../data/table-store'
import { useGuestStats } from '../hooks/useGuestStats'
import LeftSidebar from '../components/organisms/LeftSidebar'
import StatCard from '../components/atoms/StatCard'

function formatCurrency(n: number): string {
  return (
    '€' + new Intl.NumberFormat('de-DE', { maximumFractionDigits: 0 }).format(n)
  )
}

function StatsView() {
  const navigate = useNavigate()
  const guests = getGuests()
  const tables = getTables()

  const {
    confirmedCount,
    pendingCount,
    totalGuests,
    confirmationRate,
    totalGifts,
    giftCount,
    waitlistCount,
  } = useGuestStats(guests)

  const declinedCount = guests.filter((g) => g.status === 'DECLINED').length
  const totalSeats = tables.reduce((sum, t) => sum + t.seatCount, 0)
  const occupiedSeats = tables.reduce((sum, t) => sum + t.seats.length, 0)
  const seatOccupancyRate =
    totalSeats > 0 ? Math.round((occupiedSeats / totalSeats) * 100) : 0
  const avgGift = giftCount > 0 ? totalGifts / giftCount : 0

  const handleNavigateToAdd = useCallback(
    () => navigate('/guests/new'),
    [navigate],
  )
  const handleSidebarAddTable = useCallback(
    () => navigate('/seating-plan'),
    [navigate],
  )

  return (
    <>
      <LeftSidebar
        onAddGuest={handleNavigateToAdd}
        onAddTable={handleSidebarAddTable}
        guests={guests}
        tables={tables}
      />
      <main className="relative flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
        <div className="px-4 md:px-6 py-4 md:py-6">
          <div className="hidden md:block">
            <p className="text-label text-primary tracking-wider">
              ANALYTICS.MODULE_V1
            </p>
            <h1 className="text-heading-1 text-foreground-heading mt-1">
              STATS
            </h1>
          </div>
          <div className="md:hidden">
            <p className="text-label text-primary tracking-wider">
              SYSTEM_REPORT
            </p>
            <h1 className="text-heading-1 text-foreground-heading mt-1">
              STATS
            </h1>
            <p className="text-caption text-foreground-muted mt-1">
              STATUS: {confirmedCount} / {totalGuests} CONFIRMED
            </p>
          </div>
        </div>

        <div className="flex-1 px-4 md:px-6 pb-6 space-y-6">
          {/* Guests */}
          <section>
            <h2 className="text-label text-foreground-muted tracking-wider uppercase border-b border-border pb-2 mb-4">
              GUESTS
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              <StatCard label="TOTAL GUESTS" value={totalGuests} mobileBorder />
              <StatCard label="CONFIRMED" value={confirmedCount} mobileBorder />
              <StatCard label="PENDING" value={pendingCount} mobileBorder />
              <StatCard label="DECLINED" value={declinedCount} mobileBorder />
            </div>
          </section>

          {/* Confirmation */}
          <section>
            <h2 className="text-label text-foreground-muted tracking-wider uppercase border-b border-border pb-2 mb-4">
              CONFIRMATION
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <StatCard
                label="CONFIRMATION RATE"
                value={`${confirmationRate}%`}
              >
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
              <StatCard label="WAITLIST" value={waitlistCount}>
                <p className="text-caption text-foreground-muted mt-1">
                  {waitlistCount > 0
                    ? `${waitlistCount} AWAITING_CONFIRMATION`
                    : 'NO_PENDING_RESPONSES'}
                </p>
              </StatCard>
            </div>
          </section>

          {/* Seating */}
          <section>
            <h2 className="text-label text-foreground-muted tracking-wider uppercase border-b border-border pb-2 mb-4">
              SEATING
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
              <StatCard label="TABLES" value={tables.length} mobileBorder />
              <StatCard label="TOTAL SEATS" value={totalSeats} mobileBorder />
              <StatCard
                label="OCCUPANCY"
                value={`${seatOccupancyRate}%`}
                mobileBorder
              >
                <p className="text-caption text-foreground-muted mt-1">
                  {occupiedSeats}/{totalSeats} SEATS_TAKEN
                </p>
              </StatCard>
            </div>
          </section>

          {/* Gifts */}
          <section>
            <h2 className="text-label text-foreground-muted tracking-wider uppercase border-b border-border pb-2 mb-4">
              GIFTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <StatCard label="TOTAL GIFTS" value={formatCurrency(totalGifts)}>
                <p className="text-caption text-foreground-muted mt-1">
                  {giftCount > 0
                    ? `${giftCount} GIFTS RECEIVED`
                    : 'NO_GIFTS_RECEIVED'}
                </p>
              </StatCard>
              <StatCard label="AVG PER GIFT" value={formatCurrency(avgGift)} />
              <StatCard label="RSVP DEADLINE" value="T-08D">
                <span className="badge mt-2">URGENT</span>
              </StatCard>
            </div>
          </section>
        </div>
      </main>
    </>
  )
}

export default StatsView
