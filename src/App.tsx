import { useState, useCallback } from 'react'
import { useNavigate, useLocation, Outlet } from 'react-router'
import { DragDropProvider } from '@dnd-kit/react'
import {
  getGuests,
  addGuest as storeAddGuest,
  updateGuest as storeUpdateGuest,
  deleteGuest as storeDeleteGuest,
} from './data/guest-store'
import type { Guest } from './data/mock-guests'
import { DRAG_TYPE_GUEST, DRAG_TYPE_SEAT } from './data/dnd-types'
import type {
  DragGuestData,
  DragSeatData,
  DropSeatData,
  DropTableData,
} from './data/dnd-types'
import SeatingCanvas from './components/organisms/SeatingCanvas'
import CanvasPropertiesPanel from './components/organisms/CanvasPropertiesPanel'
import { useTableState } from './hooks/useTableState'
import TopNav from './components/organisms/TopNav'
import LeftSidebar from './components/organisms/LeftSidebar'
import GuestListHeader from './components/organisms/GuestListHeader'
import GuestTable from './components/organisms/GuestTable'
import GuestListFooterStats from './components/organisms/GuestListFooterStats'
import GuestDetailPanel from './components/organisms/GuestDetailPanel'
import BottomTabBar from './components/organisms/BottomTabBar'
import FAB from './components/atoms/FAB'
import EmptyState from './components/organisms/EmptyState'
import MobilePropertiesSheet from './components/organisms/MobilePropertiesSheet'
import MobileGuestsSheet from './components/organisms/MobileGuestsSheet'
import { useIsMobile } from './hooks/useIsMobile'
import { LuUsers } from 'react-icons/lu'

