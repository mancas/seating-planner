import { useState, useRef, useMemo } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import type { ReactZoomPanPinchContentRef } from 'react-zoom-pan-pinch'
import type { FloorTable, TableShape } from '../../data/table-types'
import type { Guest } from '../../data/mock-guests'
import { screenToCanvas } from '../../data/dnd-types'
import CanvasToolbar from '../molecules/CanvasToolbar'
import type { CanvasTool } from '../molecules/CanvasToolbar'
import CanvasTable from '../molecules/CanvasTable'
import CanvasStatusBar from '../atoms/CanvasStatusBar'
import SeatAssignmentPopover from '../molecules/SeatAssignmentPopover'
import { useIsMobile } from '../../hooks/useIsMobile'

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

  // Compute unassigned guests
  const unassignedGuests = useMemo(() => {
    const assignedGuestIds = new Set(
      tables.flatMap((t) => t.seats.map((s) => s.guestId)),
    )
    return guests.filter((g) => !assignedGuestIds.has(g.id))
  }, [tables, guests])

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
  function handleSeatClick(
    tableId: string,
    seatIndex: number,
    anchorRect: DOMRect,
  ) {
    setActiveSeat({ tableId, seatIndex, anchorRect })
  }

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
          panning={{ disabled: isMobile ? false : activeTool !== 'pan' }}
          pinch={{ disabled: !isMobile }}
          doubleClick={{ disabled: true }}
          wheel={{ disabled: true }}
          onTransformed={
            isMobile
              ? (_ref, state) => {
                  setCurrentZoom(state.scale)
                }
              : undefined
          }
        >
          <TransformComponent wrapperStyle={{ width: '100%', height: '100%' }}>
            {/* Dot grid canvas area */}
            <div
              ref={canvasRef}
              className="relative"
              style={{
                width: 3000,
                height: 2000,
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
                  onSelect={() => onSelectTable(table.id)}
                  onSeatClick={(seatIndex, anchorRect) =>
                    handleSeatClick(table.id, seatIndex, anchorRect)
                  }
                  activeSeatIndex={
                    activeSeat?.tableId === table.id
                      ? activeSeat.seatIndex
                      : null
                  }
                  onTableMouseDown={(e) => {
                    if (activeTool !== 'select') return
                    hasDragged.current = false
                    setDragState({
                      tableId: table.id,
                      startX: e.clientX,
                      startY: e.clientY,
                      origX: table.x,
                      origY: table.y,
                    })
                  }}
                  isMobile={isMobile}
                  activeTool={activeTool}
                  onTableTouchDrag={(tableId, deltaX, deltaY) => {
                    const instance = transformRef.current?.instance
                    const scale = instance?.transformState.scale ?? 1
                    const t = tables.find((tbl) => tbl.id === tableId)
                    if (t) {
                      onUpdateTable(tableId, {
                        x: t.x + deltaX / scale,
                        y: t.y + deltaY / scale,
                      })
                    }
                  }}
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

        {/* Seat assignment popover */}
        {activeSeat && activeSeatTable && (
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
      </div>
    </>
  )
}

export default SeatingCanvas
