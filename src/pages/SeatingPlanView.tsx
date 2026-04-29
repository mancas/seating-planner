import { useState, useCallback, useReducer } from 'react'
import { useNavigate } from 'react-router'
import { DragDropProvider } from '@dnd-kit/react'
import { getGuests } from '../data/guest-store'
import type { Guest } from '../data/guest-types'
import type { FloorTable } from '../data/table-types'
import { getUnassignedGuests } from '../data/guest-utils'
import { useDragEndHandler } from '../hooks/useDragEndHandler'
import { useTableState } from '../hooks/useTableState'
import { useOverlayPanel } from '../hooks/useOverlayPanel'
import { useIsMobile } from '../hooks/useIsMobile'
import SeatingCanvas from '../components/organisms/SeatingCanvas'
import CanvasPropertiesPanel from '../components/organisms/CanvasPropertiesPanel'
import LeftSidebar from '../components/organisms/LeftSidebar'
import MobilePropertiesSheet from '../components/organisms/MobilePropertiesSheet'
import MobileGuestsSheet from '../components/organisms/MobileGuestsSheet'
import { LuUsers, LuSettings2 } from 'react-icons/lu'

/* ─── Mobile UI state machine ─── */
type MobileSheet = 'none' | 'properties' | 'guests'

type MobileUIAction =
  | { type: 'OPEN_PROPERTIES' }
  | { type: 'OPEN_GUESTS' }
  | { type: 'CLOSE_SHEET' }
  | { type: 'TABLE_DESELECTED' }

function mobileUIReducer(
  _state: MobileSheet,
  action: MobileUIAction,
): MobileSheet {
  switch (action.type) {
    case 'OPEN_PROPERTIES':
      return 'properties'
    case 'OPEN_GUESTS':
      return 'guests'
    case 'CLOSE_SHEET':
    case 'TABLE_DESELECTED':
      return 'none'
  }
}

function SeatingPlanView() {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  const [guests] = useState<Guest[]>(() =>
    getGuests().filter((g) => g.status !== 'DECLINED'),
  )
  const [mobileSheet, dispatchSheet] = useReducer(mobileUIReducer, 'none')

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

  const handleSelectTable = useCallback(
    (id: string | null) => {
      setSelectedCanvasTableId(id)
      if (!id) dispatchSheet({ type: 'TABLE_DESELECTED' })
    },
    [setSelectedCanvasTableId],
  )

  const selectedCanvasTable =
    tables.find((t) => t.id === selectedCanvasTableId) ?? null

  const isPanelOpen = selectedCanvasTable !== null

  const handleClosePanel = useCallback(
    () => handleSelectTable(null),
    [handleSelectTable],
  )

  const {
    visible: panelVisible,
    isClosing: panelClosing,
    onAnimationEnd: panelAnimationEnd,
  } = useOverlayPanel(isPanelOpen, handleClosePanel)

  // Preserve last-selected table during exit animation using "adjusting state
  // during render" pattern (avoids reading ref.current in render).
  const [displayedTable, setDisplayedTable] = useState<FloorTable | null>(null)
  if (selectedCanvasTable && selectedCanvasTable !== displayedTable) {
    setDisplayedTable(selectedCanvasTable)
  }
  const panelTable = panelVisible
    ? (selectedCanvasTable ?? displayedTable)
    : null

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
          onSelectTable={handleSelectTable}
          onAddTable={handleAddTable}
          onUpdateTable={handleUpdateTable}
          onDeleteTable={handleDeleteTable}
          onUnassignSeat={handleUnassignSeat}
          onSwapSeats={handleSwapSeats}
          onReassignGuest={handleReassignGuest}
        />
      </main>
      {panelVisible && !isMobile && panelTable && (
        <CanvasPropertiesPanel
          table={panelTable}
          onUpdate={(data) => handleUpdateTable(panelTable.id, data)}
          onDelete={() => handleDeleteTable(panelTable.id)}
          onClose={handleClosePanel}
          isClosing={panelClosing}
          onAnimationEnd={panelAnimationEnd}
        />
      )}

      {/* Mobile table info FAB — opens properties sheet on demand */}
      {isMobile && selectedCanvasTable && mobileSheet !== 'properties' && (
        <button
          className="md:hidden fixed bottom-[140px] left-4 z-30 h-10 pl-3 pr-3.5 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center gap-1.5 cursor-pointer active:scale-95 transition-transform animate-[fadeSlideUp_200ms_ease-out]"
          onClick={() => dispatchSheet({ type: 'OPEN_PROPERTIES' })}
          aria-label={`Open properties for ${selectedCanvasTable.label}`}
        >
          <LuSettings2 size={16} />
          <span className="text-body-sm font-medium max-w-[100px] truncate">
            {selectedCanvasTable.label}
          </span>
        </button>
      )}

      {/* Mobile properties sheet — now opened explicitly */}
      {isMobile && selectedCanvasTable && mobileSheet === 'properties' && (
        <MobilePropertiesSheet
          table={selectedCanvasTable}
          onUpdate={(data) => handleUpdateTable(selectedCanvasTable.id, data)}
          onDelete={() => handleDeleteTable(selectedCanvasTable.id)}
          onClose={() => dispatchSheet({ type: 'CLOSE_SHEET' })}
        />
      )}

      {/* Mobile unassigned guests FAB */}
      {isMobile && unassignedGuests.length > 0 && (
        <button
          className="md:hidden fixed bottom-[140px] right-4 z-30 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center cursor-pointer"
          onClick={() => dispatchSheet({ type: 'OPEN_GUESTS' })}
          aria-label="View unassigned guests"
        >
          <LuUsers size={20} />
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unassignedGuests.length}
          </span>
        </button>
      )}

      {/* Mobile unassigned guests sheet */}
      {isMobile && mobileSheet === 'guests' && (
        <MobileGuestsSheet
          guests={guests}
          tables={tables}
          onClose={() => dispatchSheet({ type: 'CLOSE_SHEET' })}
        />
      )}
    </DragDropProvider>
  )
}

export default SeatingPlanView
