import { useState, useCallback } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router'
import {
  getGuests,
  addGuest as storeAddGuest,
  updateGuest as storeUpdateGuest,
  deleteGuest as storeDeleteGuest,
} from '../data/guest-store'
import type { Guest } from '../data/guest-types'
import { useGuestStats } from '../hooks/useGuestStats'
import {
  getTables,
  clearGuestAssignments as storeClearGuestAssignments,
} from '../data/table-store'
import LeftSidebar from '../components/organisms/LeftSidebar'
import GuestListHeader from '../components/organisms/GuestListHeader'
import GuestTable from '../components/organisms/GuestTable'
import GuestListFooterStats from '../components/organisms/GuestListFooterStats'
import GuestDetailPanel from '../components/organisms/GuestDetailPanel'
import FAB from '../components/atoms/FAB'
import EmptyState from '../components/organisms/EmptyState'

function GuestListView() {
  const navigate = useNavigate()
  const location = useLocation()

  const isChildRoute = location.pathname.startsWith('/guests/')

  const [guests, setGuests] = useState<Guest[]>(() => getGuests())
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)

  // Adjust selectedGuestId when location.state changes (React-recommended pattern).
  // Uses state to track previous value instead of useEffect to avoid cascading renders.
  // See: https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  const [prevLocationState, setPrevLocationState] = useState(location.state)
  if (location.state !== prevLocationState) {
    setPrevLocationState(location.state)
    const locationState = location.state as { selectedGuestId?: string } | null
    if (locationState?.selectedGuestId) {
      setSelectedGuestId(locationState.selectedGuestId)
      window.history.replaceState({}, '')
    }
  }

  const tables = getTables()

  const handleAddGuest = useCallback(
    (data: Omit<Guest, 'id'>) => {
      storeAddGuest(data)
      setGuests(getGuests())
      navigate('/', { replace: true })
    },
    [navigate],
  )

  const handleUpdateGuest = useCallback(
    (id: string, data: Omit<Guest, 'id'>) => {
      storeUpdateGuest(id, data)
      setGuests(getGuests())
      navigate('/', { state: { selectedGuestId: id } })
    },
    [navigate],
  )

  const handleDeleteGuest = useCallback(
    (id: string) => {
      storeClearGuestAssignments(id)
      storeDeleteGuest(id)
      setGuests(getGuests())
      setSelectedGuestId(null)
      navigate('/', { replace: true })
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

  const handleGuestClick = (guestId: string) => {
    setSelectedGuestId((prev) => (prev === guestId ? null : guestId))
  }

  const selectedGuest = guests.find((g) => g.id === selectedGuestId) ?? null

  const {
    confirmedCount,
    pendingCount,
    totalGuests,
    confirmationRate,
    dietaryFlagCount,
    waitlistCount,
  } = useGuestStats(guests)

  // Stub for sidebar — need table add in case sidebar navigates to canvas
  const handleSidebarAddTable = useCallback(() => {
    navigate('/seating-plan')
  }, [navigate])

  return (
    <>
      <LeftSidebar
        onAddGuest={handleNavigateToAdd}
        onAddTable={handleSidebarAddTable}
        guests={guests}
        tables={tables}
      />
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
        ) : guests.length === 0 ? (
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
              guests={guests}
              tables={tables}
              selectedGuestId={selectedGuestId}
              onGuestClick={handleGuestClick}
            />
            <GuestListFooterStats
              confirmationRate={confirmationRate}
              dietaryFlagCount={dietaryFlagCount}
            />
          </>
        )}
      </main>
      {selectedGuest && !isChildRoute && (
        <GuestDetailPanel
          guest={selectedGuest}
          onClose={() => setSelectedGuestId(null)}
          onUpdate={() => handleNavigateToEdit(selectedGuest.id)}
          onDelete={() => handleDeleteGuest(selectedGuest.id)}
        />
      )}
      {!isChildRoute && <FAB onClick={handleNavigateToAdd} label="Add guest" />}
    </>
  )
}

export default GuestListView