function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const isCanvasView = location.pathname === '/seating-plan'
  const isMobile = useIsMobile()

  const isChildRoute = location.pathname.startsWith('/guests/')

  const [guests, setGuests] = useState<Guest[]>(() => getGuests())
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)
  const [showMobileGuests, setShowMobileGuests] = useState(false)

  const locationState = location.state as { selectedGuestId?: string } | null
  if (locationState?.selectedGuestId) {
    if (selectedGuestId !== locationState.selectedGuestId) {
      setSelectedGuestId(locationState.selectedGuestId)
    }
    window.history.replaceState({}, '')
  }

  const {
    tables,
    selectedTableId: selectedCanvasTableId,
    setSelectedTableId: setSelectedCanvasTableId,
    handleAddTable,
    handleUpdateTable,
    handleDeleteTable,
    handleAssignGuest,
    handleUnassignSeat,
    handleSwapSeats,
    handleClearGuestAssignments,
  } = useTableState()

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
      handleClearGuestAssignments(id)
      storeDeleteGuest(id)
      setGuests(getGuests())
      setSelectedGuestId(null)
      navigate('/', { replace: true })
    },
    [navigate, handleClearGuestAssignments],
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

  const selectedCanvasTable =
    tables.find((t) => t.id === selectedCanvasTableId) ?? null

  const unassignedGuests = guests.filter(
    (g) => !tables.some((t) => t.seats.some((s) => s.guestId === g.id)),
  )

  const handleSidebarAddTable = useCallback(() => {
    handleAddTable({ shape: 'rectangular', seatCount: 8, x: 400, y: 300 })
  }, [handleAddTable])

  // DnD drag-end handler (lifted here so sidebar + canvas share the same DragDropProvider)
  const handleDragEnd = useCallback(
    (event: {
      operation: {
        source: { data: Record<string, unknown> } | null
        target: { data: Record<string, unknown> } | null
      }
    }) => {
      const { source, target } = event.operation
      if (!source || !target) return

      const sourceData = source.data as Record<string, unknown>
      const targetData = target.data as Record<string, unknown>

      if (sourceData.type === DRAG_TYPE_GUEST && 'seatIndex' in targetData) {
        // Guest dropped on a seat
        const guestData = sourceData as unknown as DragGuestData
        const seatData = targetData as unknown as DropSeatData
        handleAssignGuest(
          seatData.tableId,
          seatData.seatIndex,
          guestData.guestId,
        )
      } else if (
        sourceData.type === DRAG_TYPE_SEAT &&
        'seatIndex' in targetData
      ) {
        // Seat dropped on another seat — swap
        const seatSrc = sourceData as unknown as DragSeatData
        const seatTgt = targetData as unknown as DropSeatData
        handleSwapSeats(
          seatSrc.tableId,
          seatSrc.seatIndex,
          seatTgt.tableId,
          seatTgt.seatIndex,
        )
      } else if (
        sourceData.type === DRAG_TYPE_GUEST &&
        'tableId' in targetData &&
        !('seatIndex' in targetData)
      ) {
        // Guest dropped on table body — find first empty seat
        const guestData = sourceData as unknown as DragGuestData
        const tableData = targetData as unknown as DropTableData
        const table = tables.find((t) => t.id === tableData.tableId)
        if (table) {
          const occupiedSeats = new Set(table.seats.map((s) => s.seatIndex))
          for (let i = 0; i < table.seatCount; i++) {
            if (!occupiedSeats.has(i)) {
              handleAssignGuest(tableData.tableId, i, guestData.guestId)
              break
            }
          }
        }
      }
    },
    [tables, handleAssignGuest, handleSwapSeats],
  )

  const canvasContent = (
    <>
      <LeftSidebar
        onAddGuest={handleNavigateToAdd}
        onAddTable={handleSidebarAddTable}
        guests={guests}
        tables={tables}
      />
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <SeatingCanvas
          tables={tables}
          guests={guests}
          selectedTableId={selectedCanvasTableId}
          onSelectTable={setSelectedCanvasTableId}
          onAddTable={handleAddTable}
          onUpdateTable={handleUpdateTable}
          onDeleteTable={handleDeleteTable}
          onAssignGuest={handleAssignGuest}
          onUnassignSeat={handleUnassignSeat}
          onSwapSeats={handleSwapSeats}
        />
      </main>
      {selectedCanvasTable && !isChildRoute && (
        <CanvasPropertiesPanel
          table={selectedCanvasTable}
          onUpdate={(data) => handleUpdateTable(selectedCanvasTable.id, data)}
          onDelete={() => handleDeleteTable(selectedCanvasTable.id)}
          onClose={() => setSelectedCanvasTableId(null)}
        />
      )}

      {/* Mobile properties sheet */}
      {isMobile && selectedCanvasTable && (
        <MobilePropertiesSheet
          table={selectedCanvasTable}
          onUpdate={(data) => handleUpdateTable(selectedCanvasTable.id, data)}
          onDelete={() => handleDeleteTable(selectedCanvasTable.id)}
          onClose={() => setSelectedCanvasTableId(null)}
        />
      )}

      {/* Mobile unassigned guests FAB */}
      {isMobile && unassignedGuests.length > 0 && (
        <button
          className="md:hidden fixed bottom-[140px] right-4 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center cursor-pointer"
          onClick={() => setShowMobileGuests(true)}
          aria-label="View unassigned guests"
        >
          <LuUsers size={20} />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unassignedGuests.length}
          </span>
        </button>
      )}

      {/* Mobile unassigned guests sheet */}
      {isMobile && showMobileGuests && (
        <MobileGuestsSheet
          guests={unassignedGuests}
          onClose={() => setShowMobileGuests(false)}
        />
      )}
    </>
  )

  const defaultContent = (
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
              selectedGuestId={selectedGuestId}
              onGuestClick={onGuestClick}
              searchQuery=""
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
    </>
  )

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        {isCanvasView && !isChildRoute ? (
          <DragDropProvider onDragEnd={handleDragEnd}>
            {canvasContent}
          </DragDropProvider>
        ) : (
          defaultContent
        )}
      </div>
      {!isChildRoute && !isCanvasView && (
        <FAB onClick={handleNavigateToAdd} label="Add guest" />
      )}
      <BottomTabBar />
    </div>
  )
}

export default App
