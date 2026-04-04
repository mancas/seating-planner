import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router'
import { DragDropProvider } from '@dnd-kit/react'
import { getGuests } from '../data/guest-store'
import type { Guest } from '../data/guest-types'
import { getUnassignedGuests } from '../data/guest-utils'
import { useDragEndHandler } from '../hooks/useDragEndHandler'
import { useTableState } from '../hooks/useTableState'
import { useIsMobile } from '../hooks/useIsMobile'
import SeatingCanvas from '../components/organisms/SeatingCanvas'
import CanvasPropertiesPanel from '../components/organisms/CanvasPropertiesPanel'
import LeftSidebar from '../components/organisms/LeftSidebar'
import MobilePropertiesSheet from '../components/organisms/MobilePropertiesSheet'
import MobileGuestsSheet from '../components/organisms/MobileGuestsSheet'
import { LuUsers } from 'react-icons/lu'

function SeatingPlanView() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [guests] = useState<Guest[]>(() => getGuests())
  const [showMobileGuests, setShowMobileGuests] = useState(false)

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
    handleReassignGuest,
  } = useTableState()

  const handleDragEnd = useDragEndHandler(
    tables,
    handleAssignGuest,
    handleSwapSeats,
  )

  const handleNavigateToAdd = useCallback(() => {
    navigate('/guests/new')
  }, [navigate])

  const handleSidebarAddTable = useCallback(() => {
    handleAddTable({ shape: 'rectangular', seatCount: 8, x: 400, y: 300 })
  }, [handleAddTable])

  const selectedCanvasTable =
    tables.find((t) => t.id === selectedCanvasTableId) ?? null

  const unassignedGuests = getUnassignedGuests(guests, tables)

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
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
          onReassignGuest={handleReassignGuest}
        />
      </main>
      {selectedCanvasTable && (
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
    </DragDropProvider>
  )
}

export default SeatingPlanView
