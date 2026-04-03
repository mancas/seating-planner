# Task Report: TASK-005

## Task: Integration (App.tsx + LeftSidebar + useTableState)

## Status: COMPLETED

## Changes Made

### File: `src/hooks/useTableState.ts` (new)

Custom hook wrapping all table-store CRUD operations with React state management.

- Initializes `tables` state from `getTables()` via lazy `useState`
- Manages `selectedTableId` state for canvas table selection
- `refreshTables()` callback syncs React state with localStorage store
- Exposes 7 handler functions: `handleAddTable`, `handleUpdateTable`, `handleDeleteTable`, `handleAssignGuest`, `handleUnassignSeat`, `handleSwapSeats`, `handleClearGuestAssignments`
- Each handler calls the corresponding store function then `refreshTables()`
- `handleDeleteTable` also clears `selectedTableId`
- `handleAddTable` defaults `rotation: 0` for new tables

### File: `src/App.tsx` (modified)

Wired SeatingCanvas and CanvasPropertiesPanel into the app shell.

**New imports:**

- `SeatingCanvas`, `CanvasPropertiesPanel`, `useTableState`

**State & handlers:**

- Destructured `useTableState()` (placed before `handleDeleteGuest` to avoid TDZ)
- Added `selectedCanvasTable` derived from `tables` + `selectedCanvasTableId`
- Added `handleSidebarAddTable` — creates rectangular 8-seat table at (400, 300)
- Modified `handleDeleteGuest` to call `handleClearGuestAssignments(id)` before deleting guest, ensuring seat assignments are cleaned up

**JSX changes:**

- `LeftSidebar` now receives `activeTab`, `onAddTable`, `guests`, `tables` props
- `<main>` overflow is conditional: `overflow-hidden` for canvas tab, `overflow-y-auto` for others
- Replaced catch-all MODULE_OFFLINE placeholder with canvas tab rendering `<SeatingCanvas>` with all required props
- Added `<CanvasPropertiesPanel>` after `<GuestDetailPanel>`, shown when a table is selected on canvas tab
- All existing guest functionality preserved unchanged

### File: `src/components/organisms/LeftSidebar.tsx` (modified)

Extended sidebar to be tab-aware with canvas-specific actions.

**Props updated:**

- Added `activeTab`, `onAddTable?`, `guests?`, `tables?` (optional props default to empty arrays)

**New imports:**

- `Guest` from `mock-guests`, `FloorTable` from `table-types`
- `LuPlus`, `LuGripVertical` from `react-icons/lu`

**Nav items:**

- LAYOUT: `isActive={activeTab === 'canvas'}`
- OBJECTS: `isActive={activeTab === 'guests'}`

**Bottom section:**

- Canvas tab: "ADD TABLE" button (btn-primary, LuPlus icon) + unassigned guests list with count badge and cursor-grab items
- Guests tab: existing "ADD GUEST" button (unchanged)
- HISTORY link preserved in both modes

## Verification

- [x] `npx tsc --noEmit` — passes with zero errors
- [x] `npm run build` — passes, produces clean production bundle
- [x] No LSP errors in any modified file
- [x] Guest tab functionality fully preserved
- [x] Canvas tab renders SeatingCanvas with full prop wiring
- [x] CanvasPropertiesPanel shows when table selected on canvas tab
- [x] Deleting a guest clears their seat assignments from tables
