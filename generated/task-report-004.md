# Task Report — TASK-004: Canvas Organisms

## Status: COMPLETE

## Files Created

- `src/components/organisms/SeatingCanvas.tsx` (new)
- `src/components/organisms/CanvasPropertiesPanel.tsx` (new)

## Implementation Summary

### SeatingCanvas.tsx

Full-featured canvas editor component with the following capabilities:

**Props**: Accepts `tables`, `guests`, `selectedTableId`, and callbacks for table CRUD, guest assignment/unassignment, and seat swapping.

**Internal state**:

- `activeTool` (CanvasTool, default `'select'`) — current toolbar tool
- `activeSeat` (ActiveSeat | null) — tracks which seat's popover is open
- `transformRef` (ReactZoomPanPinchContentRef) — ref to pan/zoom instance
- `dragState` (DragState | null) — mouse-based table repositioning state

**DnD integration** (`@dnd-kit/react` v0.3.2):

- Wraps canvas area in `<DragDropProvider onDragEnd={handleDragEnd}>`
- `handleDragEnd` routes drops based on `source.data.type` and target data shape:
  - `DRAG_TYPE_GUEST` → `DropSeatData`: calls `onAssignGuest`
  - `DRAG_TYPE_SEAT` → `DropSeatData`: calls `onSwapSeats`
  - `DRAG_TYPE_GUEST` → `DropTableData` (no seatIndex): finds first empty seat, calls `onAssignGuest`
- Event typing uses inline object type matching `DragOperationSnapshot` shape (avoids importing `DragEndEvent` which is a function type alias, not an event interface)

**Pan/zoom** (`react-zoom-pan-pinch` v3.7.0):

- `TransformWrapper` with `disabled` and `panning.disabled` toggled by activeTool
- Fixed scale (min=1, max=1), double-click and wheel zoom disabled
- `TransformComponent` fills available space

**Canvas click handler**:

- Closes active popover on any click
- Add tools: computes canvas coordinates via `screenToCanvas()`, calls `onAddTable`, auto-reverts to select
- Select tool: deselects table on background click

**Table repositioning** (mouse-based, not DnD):

- `onMouseDown` on table wrapper → captures start position and original table coords
- `onMouseMove` on canvas → computes delta (accounting for zoom scale), calls `onUpdateTable`
- `onMouseUp` / `onMouseLeave` → clears drag state

**Unassigned guests**: computed via `useMemo` from tables' seat assignments vs full guest list

**Render structure**:

- Mobile: placeholder with `CANVAS_EDITOR // DESKTOP_REQUIRED`
- Desktop: `hidden md:flex flex-1 relative overflow-hidden bg-background`
  - DragDropProvider → TransformWrapper → TransformComponent → dot-grid div → CanvasTable instances
  - Absolute-positioned CanvasToolbar (top-left) and CanvasStatusBar (top-right)
  - SeatAssignmentPopover when activeSeat is set

**Dot grid**: `radial-gradient(circle, var(--nc-gray-700) 1px, transparent 1px)` at 24px spacing

### CanvasPropertiesPanel.tsx

Right-side properties panel for editing a selected table.

**Props**: `table` (FloorTable), `onUpdate`, `onDelete`, `onClose`

**Internal form state**: `label`, `shape`, `seatCount`, `rotation` — reset via `useEffect` when `table.id` changes

**Layout sections**:

1. **Header**: "PROPERTIES" label + close IconButton (LuX)
2. **INFORMATION**: Label input (`.input` class), reference ID badge (`.badge` class)
3. **CONFIGURATION**:
   - ShapeToggle component for rectangular/circular
   - Seat count range slider (1–20) with `accent-[var(--nc-primary)]` + numeric display
   - Rotation range slider (0–359) with `accent-[var(--nc-primary)]` + degree display
   - Preset angle buttons: 0°, 90°, 180°, 270° with active state styling
4. **Actions**: "UPDATE CHANGES" (btn-primary w-full), "DELETE ENTITY" (btn-ghost w-full text-foreground-muted)

**Panel styling**: `hidden md:flex flex-col w-[320px] min-w-[320px] bg-surface border-l border-border h-full overflow-y-auto` — matches GuestDetailPanel pattern

## Conventions Followed

- Function declarations (not arrow functions) for components
- Default exports
- Props interface (not inline)
- No semicolons
- Single quotes
- Trailing commas
- `import type` for type-only imports

## Verification

- `npx tsc --noEmit`: **PASS** — zero errors
