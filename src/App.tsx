import { useState, useCallback } from 'react'
import { useSearchParams, useNavigate, useLocation, Outlet } from 'react-router'
import {
  getGuests,
  addGuest as storeAddGuest,
  updateGuest as storeUpdateGuest,
  deleteGuest as storeDeleteGuest,
} from './data/guest-store'
import type { Guest } from './data/mock-guests'
import TopNav from './components/organisms/TopNav'
import LeftSidebar from './components/organisms/LeftSidebar'
import GuestListHeader from './components/organisms/GuestListHeader'
import GuestTable from './components/organisms/GuestTable'
import GuestListFooterStats from './components/organisms/GuestListFooterStats'
import GuestDetailPanel from './components/organisms/GuestDetailPanel'
import BottomTabBar from './components/organisms/BottomTabBar'
import FAB from './components/atoms/FAB'
import EmptyState from './components/organisms/EmptyState'

function App() {
  const [searchParams, setSearchParams] = useSearchParams()
  const rawTab = searchParams.get('tab') ?? 'guests'
  const activeTab = ['guests', 'canvas', 'tools', 'more'].includes(rawTab)
    ? rawTab
    : 'guests'

  const onTabChange = (tab: string) => {
    setSearchParams({ tab })
  }

  const navigate = useNavigate()
  const location = useLocation()

  const isChildRoute = location.pathname.startsWith('/guests/')

  const [guests, setGuests] = useState<Guest[]>(() => getGuests())
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')

  const locationState = location.state as { selectedGuestId?: string } | null
  if (locationState?.selectedGuestId) {
    if (selectedGuestId !== locationState.selectedGuestId) {
      setSelectedGuestId(locationState.selectedGuestId)
    }
    window.history.replaceState({}, '')
  }

  const handleAddGuest = useCallback(
    (data: Omit<Guest, 'id'>) => {
      storeAddGuest(data)
      setGuests(getGuests())
      navigate('/?tab=guests', { replace: true })
    },
    [navigate],
  )

  const handleUpdateGuest = useCallback(
    (id: string, data: Omit<Guest, 'id'>) => {
      storeUpdateGuest(id, data)
      setGuests(getGuests())
      navigate('/?tab=guests', { state: { selectedGuestId: id } })
    },
    [navigate],
  )

  const handleDeleteGuest = useCallback(
    (id: string) => {
      storeDeleteGuest(id)
      setGuests(getGuests())
      setSelectedGuestId(null)
      navigate('/?tab=guests', { replace: true })
    },
    [navigate],
  )

  const handleNavigateToAdd = useCallback(() => {
    navigate('/guests/new')
  }, [navigate])

  const handleNavigateToEdit = useCallback(
    (id: string) => {
      navigate(`/guests/${id}/edit`)
    },
    [navigate],
  )

  const onGuestClick = (guestId: string) => {
    setSelectedGuestId((prev) => (prev === guestId ? null : guestId))
  }

  const selectedGuest = guests.find((g) => g.id === selectedGuestId) ?? null

  const confirmedCount = guests.filter((g) => g.status === 'CONFIRMED').length
  const pendingCount = guests.filter((g) => g.status === 'PENDING').length
  const totalGuests = guests.length
  const confirmationRate =
    totalGuests > 0 ? Math.round((confirmedCount / totalGuests) * 100) : 0
  const dietaryFlagCount = guests.filter((g) => g.dietary.type !== null).length
  const waitlistCount = pendingCount

  const filteredGuests = guests.filter((g) => {
    const fullName = `${g.firstName} ${g.lastName}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav
        activeTab={activeTab}
        onTabChange={onTabChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar onAddGuest={handleNavigateToAdd} />
        <main className="flex-1 flex flex-col overflow-y-auto pb-16 md:pb-0">
          {isChildRoute ? (
            <Outlet
              context={{
                guests,
                onAdd: handleAddGuest,
                onUpdate: handleUpdateGuest,
                onDelete: handleDeleteGuest,
                onCancel: () => navigate(-1),
              }}
            />
          ) : activeTab === 'guests' ? (
            guests.length === 0 ? (
              <EmptyState onAddGuest={handleNavigateToAdd} />
            ) : (
              <>
                <GuestListHeader
                  confirmedCount={confirmedCount}
                  pendingCount={pendingCount}
                  totalGuests={totalGuests}
                  waitlistCount={waitlistCount}
                />
                <GuestTable
                  guests={filteredGuests}
                  selectedGuestId={selectedGuestId}
                  onGuestClick={onGuestClick}
                  searchQuery={searchQuery}
                />
                <GuestListFooterStats
                  confirmationRate={confirmationRate}
                  dietaryFlagCount={dietaryFlagCount}
                />
              </>
            )
          ) : (
            <div className="flex-1 flex items-center justify-center text-foreground-muted text-label tracking-wider">
              {activeTab.toUpperCase()} // MODULE_OFFLINE
            </div>
          )}
        </main>
        {selectedGuest && activeTab === 'guests' && !isChildRoute && (
          <GuestDetailPanel
            guest={selectedGuest}
            onClose={() => setSelectedGuestId(null)}
            onUpdate={() => handleNavigateToEdit(selectedGuest.id)}
            onDelete={() => handleDeleteGuest(selectedGuest.id)}
          />
        )}
      </div>
      {!isChildRoute && <FAB onClick={handleNavigateToAdd} label="Add guest" />}
      <BottomTabBar activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  )
}

export default App
