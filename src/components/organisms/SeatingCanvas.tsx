import { useCallback, useMemo, useRef, useState } from 'react'
import type { ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch'
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'
import { screenToCanvas } from '../../data/canvas-utils'
import type { Guest } from '../../data/guest-types'
import { getUnassignedGuests } from '../../data/guest-utils'
import type { FloorTable, TableShape } from '../../data/table-types'
import { useIsMobile } from '../../hooks/useIsMobile'
import CanvasStatusBar from '../atoms/CanvasStatusBar'
import CanvasTable from '../molecules/CanvasTable'
import type { CanvasTool } from '../molecules/CanvasToolbar'
import CanvasToolbar from '../molecules/CanvasToolbar'
import SeatAssignmentPopover from '../molecules/SeatAssignmentPopover'
import MobileSeatAssignmentSheet from './MobileSeatAssignmentSheet'

interface Props {
  tables: FloorTable[]
  guests: Guest[]
  selectedTableId: string | null
  onSelectTable: (id: string | null) => void
  onAddTable: (data: {
    shape: TableShape
    seatCount: number
    x: number
    y: number
  }) => void
  onUpdateTable: (
    id: string,
    data: Partial<
      Pick<FloorTable, 'label' | 'shape' | 'seatCount' | 'x' | 'y' | 'rotation'>
    >,
  ) => void
  onDeleteTable: (id: string) => void
  onAssignGuest: (tableId: string, seatIndex: number, guestId: string) => void
  onUnassignSeat: (tableId: string, seatIndex: number) => void
  onSwapSeats: (
    srcTableId: string,
    srcSeatIdx: number,
    tgtTableId: string,
    tgtSeatIdx: number,
  ) => void
  onReassignGuest: (tableId: string, seatIndex: number, guestId: string) => void
}

interface ActiveSeat {
  tableId: string
  seatIndex: number
  anchorRect: DOMRect
}

interface DragState {
  tableId: string
  startX: number
  startY: number
  origX: number
  origY: number
}

const CANVAS_WIDTH = 3000
const CANVAS_HEIGHT = 2000
const DRAG_THRESHOLD = 3

function SeatingCanvas({
  tables,
  guests,
  selectedTableId,
  onSelectTable,
  onAddTable,
  onUpdateTable,
  onAssignGuest,
  onUnassignSeat,
  onReassignGuest,
}: Props) {
  const [activeTool, setActiveTool] = useState<CanvasTool>('select')
  const [activeSeat, setActiveSeat] = useState<ActiveSeat | null>(null)
  const transformRef = useRef<ReactZoomPanPinchContentRef>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()
  const [currentZoom, setCurrentZoom] = useState(1)

  // Table drag state (mouse-based repositioning)
  const [dragState, setDragState] = useState<DragState | null>(null)
  const hasDragged = useRef(false)

  // Refs for stable callbacks (avoid re-creating per-table closures)
  const tablesRef = useRef(tables)
  const activeToolRef = useRef(activeTool)

  // Compute unassigned guests
  const unassignedGuests = useMemo(
    () => getUnassignedGuests(guests, tables),
    [tables, guests],
  )

  // Canvas click handler — only fires for direct clicks on the dot-grid background
  function handleCanvasClick(e: React.MouseEvent<HTMLDivElement>) {
    // If we just finished dragging a table, ignore this click
    if (hasDragged.current) {
      hasDragged.current = false
      return
    }

    // Only handle clicks directly on the canvas background, not bubbled from children
    if (e.target !== e.currentTarget) return

    // Close popover on any canvas click
    setActiveSeat(null)

    if (activeTool === 'add-circle' || activeTool === 'add-rectangle') {
      const container = canvasRef.current
      if (!container) return

      const rect = container.getBoundingClientRect()
      const instance = transformRef.current?.instance
      const scale = instance?.transformState.scale ?? 1
      const positionX = instance?.transformState.positionX ?? 0
      const positionY = instance?.transformState.positionY ?? 0

      const canvasPos = screenToCanvas(
        e.clientX,
        e.clientY,
        rect,
        scale,
        positionX,
        positionY,
      )
      const shape: TableShape =
        activeTool === 'add-circle' ? 'circular' : 'rectangular'
      onAddTable({ shape, seatCount: 8, x: canvasPos.x, y: canvasPos.y })
      setActiveTool('select')
      return
    }

    if (activeTool === 'select') {
      onSelectTable(null)
    }
  }

  function handleCanvasMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!dragState) return

    const dx = e.clientX - dragState.startX
    const dy = e.clientY - dragState.startY

    // Mark as dragged once past threshold
    if (!hasDragged.current && Math.hypot(dx, dy) > DRAG_THRESHOLD) {
      hasDragged.current = true
    }

    const instance = transformRef.current?.instance
    const scale = instance?.transformState.scale ?? 1

    onUpdateTable(dragState.tableId, {
      x: dragState.origX + dx / scale,
      y: dragState.origY + dy / scale,
    })
  }

  function handleCanvasMouseUp() {
    if (dragState) {
      setDragState(null)
    }
  }

  // Seat click handler
  const handleSeatClick = useCallback(
    (tableId: string, seatIndex: number, anchorRect: DOMRect) => {
      if (isMobile) {
        onSelectTable(null) // Close MobilePropertiesSheet (DD-F3)
      }
      setActiveSeat({ tableId, seatIndex, anchorRect })
    },
    [isMobile, onSelectTable],
  )

  // Stable table mouse-down handler (for desktop drag)
  const handleTableMouseDown = useCallback(
    (tableId: string, e: React.MouseEvent) => {
      if (activeToolRef.current !== 'select') return
      hasDragged.current = false
      const t = tablesRef.current.find((tbl) => tbl.id === tableId)
      if (!t) return
      setDragState({
        tableId,
        startX: e.clientX,
        startY: e.clientY,
        origX: t.x,
        origY: t.y,
      })
    },
    [],
  )

  // Stable touch-drag handler
  const handleTableTouchDrag = useCallback(
    (tableId: string, canvasDx: number, canvasDy: number) => {
      const t = tablesRef.current.find((tbl) => tbl.id === tableId)
      if (t) {
        onUpdateTable(tableId, {
          x: t.x + canvasDx,
          y: t.y + canvasDy,
        })
      }
    },
    [onUpdateTable],
  )

  // Find data for active seat popover
  const activeSeatTable = activeSeat
    ? tables.find((t) => t.id === activeSeat.tableId)
    : null
  const activeSeatAssignment = activeSeatTable
    ? activeSeatTable.seats.find((s) => s.seatIndex === activeSeat!.seatIndex)
    : null
  const activeSeatGuest = activeSeatAssignment
    ? (guests.find((g) => g.id === activeSeatAssignment.guestId) ?? null)
    : null

  return (
    <>
      {/* Canvas — renders on both mobile and desktop */}
      <div className="flex flex-1 relative overflow-hidden bg-background">
        <TransformWrapper
          ref={transformRef}
          disabled={isMobile ? false : activeTool !== 'pan'}
          initialScale={1}
          minScale={isMobile ? 0.5 : 1}
          maxScale={isMobile ? 3 : 1}
          limitToBounds={false}
          panning={{
            disabled: isMobile ? activeTool === 'pan' : activeTool !== 'pan',
          }}
          pinch={{ disabled: !isMobile }}
          doubleClick={{ disabled: true }}
          wheel={{ disabled: true }}
          onTransformed={(_ref, state) => {
            setCurrentZoom(state.scale)
          }}
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            {/* Dot grid canvas area */}
            <div
              ref={canvasRef}
              className="relative"
              style={{
                width: CANVAS_WIDTH,
                height: CANVAS_HEIGHT,
                backgroundImage:
                  'radial-gradient(circle, var(--nc-gray-700) 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                cursor:
                  activeTool === 'pan'
                    ? 'grab'
                    : activeTool.startsWith('add-')
                      ? 'crosshair'
                      : 'default',
              }}
              onClick={handleCanvasClick}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              onMouseLeave={handleCanvasMouseUp}
            >
              {tables.map((table) => (
                <CanvasTable
                  key={table.id}
                  table={table}
                  isSelected={selectedTableId === table.id}
                  guests={guests}
                  onSelectTable={onSelectTable}
                  onSeatClick={handleSeatClick}
                  activeSeatIndex={
                    activeSeat?.tableId === table.id
                      ? activeSeat.seatIndex
                      : null
                  }
                  onTableMouseDown={handleTableMouseDown}
                  isMobile={isMobile}
                  activeTool={activeTool}
                  scale={currentZoom}
                  onTableTouchDrag={handleTableTouchDrag}
                />
              ))}
            </div>
          </TransformComponent>
        </TransformWrapper>

        {/* Mobile toolbar */}
        <div className="md:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-30">
          <CanvasToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        </div>

        {/* Desktop toolbar */}
        <div className="hidden md:block absolute top-4 left-4 z-10">
          <CanvasToolbar activeTool={activeTool} onToolChange={setActiveTool} />
        </div>

        {/* Status bar */}
        <div className="absolute top-4 right-4 z-10">
          <CanvasStatusBar zoom={isMobile ? currentZoom : undefined} />
        </div>

        {/* Seat assignment: popover on desktop, bottom sheet on mobile */}
        {activeSeat && activeSeatTable && !isMobile && (
          <SeatAssignmentPopover
            seatIndex={activeSeat.seatIndex}
            tableLabel={activeSeatTable.label}
            assignedGuest={activeSeatGuest}
            unassignedGuests={unassignedGuests}
            onAssign={(guestId) => {
              onAssignGuest(activeSeat.tableId, activeSeat.seatIndex, guestId)
              setActiveSeat(null)
            }}
            onUnassign={() => {
              onUnassignSeat(activeSeat.tableId, activeSeat.seatIndex)
              setActiveSeat(null)
            }}
            onClose={() => setActiveSeat(null)}
            anchorRect={activeSeat.anchorRect}
          />
        )}
        {activeSeat && activeSeatTable && isMobile && (
          <MobileSeatAssignmentSheet
            seatIndex={activeSeat.seatIndex}
            tableLabel={activeSeatTable.label}
            assignedGuest={activeSeatGuest}
            unassignedGuests={unassignedGuests}
            tables={tables}
            guests={guests}
            onAssign={(guestId) => {
              onReassignGuest(activeSeat.tableId, activeSeat.seatIndex, guestId)
              setActiveSeat(null)
            }}
            onUnassign={() => {
              onUnassignSeat(activeSeat.tableId, activeSeat.seatIndex)
              setActiveSeat(null)
            }}
            onClose={() => setActiveSeat(null)}
          />
        )}
      </div>
    </>
  )
}

export default SeatingCanvas
