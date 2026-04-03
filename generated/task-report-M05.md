# Task Report: TASK-M05 — Mobile Table Touch Interactions

## Summary

Added long-press + drag touch handling to `CanvasTable` for mobile table repositioning and disabled DnD seat dragging on mobile.

## Changes Made

### `src/components/molecules/CanvasTable.tsx` (modified)

1. **New imports**: Added `useState`, `useRef`, `useCallback` from React and `useLongPress` from `../../hooks/useLongPress`.

2. **Extended Props interface** with three new optional props:
   - `isMobile?: boolean` — flags mobile context
   - `activeTool?: string` — current active tool (e.g. `'select'`)
   - `onTableTouchDrag?: (tableId: string, deltaX: number, deltaY: number) => void` — callback for touch drag deltas

3. **Updated `SeatSlot` sub-component**:
   - Added `isMobile?: boolean` prop
   - Changed `useDraggable` disabled condition from `disabled: isEmpty` to `disabled: isEmpty || !!isMobile` — disables seat DnD on mobile

4. **Added touch state and handlers in `CanvasTable`**:
   - `touchStartPos` ref to track finger position
   - `isDragMode` state to toggle drag behavior
   - `handleLongPress` — activates drag mode when table is selected, on mobile, with select tool active
   - `handleTap` — selects the table on quick tap
   - `longPressHandlers` — wired up via `useLongPress({ threshold: 300, ... })`
   - `handleTouchMove` — computes screen-space deltas and fires `onTableTouchDrag`
   - `handleTouchEnd` — resets drag mode and touch position

5. **Updated root container div**:
   - Dynamic className with drag mode visual feedback: `shadow-lg ring-2 ring-primary rounded`
   - `onTouchStart` — initializes touch position, starts long-press timer, stops propagation only when select tool is active (allows pan tool to pass through)
   - `onTouchMove` — delegates to long-press cancel logic and touch move handler
   - `onTouchEnd` — delegates to long-press end and touch end cleanup

6. **Passed `isMobile` to `SeatSlot`** in the seat rendering loop.

## Acceptance Criteria Verification

| Criterion                                                                                    | Status                 |
| -------------------------------------------------------------------------------------------- | ---------------------- |
| Long-press (300ms) on selected table with select tool enables drag mode with visual feedback | Done                   |
| Drag mode fires `onTableTouchDrag` with screen-space deltas                                  | Done                   |
| Quick tap selects table via `useLongPress.onTap`                                             | Done                   |
| Pan tool active: `onTouchStart` does NOT call `e.stopPropagation()`                          | Done                   |
| Seat DnD disabled on mobile via `disabled: isEmpty \|\| !!isMobile`                          | Done                   |
| Desktop behavior unchanged — mouse handlers still work                                       | Done                   |
| File compiles with `tsc -b`                                                                  | Verified — clean build |
