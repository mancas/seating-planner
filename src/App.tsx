import { useState } from 'react'
import { useSearchParams } from 'react-router'
import {
  guests,
  getConfirmedCount,
  getPendingCount,
  getConfirmationRate,
  getDietaryFlagCount,
  getTotalGuests,
  getWaitlistCount,
} from './data/mock-guests'
import TopNav from './components/organisms/TopNav'
import LeftSidebar from './components/organisms/LeftSidebar'
import GuestListHeader from './components/organisms/GuestListHeader'
import GuestTable from './components/organisms/GuestTable'
import GuestListFooterStats from './components/organisms/GuestListFooterStats'
import GuestDetailPanel from './components/organisms/GuestDetailPanel'
import BottomTabBar from './components/organisms/BottomTabBar'
import FAB from './components/atoms/FAB'

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab') ?? 'guests'
  const activeTab = ['guests', 'canvas', 'tools', 'more'].includes(rawTab)
    ? rawTab
    : 'guests'

  const onTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const onGuestClick = (guestId: string) => {
    setSelectedGuestId((prev) => (prev === guestId ? null : guestId))
  }

  const selectedGuest = guests.find((g) => g.id === selectedGuestId) ?? null

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
          {activeTab === 'guests' ? (
            <>
              <GuestListHeader
                confirmedCount={getConfirmedCount()}
                pendingCount={getPendingCount()}
                totalGuests={getTotalGuests()}
                waitlistCount={getWaitlistCount()}
              />
              <GuestTable
                guests={guests}
                selectedGuestId={selectedGuestId}
                onGuestClick={onGuestClick}
                searchQuery={searchQuery}
              />
              <GuestListFooterStats
                confirmationRate={getConfirmationRate()}
                dietaryFlagCount={getDietaryFlagCount()}
              />
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-foreground-muted text-label tracking-wider">
              {activeTab.toUpperCase()} // MODULE_OFFLINE
            </div>
          )}
        </main>
        {selectedGuest && activeTab === 'guests' && (
          <GuestDetailPanel
            guest={selectedGuest}
            onClose={() => setSelectedGuestId(null)}
          />
        )}
      </div>
      <FAB onClick={() => {}} label="Add guest" />
      <BottomTabBar activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}

export default App
